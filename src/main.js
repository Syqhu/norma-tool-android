const { app, BrowserWindow, ipcMain, Notification, dialog, session } = require("electron");
const path = require("path");
const { shell } = require("electron");
const sharp = require("sharp");
const { createWorker } = require("tesseract.js");

let mainWindow;
const hoyolabPartition = "persist:norma-tool-hoyolab";
const hoyolabBattleRecordUrl = "https://act.hoyolab.com/app/zzz-game-record/index.html?lang=ja-jp";
const hoyolabApiBase = "https://sg-act-public-api.hoyolab.com/event/game_record_zzz";
const hoyolabRoleEndpoints = [
  "https://api-os-takumi.hoyoverse.com/binding/api/getUserGameRolesByCookie",
  "https://api-os-takumi.hoyolab.com/binding/api/getUserGameRolesByCookie"
];
const githubRepo = "Syqhu/norma-tool";
const githubReleasesUrl = `https://api.github.com/repos/${githubRepo}/releases?per_page=20`;

function parseVersionTag(value) {
  const text = String(value || "").trim().replace(/^v/i, "");
  const [core, prerelease] = text.split("-");
  const nums = core.split(".").map((item) => Number.parseInt(item, 10));
  return {
    major: Number.isFinite(nums[0]) ? nums[0] : 0,
    minor: Number.isFinite(nums[1]) ? nums[1] : 0,
    patch: Number.isFinite(nums[2]) ? nums[2] : 0,
    prerelease: Boolean(prerelease)
  };
}

function compareVersions(a, b) {
  const left = parseVersionTag(a);
  const right = parseVersionTag(b);
  for (const key of ["major", "minor", "patch"]) {
    if (left[key] !== right[key]) return left[key] > right[key] ? 1 : -1;
  }
  if (left.prerelease !== right.prerelease) return left.prerelease ? -1 : 1;
  return 0;
}

async function checkGithubUpdate() {
  const response = await fetch(githubReleasesUrl, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "norma-tool-update-checker"
    }
  });
  if (!response.ok) throw new Error(`GitHub HTTP ${response.status}`);
  const releases = await response.json();
  const release = (Array.isArray(releases) ? releases : [])
    .filter((item) => !item.draft && item.tag_name)
    .sort((a, b) => {
      const versionDiff = compareVersions(b.tag_name, a.tag_name);
      if (versionDiff !== 0) return versionDiff;
      return new Date(b.published_at || b.created_at || 0) - new Date(a.published_at || a.created_at || 0);
    })[0];
  if (!release) throw new Error("GitHub Releaseが見つかりませんでした。");
  const currentVersion = app.getVersion();
  const latestVersion = String(release.tag_name || "").replace(/^v/i, "");
  return {
    hasUpdate: compareVersions(latestVersion, currentVersion) > 0,
    currentVersion,
    latestVersion,
    tagName: release.tag_name || "",
    name: release.name || release.tag_name || "",
    releaseUrl: release.html_url || `https://github.com/${githubRepo}/releases`,
    publishedAt: release.published_at || "",
    body: release.body || "",
    assets: (release.assets || []).map((asset) => ({
      name: asset.name,
      size: asset.size,
      downloadUrl: asset.browser_download_url
    }))
  };
}

const hoyolabStatMap = [
  { key: "critDmg", patterns: [/会心ダメージ/i, /会心ダメ/i, /CRIT DMG/i, /Crit DMG/i] },
  { key: "critRate", patterns: [/会心率/i, /CRIT Rate/i, /Crit Rate/i] },
  { key: "anomalyProf", patterns: [/異常掌握/i, /Anomaly Proficiency/i] },
  { key: "ap", patterns: [/異常マスタリー/i, /Anomaly Mastery/i] },
  { key: "penRatio", patterns: [/貫通率/i, /PEN Ratio/i] },
  { key: "impact", patterns: [/衝撃力/i, /Impact/i] },
  { key: "energy", patterns: [/エネルギー自動回復/i, /Energy Regen/i] },
  { key: "atk", patterns: [/攻撃力/i, /^ATK$/i] },
  { key: "def", patterns: [/防御力/i, /^DEF$/i] },
  { key: "hp", patterns: [/^HP$/i] }
];

const statOcrRegions = {
  hp: { left: 1260, top: 520, width: 130, height: 45 },
  atk: { left: 1620, top: 520, width: 140, height: 45 },
  def: { left: 1260, top: 573, width: 130, height: 45 },
  impact: { left: 1620, top: 573, width: 140, height: 45 },
  critRate: { left: 1260, top: 626, width: 135, height: 45 },
  critDmg: { left: 1620, top: 626, width: 140, height: 45 },
  anomalyProf: { left: 1260, top: 681, width: 135, height: 45 },
  ap: { left: 1620, top: 681, width: 140, height: 45 },
  penRatio: { left: 1260, top: 735, width: 135, height: 45 },
  energy: { left: 1620, top: 735, width: 140, height: 45 }
};

function scaleRegion(region, width, height) {
  const scaled = {
    left: Math.round(region.left * width / 1920),
    top: Math.round(region.top * height / 1080),
    width: Math.round(region.width * width / 1920),
    height: Math.round(region.height * height / 1080)
  };
  scaled.left = Math.max(0, Math.min(width - 1, scaled.left));
  scaled.top = Math.max(0, Math.min(height - 1, scaled.top));
  scaled.width = Math.max(1, Math.min(width - scaled.left, scaled.width));
  scaled.height = Math.max(1, Math.min(height - scaled.top, scaled.height));
  return scaled;
}

function cleanOcrNumber(text) {
  const cleaned = String(text || "").replace(/[^0-9.]/g, "");
  if (!cleaned) return "";
  const firstDot = cleaned.indexOf(".");
  return firstDot === -1
    ? cleaned
    : `${cleaned.slice(0, firstDot + 1)}${cleaned.slice(firstDot + 1).replace(/\./g, "")}`;
}

function hoyolabSession() {
  return session.fromPartition(hoyolabPartition);
}

async function hoyolabCookies() {
  const ses = hoyolabSession();
  return ses.cookies.get({});
}

function cookieHeader(cookies) {
  return cookies
    .filter((cookie) => /hoyolab|hoyoverse|mihoyo/i.test(cookie.domain || ""))
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

async function hoyolabLoginState() {
  const cookies = await hoyolabCookies();
  const names = new Set(cookies.map((cookie) => cookie.name));
  const loggedIn = ["ltoken", "ltoken_v2", "cookie_token", "cookie_token_v2"].some((name) => names.has(name));
  return {
    loggedIn,
    cookieCount: cookies.length,
    hasLToken: names.has("ltoken") || names.has("ltoken_v2"),
    hasCookieToken: names.has("cookie_token") || names.has("cookie_token_v2")
  };
}

function hoyolabHeaders(cookies, extra = {}) {
  return {
    "accept": "application/json, text/plain, */*",
    "cookie": cookieHeader(cookies),
    "origin": "https://act.hoyolab.com",
    "referer": hoyolabBattleRecordUrl,
    "user-agent": "Mozilla/5.0 norma-tool",
    "x-rpc-language": "ja-jp",
    "x-rpc-lang": "ja-jp",
    "x-rpc-platform": "4",
    "x-rpc-page": "/zzz",
    ...extra
  };
}

async function hoyolabGet(url, cookies) {
  const response = await fetch(url, { headers: hoyolabHeaders(cookies) });
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { retcode: response.status, message: text.slice(0, 300), data: null };
  }
  if (!response.ok) {
    throw new Error(json.message || `HoYoLAB HTTP ${response.status}`);
  }
  return json;
}

async function fetchHoyolabRoles(cookies) {
  let lastError;
  for (const endpoint of hoyolabRoleEndpoints) {
    try {
      const url = `${endpoint}?game_biz=nap_global`;
      const json = await hoyolabGet(url, cookies);
      if (json.retcode === 0) return json.data?.list || [];
      lastError = new Error(json.message || `retcode ${json.retcode}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("HoYoLABのゲームロール取得に失敗しました。");
}

function zzzRoleFromRoles(roles) {
  return (roles || []).find((role) => /nap/i.test(role.game_biz || "") || role.region || role.game_uid) || null;
}

function numberFromHoyolab(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    return numberFromHoyolab(value.formatted_value ?? value.format_value ?? value.display_value ?? value.value_text ?? value.value_str ?? value.final_value ?? value.value ?? value.val ?? value.final ?? value.base ?? value.add);
  }
  const text = String(value).replace(/,/g, "");
  const match = text.match(/-?\d+(?:\.\d+)?/);
  return match ? match[0] : "";
}

function hoyolabDisplayValue(item) {
  if (!item || typeof item !== "object") return item;
  return item.formatted_value
    ?? item.format_value
    ?? item.display_value
    ?? item.value_text
    ?? item.value_str
    ?? item.final_value
    ?? item.value
    ?? item.val
    ?? item.final
    ?? item.base;
}

function hoyolabPropertyValue(item) {
  if (!item || typeof item !== "object") return item;
  return item.base
    ?? item.formatted_value
    ?? item.format_value
    ?? item.display_value
    ?? item.value_text
    ?? item.value_str
    ?? item.final_value
    ?? item.value
    ?? item.val
    ?? item.final;
}

function statKeyFromLabel(label) {
  const text = String(label || "").trim();
  if (!text) return "";
  const matched = hoyolabStatMap.find((item) => item.patterns.some((pattern) => pattern.test(text)));
  return matched?.key || "";
}

function collectStatObjects(value, depth = 0, result = []) {
  if (!value || depth > 4) return result;
  if (Array.isArray(value)) {
    value.forEach((item) => collectStatObjects(item, depth + 1, result));
    return result;
  }
  if (typeof value !== "object") return result;
  const label = value.name || value.title || value.label || value.property_name || value.full_name || value.base_name;
  const rawValue = hoyolabDisplayValue(value);
  if (label && rawValue !== undefined) result.push({ label, value: rawValue });
  for (const key of ["properties", "property_list", "attrs", "attribute_list", "final_properties", "base_properties"]) {
    if (value[key]) collectStatObjects(value[key], depth + 1, result);
  }
  return result;
}

function normalizeHoyolabStats(avatar) {
  const stats = {};
  for (const item of collectStatObjects(avatar)) {
    const key = statKeyFromLabel(item.label);
    const value = numberFromHoyolab(item.value);
    if (key && value !== "") stats[key] = value;
  }
  return stats;
}

function normalizeHoyolabSubstat(item) {
  if (!item) return { name: "", value: "" };
  const name = item.property_name || item.name || item.title || item.label || item.full_name || item.stat || "";
  return {
    name,
    value: numberFromHoyolab(hoyolabPropertyValue(item))
  };
}

function normalizeHoyolabDisc(item) {
  const slot = Number(item.equipment_type || item.pos || item.slot || item.index || item.id || 0);
  const main = item.main_property || item.main_properties?.[0] || item.main_stat || item.main || {};
  const substats = item.properties || item.sub_properties || item.substats || item.secondary_properties || [];
  return {
    slot: slot >= 1 && slot <= 6 ? slot : null,
    set: item.equip_suit?.name || item.suit?.name || item.set?.name || item.set_name || "",
    main: normalizeHoyolabSubstat(main).name || item.main_property_name || "",
    substats: Array.from({ length: 4 }, (_, i) => normalizeHoyolabSubstat(substats[i]))
  };
}

function normalizeHoyolabAvatar(raw) {
  const avatar = raw?.avatar_list?.[0] || raw || {};
  const id = Number(avatar.id || avatar.avatar_id || avatar.template_id || avatar.role_id || 0);
  const equip = avatar.equip || avatar.equipment || avatar.drive_disc || avatar.drive_discs || avatar.equipments || [];
  return {
    id,
    name: avatar.name || avatar.full_name || avatar.avatar_name || "",
    level: Number(avatar.level || avatar.lv || 0),
    mindscape: Number(avatar.rank || avatar.mindscape || avatar.talent_num || avatar.unlocked_talent_num || 0),
    weapon: avatar.weapon?.name || avatar.weapon_name || "",
    weaponRank: Number(avatar.weapon?.star || avatar.weapon?.rank || avatar.weapon_refine || 1),
    stats: normalizeHoyolabStats(avatar),
    discs: Array.isArray(equip) ? equip.map(normalizeHoyolabDisc).filter((disc) => disc.slot) : [],
    raw: avatar
  };
}

async function fetchHoyolabZzzData(role, cookies) {
  const roleId = role.game_uid || role.game_role_id || role.role_id;
  const server = role.region || role.region_name || role.server;
  if (!roleId || !server) throw new Error("ZZZのUIDまたはサーバー情報を取得できませんでした。");
  const query = new URLSearchParams({ role_id: String(roleId), server: String(server) });
  const basic = await hoyolabGet(`${hoyolabApiBase}/api/zzz/avatar/basic?${query}`, cookies);
  if (basic.retcode !== 0) throw new Error(basic.message || `avatar/basic retcode ${basic.retcode}`);
  const avatars = basic.data?.avatar_list || [];
  const details = [];
  for (const avatar of avatars) {
    const id = avatar.id || avatar.avatar_id;
    if (!id) {
      details.push(normalizeHoyolabAvatar(avatar));
      continue;
    }
    const detailQuery = new URLSearchParams({ role_id: String(roleId), server: String(server) });
    detailQuery.append("id_list[]", String(id));
    detailQuery.append("need_wiki", "true");
    try {
      const detail = await hoyolabGet(`${hoyolabApiBase}/api/zzz/avatar/info?${detailQuery}`, cookies);
      details.push(normalizeHoyolabAvatar(detail.data || avatar));
    } catch {
      details.push(normalizeHoyolabAvatar(avatar));
    }
  }
  return {
    role: {
      nickname: role.nickname || role.name || "",
      level: role.level || "",
      region: server,
      uid: roleId
    },
    characters: details,
    rawCount: avatars.length
  };
}

async function ocrStatImage(filePath) {
  const metadata = await sharp(filePath).metadata();
  const width = metadata.width || 1920;
  const height = metadata.height || 1080;
  const worker = await createWorker("eng");
  const stats = {};
  const raw = {};
  try {
    await worker.setParameters({
      tessedit_char_whitelist: "0123456789.%",
      classify_bln_numeric_mode: "1",
      tessedit_pageseg_mode: "7"
    });
    for (const [key, region] of Object.entries(statOcrRegions)) {
      const crop = scaleRegion(region, width, height);
      const buffer = await sharp(filePath)
        .extract(crop)
        .resize({ width: crop.width * 4, height: crop.height * 4, kernel: "lanczos3" })
        .grayscale()
        .normalise()
        .png()
        .toBuffer();
      const result = await worker.recognize(buffer);
      raw[key] = result.data.text;
      const value = cleanOcrNumber(result.data.text);
      if (value) stats[key] = value;
    }
  } finally {
    await worker.terminate();
  }
  return { stats, raw, image: filePath, width, height };
}

const discStatNames = [];
const discStatCatalog = [
  { name: "HP%", aliases: ["HP%", "HP %", "HPパーセント"] },
  { name: "HP", aliases: ["HP"] },
  { name: "攻撃力%", aliases: ["攻撃力%", "攻撃力 %", "攻撃カ%", "ATK%", "ATK %"] },
  { name: "攻撃力", aliases: ["攻撃力", "攻撃カ", "ATK"] },
  { name: "防御力%", aliases: ["防御力%", "防御力 %", "防御カ%", "DEF%", "DEF %"] },
  { name: "防御力", aliases: ["防御力", "防御カ", "DEF"] },
  { name: "会心率", aliases: ["会心率", "会心 率", "CRIT Rate", "Crit Rate", "CRIT率"] },
  { name: "会心ダメージ", aliases: ["会心ダメージ", "会心ダメ", "会心 ダメージ", "CRIT DMG", "Crit DMG", "CRITダメージ"] },
  { name: "異常マスタリー", aliases: ["異常マスタリー", "異常 マスタリー", "Anomaly Mastery"] },
  { name: "異常掌握", aliases: ["異常掌握", "異常 掌握", "Anomaly Proficiency"] },
  { name: "衝撃力", aliases: ["衝撃力", "衝撃 力", "Impact"] },
  { name: "エネルギー自動回復", aliases: ["エネルギー自動回復", "エネルギー 自動回復", "エネ自動回復", "Energy Regen", "Energy Regeneration"] },
  { name: "貫通値", aliases: ["貫通値", "貫通 値", "PEN"] },
  { name: "貫通率", aliases: ["貫通率", "貫通 率", "PEN Ratio", "PEN%"] },
  { name: "物理属性ダメージ", aliases: ["物理属性ダメージ", "物理 属性 ダメージ", "物理ダメージ", "Physical DMG"] },
  { name: "炎属性ダメージ", aliases: ["炎属性ダメージ", "炎 属性 ダメージ", "炎ダメージ", "Fire DMG"] },
  { name: "氷属性ダメージ", aliases: ["氷属性ダメージ", "氷 属性 ダメージ", "氷ダメージ", "Ice DMG"] },
  { name: "電気属性ダメージ", aliases: ["電気属性ダメージ", "電気 属性 ダメージ", "電気ダメージ", "Electric DMG"] },
  { name: "エーテル属性ダメージ", aliases: ["エーテル属性ダメージ", "エーテル 属性 ダメージ", "エーテルダメージ", "Ether DMG"] },
  { name: "風属性ダメージ", aliases: ["風属性ダメージ", "風 属性 ダメージ", "風ダメージ", "Wind DMG"] }
];

function normalizeOcrText(text) {
  return String(text || "")
    .normalize("NFKC")
    .replace(/[|｜]/g, "I")
    .replace(/[＋]/g, "+")
    .replace(/[％]/g, "%")
    .replace(/[：]/g, ":")
    .replace(/\s+/g, " ")
    .trim();
}

function regexEscape(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findDiscStatMentions(text) {
  const mentions = [];
  for (const item of discStatCatalog) {
    for (const alias of item.aliases) {
      const pattern = new RegExp(regexEscape(alias).replace(/\\ /g, "\\s*"), "ig");
      for (const match of text.matchAll(pattern)) {
        mentions.push({
          name: item.name,
          index: match.index || 0,
          end: (match.index || 0) + match[0].length
        });
      }
    }
  }
  return mentions
    .sort((a, b) => a.index - b.index || b.end - b.index - (a.end - a.index))
    .filter((item, index, list) => !list.slice(0, index).some((prev) => Math.abs(prev.index - item.index) < 3));
}

function valueAfterMention(text, mention, nextMention) {
  const chunk = text.slice(mention.end, nextMention?.index || mention.end + 32);
  const match = chunk.match(/[+＋]?\s*\d+(?:\.\d+)?\s*%?/);
  return match ? match[0].replace(/[+＋\s%]/g, "") : "";
}

function parseDiscSlot(text) {
  const patterns = [
    /(?:^|[^\d])([1-6])\s*(?:番|号|號|Slot|SLOT|slot)/,
    /(?:ディスク|Disk|Drive\s*Disc|ドライバディスク)\s*([1-6])/i,
    /(?:\b|#)([1-6])(?:\b|$)/
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number(match[1]);
  }
  return null;
}

function parseDiscOcrText(text) {
  const normalized = normalizeOcrText(text);
  const slot = parseDiscSlot(normalized);
  const mentions = findDiscStatMentions(normalized);
  const main = mentions[0]?.name || "";
  const substats = Array.from({ length: 4 }, (_, index) => {
    const mention = mentions[index + 1];
    return {
      name: mention?.name || "",
      value: mention ? valueAfterMention(normalized, mention, mentions[index + 2]) : ""
    };
  });
  return {
    slot,
    set: "",
    main,
    substats,
    rawText: normalized
  };
}
async function ocrDiscImage(filePath) {
  const metadata = await sharp(filePath).metadata();
  const buffer = await sharp(filePath)
    .resize({ width: 1800, withoutEnlargement: true })
    .grayscale()
    .normalise()
    .png()
    .toBuffer();
  let worker;
  try {
    worker = await createWorker("jpn+eng");
  } catch {
    worker = await createWorker("eng");
  }
  try {
    await worker.setParameters({ tessedit_pageseg_mode: "6" });
    const result = await worker.recognize(buffer);
    return {
      ...parseDiscOcrText(result.data.text),
      image: filePath,
      width: metadata.width,
      height: metadata.height
    };
  } finally {
    await worker.terminate();
  }
}

function escapeSvg(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

async function saveBuildCard(payload) {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: "ビルドカードを保存",
    defaultPath: `${payload.character || "build-card"}.png`,
    filters: [{ name: "PNG", extensions: ["png"] }]
  });
  if (result.canceled || !result.filePath) return null;
  const stats = payload.stats || [];
  const discs = payload.discs || [];
  const statRows = stats.slice(0, 8).map((item, index) => {
    const x = 56 + (index % 2) * 420;
    const y = 210 + Math.floor(index / 2) * 58;
    return `<text x="${x}" y="${y}" class="label">${escapeSvg(item.label)}</text><text x="${x + 250}" y="${y}" class="value">${escapeSvg(item.value)}</text>`;
  }).join("");
  const discRows = discs.slice(0, 6).map((item, index) => {
    const y = 500 + index * 44;
    return `<text x="58" y="${y}" class="label">${escapeSvg(item.slot)}番</text><text x="140" y="${y}" class="disc">${escapeSvg(item.text)}</text><text x="795" y="${y}" class="value">${escapeSvg(item.score)}</text>`;
  }).join("");
  const svg = `
    <svg width="960" height="820" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" x2="1"><stop offset="0" stop-color="#0b0718"/><stop offset="1" stop-color="#1a112d"/></linearGradient>
      </defs>
      <rect width="960" height="820" fill="url(#bg)"/>
      <rect x="28" y="28" width="904" height="764" rx="24" fill="#11101a" stroke="#b57cff" stroke-opacity=".45"/>
      <text x="56" y="92" class="eyebrow">norma tool build card</text>
      <text x="56" y="148" class="title">${escapeSvg(payload.character)}</text>
      <text x="58" y="180" class="section">Current Stats</text>
      ${statRows}
      <text x="58" y="454" class="section">Disc Score</text>
      ${discRows}
      <text x="56" y="760" class="note">${escapeSvg(payload.note || "")}</text>
      <style>
        text { font-family: "Yu Gothic", "Meiryo", sans-serif; fill: #f6f3ff; }
        .eyebrow { font-size: 22px; fill: #2ad5ff; font-weight: 700; }
        .title { font-size: 58px; font-weight: 900; }
        .section { font-size: 24px; fill: #ffd60a; font-weight: 900; }
        .label { font-size: 21px; fill: #b8b1c9; font-weight: 700; }
        .value { font-size: 27px; fill: #fff; font-weight: 900; text-anchor: end; }
        .disc { font-size: 19px; fill: #f6f3ff; font-weight: 700; }
        .note { font-size: 18px; fill: #b8b1c9; }
      </style>
    </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(result.filePath);
  return result.filePath;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1220,
    height: 780,
    minWidth: 1040,
    minHeight: 680,
    backgroundColor: "#080512",
    title: "norma tool",
    icon: path.join(__dirname, "..", "assets", "norma-tool-icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

ipcMain.handle("notify-daily-incomplete", (_event, payload) => {
  if (!Notification.isSupported()) return false;
  const title = payload?.title || "norma tool デイリー未完了";
  const body = payload?.body || "まだ完了していないデイリーがあります。";
  new Notification({ title, body, silent: false }).show();
  return true;
});

ipcMain.handle("get-app-info", () => ({
  version: app.getVersion(),
  dataPath: app.getPath("userData")
}));

ipcMain.handle("check-app-update", () => checkGithubUpdate());

ipcMain.handle("open-external-url", async (_event, url) => {
  const target = String(url || "");
  if (!/^https:\/\/github\.com\/Syqhu\/norma-tool(?:\/|$)/i.test(target)) {
    throw new Error("許可されていないURLです。");
  }
  await shell.openExternal(target);
  return true;
});

ipcMain.handle("hoyolab-login", async () => {
  const loginWindow = new BrowserWindow({
    width: 1120,
    height: 760,
    minWidth: 860,
    minHeight: 620,
    title: "HoYoLAB Login - norma tool",
    parent: mainWindow,
    modal: false,
    autoHideMenuBar: true,
    webPreferences: {
      partition: hoyolabPartition,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  loginWindow.loadURL(hoyolabBattleRecordUrl);
  await new Promise((resolve) => {
    loginWindow.on("closed", resolve);
  });
  return hoyolabLoginState();
});

ipcMain.handle("hoyolab-status", () => hoyolabLoginState());

ipcMain.handle("hoyolab-disconnect", async () => {
  const ses = hoyolabSession();
  await ses.clearStorageData({ storages: ["cookies", "localstorage", "indexdb", "cachestorage"] });
  return hoyolabLoginState();
});

ipcMain.handle("hoyolab-sync", async () => {
  const cookies = await hoyolabCookies();
  const state = await hoyolabLoginState();
  if (!state.loggedIn) {
    throw new Error("HoYoLABにログインしてから同期してください。");
  }
  const roles = await fetchHoyolabRoles(cookies);
  const role = zzzRoleFromRoles(roles);
  if (!role) {
    throw new Error("HoYoLABアカウントにZZZのゲームロールが見つかりませんでした。");
  }
  const data = await fetchHoyolabZzzData(role, cookies);
  return {
    ...data,
    accounts: roles.map((item) => ({
      nickname: item.nickname || item.name || "",
      uid: item.game_uid || item.game_role_id || "",
      region: item.region || "",
      level: item.level || "",
      gameBiz: item.game_biz || ""
    }))
  };
});

ipcMain.handle("choose-stat-image", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "ステータス画像を選択",
    properties: ["openFile"],
    filters: [
      { name: "Images", extensions: ["png", "jpg", "jpeg", "webp"] }
    ]
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("extract-stats-from-image", async (_event, filePath) => {
  if (!filePath || typeof filePath !== "string") throw new Error("画像ファイルが選択されていません。");
  return ocrStatImage(filePath);
});

ipcMain.handle("extract-disc-from-image", async (_event, filePath) => {
  if (!filePath || typeof filePath !== "string") throw new Error("画像ファイルが選択されていません。");
  return ocrDiscImage(filePath);
});

ipcMain.handle("save-build-card", async (_event, payload) => saveBuildCard(payload || {}));

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

