const ELEMENTS = ["すべて", "物理", "炎", "氷", "電気", "エーテル", "不明"];
const ROLES = ["すべて", "強攻", "撃破", "異常", "支援", "防護", "命破", "不明"];
const RANKS = ["すべて", "S", "A"];
const OWNERSHIP_FILTERS = ["すべて", "所持", "未所持", "育成中", "完成"];
const DATA_SCHEMA_VERSION = "Ver3.0";

const elementMap = {
  200: "物理",
  201: "炎",
  202: "氷",
  203: "電気",
  205: "エーテル"
};

const roleMap = {
  1: "強攻",
  2: "撃破",
  3: "異常",
  4: "支援",
  5: "防護",
  6: "命破"
};

const campMap = {
  1: "邪兎屋",
  2: "ヴィクトリア家政",
  3: "白祇重工",
  4: "カリュドーンの子",
  5: "オボルス小隊",
  6: "対ホロウ6課",
  7: "特務捜査班",
  8: "スターズ・オブ・リラ",
  9: "モッキンバード",
  10: "雲嶽山",
  11: "怪啖屋",
  12: "衛非地区",
  13: "仮想アイドル",
  15: "クランプス",
  16: "ワイルドハント",
  17: "未確認陣営"
};

const additionalAbilityRules = {
  1241: { any: [{ role: "支援" }, { camp: 7 }], label: "支援または特務捜査班" },
  1251: { any: [{ role: "強攻" }, { camp: 7 }], label: "強攻または特務捜査班" },
  1261: { any: [{ role: "異常" }, { camp: 7 }], label: "異常または特務捜査班" },
  1271: { any: [{ element: "電気" }, { camp: 7 }], label: "電気または特務捜査班" },
  1291: { any: [{ role: "撃破" }, { camp: 9 }], label: "撃破またはモッキンバード" },
  1311: { any: [{ role: "強攻" }, { role: "異常" }, { camp: 8 }], label: "火力役またはスターズ・オブ・リラ" },
  1331: { any: [{ role: "異常" }, { camp: 9 }], label: "異常またはモッキンバード" },
  1361: { any: [{ role: "強攻" }, { camp: 5 }], label: "強攻またはオボルス小隊" },
  1371: { any: [{ role: "撃破" }, { role: "支援" }, { camp: 10 }], label: "撃破/支援または雲嶽山" },
  1381: { any: [{ role: "撃破" }, { camp: 5 }], label: "撃破またはオボルス小隊" },
  1401: { any: [{ role: "異常" }, { camp: 11 }], label: "異常または怪啖屋" },
  1411: { any: [{ role: "異常" }, { camp: 11 }], label: "異常または怪啖屋" },
  1451: { any: [{ role: "命破" }, { camp: 11 }], label: "命破または怪啖屋" },
  1531: { any: [{ role: "支援" }, { role: "撃破" }, { camp: 1 }], label: "支援/撃破または邪兎屋" }
};
const teamKitHints = {
  1031: { label: "防御ダウン/エーテル支援", roles: ["強攻", "異常"], elements: ["エーテル"], universal: false },
  1071: { label: "シールド/与ダメ支援", roles: ["強攻", "異常", "命破"], elements: [], universal: true },
  1131: { label: "氷/攻撃支援", roles: ["強攻", "異常"], elements: ["氷"], universal: false },
  1151: { label: "攻撃バフ/クイック支援", roles: ["強攻", "異常"], elements: ["炎"], universal: true },
  1211: { label: "貫通/電気支援", roles: ["強攻", "異常"], elements: ["電気"], universal: false },
  1271: { label: "異常マスタリー/防護", roles: ["異常"], elements: [], universal: false },
  1311: { label: "汎用火力バフ/クイック支援", roles: ["強攻", "異常", "命破"], elements: [], universal: true },
  1371: { label: "命破主軸", roles: ["命破"], elements: [], universal: false },
  1411: { label: "異常/混沌支援", roles: ["異常"], elements: [], universal: false },
  1421: { label: "耐久/命破支援", roles: ["命破"], elements: [], universal: false },
  1451: { label: "命破特化支援", roles: ["命破"], elements: [], universal: false }
};

const characterScoreTuning = {
  エレン: { stats: { 会心率: 28, 会心ダメージ: 28, 攻撃力: 18, "攻撃力%": 22, 氷属性ダメージ: 20 }, note: "会心2種と氷/攻撃を高めに評価" },
  朱鳶: { stats: { 会心率: 28, 会心ダメージ: 28, 攻撃力: 18, "攻撃力%": 22, エーテル属性ダメージ: 20 }, note: "会心火力とエーテル火力を高めに評価" },
  雅: { stats: { 会心率: 28, 会心ダメージ: 28, 攻撃力: 18, "攻撃力%": 22, 氷属性ダメージ: 20 }, note: "会心と氷火力を高めに評価" },
  ジェーン: { stats: { 異常マスタリー: 30, 異常掌握: 24, "攻撃力%": 22, 物理属性ダメージ: 18 }, note: "異常2種と攻撃を高めに評価" },
  バーニス: { stats: { 異常マスタリー: 30, 異常掌握: 24, "攻撃力%": 22, 炎属性ダメージ: 18 }, note: "控え異常火力向けに異常マスタリーを重視" },
  柳: { stats: { 異常マスタリー: 30, 異常掌握: 24, "攻撃力%": 22, 電気属性ダメージ: 18 }, note: "混沌/異常軸向けに異常2種を重視" },
  アストラ: { stats: { "攻撃力%": 28, エネルギー自動回復: 26, 攻撃力: 18 }, note: "支援量と回転率を重視" },
  トリガー: { stats: { 衝撃力: 30, 会心率: 20, 会心ダメージ: 18, "攻撃力%": 18 }, note: "撃破性能と火力サブを両立評価" },
  "0号アンビー": { stats: { 会心率: 28, 会心ダメージ: 28, "攻撃力%": 22, 電気属性ダメージ: 20 }, note: "電気強攻向けに会心と攻撃を重視" },
  儀玄: { stats: { HP: 22, "HP%": 28, 会心率: 24, 会心ダメージ: 22 }, note: "命破向けにHPと会心を重視" }
};

const characterPairSynergy = [
  { includes: ["アストラ"], roles: ["強攻", "異常", "命破"], score: 10, note: "アストラは主力へ長めの火力支援を渡せます" },
  { includes: ["セス"], roles: ["異常"], score: 10, note: "セスは異常主軸の直前配置でバフを渡しやすいです" },
  { includes: ["トリガー"], roles: ["強攻", "命破"], score: 9, note: "トリガーはブレイク窓を作る主力補助として評価します" },
  { includes: ["ライカン"], elements: ["氷"], score: 8, note: "ライカンは氷主軸のブレイク支援として噛み合います" },
  { includes: ["蒼角"], elements: ["氷"], score: 8, note: "蒼角は氷火力支援として氷主軸に向きます" },
  { includes: ["ルーシー"], roles: ["強攻", "異常"], score: 7, note: "ルーシーは攻撃バフを主力へ渡しやすいです" },
  { includes: ["シーザー"], roles: ["強攻", "異常", "命破"], score: 9, note: "シーザーは耐久と与ダメ支援を同時に補えます" },
  { includes: ["ニコ"], elements: ["エーテル"], score: 8, note: "ニコはエーテル/集敵/防御ダウンで短時間火力に寄与します" }
];

const teamSourceAudit = {
  updatedAt: "2026-07-02",
  policy: "複数ソースで共通する編成原則だけを採用。個別キャラ条件は確認済みのみ個別ルール化し、未確認は同属性/同陣営の汎用条件として扱います。",
  sources: [
    { name: "Game8 Additional Ability", url: "https://game8.co/games/Zenless-Zone-Zero/archives/460451", note: "追加能力は同属性/同陣営が基本。朱鳶/青衣/ジェーンなどのロール条件例を確認。" },
    { name: "Game8 Team Building", url: "https://game8.co/games/Zenless-Zone-Zero/archives/563441", note: "追加能力確認、DPS確保、撃破+火力、異常2枚の混沌などの編成原則を確認。" },
    { name: "Prydwen Attributes", url: "https://www.prydwen.gg/zenless/guides/agents-attributes", note: "属性/陣営で追加パッシブを発動する基本仕様を確認。" },
    { name: "Mobalytics Teams", url: "https://mobalytics.gg/zzz/teams", note: "高難度向け実編成が主力+支援/撃破/異常相方を軸に組まれていることを確認。" }
  ]
};

const targetData = window.ZZZ_TARGET_DATA || { stats: [], discMainOptions: [""], roleTemplates: {}, profiles: {} };
const statByKey = Object.fromEntries(targetData.stats.map((stat) => [stat.key, stat]));
const discSlots = [1, 2, 3, 4, 5, 6];
const flexibleMainSlots = [4, 5, 6];
const fixedDiscMainStats = { 1: "HP", 2: "攻撃力", 3: "防御力" };
const agentTabs = [
  { key: "overview", label: "概要" },
  { key: "stats", label: "ステータス" },
  { key: "discs", label: "ディスク" },
  { key: "diagnosis", label: "診断" },
  { key: "owned", label: "所持" },
  { key: "materials", label: "素材" },
  { key: "sources", label: "ソース" }
];
const discSetOptions = [
  "",
  "ウッドペッカー・エレクトロ",
  "パファー・エレクトロ",
  "ショックスター・ディスコ",
  "フリーダム・ブルース",
  "ホルモン・パンク",
  "ソウル・ロック",
  "スイング・ジャズ",
  "炎獄のヘヴィメタル",
  "混沌のヘヴィメタル",
  "霹靂のヘヴィメタル",
  "極地のヘヴィメタル",
  "獣牙のヘヴィメタル",
  "ケイオス・ジャズ",
  "プロト・パンク",
  "折枝の刀歌",
  "静寂のアストラ",
  "シャドウハーモニー",
  "「パエトーン」の歌",
  "雲嶽は我に似たり",
  "大山を統べる者",
  "暁に咲く花",
  "月光騎士の讃歌",
  "純白の行歌",
  "流光のアリア",
  "雪うさぎのワンダーランド",
  "獄中の手記",
  "風鳴りのサロン",
  "夜明けの紀行"
];
const discSetAliases = {
  ウッドペッカーエレクトロ: "ウッドペッカー・エレクトロ",
  パエトーンの歌: "「パエトーン」の歌",
  雪うさぎのソナタ: "雪うさぎのワンダーランド",
  BunnyInWonderland: "雪うさぎのワンダーランド",
  "Bunny in Wonderland": "雪うさぎのワンダーランド",
  "Notes From The Chained": "獄中の手記",
  "Notes from the Chained": "獄中の手記",
  "Wuthering Salon": "風鳴りのサロン",
  "The Sky Ablaze": "夜明けの紀行",
  "White Water Ballad": "純白の行歌",
  "Dawn's Bloom": "暁に咲く花",
  "Phaethon's Melody": "「パエトーン」の歌",
  "Moonlight Lullaby": "月光騎士の讃歌",
  "King of the Summit": "大山を統べる者",
  "Yunkui Tales": "雲嶽は我に似たり",
  "Astral Voice": "静寂のアストラ",
  "Branch & Blade Song": "折枝の刀歌",
  "Proto Punk": "プロト・パンク",
  "Chaos Jazz": "ケイオス・ジャズ"
};
const discSetDatabase = {
  "ウッドペッカー・エレクトロ": { two: "会心率+8%", four: "会心時に攻撃力上昇", roles: ["強攻", "命破"], stats: ["会心率", "会心ダメージ", "攻撃力%"], tags: ["crit"] },
  "パファー・エレクトロ": { two: "貫通率+8%", four: "終結スキル強化", roles: ["強攻", "命破"], stats: ["貫通率", "攻撃力%"], tags: ["ultimate"] },
  "ショックスター・ディスコ": { two: "衝撃力+6%", four: "ブレイク値上昇", roles: ["撃破"], stats: ["衝撃力"], tags: ["stun"] },
  "フリーダム・ブルース": { two: "異常マスタリー+30", four: "状態異常蓄積耐性低下", roles: ["異常"], stats: ["異常マスタリー"], tags: ["anomaly"] },
  "ホルモン・パンク": { two: "攻撃力+10%", four: "出場時攻撃力上昇", roles: ["強攻", "異常", "命破"], stats: ["攻撃力%"], tags: ["atk"] },
  "ソウル・ロック": { two: "防御力+16%", four: "被ダメージ軽減", roles: ["防護"], stats: ["防御力%", "HP%"], tags: ["defense"] },
  "スイング・ジャズ": { two: "エネルギー自動回復+20%", four: "連携/終結で全体与ダメ上昇", roles: ["支援"], stats: ["エネルギー自動回復"], tags: ["support"] },
  "炎獄のヘヴィメタル": { two: "炎属性ダメージ+10%", four: "熱傷敵への会心率上昇", roles: ["強攻", "異常"], stats: ["会心率", "攻撃力%"], elements: ["炎"], tags: ["element"] },
  "混沌のヘヴィメタル": { two: "エーテル属性ダメージ+10%", four: "侵蝕で会心ダメージ上昇", roles: ["強攻", "異常"], stats: ["会心ダメージ"], elements: ["エーテル"], tags: ["element"] },
  "霹靂のヘヴィメタル": { two: "電気属性ダメージ+10%", four: "感電敵がいる時攻撃力上昇", roles: ["強攻", "異常"], stats: ["攻撃力%"], elements: ["電気"], tags: ["element"] },
  "極地のヘヴィメタル": { two: "氷属性ダメージ+10%", four: "通常/ダッシュ攻撃強化", roles: ["強攻", "異常"], stats: ["会心率", "会心ダメージ"], elements: ["氷"], tags: ["element"] },
  "獣牙のヘヴィメタル": { two: "物理属性ダメージ+10%", four: "強撃後の与ダメージ上昇", roles: ["強攻", "異常"], stats: ["攻撃力%", "会心率"], elements: ["物理"], tags: ["element"] },
  "ケイオス・ジャズ": { two: "異常マスタリー+30", four: "炎/電気と控え攻撃を強化", roles: ["異常", "支援"], stats: ["異常マスタリー", "攻撃力%"], elements: ["炎", "電気"], tags: ["anomaly", "off-field"] },
  "プロト・パンク": { two: "シールド生成量+15%", four: "支援発動で全体与ダメ上昇", roles: ["防護"], stats: ["HP%", "防御力%"], tags: ["defense", "support"] },
  "折枝の刀歌": { two: "会心ダメージ+16%", four: "異常掌握/凍結条件で会心強化", roles: ["異常", "強攻"], stats: ["会心ダメージ", "会心率", "異常掌握"], elements: ["氷"], tags: ["crit", "anomaly"] },
  "静寂のアストラ": { two: "攻撃力+10%", four: "クイック支援出場キャラを強化", roles: ["支援"], stats: ["攻撃力%", "エネルギー自動回復"], tags: ["support", "quick-assist"] },
  "シャドウハーモニー": { two: "追加攻撃/ダッシュ攻撃強化", four: "追加攻撃/ダッシュ攻撃で攻撃・会心上昇", roles: ["強攻"], stats: ["攻撃力%", "会心率"], tags: ["follow-up", "dash"] },
  "「パエトーン」の歌": { two: "異常掌握+8%", four: "強化特殊後に異常マスタリー上昇", roles: ["異常"], stats: ["異常掌握", "異常マスタリー"], elements: ["エーテル"], tags: ["anomaly"] },
  "雲嶽は我に似たり": { two: "HP+10%", four: "会心率/透徹ダメージ強化", roles: ["命破"], stats: ["HP%", "会心率"], tags: ["rupture"] },
  "大山を統べる者": { two: "ブレイク値+6%", four: "撃破キャラが全体会心ダメージ支援", roles: ["撃破"], stats: ["衝撃力", "会心率"], tags: ["stun", "support"] },
  "暁に咲く花": { two: "通常攻撃ダメージ+15%", four: "強攻の通常攻撃を追加強化", roles: ["強攻"], stats: ["攻撃力%", "会心率"], tags: ["basic"] },
  "月光騎士の讃歌": { two: "エネルギー自動回復+20%", four: "支援キャラの全体与ダメ上昇", roles: ["支援"], stats: ["エネルギー自動回復"], tags: ["support"] },
  "純白の行歌": { two: "物理属性ダメージ+10%", four: "エーテルベール中に会心/攻撃強化", roles: ["強攻"], stats: ["会心率", "攻撃力%"], elements: ["物理"], tags: ["veil", "crit"] },
  "流光のアリア": { two: "エーテル属性ダメージ+10%", four: "通常攻撃/ブレイクで異常・与ダメ強化", roles: ["異常", "強攻"], stats: ["異常マスタリー", "攻撃力%"], elements: ["エーテル"], tags: ["anomaly", "break"] },
  "雪うさぎのワンダーランド": { two: "HP+10%", four: "防護キャラが全体与ダメを累積支援", roles: ["防護"], stats: ["HP%", "防御力%"], tags: ["defense", "support"] },
  "獄中の手記": { two: "氷属性ダメージ+10%", four: "狂咲/凍結で異常ダメージ強化", roles: ["異常"], stats: ["異常マスタリー", "攻撃力%"], elements: ["氷"], tags: ["anomaly"] },
  "風鳴りのサロン": { two: "風属性ダメージ+10%", four: "強化特殊/風化で異常マスタリーと与ダメ上昇", roles: ["異常"], stats: ["異常マスタリー", "攻撃力%"], elements: ["風"], tags: ["anomaly"] },
  "夜明けの紀行": { two: "エーテル属性ダメージ+10%", four: "エーテルキャラの会心ダメージ/攻撃力強化", roles: ["強攻", "命破"], stats: ["会心ダメージ", "攻撃力%"], elements: ["エーテル"], tags: ["crit", "element"] }
};
const teamTemplateDatabase = [
  { name: "強攻ブレイク", roles: ["強攻", "撃破", "支援|防護"], note: "ブレイク中に主力火力を集中。朱鳶/11号/エレン系に向きます。" },
  { name: "異常混沌", roles: ["異常", "異常", "支援|防護"], note: "異属性異常を交互に入れて混沌を狙います。支援枠はバフ持続を重視。" },
  { name: "命破ブレイク", roles: ["命破", "撃破", "支援|防護"], note: "命破主軸に撃破の行動機会と専用支援を合わせます。" },
  { name: "ハイパーキャリー", roles: ["強攻|異常|命破", "支援", "防護|支援|撃破"], note: "主力を1人に寄せ、2枠でバフ/耐久/ブレイクを補います。" },
  { name: "初期/汎用", roles: ["強攻", "撃破", "支援"], note: "迷った時の基本形。追加能力より役割補完を優先します。" }
];
const contentPresetDatabase = [
  { name: "式輿防衛戦", needs: ["短時間火力", "ブレイク火力", "属性弱点"], prefer: ["強攻ブレイク", "異常混沌"], note: "片面ごとの弱点に合わせ、主力を絞ります。" },
  { name: "危局強襲戦", needs: ["ギミック対応", "継続火力", "ステージバフ"], prefer: ["異常混沌", "命破ブレイク"], note: "バフと敵仕様で主軸を変えるのが重要です。" },
  { name: "塔/高難度", needs: ["耐久", "中断耐性", "安定ローテ"], prefer: ["ハイパーキャリー", "命破ブレイク"], note: "防護や長持続支援の価値を高めに見ます。" },
  { name: "素材周回", needs: ["高速処理", "操作量少なめ"], prefer: ["強攻ブレイク", "ハイパーキャリー"], note: "過剰な混沌準備より即火力を優先します。" }
];
const discSubstatOptions = [
  "",
  "HP",
  "HP%",
  "攻撃力",
  "攻撃力%",
  "防御力",
  "防御力%",
  "会心率",
  "会心ダメージ",
  "異常マスタリー",
  "貫通値"
];
const ownershipStatuses = ["未所持", "育成予定", "育成中", "完成", "保留"];
const materialPlans = {
  40: { denny: 160000, exp: 24, promotion: 8, skill: 20, core: 2, battery: 240 },
  50: { denny: 360000, exp: 54, promotion: 16, skill: 45, core: 4, battery: 520 },
  60: { denny: 720000, exp: 108, promotion: 30, skill: 90, core: 6, battery: 980 }
};
const materialTypeOptions = ["強攻", "撃破", "異常", "支援", "防護", "命破"];
const skillTypeOptions = ["物理", "炎", "氷", "電気", "エーテル"];
const weeklyBossOptions = ["未設定", "要警戒・新週ボス", "既存週ボス", "Ver3.0追加素材待ち"];
const quickTagOptions = ["厳選中", "危局用", "式輿用", "推し", "素材待ち", "会心不足", "異常不足", "完成間近"];
const buildPresets = {
  default: { label: "登録値", note: "登録済みソースの目標値と推奨ディスクを使います。" },
  signature: { label: "モチーフ想定", note: "複数ソースのモチーフ想定値や実用編成で多い方向に寄せます。" },
  nonSignature: { label: "代用音動機", note: "数値は捏造せず、ディスク重みを不足しやすい会心/攻撃/異常側へ寄せます。" },
  critStable: { label: "会心安定", note: "X/YouTubeで多い安定会心型。会心率を高めに評価します。" },
  anomalyCore: { label: "異常重視", note: "異常キャラ向け。異常マスタリー/異常掌握を高く評価します。" },
  supportCycle: { label: "支援回転", note: "支援/防護向け。エネルギー自動回復と役割ステータスを高く評価します。" }
};
const sourceAudit = {
  version: DATA_SCHEMA_VERSION,
  updatedAt: "2026-07-01",
  policy: "Game8/GameWith/takugame/個人攻略/X/YouTubeを照合。数値目標は確認できたものだけ登録。",
  sources: [
    { name: "Game8 ゼンレスゾーンゼロ攻略", type: "攻略DB", url: "https://game8.jp/zenless" },
    { name: "GameWith ゼンレスゾーンゼロ攻略", type: "攻略DB", url: "https://gamewith.jp/zenless/" },
    { name: "takugame ゼンゼロ記事", type: "個人攻略", url: "https://takugame.com/" },
    { name: "Game8 X", type: "X", url: "https://x.com/ZZZ_Game8" },
    { name: "YouTube build/disc guides", type: "YouTube", url: "https://www.youtube.com/results?search_query=Zenless+Zone+Zero+3.0+build+disc+guide" }
  ]
};

const ANDROID_APP_VERSION = "0.1.10";

if (!window.zzzApp) {
  window.zzzApp = {
    platform: "android",
    notifyDailyIncomplete: async (payload) => {
      const plugin = window.Capacitor?.Plugins?.LocalNotifications;
      if (plugin) {
        const permission = await plugin.requestPermissions();
        if (permission.display !== "granted") return false;
        await plugin.createChannel?.({
          id: "daily",
          name: "norma tool",
          description: "デイリー通知",
          importance: 4,
          visibility: 1
        }).catch(() => {});
        await plugin.schedule({
          notifications: [{
            id: Date.now() % 2147483647,
            title: payload?.title || "norma tool",
            body: payload?.body || "",
            schedule: { at: new Date(Date.now() + 500) },
            channelId: "daily"
          }]
        });
        return true;
      }
      if ("Notification" in window) {
        if (Notification.permission === "default") await Notification.requestPermission();
        if (Notification.permission !== "granted") return false;
        new Notification(payload?.title || "norma tool", { body: payload?.body || "" });
        return true;
      }
      return false;
    },
    getAppInfo: async () => ({
      version: `${ANDROID_APP_VERSION} Android beta`,
      dataPath: "この端末のアプリ内保存"
    }),
    checkAppUpdate: async () => {
      const response = await fetch("https://api.github.com/repos/Syqhu/norma-tool-android/releases?per_page=20");
      const releases = await response.json();
      const release = (Array.isArray(releases) ? releases : []).find((item) => !item.draft);
      const latestVersion = String(release?.tag_name || "").replace(/^v/i, "");
      return {
        hasUpdate: compareVersionText(latestVersion, ANDROID_APP_VERSION) > 0,
        currentVersion: ANDROID_APP_VERSION,
        latestVersion,
        tagName: release?.tag_name || "",
        name: release?.name || release?.tag_name || "",
        releaseUrl: release?.html_url || "https://github.com/Syqhu/norma-tool-android/releases",
        publishedAt: release?.published_at || "",
        body: release?.body || "",
        assets: (release?.assets || []).map((asset) => ({
          name: asset.name || "",
          url: asset.browser_download_url || "",
          size: asset.size || 0
        }))
      };
    },
    openExternalUrl: async (url) => {
      window.open(url, "_blank", "noopener,noreferrer");
      return true;
    },
    chooseStatImage: async () => null,
    extractStatsFromImage: async () => {
      throw new Error("Android betaでは画像OCRはまだ未対応です。手入力を使ってください。");
    },
    extractDiscFromImage: async () => {
      throw new Error("Android betaではディスクOCRはまだ未対応です。手入力を使ってください。");
    },
    saveBuildCard: async () => {
      throw new Error("Android betaではビルドカード保存はまだ未対応です。");
    },
    hoyolabLogin: async () => window.Capacitor?.Plugins?.HoyolabAuth?.login?.() || ({ loggedIn: false, cookieCount: 0 }),
    hoyolabStatus: async () => window.Capacitor?.Plugins?.HoyolabAuth?.status?.() || ({ loggedIn: false, cookieCount: 0 }),
    hoyolabSync: () => androidHoyolabSync(),
    hoyolabDailyStatus: () => androidHoyolabDailyStatus(),
    hoyolabDisconnect: async () => window.Capacitor?.Plugins?.HoyolabAuth?.disconnect?.() || ({ loggedIn: false, cookieCount: 0 })
  };
}
const isAndroidBeta = window.zzzApp?.platform === "android";
const hoyolabBattleRecordUrl = "https://act.hoyolab.com/app/zzz-game-record/index.html?lang=ja-jp";
const hoyolabApiBase = "https://sg-act-public-api.hoyolab.com/event/game_record_zzz";
const hoyolabNoteUrl = "https://sg-act-nap-api.hoyolab.com/event/game_record_zzz/api/zzz/note";
const hoyolabRoleEndpoints = [
  "https://api-os-takumi.hoyoverse.com/binding/api/getUserGameRolesByCookie",
  "https://api-os-takumi.hoyolab.com/binding/api/getUserGameRolesByCookie"
];
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

function compareVersionText(a, b) {
  const parse = (value) => String(value || "").replace(/^v/i, "").split("-")[0].split(".").map((part) => Number.parseInt(part, 10) || 0);
  const left = parse(a);
  const right = parse(b);
  for (let i = 0; i < 3; i += 1) {
    if ((left[i] || 0) !== (right[i] || 0)) return (left[i] || 0) > (right[i] || 0) ? 1 : -1;
  }
  return 0;
}
const profileIdAliases = {
  1011: "Anby",
  1021: "Nekomata",
  1031: "Nicole",
  1041: "Soldier 11",
  1051: "Yidhari",
  1061: "Corin",
  1071: "Caesar",
  1081: "Billy",
  1091: "Miyabi",
  1101: "Koleda",
  1111: "Anton",
  1121: "Ben",
  1131: "Soukaku",
  1141: "Lycaon",
  1151: "Lucy",
  1161: "Lighter",
  1171: "Burnice",
  1181: "Grace",
  1191: "Ellen",
  1201: "Harumasa",
  1211: "Rina",
  1221: "Yanagi",
  1241: "Zhu Yuan",
  1251: "Qingyi",
  1261: "Jane",
  1271: "Seth",
  1281: "Piper",
  1291: "Hugo",
  1301: "Orphie & Magus",
  1311: "Astra Yao",
  1321: "Evelyn",
  1331: "Vivian",
  1341: "Zhao",
  1351: "Pulchra",
  1361: "Trigger",
  1371: "Yixuan",
  1381: "Soldier 0 - Anby",
  1391: "Ju Fufu",
  1401: "Alice",
  1411: "Yuzuha",
  1421: "Pan Yinhu",
  1431: "Ye Shunguang",
  1441: "Manato",
  1451: "Lucia",
  1461: "Seed",
  1471: "Banyue",
  1481: "Dialyn",
  1491: "Sunna",
  1501: "Aria",
  1511: "Nangong Yu",
  1521: "Cissia",
  1531: "Starlight - Billy",
  1541: "Promeia",
  1551: "Pyrois",
  1561: "Velina",
  1571: "Norma",
  1581: "Avatar_Female_Size02_Remielle",
  1591: "Avatar_Female_Size03_Sigrid"
};

const fallbackCharacters = [
  { id: 1011, name: "アンビー", rank: "A", role: "撃破", element: "電気", camp: 1, icon: "IconRole01" },
  { id: 1021, name: "猫又", rank: "S", role: "強攻", element: "物理", camp: 1, icon: "IconRole11" },
  { id: 1031, name: "ニコ", rank: "A", role: "支援", element: "エーテル", camp: 1, icon: "IconRole12" },
  { id: 1041, name: "11号", rank: "S", role: "強攻", element: "炎", camp: 5, icon: "IconRole05" },
  { id: 1091, name: "星見雅", rank: "S", role: "異常", element: "氷", camp: 6, icon: "IconRole13" },
  { id: 1191, name: "エレン", rank: "S", role: "強攻", element: "氷", camp: 2, icon: "IconRole08" },
  { id: 1241, name: "朱鳶", rank: "S", role: "強攻", element: "エーテル", camp: 7, icon: "IconRole21" },
  { id: 1261, name: "ジェーン", rank: "S", role: "異常", element: "物理", camp: 7, icon: "IconRole24" }
];

const dailyTasks = [
  "活性を消費する",
  "デイリー依頼を確認する",
  "店舗/スクラッチを確認する",
  "育成素材を集める",
  "ディスクを1枚確認する",
  "イベント/期間限定報酬を見る"
];

const state = {
  characters: [],
  selectedId: null,
  filters: {
    search: "",
    element: "すべて",
    role: "すべて",
    rank: "すべて"
    ,
    ownership: "すべて"
  },
  settings: loadSettings(),
  daily: loadDailyState(),
  agentTab: "overview",
  statImportStatus: "",
  discImportStatus: "",
  team: loadTeamState(),
  warehouse: {
    search: "",
    set: "",
    slot: "",
    sort: "score"
  },
  updateInfo: null
};

let autoDetectTimer = null;

const el = {
  dataStatus: document.querySelector("#dataStatus"),
  dailyStatus: document.querySelector("#dailyStatus"),
  homePanel: document.querySelector("#homePanel"),
  grid: document.querySelector("#characterGrid"),
  detail: document.querySelector("#detailPanel"),
  agentPage: document.querySelector("#agentPage"),
  teamPanel: document.querySelector("#teamPanel"),
  warehousePanel: document.querySelector("#warehousePanel"),
  accountPanel: document.querySelector("#accountPanel"),
  search: document.querySelector("#searchInput"),
  elementFilters: document.querySelector("#elementFilters"),
  roleFilters: document.querySelector("#roleFilters"),
  rankFilters: document.querySelector("#rankFilters"),
  ownershipFilters: document.querySelector("#ownershipFilters"),
  dailyList: document.querySelector("#dailyList"),
  dailyStamina: document.querySelector("#dailyStaminaPanel"),
  dailyCards: document.querySelector("#dailyCardsPanel"),
  weeklyPanel: document.querySelector("#weeklyPanel"),
  detectDaily: document.querySelector("#detectDailyBtn"),
  notifyNow: document.querySelector("#notifyNowBtn"),
  notificationToggle: document.querySelector("#notificationToggle"),
  notificationTime: document.querySelector("#notificationTimeInput"),
  staminaNotifyToggle: document.querySelector("#staminaNotifyToggle"),
  staminaThreshold: document.querySelector("#staminaThresholdInput"),
  autoDetectToggle: document.querySelector("#autoDetectToggle"),
  autoDetectInterval: document.querySelector("#autoDetectIntervalInput"),
  autoUpdateToggle: document.querySelector("#autoUpdateToggle"),
  appUpdateToggle: document.querySelector("#appUpdateToggle"),
  autoBackupToggle: document.querySelector("#autoBackupToggle"),
  refreshData: document.querySelector("#refreshDataBtn"),
  appUpdateStatus: document.querySelector("#appUpdateStatus"),
  checkAppUpdate: document.querySelector("#checkAppUpdateBtn"),
  openAppRelease: document.querySelector("#openAppReleaseBtn"),
  setupPanel: document.querySelector("#setupPanel"),
  hoyolabLogin: document.querySelector("#hoyolabLoginBtn"),
  hoyolabSync: document.querySelector("#hoyolabSyncBtn"),
  hoyolabDisconnect: document.querySelector("#hoyolabDisconnectBtn"),
  hoyolabStatus: document.querySelector("#hoyolabStatus"),
  createLocalBackup: document.querySelector("#createLocalBackupBtn"),
  restoreLocalBackup: document.querySelector("#restoreLocalBackupBtn"),
  backupStatus: document.querySelector("#backupStatus"),
  appInfo: document.querySelector("#appInfo")
};

if (isAndroidBeta) {
  document.body.classList.add("android-beta");
}

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadSettings() {
  const saved = readJsonStorage("settings", {});
  return {
    notifyDaily: saved.notifyDaily ?? true,
    notifyTime: saved.notifyTime || "21:00",
    staminaNotify: saved.staminaNotify ?? true,
    staminaThreshold: Number(saved.staminaThreshold || 220),
    autoDetect: saved.autoDetect ?? false,
    autoDetectInterval: Number(saved.autoDetectInterval || 30),
    autoUpdate: saved.autoUpdate ?? true,
    appUpdate: saved.appUpdate ?? true,
    autoBackup: saved.autoBackup ?? true
  };
}

function saveSettings() {
  localStorage.setItem("settings", JSON.stringify(state.settings));
}

function loadDailyState() {
  const key = todayKey();
  const saved = readJsonStorage("dailyState", {});
  if (saved.date !== key) {
    return { date: key, done: Array(dailyTasks.length).fill(false), lastNotified: "", hoyolab: null };
  }
  return {
    date: key,
    done: Array.from({ length: dailyTasks.length }, (_, i) => Boolean(saved.done?.[i])),
    lastNotified: saved.lastNotified || "",
    hoyolab: saved.hoyolab || null
  };
}

function saveDailyState() {
  localStorage.setItem("dailyState", JSON.stringify(state.daily));
}

function loadTeamState() {
  const saved = readJsonStorage("teamState", null);
  return {
    slots: Array.from({ length: 3 }, (_, i) => saved?.slots?.[i] || "")
  };
}

function saveTeamState() {
  localStorage.setItem("teamState", JSON.stringify(state.team));
}

function loadDiscWarehouse() {
  return readJsonStorage("discWarehouse", []);
}

function saveDiscWarehouse(items) {
  localStorage.setItem("discWarehouse", JSON.stringify(items.slice(0, 300)));
}

function warehouseDiscToComparison(entry) {
  const slot = Number(entry.slot || 1);
  return {
    slot,
    set: normalizeDiscSetName(entry.set || ""),
    main: fixedDiscMainStats[slot] || normalizeDiscMainName(entry.main, slot),
    substats: Array.from({ length: 4 }, (_, index) => normalizeSubstat(entry.substats?.[index]))
  };
}

function discWarehouseEntry(character, disc, source = "手動") {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt: new Date().toISOString(),
    source,
    characterId: character?.id || "",
    characterName: character?.name || "",
    slot: disc.slot,
    set: normalizeDiscSetName(disc.set || ""),
    main: normalizeDiscMainName(disc.main, disc.slot),
    substats: Array.from({ length: 4 }, (_, index) => normalizeSubstat(disc.substats?.[index]))
  };
}

function discWarehouseFingerprint(entry) {
  const substats = Array.from({ length: 4 }, (_, index) => normalizeSubstat(entry.substats?.[index]))
    .map((item) => `${item.name}:${item.value}`)
    .join("|");
  return [
    entry.characterId || "",
    entry.slot || "",
    normalizeDiscSetName(entry.set || ""),
    normalizeDiscMainName(entry.main, entry.slot),
    substats
  ].join("::");
}

function addDiscToWarehouse(character, disc, source = "手動") {
  const entry = discWarehouseEntry(character, disc, source);
  const fingerprint = discWarehouseFingerprint(entry);
  const existing = loadDiscWarehouse().filter((item) => discWarehouseFingerprint(item) !== fingerprint);
  const items = [entry, ...existing].slice(0, 300);
  saveDiscWarehouse(items);
  return entry;
}

function removeDiscFromWarehouse(id) {
  saveDiscWarehouse(loadDiscWarehouse().filter((item) => item.id !== id));
}

function buildCompletion(character, profile, data) {
  const comparisons = compareTargets(profile, data);
  const statScores = comparisons.map((item) => {
    if (item.current === null || !item.min) return 0;
    return Math.min(100, Math.round((item.current / item.min) * 100));
  });
  const statScore = statScores.length ? Math.round(statScores.reduce((sum, value) => sum + value, 0) / statScores.length) : 0;
  const discScores = data.discs.map((disc) => discScore(profile, disc));
  const discScoreAvg = Math.round(discScores.reduce((sum, value) => sum + value, 0) / (discScores.length || 1));
  const flexibleMatches = flexibleMainSlots.filter((slot) => {
    const disc = data.discs[slot - 1];
    return matchesRecommendation(normalizeDiscMainName(disc?.main, slot), profile.mainStats?.[slot] || []);
  }).length;
  const mainScore = Math.round((flexibleMatches / flexibleMainSlots.length) * 100);
  const levelScore = Math.min(100, Math.round((Number(data.materials?.currentLevel || 1) / 60) * 100));
  const ownedBonus = data.ownership?.owned ? 4 : 0;
  const total = Math.min(100, Math.round(statScore * 0.34 + discScoreAvg * 0.34 + mainScore * 0.2 + levelScore * 0.12 + ownedBonus));
  const notes = [];
  if (statScore < 80) notes.push("目標ステータスに不足があります");
  if (discScoreAvg < 70) notes.push("ディスク平均に更新余地があります");
  if (mainScore < 100) notes.push("4/5/6番のメイン一致を確認してください");
  if (levelScore < 100) notes.push("Lv60まで育成余地があります");
  if (!notes.length) notes.push("入力範囲では完成度が高い状態です");
  return { total, statScore, discScoreAvg, mainScore, levelScore, notes };
}

function renderCompletionPanel(completion) {
  return `
    <div class="completion-panel">
      <div class="completion-head">
        <strong>ビルド完成度</strong>
        <span>${completion.total}%</span>
      </div>
      <div class="completion-bar"><i style="width:${completion.total}%"></i></div>
      <div class="completion-grid">
        <span>ステータス ${completion.statScore}%</span>
        <span>ディスク ${completion.discScoreAvg}</span>
        <span>メイン一致 ${completion.mainScore}%</span>
        <span>Lv ${completion.levelScore}%</span>
      </div>
    </div>
  `;
}

function planFor(character) {
  const byRole = {
    強攻: {
      summary: "火力を伸ばす会心・攻撃寄せ。まず主力スキルと音動機を優先。",
      mainStats: "4番: 会心率/会心ダメ、5番: 属性/攻撃%、6番: 攻撃%",
      subStats: "会心率、会心ダメ、攻撃%、貫通値",
      priority: "Lv/音動機 > コア > 主力スキル > ディスク厳選"
    },
    異常: {
      summary: "状態異常の蓄積と異常ダメージを伸ばす。異常マスタリーを厚めに。",
      mainStats: "4番: 異常マスタリー、5番: 属性/攻撃%、6番: 異常掌握",
      subStats: "異常マスタリー、攻撃%、貫通値、会心系は必要に応じて",
      priority: "Lv/音動機 > コア > 異常関連スキル > ディスク厳選"
    },
    撃破: {
      summary: "ブレイク速度重視。衝撃力とエネルギー回りを優先。",
      mainStats: "4番: 会心/攻撃、5番: 属性/攻撃%、6番: 衝撃力",
      subStats: "衝撃力、攻撃%、会心率、会心ダメ",
      priority: "Lv > コア > 特殊/通常/連携 > ディスク厳選"
    },
    支援: {
      summary: "チームバフと回転率重視。本人火力より支援性能を安定させる。",
      mainStats: "4番: 攻撃/異常/会心、5番: 攻撃/属性、6番: エネルギー/攻撃",
      subStats: "攻撃%、エネルギー系、必要な異常/会心",
      priority: "コア > 支援スキル > 音動機 > ディスク"
    },
    防護: {
      summary: "耐久と支援性能を両立。シールド/被弾管理を軸にする。",
      mainStats: "4番: 防御/攻撃、5番: 防御/攻撃、6番: 防御/エネルギー",
      subStats: "防御%、攻撃%、エネルギー、必要な会心",
      priority: "コア > 防護性能 > 音動機 > ディスク"
    },
    命破: {
      summary: "特殊ロールとして火力と固有ギミックを両立。まずキャラ固有効果を読む。",
      mainStats: "4番: 会心/固有向け、5番: 属性/攻撃、6番: 攻撃/固有向け",
      subStats: "攻撃%、会心系、固有ステータス",
      priority: "コア > 主力スキル > 音動機 > ディスク"
    }
  };
  return byRole[character.role] || {
    summary: "データ未分類。ロールとスキル説明に合わせて主力ステータスを決める。",
    mainStats: "キャラ性能に合わせて調整",
    subStats: "攻撃%、会心系、必要な固有ステータス",
    priority: "Lv > コア > 主力スキル > ディスク"
  };
}

function iconPath(character) {
  if (!character?.icon) return "";
  return `https://static.nanoka.cc/assets/zzz/${character.icon}.webp`;
}

function elementColor(element) {
  return {
    物理: "#ecd797",
    炎: "#ff744a",
    氷: "#69d2ff",
    電気: "#b17eff",
    エーテル: "#ff61be"
  }[element] || "#b57cff";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

function comparisonKey(character) {
  return `agentComparison:${character.id}`;
}

function defaultComparisonState() {
  return {
    stats: Object.fromEntries(targetData.stats.map((stat) => [stat.key, ""])),
    customTargets: {},
    targetMode: "default",
    ownership: {
      owned: false,
      status: "未所持",
      mindscape: 0,
      weapon: "",
      weaponRank: 1,
      tags: [],
      memo: ""
    },
    materials: {
      currentLevel: 1,
      targetLevel: 60,
      skillGoal: 12,
      coreGoal: 6,
      weeklyBossDone: false,
      promotionType: "",
      skillType: "",
      weeklyBossType: "未設定",
      ownedDenny: 0,
      ownedExp: 0,
      ownedPromotion: 0,
      ownedSkill: 0,
      ownedCore: 0,
      dailyBattery: 300
    },
    discs: discSlots.map((slot) => ({
      slot,
      set: "",
      main: fixedDiscMainStats[slot] || "",
      substats: Array.from({ length: 4 }, () => ({ name: "", value: "" }))
    })),
    discCandidates: discSlots.map((slot) => ({
      slot,
      set: "",
      main: fixedDiscMainStats[slot] || "",
      substats: Array.from({ length: 4 }, () => ({ name: "", value: "" }))
    }))
  };
}

function loadComparisonState(character) {
  const defaults = defaultComparisonState();
  const saved = readJsonStorage(comparisonKey(character), null);
  if (!saved) return defaults;
  return {
    stats: { ...defaults.stats, ...(saved.stats || {}) },
    customTargets: { ...(saved.customTargets || {}) },
    targetMode: saved.targetMode || defaults.targetMode,
    ownership: {
      ...defaults.ownership,
      ...(saved.ownership || {}),
      tags: Array.isArray(saved.ownership?.tags)
        ? saved.ownership.tags
        : String(saved.ownership?.tags || "").split(/[、,\s]+/).map((item) => item.trim()).filter(Boolean)
    },
    materials: { ...defaults.materials, ...(saved.materials || {}) },
    discs: normalizeDiscList(defaults.discs, saved.discs),
    discCandidates: normalizeDiscList(defaults.discCandidates, saved.discCandidates)
  };
}

function normalizeDiscList(defaults, savedList) {
  return discSlots.map((slot, index) => {
    const disc = { ...defaults[index], ...(savedList?.[index] || {}) };
    disc.slot = slot;
    disc.set = normalizeDiscSetName(disc.set);
    if (fixedDiscMainStats[slot]) disc.main = fixedDiscMainStats[slot];
    if (typeof disc.substats === "string") {
      disc.substats = disc.substats.split(/[、,/]/).map((item) => item.trim()).filter(Boolean).slice(0, 4);
    }
    disc.substats = Array.from({ length: 4 }, (_, i) => normalizeSubstat(disc.substats?.[i]));
    return disc;
  });
}

function saveComparisonState(character, data) {
  localStorage.setItem(comparisonKey(character), JSON.stringify(data));
}

function profileFor(character) {
  const alias = profileIdAliases[character.id];
  const profile = targetData.profiles[character.en] || targetData.profiles[character.name] || targetData.profiles[alias];
  const template = targetData.roleTemplates[character.role] || targetData.roleTemplates.強攻 || {};
  return {
    status: profile?.status || template.status || "未確認",
    variant: profile?.variant || "ロール基準",
    targets: profile?.targets || [],
    mainStats: profile?.mainStats || template.mainStats || {},
    subStats: profile?.subStats || template.subStats || [],
    sets: profile?.sets || [],
    note: profile?.note || template.note || "目標値は未登録です。",
    sources: profile?.sources || [],
    verified: Boolean(profile)
  };
}

function activeProfile(profile, data, character) {
  const mode = data.targetMode || "default";
  const next = {
    ...profile,
    mainStats: Object.fromEntries(Object.entries(profile.mainStats || {}).map(([slot, values]) => [slot, [...values]])),
    subStats: [...(profile.subStats || [])],
    note: `${profile.note}${buildPresets[mode] ? ` / ${buildPresets[mode].label}: ${buildPresets[mode].note}` : ""}`
  };
  if (mode === "critStable") {
    next.subStats = uniqueList(["会心率", "会心ダメージ", "攻撃力%", ...next.subStats]);
    next.mainStats[4] = uniqueList(["会心率", "会心ダメージ", ...(next.mainStats[4] || [])]);
  } else if (mode === "anomalyCore" || character.role === "異常") {
    next.subStats = uniqueList(["異常マスタリー", "攻撃力%", ...next.subStats]);
    next.mainStats[4] = uniqueList(["異常マスタリー", ...(next.mainStats[4] || [])]);
    next.mainStats[6] = uniqueList(["異常掌握", "攻撃力%", ...(next.mainStats[6] || [])]);
  } else if (mode === "supportCycle" || ["支援", "防護"].includes(character.role)) {
    next.subStats = uniqueList(["エネルギー自動回復", "攻撃力%", "HP%", "防御力%", ...next.subStats]);
    next.mainStats[6] = uniqueList(["エネルギー自動回復", ...(next.mainStats[6] || [])]);
  } else if (mode === "nonSignature") {
    next.subStats = uniqueList([...next.subStats, "会心率", "会心ダメージ", "攻撃力%", "異常マスタリー"]);
  }
  return next;
}

function uniqueList(items) {
  return [...new Set(items.filter(Boolean))];
}

function normalizeSubstat(entry) {
  if (!entry) return { name: "", value: "" };
  if (typeof entry === "string") return { name: entry, value: "" };
  return {
    name: entry.name || entry.stat || "",
    value: entry.value === undefined || entry.value === null ? "" : String(entry.value)
  };
}

function normalizeDiscMainName(name, slot) {
  const value = String(name || "").trim();
  if (!value) return "";
  const compact = value.replace(/\s+/g, "");
  const aliases = {
    会心ダメ: "会心ダメージ",
    エネ自動回復: "エネルギー自動回復",
    エネルギー回復: "エネルギー自動回復",
    物理ダメージ: "物理属性ダメージ",
    炎ダメージ: "炎属性ダメージ",
    氷ダメージ: "氷属性ダメージ",
    電気ダメージ: "電気属性ダメージ",
    エーテルダメージ: "エーテル属性ダメージ",
    風ダメージ: "風属性ダメージ"
  };
  const normalized = aliases[compact] || value;
  if (Number(slot) >= 4 && Number(slot) <= 6) {
    if (normalized === "HP") return "HP%";
    if (normalized === "攻撃力") return "攻撃力%";
    if (normalized === "防御力") return "防御力%";
  }
  return normalized;
}

function inferDiscSlotFromMain(main) {
  const normalized = normalizeDiscMainName(main, 0);
  if (!normalized) return null;
  if (["会心率", "会心ダメージ", "異常マスタリー"].includes(normalized)) return 4;
  if (normalized.endsWith("属性ダメージ") || normalized === "貫通率") return 5;
  if (["衝撃力", "異常掌握", "エネルギー自動回復"].includes(normalized)) return 6;
  return null;
}

function inferDiscSlotForCharacter(main, character, data) {
  const direct = inferDiscSlotFromMain(main);
  if (direct) return direct;
  const normalized = normalizeDiscMainName(main, 0);
  if (!normalized) return null;
  const profile = activeProfile(profileFor(character), data, character);
  const matches = flexibleMainSlots.filter((slot) => {
    const slotMain = normalizeDiscMainName(normalized, slot);
    return (profile.mainStats?.[slot] || []).some((candidate) => matchesRecommendation(slotMain, [candidate]));
  });
  return matches.length === 1 ? matches[0] : null;
}

function normalizeDiscSetName(name) {
  const value = String(name || "").trim();
  if (!value) return "";
  return discSetAliases[value] || value;
}

function normalizedSubstats(disc) {
  if (typeof disc.substats === "string") {
    return disc.substats.split(/[、,/]/).map((item) => normalizeSubstat(item.trim())).filter((item) => item.name);
  }
  return (disc.substats || []).map(normalizeSubstat).filter((item) => item.name);
}

function substatUnit(name) {
  return name.includes("%") || ["会心率", "会心ダメージ"].includes(name) ? "%" : "";
}

function substatLabel(substat) {
  const item = normalizeSubstat(substat);
  if (!item.name) return "";
  const value = numeric(item.value);
  if (value === null) return item.name;
  return `${item.name} +${value.toLocaleString("ja-JP")}${substatUnit(item.name)}`;
}

function scoreTuningFor(character) {
  const keys = [character?.name, character?.en, profileIdAliases[character?.id]]
    .map((value) => String(value || "").trim())
    .filter(Boolean);
  return Object.entries(characterScoreTuning).find(([name]) => keys.some((key) => key.includes(name) || name.includes(key)))?.[1] || null;
}

function discWeightProfile(character, profile, data) {
  const active = activeProfile(profile, data, character);
  const weights = {};
  for (const stat of active.subStats || []) weights[stat] = Math.max(weights[stat] || 0, 18);
  for (const target of active.targets || []) {
    const label = statLabel(target.key);
    if (label) weights[label] = Math.max(weights[label] || 0, 22);
    if (target.key === "critRate") weights["会心率"] = Math.max(weights["会心率"] || 0, 24);
    if (target.key === "critDmg") weights["会心ダメージ"] = Math.max(weights["会心ダメージ"] || 0, 22);
    if (target.key === "atk") weights["攻撃力%"] = Math.max(weights["攻撃力%"] || 0, 20);
    if (target.key === "hp") weights["HP%"] = Math.max(weights["HP%"] || 0, 20);
    if (target.key === "def") weights["防御力%"] = Math.max(weights["防御力%"] || 0, 20);
    if (target.key === "ap") weights["異常マスタリー"] = Math.max(weights["異常マスタリー"] || 0, 24);
    if (target.key === "anomalyProf") weights["異常掌握"] = Math.max(weights["異常掌握"] || 0, 20);
  }
  if (character.role === "撃破") weights["衝撃力"] = Math.max(weights["衝撃力"] || 0, 24);
  if (character.role === "支援") weights["エネルギー自動回復"] = Math.max(weights["エネルギー自動回復"] || 0, 20);
  const tuning = scoreTuningFor(character);
  if (tuning?.stats) {
    for (const [name, weight] of Object.entries(tuning.stats)) {
      weights[name] = Math.max(weights[name] || 0, weight);
    }
  }
  return {
    mode: data.targetMode || "default",
    weights,
    source: tuning?.note
      ? `キャラ別基準: ${tuning.note}`
      : "複数ソースで確認した推奨メイン・サブステと実用プリセット傾向を反映"
  };
}

function statLabel(key) {
  return statByKey[key]?.label || key;
}

function statValueText(value, key) {
  if (value === null || value === undefined || value === "") return "未入力";
  const unit = statByKey[key]?.unit || "";
  return `${Number(value).toLocaleString("ja-JP")}${unit}`;
}

function targetValueText(target) {
  if (target.min === null || target.min === undefined) return target.note || "ソース記載に従う";
  return `${statValueText(target.min, target.key)}以上`;
}

function readComparisonForm(base = defaultComparisonState()) {
  const stats = { ...(base.stats || {}) };
  document.querySelectorAll("[data-stat-input]").forEach((input) => {
    stats[input.dataset.statInput] = input.value;
  });
  const customTargets = { ...(base.customTargets || {}) };
  document.querySelectorAll("[data-target-input]").forEach((input) => {
    customTargets[input.dataset.targetInput] = input.value;
  });
  const discs = discSlots.map((slot, index) => {
    const baseDisc = base.discs?.[index] || { slot, set: "", main: fixedDiscMainStats[slot] || "", substats: [] };
    const subRows = Array.from(document.querySelectorAll(`[data-disc-sub-row="${slot}"]`));
    return {
      slot,
      set: normalizeDiscSetName(document.querySelector(`[data-disc-set="${slot}"]`)?.value ?? baseDisc.set ?? ""),
      main: fixedDiscMainStats[slot] || document.querySelector(`[data-disc-main="${slot}"]`)?.value || baseDisc.main || "",
      substats: subRows.length
        ? subRows.map((row) => ({
          name: row.querySelector("[data-disc-sub-name]")?.value || "",
          value: row.querySelector("[data-disc-sub-value]")?.value || ""
        }))
        : Array.from({ length: 4 }, (_, i) => normalizeSubstat(baseDisc.substats?.[i]))
    };
  });
  const discCandidates = discSlots.map((slot, index) => {
    const baseDisc = base.discCandidates?.[index] || { slot, set: "", main: fixedDiscMainStats[slot] || "", substats: [] };
    const subRows = Array.from(document.querySelectorAll(`[data-candidate-sub-row="${slot}"]`));
    return {
      slot,
      set: normalizeDiscSetName(document.querySelector(`[data-candidate-set="${slot}"]`)?.value ?? baseDisc.set ?? ""),
      main: fixedDiscMainStats[slot] || document.querySelector(`[data-candidate-main="${slot}"]`)?.value || baseDisc.main || "",
      substats: subRows.length
        ? subRows.map((row) => ({
          name: row.querySelector("[data-candidate-sub-name]")?.value || "",
          value: row.querySelector("[data-candidate-sub-value]")?.value || ""
        }))
        : Array.from({ length: 4 }, (_, i) => normalizeSubstat(baseDisc.substats?.[i]))
    };
  });
  const ownership = {
    ...(base.ownership || {}),
    owned: document.querySelector("[data-owned-input]") ? Boolean(document.querySelector("[data-owned-input]").checked) : base.ownership?.owned ?? false,
    status: document.querySelector("[data-owned-status]")?.value ?? base.ownership?.status ?? "未所持",
    mindscape: Number(document.querySelector("[data-mindscape]")?.value ?? base.ownership?.mindscape ?? 0),
    weapon: document.querySelector("[data-weapon]")?.value ?? base.ownership?.weapon ?? "",
    weaponRank: Number(document.querySelector("[data-weapon-rank]")?.value ?? base.ownership?.weaponRank ?? 1),
    tags: uniqueList(String(document.querySelector("[data-owned-tags]")?.value ?? (base.ownership?.tags || []).join("、"))
      .split(/[、,\s]+/)
      .map((item) => item.trim())
      .filter(Boolean)),
    memo: document.querySelector("[data-owned-memo]")?.value ?? base.ownership?.memo ?? ""
  };
  const materials = {
    ...(base.materials || {}),
    currentLevel: Number(document.querySelector("[data-current-level]")?.value ?? base.materials?.currentLevel ?? 1),
    targetLevel: Number(document.querySelector("[data-target-level]")?.value ?? base.materials?.targetLevel ?? 60),
    skillGoal: Number(document.querySelector("[data-skill-goal]")?.value ?? base.materials?.skillGoal ?? 12),
    coreGoal: Number(document.querySelector("[data-core-goal]")?.value ?? base.materials?.coreGoal ?? 6),
    weeklyBossDone: document.querySelector("[data-weekly-boss]") ? Boolean(document.querySelector("[data-weekly-boss]").checked) : base.materials?.weeklyBossDone ?? false
  };
  materials.promotionType = document.querySelector("[data-promotion-type]")?.value ?? base.materials?.promotionType ?? "";
  materials.skillType = document.querySelector("[data-skill-type]")?.value ?? base.materials?.skillType ?? "";
  materials.weeklyBossType = document.querySelector("[data-weekly-boss-type]")?.value ?? base.materials?.weeklyBossType ?? "未設定";
  materials.ownedDenny = Number(document.querySelector("[data-owned-denny]")?.value ?? base.materials?.ownedDenny ?? 0);
  materials.ownedExp = Number(document.querySelector("[data-owned-exp]")?.value ?? base.materials?.ownedExp ?? 0);
  materials.ownedPromotion = Number(document.querySelector("[data-owned-promotion]")?.value ?? base.materials?.ownedPromotion ?? 0);
  materials.ownedSkill = Number(document.querySelector("[data-owned-skill]")?.value ?? base.materials?.ownedSkill ?? 0);
  materials.ownedCore = Number(document.querySelector("[data-owned-core]")?.value ?? base.materials?.ownedCore ?? 0);
  materials.dailyBattery = Number(document.querySelector("[data-daily-battery]")?.value ?? base.materials?.dailyBattery ?? 300);
  return {
    stats,
    customTargets,
    discs,
    discCandidates,
    targetMode: document.querySelector("[data-target-mode]")?.value ?? base.targetMode ?? "default",
    ownership,
    materials
  };
}

function numeric(value) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function effectiveTargets(profile, data) {
  const fromProfile = profile.targets.filter((target) => target.min !== null && target.min !== undefined);
  const custom = Object.entries(data.customTargets)
    .map(([key, value]) => ({ key, min: numeric(value), note: "手入力目標" }))
    .filter((target) => target.min !== null);
  const merged = [...fromProfile];
  for (const target of custom) {
    const existing = merged.find((item) => item.key === target.key);
    if (existing) existing.min = target.min;
    else merged.push(target);
  }
  return merged;
}

function compareTargets(profile, data) {
  return effectiveTargets(profile, data).map((target) => {
    const current = numeric(data.stats[target.key]);
    if (current === null) return { ...target, current, status: "blank", gap: null };
    const gap = Number((target.min - current).toFixed(2));
    return { ...target, current, status: gap <= 0 ? "ok" : "short", gap };
  });
}

function matchesRecommendation(value, recommended) {
  if (!value) return false;
  return recommended.some((item) => value === item || item === "属性ダメージ" && value.includes("属性ダメージ"));
}

function discSubstatText(disc) {
  if (Array.isArray(disc.substats)) return normalizedSubstats(disc).map(substatLabel).filter(Boolean).join(" / ");
  return String(disc.substats || "");
}

function substatValueBonus(substat, weight) {
  const value = numeric(substat.value);
  if (value === null || value <= 0) return 0;
  const looksLikeRollCount = Number.isInteger(value) && value >= 1 && value <= 5;
  if (looksLikeRollCount && ["会心率", "会心ダメージ"].includes(substat.name)) {
    return Math.min(14, value * 3);
  }
  if (looksLikeRollCount && ["攻撃力%", "HP%", "防御力%", "異常マスタリー", "貫通値"].includes(substat.name)) {
    return Math.min(10, value * 2);
  }
  const divisor = substatUnit(substat.name) ? 2.8 : 18;
  return Math.min(7, Math.round((value / divisor) * Math.max(1, weight / 12)));
}

function discScore(profile, disc) {
  return discScoreDetail(profile, disc).score;
}

function discScoreDetail(profile, disc) {
  const priorities = profile.subStats || [];
  const weights = profile.scoreWeights || {};
  const subs = normalizedSubstats(disc);
  let score = 0;
  const parts = [];
  const recommendedMain = profile.mainStats[disc.slot] || [];
  const discMain = normalizeDiscMainName(disc.main, disc.slot);
  const flexibleSlot = flexibleMainSlots.includes(disc.slot);
  const setMatched = Boolean(disc.set && profile.sets.some((set) => set.includes(disc.set) || disc.set.includes(set.replace(/\s\d$/, ""))));
  if (disc.slot <= 3) {
    score += 10;
    parts.push({ label: "固定メイン", value: 10 });
  } else if (matchesRecommendation(discMain, recommendedMain)) {
    score += 30;
    parts.push({ label: `推奨メイン ${discMain}`, value: 30 });
  } else if (discMain) {
    score -= 6;
    parts.push({ label: `非推奨メイン ${discMain}`, value: -6 });
  } else if (flexibleSlot) {
    score -= 3;
    parts.push({ label: "メイン未入力", value: -3 });
  }
  let effectiveSubstats = 0;
  for (const sub of subs) {
    let base = 1;
    if (weights[sub.name]) base = Math.round(weights[sub.name] * 0.85);
    else if (priorities.includes(sub.name)) base = 15;
    else if (["会心率", "会心ダメージ", "攻撃力%", "異常マスタリー", "HP%", "防御力%"].includes(sub.name)) base = 5;
    if (base >= 4) effectiveSubstats += 1;
    const bonus = substatValueBonus(sub, base);
    score += base + bonus;
    parts.push({ label: substatLabel(sub), value: base + bonus });
  }
  if (subs.length <= 1 && (disc.main || disc.set || subs.length)) {
    const penalty = subs.length ? 6 : 10;
    score -= penalty;
    parts.push({ label: "サブステ情報不足", value: -penalty });
  }
  if (effectiveSubstats === 0 && subs.length) {
    score -= 10;
    parts.push({ label: "有効サブステなし", value: -10 });
  } else if (effectiveSubstats === 1 && subs.length >= 3) {
    score -= 4;
    parts.push({ label: "有効サブステ1枠のみ", value: -4 });
  }
  if (setMatched) {
    score += 7;
    parts.push({ label: `推奨セット ${disc.set}`, value: 7 });
  } else if (disc.set) {
    score -= 2;
    parts.push({ label: `非推奨セット ${disc.set}`, value: -2 });
  }
  return { score: Math.max(0, Math.min(score, 100)), rawScore: score, parts };
}

function discGrade(score) {
  if (score >= 78) return "採用";
  if (score >= 58) return "保留";
  return "交換候補";
}

function analyzeDiscs(profile, data) {
  const messages = [];
  const comparisons = compareTargets(profile, data);
  const shortages = comparisons.filter((item) => item.status === "short");
  for (const item of shortages) {
    messages.push(`${statLabel(item.key)}が${statValueText(item.gap, item.key)}不足しています。`);
  }
  for (const slot of flexibleMainSlots) {
    const disc = data.discs.find((item) => item.slot === slot);
    const recommended = profile.mainStats[slot] || [];
    if (!recommended.length) continue;
    if (!disc?.main) {
      messages.push(`${slot}番ディスクのメインを入力してください。候補: ${recommended.join(" / ")}`);
    } else if (!matchesRecommendation(normalizeDiscMainName(disc.main, slot), recommended)) {
      messages.push(`${slot}番のメインは「${normalizeDiscMainName(disc.main, slot)}」より「${recommended.join(" / ")}」を優先候補にしてください。`);
    }
  }

  const priorityWords = [
    ...shortages.map((item) => statLabel(item.key)),
    ...profile.subStats
  ].filter(Boolean);
  const weakDiscs = data.discs.filter((disc) => {
    const text = discSubstatText(disc);
    if (!text.trim()) return false;
    return !priorityWords.some((word) => text.includes(word));
  });
  if (weakDiscs.length) {
    messages.push(`${weakDiscs.map((disc) => `${disc.slot}番`).join(" / ")}は優先サブステが少ないため交換候補です。`);
  }
  const lowScoreDiscs = data.discs.filter((disc) => discScore(profile, disc) < 64 && (disc.main || discSubstatText(disc) || disc.set));
  if (lowScoreDiscs.length) {
    messages.push(`${lowScoreDiscs.map((disc) => `${disc.slot}番`).join(" / ")}はスコアが低めです。優先サブステか推奨メインに寄せてください。`);
  }
  if (!messages.length) messages.push("現在入力された範囲では大きな不足はありません。サブステの伸び値で微調整してください。");
  return messages;
}

function buildDiagnosis(character, profile, data) {
  const comparisons = compareTargets(profile, data);
  const discDetails = data.discs.map((disc) => ({ disc, detail: discScoreDetail(profile, disc) }));
  const shortages = comparisons.filter((item) => item.status === "short").sort((a, b) => b.gap - a.gap);
  const blankTargets = comparisons.filter((item) => item.status === "blank");
  const weakDiscs = discDetails.filter((item) => item.detail.score < 64 && (item.disc.main || item.disc.set || discSubstatText(item.disc)));
  const avgDisc = discDetails.length
    ? Math.round(discDetails.reduce((sum, item) => sum + item.detail.score, 0) / discDetails.length)
    : 0;
  const notes = [];
  if (shortages.length) notes.push(`${shortages[0].key ? statLabel(shortages[0].key) : "主要ステータス"}が最優先です。${statValueText(shortages[0].gap, shortages[0].key)}不足しています。`);
  if (blankTargets.length) notes.push(`${blankTargets.map((item) => statLabel(item.key)).join(" / ")}の現在値が未入力です。${isAndroidBeta ? "手入力" : "画像OCRか手入力"}で診断精度が上がります。`);
  if (weakDiscs.length) notes.push(`${weakDiscs.map((item) => `${item.disc.slot}番`).join(" / ")}ディスクが交換候補です。`);
  if (!profile.verified) notes.push("このキャラの目標は未確認寄りです。手入力目標を併用してください。");
  if (!notes.length) notes.push(`${character.name}は入力範囲では大きな穴が少ない状態です。サブステ数値の伸びを詰めてください。`);
  return { comparisons, discDetails, shortages, blankTargets, weakDiscs, avgDisc, notes };
}

function discHistoryKey(character) {
  return `discHistory:${character.id}`;
}

function loadDiscHistory(character) {
  return readJsonStorage(discHistoryKey(character), []);
}

function saveDiscHistory(character, data, profile) {
  const history = loadDiscHistory(character);
  const scores = data.discs.map((disc) => ({ slot: disc.slot, score: discScore(profile, disc), main: disc.main, set: disc.set }));
  history.unshift({
    savedAt: new Date().toLocaleString("ja-JP"),
    total: Math.round(scores.reduce((sum, item) => sum + item.score, 0) / (scores.length || 1)),
    scores,
    discs: data.discs
  });
  localStorage.setItem(discHistoryKey(character), JSON.stringify(history.slice(0, 8)));
}

function bestCharactersForDisc(disc) {
  if (!state.characters.length) return [];
  return state.characters
    .map((character) => {
      const profile = profileFor(character);
      const scoreProfile = { ...profile, scoreWeights: discWeightProfile(character, profile, defaultComparisonState()).weights };
      return { character, score: discScore(scoreProfile, disc) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function discSetInfo(name) {
  return discSetDatabase[normalizeDiscSetName(name)] || null;
}

function discSetFit(character, disc) {
  const info = discSetInfo(disc.set);
  if (!info) return { score: 0, label: "セット未判定" };
  let score = 0;
  if (info.roles?.includes(character.role)) score += 12;
  if (info.elements?.includes(character.element)) score += 8;
  const profile = profileFor(character);
  const statHits = normalizedSubstats(disc).filter((sub) => (profile.subStats || []).includes(sub.name) || (info.stats || []).includes(sub.name)).length;
  score += statHits * 3;
  if (fixedDiscMainStats[disc.slot] || (profile.mainStats?.[disc.slot] || []).includes(disc.main)) score += 5;
  return {
    score,
    label: `${info.two} / ${info.roles.join("・")}向け`
  };
}

function classifyDiscForCharacter(character, profile, disc) {
  const score = discScore(profile, disc);
  const fit = discSetFit(character, disc);
  const filled = normalizedSubstats(disc).length;
  const total = score + fit.score;
  if (!disc.set && !disc.main && filled === 0) return { grade: "未入力", reason: "ディスク情報がありません", total };
  if ((total >= 110 && score >= 82) || score >= 90) return { grade: "神個体", reason: `スコア${score} / ${fit.label}`, total };
  if (score >= 78) return { grade: "採用", reason: `スコア${score} / ${fit.label}`, total };
  if (total >= 78 || score >= 58 || fit.score >= 22) return { grade: "保留", reason: `更新候補と比較。${fit.label}`, total };
  return { grade: "餌候補", reason: `スコア${score}。主力候補から外れます`, total };
}

function buildHistoryKey(character) {
  return `buildHistory:${character.id}`;
}

function loadBuildHistory(character) {
  return readJsonStorage(buildHistoryKey(character), []);
}

function saveBuildHistory(character, data, source = "手動") {
  const baseProfile = profileFor(character);
  const profile = {
    ...activeProfile(baseProfile, data, character),
    scoreWeights: discWeightProfile(character, baseProfile, data).weights
  };
  const entry = {
    date: new Date().toISOString(),
    source,
    stats: { ...data.stats },
    ownership: { ...data.ownership },
    avgDisc: Math.round(data.discs.reduce((sum, disc) => sum + discScore(profile, disc), 0) / 6),
    discs: data.discs.map((disc) => ({
      slot: disc.slot,
      set: disc.set,
      main: disc.main,
      score: discScore(profile, disc)
    }))
  };
  const history = [entry, ...loadBuildHistory(character)].slice(0, 12);
  localStorage.setItem(buildHistoryKey(character), JSON.stringify(history));
}

async function fetchCharacters() {
  const manifest = await fetch("https://static.nanoka.cc/manifest.json").then((r) => r.json());
  const version = manifest.zzz.latest;
  const data = await fetch(`https://static.nanoka.cc/zzz/${version}/character.json`).then((r) => r.json());
  return Object.entries(data)
    .filter(([id]) => id !== "2011" && id !== "2021")
    .map(([id, c]) => ({
      id: Number(id),
      name: c.ja || c.en || c.code || id,
      en: c.en || c.code || "",
      rank: c.rank >= 4 ? "S" : "A",
      role: roleMap[c.type] || "不明",
      element: elementMap[c.element] || "不明",
      camp: c.camp || 0,
      icon: c.icon || ""
    }))
    .sort((a, b) => (a.rank === b.rank ? a.name.localeCompare(b.name, "ja") : a.rank === "S" ? -1 : 1));
}

async function loadCharacters({ force = false } = {}) {
  const cached = readJsonStorage("characters", null);
  if (cached?.items?.length && cached.items.some((item) => item.icon) && !force) {
    state.characters = cached.items;
    el.dataStatus.textContent = `キャッシュ ${state.characters.length}件`;
    renderCharacters();
  } else {
    state.characters = fallbackCharacters;
    renderCharacters();
  }

  if (!state.settings.autoUpdate && !force) return;

  try {
    el.dataStatus.textContent = "オンライン更新中";
    const items = await fetchCharacters();
    state.characters = items;
    localStorage.setItem("characters", JSON.stringify({ updatedAt: Date.now(), items }));
    el.dataStatus.textContent = `更新済み ${items.length}件`;
    renderCharacters();
  } catch {
    el.dataStatus.textContent = `オフライン表示 ${state.characters.length}件`;
  }
}

function makeFilter(container, values, key) {
  container.innerHTML = "";
  for (const value of values) {
    const btn = document.createElement("button");
    btn.className = `chip ${state.filters[key] === value ? "active" : ""}`;
    btn.textContent = value;
    btn.addEventListener("click", () => {
      state.filters[key] = value;
      renderFilters();
      renderCharacters();
    });
    container.appendChild(btn);
  }
}

function renderFilters() {
  makeFilter(el.elementFilters, ELEMENTS, "element");
  makeFilter(el.roleFilters, ROLES, "role");
  makeFilter(el.rankFilters, RANKS, "rank");
  makeFilter(el.ownershipFilters, OWNERSHIP_FILTERS, "ownership");
}

function filteredCharacters() {
  const q = state.filters.search.trim().toLowerCase();
  return state.characters.filter((c) => {
    if (state.filters.element !== "すべて" && c.element !== state.filters.element) return false;
    if (state.filters.role !== "すべて" && c.role !== state.filters.role) return false;
    if (state.filters.rank !== "すべて" && c.rank !== state.filters.rank) return false;
    if (state.filters.ownership !== "すべて") {
      const owned = loadComparisonState(c).ownership;
      if (state.filters.ownership === "所持" && !owned.owned) return false;
      if (state.filters.ownership === "未所持" && owned.owned) return false;
      if (["育成中", "完成"].includes(state.filters.ownership) && owned.status !== state.filters.ownership) return false;
    }
    if (!q) return true;
    return [c.name, c.en, c.role, c.element, c.rank].join(" ").toLowerCase().includes(q);
  });
}

function renderCharacters() {
  const items = filteredCharacters();
  el.grid.innerHTML = "";
  for (const character of items) {
    const plan = planFor(character);
    const owned = loadComparisonState(character).ownership;
    const card = document.createElement("article");
    card.className = `agent-card ${state.selectedId === character.id ? "selected" : ""}`;
    card.innerHTML = `
      <div class="agent-art">
        <img src="${iconPath(character)}" alt="${character.name}" />
        <div class="fallback-icon" style="display:none;background:${elementColor(character.element)}">${character.name.slice(0, 1)}</div>
      </div>
      <div class="agent-body">
        <h3>${character.name}</h3>
        <div class="agent-meta">
          <span class="mini-pill ${character.rank === "S" ? "rank-s" : ""}">${character.rank}-Rank</span>
          <span class="mini-pill">${character.element}</span>
          <span class="mini-pill">${character.role}</span>
          <span class="mini-pill ${owned.owned ? "owned" : ""}">${owned.status}</span>
        </div>
        <div class="plan-line">${plan.summary}</div>
      </div>
    `;
    const img = card.querySelector("img");
    const fallback = card.querySelector(".fallback-icon");
    img.addEventListener("error", () => {
      img.style.display = "none";
      fallback.style.display = "grid";
    });
    card.addEventListener("click", () => selectCharacter(character.id));
    el.grid.appendChild(card);
  }
  if (!items.length) {
    el.grid.innerHTML = `<div class="glass-panel empty-detail">条件に合うキャラがいません。</div>`;
  }
}

function selectCharacter(id) {
  state.selectedId = id;
  const character = state.characters.find((c) => c.id === id);
  if (!character) return;
  renderCharacters();
  renderAgentPage(character);
  switchView("agentDetail");
}

function renderDetail(character) {
  const plan = planFor(character);
  el.detail.innerHTML = `
    <div class="detail-hero">
      <img src="${iconPath(character)}" alt="${character.name}" />
      <div class="detail-fallback" style="display:none;background:${elementColor(character.element)}">${character.name.slice(0, 1)}</div>
      <div>
        <p class="eyebrow">${character.rank}-Rank / ${character.role} / ${character.element}</p>
        <h2>${character.name}</h2>
        <p class="muted">${character.en || ""}</p>
      </div>
    </div>
    <div class="section-list">
      <div class="plan-block"><strong>育成方針</strong><p>${plan.summary}</p></div>
      <div class="plan-block"><strong>ディスク主ステ</strong><p>${plan.mainStats}</p></div>
      <div class="plan-block"><strong>サブステ優先</strong><p>${plan.subStats}</p></div>
      <div class="plan-block"><strong>育成優先度</strong><p>${plan.priority}</p></div>
    </div>
  `;
  const img = el.detail.querySelector("img");
  const fallback = el.detail.querySelector(".detail-fallback");
  img.addEventListener("error", () => {
    img.style.display = "none";
    fallback.style.display = "grid";
  });
}

function renderAgentPage(character) {
  const plan = planFor(character);
  const baseProfile = profileFor(character);
  const data = loadComparisonState(character);
  const weightProfile = discWeightProfile(character, baseProfile, data);
  const profile = {
    ...activeProfile(baseProfile, data, character),
    scoreWeights: weightProfile.weights,
    scoreSource: weightProfile.source
  };
  const srcLinks = profile.sources.length
    ? profile.sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.name)}</a>`).join(" / ")
    : "複数ソース確認待ち";

  el.agentPage.innerHTML = `
    <button class="back-button" id="backToAgentsBtn">← 一覧へ戻る</button>
    <section class="agent-page-hero glass-panel">
      <div class="agent-page-art">
        <img src="${iconPath(character)}" alt="${escapeHtml(character.name)}" />
        <div class="detail-fallback" style="display:none;background:${elementColor(character.element)}">${escapeHtml(character.name.slice(0, 1))}</div>
      </div>
      <div class="agent-page-title">
        <p class="eyebrow">${escapeHtml(character.rank)}-Rank / ${escapeHtml(character.role)} / ${escapeHtml(character.element)}</p>
        <h2>${escapeHtml(character.name)}</h2>
        <p class="muted">${escapeHtml(character.en || "")}</p>
        <div class="target-badges">
          <span class="mini-pill ${profile.verified ? "rank-s" : ""}">${escapeHtml(profile.status)}</span>
          <span class="mini-pill">${escapeHtml(profile.variant)}</span>
        </div>
      </div>
      <div class="source-box">
        <strong>参照</strong>
        <p>${srcLinks}</p>
      </div>
    </section>

    <section class="agent-tabs glass-panel">
      ${agentTabs.map((tab) => `<button class="tab-button ${state.agentTab === tab.key ? "active" : ""}" data-agent-tab="${tab.key}">${tab.label}</button>`).join("")}
    </section>

    <section class="agent-tab-body">
      ${renderAgentTab(character, profile, plan, data)}
    </section>
  `;

  const img = el.agentPage.querySelector(".agent-page-art img");
  const fallback = el.agentPage.querySelector(".agent-page-art .detail-fallback");
  img.addEventListener("error", () => {
    img.style.display = "none";
    fallback.style.display = "grid";
  });
  bindAgentPageEvents(character);
}

function renderAgentTab(character, profile, plan, data) {
  if (state.agentTab === "stats") return renderStatsTab(profile, data);
  if (state.agentTab === "discs") return renderDiscsTab(profile, data);
  if (state.agentTab === "diagnosis") return renderDiagnosisTab(character, profile, data);
  if (state.agentTab === "owned") return renderOwnedTab(data);
  if (state.agentTab === "materials") return renderMaterialsTab(character, data);
  if (state.agentTab === "sources") return renderSourcesTab(profile);
  return renderOverviewTab(character, profile, plan, data);
}

function renderOverviewTab(character, profile, plan, data) {
  const owned = data.ownership;
  const completedTargets = compareTargets(profile, data).filter((item) => item.status === "ok").length;
  const totalTargets = effectiveTargets(profile, data).length;
  const roadmap = roadmapItems(character, profile, data);
  return `
    <section class="agent-page-grid">
      <div class="glass-panel metric-panel">
        <p class="eyebrow">Overview</p>
        <h2>育成概要</h2>
        <div class="summary-grid">
          <div class="summary-card"><span>所持</span><strong>${owned.owned ? "所持" : "未所持"}</strong><em>${escapeHtml(owned.status)}</em></div>
          <div class="summary-card"><span>凸数</span><strong>M${owned.mindscape}</strong><em>音動機 R${owned.weaponRank}</em></div>
          <div class="summary-card"><span>目標達成</span><strong>${completedTargets}/${totalTargets || 0}</strong><em>${escapeHtml(profile.status)}</em></div>
        </div>
        <div class="section-list">
          <div class="plan-block"><strong>方針</strong><p>${escapeHtml(plan.summary)}</p></div>
          <div class="plan-block"><strong>推奨メイン</strong><p>${renderMainStatsText(profile)}</p></div>
          <div class="plan-block"><strong>優先サブステ</strong><p>${escapeHtml(profile.subStats.join("、") || plan.subStats)}</p></div>
          <div class="plan-block"><strong>セット候補</strong><p>${escapeHtml(profile.sets.join(" / ") || "ソース確認後に登録")}</p></div>
        </div>
      </div>
      <div class="glass-panel metric-panel">
        <p class="eyebrow">Build Modes</p>
        <h2>目標プリセット</h2>
        <label class="select-line">
          <span>前提</span>
          <select data-target-mode>
            ${["default", "signature", "nonSignature"].map((mode) => `<option value="${mode}" ${data.targetMode === mode ? "selected" : ""}>${mode === "default" ? "登録値" : mode === "signature" ? "モチーフ想定" : "代用音動機想定"}</option>`).join("")}
          </select>
        </label>
        <p class="muted tight">${escapeHtml(profile.note)}</p>
        <div class="target-list">${renderTargetRows(profile, data, compareTargets(profile, data))}</div>
        <div class="analysis-box">
          <strong>育成ロードマップ</strong>
          <ul>${roadmap.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
      </div>
    </section>
  `;
}

function renderStatsTab(profile, data) {
  const comparisons = compareTargets(profile, data);
  const okCount = comparisons.filter((item) => item.status === "ok").length;
  const shortCount = comparisons.filter((item) => item.status === "short").length;
  const enteredStats = targetData.stats.filter((stat) => numeric(data.stats[stat.key]) !== null);
  const character = state.characters.find((item) => item.id === state.selectedId) || {};
  const adjustmentHints = targetAdjustmentHints(character, data, profile);
  return `
    <section class="glass-panel metric-panel">
      <div class="panel-heading compact">
        <div>
          <p class="eyebrow">Target</p>
          <h2>目標ステータス比較</h2>
        </div>
        <div class="button-row">
          ${isAndroidBeta ? "" : `<button class="pill-button" id="statImageImportBtn">画像から取得</button>`}
          <button class="pill-button primary" id="saveCompareBtn">保存して再計算</button>
        </div>
      </div>
      <p class="muted tight">${escapeHtml(profile.note)}</p>
      ${state.statImportStatus ? `<p class="import-status">${escapeHtml(state.statImportStatus)}</p>` : ""}
      <div class="stat-compare-summary">
        <div class="summary-card"><span>達成</span><strong>${okCount}/${comparisons.length || 0}</strong><em>目標ステータス</em></div>
        <div class="summary-card"><span>不足</span><strong>${shortCount}</strong><em>${shortCount ? "伸ばす候補あり" : "不足なし"}</em></div>
        <div class="summary-card"><span>現在値入力</span><strong>${enteredStats.length}/${targetData.stats.length}</strong><em>保存済みステータス</em></div>
      </div>
      <div class="current-stat-strip">
        ${enteredStats.length
          ? enteredStats.map((stat) => `<div><span>${escapeHtml(stat.label)}</span><strong>${escapeHtml(statValueText(data.stats[stat.key], stat.key))}</strong></div>`).join("")
          : `<div class="empty-current"><span>現在ステータス</span><strong>未入力</strong></div>`}
      </div>
      <div class="target-list">${renderTargetRows(profile, data, comparisons)}</div>
      <div class="analysis-box compact-db">
        <strong>目標ステータス自動補正</strong>
        <ul>${adjustmentHints.map((hint) => `<li>${escapeHtml(hint)}</li>`).join("") || "<li>現在の装備条件では追加補正なし</li>"}</ul>
      </div>
      <div class="section-label">現在ステータス入力</div>
      <div class="current-stat-grid">${targetData.stats.map((stat) => renderStatInput(stat, data)).join("")}</div>
    </section>
  `;
}

function renderDiscsTab(profile, data) {
  const messages = analyzeDiscs(profile, data);
  const weights = Object.entries(profile.scoreWeights || {}).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const character = state.characters.find((item) => item.id === state.selectedId) || {};
  const classifications = data.discs.map((disc) => classifyDiscForCharacter(character, profile, disc));
  const compareRows = discComparisonRows(profile, data);
  const scoreRows = data.discs.map((disc) => {
    const score = discScore(profile, disc);
    const classification = classifications[disc.slot - 1];
    return `<div class="score-row"><span>${disc.slot}番</span><strong>${score}</strong><em>${escapeHtml(classification.grade)} / ${discGrade(score)}</em></div>`;
  }).join("");
  return `
    <section class="glass-panel metric-panel">
      <div class="panel-heading compact">
        <div>
          <p class="eyebrow">Disc Check</p>
          <h2>ディスク入力と交換候補</h2>
        </div>
        <div class="button-row">
          ${isAndroidBeta ? "" : `<button class="pill-button" id="discImageImportBtn">ディスク画像から取得</button>`}
          <button class="pill-button" id="saveDiscHistoryBtn">履歴保存</button>
          <button class="pill-button" id="saveDiscsWarehouseBtn">倉庫へ保存</button>
          <button class="pill-button" id="clearCompareBtn">入力をクリア</button>
        </div>
      </div>
      ${state.discImportStatus ? `<p class="import-status">${escapeHtml(state.discImportStatus)}</p>` : ""}
      <div class="disc-grid">${data.discs.map((disc) => renderDiscRow(profile, disc)).join("")}</div>
      <div class="disc-score-grid">${scoreRows}</div>
      <div class="analysis-box compact-db">
        <strong>現在装備 vs 比較候補</strong>
        <ul>${compareRows.length ? compareRows.map((row) => `<li>${row.slot}番: 現在 ${row.current} / 候補 ${row.candidate} / ${row.delta >= 0 ? "+" : ""}${row.delta} - ${escapeHtml(row.note)}</li>`).join("") : "<li>比較候補を入力すると、倉庫なしで交換差分を確認できます。</li>"}</ul>
      </div>
      <details class="candidate-panel">
        <summary>比較候補を入力</summary>
        <div class="disc-grid candidate-grid">${data.discCandidates.map((disc) => renderCandidateDiscRow(profile, disc)).join("")}</div>
      </details>
      <div class="analysis-box">
        <strong>自動仕分け</strong>
        <ul>${data.discs.map((disc) => {
          const classification = classifications[disc.slot - 1];
          return `<li>${disc.slot}番: ${escapeHtml(classification.grade)} - ${escapeHtml(classification.reason)}</li>`;
        }).join("")}</ul>
      </div>
      ${renderDiscHistoryPanel(data)}
      ${renderDiscSetDatabasePanel(profile)}
      <div class="weight-panel">
        <strong>キャラ別スコア重み</strong>
        <p>${escapeHtml(profile.scoreSource || "")}</p>
        <div class="weight-list">${weights.map(([name, weight]) => `<span>${escapeHtml(name)} +${weight}</span>`).join("")}</div>
      </div>
      <div class="analysis-box">
        <strong>判定</strong>
        <ul>${messages.map((message) => `<li>${escapeHtml(message)}</li>`).join("")}</ul>
      </div>
    </section>
  `;
}

function renderDiagnosisTab(character, profile, data) {
  const diagnosis = buildDiagnosis(character, profile, data);
  const topShortages = diagnosis.shortages.slice(0, 4);
  const buildHistory = loadBuildHistory(character);
  const completion = buildCompletion(character, profile, data);
  return `
    <section class="agent-page-grid">
      <div class="glass-panel metric-panel">
        <div class="panel-heading compact">
          <div>
            <p class="eyebrow">Build Diagnosis</p>
            <h2>ビルド診断</h2>
          </div>
          ${isAndroidBeta ? "" : `<button class="pill-button primary" id="saveBuildCardBtn">ビルドカード保存</button>`}
        </div>
        <div class="summary-grid">
          <div class="summary-card"><span>ディスク平均</span><strong>${diagnosis.avgDisc}</strong><em>${diagnosis.avgDisc >= 72 ? "良好" : "更新余地あり"}</em></div>
          <div class="summary-card"><span>不足項目</span><strong>${diagnosis.shortages.length}</strong><em>目標比較</em></div>
          <div class="summary-card"><span>交換候補</span><strong>${diagnosis.weakDiscs.length}</strong><em>ディスク</em></div>
        </div>
        ${renderCompletionPanel(completion)}
        <div class="analysis-box">
          <strong>次にやること</strong>
          <ul>${[...completion.notes, ...diagnosis.notes].slice(0, 6).map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
        </div>
        <div class="target-list diagnosis-list">
          ${topShortages.length ? topShortages.map((item) => `
            <div class="target-row short">
              <div class="target-title"><span>${escapeHtml(statLabel(item.key))}</span><strong>${escapeHtml(statValueText(item.gap, item.key))}不足</strong></div>
              <div class="target-values">
                <div><span>現在</span><b>${escapeHtml(statValueText(item.current, item.key))}</b></div>
                <div><span>目標</span><b>${escapeHtml(targetValueText(item))}</b></div>
                <div><span>優先度</span><b>高</b></div>
              </div>
            </div>
          `).join("") : `<div class="target-row ok"><div class="target-title"><span>ステータス</span><strong>大きな不足なし</strong></div><div class="target-values"><div><span>状態</span><b>良好</b></div></div></div>`}
        </div>
      </div>
      <div class="glass-panel metric-panel">
        <p class="eyebrow">Disc Detail</p>
        <h2>ディスク別診断</h2>
        <div class="disc-detail-list">
          ${diagnosis.discDetails.map(({ disc, detail }) => `
            <div class="disc-detail-row">
              <div><strong>${disc.slot}番 ${detail.score}</strong><span>${escapeHtml(discGrade(detail.score))}</span></div>
              <p>${escapeHtml(detail.parts.slice(0, 4).map((part) => `${part.label} +${part.value}`).join(" / ") || "未入力")}</p>
            </div>
          `).join("")}
        </div>
        <div class="analysis-box compact-db">
          <strong>ビルド履歴</strong>
          <ul>${buildHistory.length ? buildHistory.slice(0, 6).map((item) => `<li>${escapeHtml(new Date(item.date).toLocaleString("ja-JP"))} / ${escapeHtml(item.source)} / 平均${item.avgDisc}</li>`).join("") : `<li>履歴なし。${isAndroidBeta ? "履歴保存ボタンで記録できます。" : "HoYoLAB同期で自動保存されます。"}</li>`}</ul>
        </div>
      </div>
    </section>
  `;
}

function discHasData(disc) {
  if (!disc) return false;
  const slot = Number(disc.slot || 0);
  const main = normalizeDiscMainName(disc.main, slot);
  const fixedOnly = fixedDiscMainStats[slot] && main === fixedDiscMainStats[slot];
  return Boolean(disc.set || discSubstatText(disc) || (main && !fixedOnly));
}

function discComparisonRows(profile, data) {
  return discSlots
    .map((slot, index) => {
      const currentDisc = data.discs[index];
      const candidateDisc = data.discCandidates?.[index];
      if (!discHasData(candidateDisc)) return null;
      const current = discScore(profile, currentDisc);
      const candidate = discScore(profile, candidateDisc);
      const delta = candidate - current;
      return {
        slot,
        current,
        candidate,
        delta,
        note: delta >= 8
          ? "交換優先"
          : delta >= 3
            ? "微更新候補"
            : delta >= 0
              ? "ほぼ横並び"
              : "現在装備を維持"
      };
    })
    .filter(Boolean);
}

function warehouseScoreForCharacter(entry, character) {
  const baseProfile = profileFor(character);
  const data = loadComparisonState(character);
  const profile = {
    ...activeProfile(baseProfile, data, character),
    scoreWeights: discWeightProfile(character, baseProfile, data).weights
  };
  return discScore(profile, entry);
}

function filteredWarehouseItems() {
  const query = state.warehouse.search.trim().toLowerCase();
  const character = state.characters.find((item) => item.id === state.selectedId) || state.characters[0] || null;
  return loadDiscWarehouse().filter((item) => {
    if (state.warehouse.slot && String(item.slot) !== String(state.warehouse.slot)) return false;
    if (state.warehouse.set && normalizeDiscSetName(item.set) !== normalizeDiscSetName(state.warehouse.set)) return false;
    if (!query) return true;
    return [item.characterName, item.set, item.main, discSubstatText(item), item.source]
      .join(" ")
      .toLowerCase()
      .includes(query);
  }).sort((a, b) => {
    if (state.warehouse.sort === "new") return new Date(b.savedAt || 0) - new Date(a.savedAt || 0);
    if (state.warehouse.sort === "slot") return Number(a.slot || 0) - Number(b.slot || 0);
    if (state.warehouse.sort === "set") return String(a.set || "").localeCompare(String(b.set || ""), "ja");
    const left = character ? warehouseScoreForCharacter(a, character) : 0;
    const right = character ? warehouseScoreForCharacter(b, character) : 0;
    return right - left;
  });
}

function renderWarehousePanel() {
  if (!el.warehousePanel) return;
  const all = loadDiscWarehouse();
  const items = filteredWarehouseItems();
  const character = state.characters.find((item) => item.id === state.selectedId) || state.characters[0] || null;
  const setOptions = discSetOptions.map((option) => `<option value="${escapeHtml(option)}" ${state.warehouse.set === option ? "selected" : ""}>${escapeHtml(option || "セットすべて")}</option>`).join("");
  const slotOptions = ["", ...discSlots].map((slot) => `<option value="${slot}" ${String(state.warehouse.slot) === String(slot) ? "selected" : ""}>${slot || "番号すべて"}</option>`).join("");
  const sortOptions = [
    ["score", "評価順"],
    ["new", "新着順"],
    ["slot", "番号順"],
    ["set", "セット順"]
  ].map(([value, label]) => `<option value="${value}" ${state.warehouse.sort === value ? "selected" : ""}>${label}</option>`).join("");
  el.warehousePanel.innerHTML = `
    <div class="panel-heading compact">
      <div>
        <p class="eyebrow">Disc Warehouse</p>
        <h2>所持ディスク倉庫</h2>
      </div>
      <button class="pill-button danger" id="clearWarehouseBtn">倉庫を全削除</button>
    </div>
    <div class="warehouse-toolbar">
      <label class="select-line"><span>検索</span><input id="warehouseSearch" type="search" value="${escapeHtml(state.warehouse.search)}" placeholder="セット、メイン、サブ、保存元..." /></label>
      <label class="select-line"><span>番号</span><select id="warehouseSlot">${slotOptions}</select></label>
      <label class="select-line"><span>セット</span><select id="warehouseSet">${setOptions}</select></label>
      <label class="select-line"><span>並び</span><select id="warehouseSort">${sortOptions}</select></label>
    </div>
    <div class="summary-grid">
      <div class="summary-card"><span>登録枚数</span><strong>${all.length}</strong><em>最大300件</em></div>
      <div class="summary-card"><span>表示中</span><strong>${items.length}</strong><em>検索結果</em></div>
      <div class="summary-card"><span>評価対象</span><strong>${escapeHtml(character?.name || "未選択")}</strong><em>現在選択キャラ基準</em></div>
    </div>
    <div class="warehouse-list">
      ${items.length ? items.map((item) => {
        const score = character ? warehouseScoreForCharacter(item, character) : 0;
        const best = bestCharactersForDisc(item);
        return `
          <article class="warehouse-card">
            <div class="warehouse-card-head">
              <strong>${escapeHtml(item.slot)}番 ${escapeHtml(item.main || "メイン未入力")}</strong>
              <span>${score}</span>
            </div>
            <p>${escapeHtml(item.set || "セット未入力")}</p>
            <em>${escapeHtml(discSubstatText(item) || "サブステ未入力")}</em>
            <small>保存元: ${escapeHtml(item.characterName || item.source || "倉庫")} / 合うキャラ: ${best.map((row) => `${escapeHtml(row.character.name)} ${row.score}`).join(" / ") || "未判定"}</small>
            <div class="button-row">
              <button class="pill-button" data-warehouse-candidate="${escapeHtml(item.id)}">比較候補へ</button>
              <button class="pill-button danger" data-warehouse-delete="${escapeHtml(item.id)}">削除</button>
            </div>
          </article>
        `;
      }).join("") : `<div class="empty-detail">条件に合うディスクがありません。</div>`}
    </div>
  `;
  el.warehousePanel.querySelector("#warehouseSearch")?.addEventListener("input", (event) => {
    state.warehouse.search = event.target.value;
    renderWarehousePanel();
  });
  el.warehousePanel.querySelector("#warehouseSlot")?.addEventListener("change", (event) => {
    state.warehouse.slot = event.target.value;
    renderWarehousePanel();
  });
  el.warehousePanel.querySelector("#warehouseSet")?.addEventListener("change", (event) => {
    state.warehouse.set = event.target.value;
    renderWarehousePanel();
  });
  el.warehousePanel.querySelector("#warehouseSort")?.addEventListener("change", (event) => {
    state.warehouse.sort = event.target.value;
    renderWarehousePanel();
  });
  el.warehousePanel.querySelectorAll("[data-warehouse-candidate]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = state.characters.find((item) => item.id === state.selectedId) || character;
      const entry = loadDiscWarehouse().find((item) => item.id === button.dataset.warehouseCandidate);
      if (!target || !entry) return;
      const data = loadComparisonState(target);
      const disc = warehouseDiscToComparison(entry);
      data.discCandidates[disc.slot - 1] = disc;
      saveComparisonState(target, data);
      state.selectedId = target.id;
      state.discImportStatus = `${entry.slot}番を${target.name}の比較候補に反映しました。`;
      renderWarehousePanel();
    });
  });
  el.warehousePanel.querySelectorAll("[data-warehouse-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      removeDiscFromWarehouse(button.dataset.warehouseDelete);
      renderWarehousePanel();
    });
  });
  el.warehousePanel.querySelector("#clearWarehouseBtn")?.addEventListener("click", () => {
    saveDiscWarehouse([]);
    renderWarehousePanel();
  });
}

function renderDiscHistoryPanel(data) {
  const character = state.characters.find((item) => item.id === state.selectedId);
  if (!character) return "";
  const history = loadDiscHistory(character);
  const currentAverage = Math.round(data.discs.reduce((sum, disc) => sum + (disc.main || disc.set || discSubstatText(disc) ? 1 : 0), 0) / 6 * 100);
  return `
    <div class="history-panel">
      <div><strong>ディスク履歴</strong><span>入力率 ${currentAverage}% / 最新${history.length}件</span></div>
      <div class="history-list">
        ${history.length ? history.map((item) => `<span>${escapeHtml(item.savedAt)} 平均${item.total}</span>`).join("") : `<span>履歴なし</span>`}
      </div>
    </div>
  `;
}

function renderDiscSetDatabasePanel(profile) {
  const preferred = Object.entries(discSetDatabase)
    .filter(([name, info]) => {
      const subHit = (info.stats || []).some((stat) => (profile.subStats || []).includes(stat));
      const setHit = (profile.sets || []).some((setName) => normalizeDiscSetName(setName) === name);
      const roleHit = (info.roles || []).some((role) => ["支援", "防護", "撃破"].includes(role));
      return subHit || setHit || roleHit;
    })
    .slice(0, 10);
  return `
    <div class="analysis-box compact-db">
      <strong>ディスク正式DB</strong>
      <ul>${preferred.map(([name, info]) => `<li>${escapeHtml(name)}: 2セット ${escapeHtml(info.two)} / 適性 ${escapeHtml(info.roles.join("・"))}</li>`).join("")}</ul>
    </div>
  `;
}

function renderOwnedTab(data) {
  const owned = data.ownership;
  const tags = Array.isArray(owned.tags) ? owned.tags : [];
  return `
    <section class="glass-panel metric-panel">
      <div class="panel-heading compact">
        <div>
          <p class="eyebrow">Roster</p>
          <h2>所持キャラ管理</h2>
        </div>
        <button class="pill-button primary" id="saveCompareBtn">保存</button>
      </div>
      <div class="owned-grid">
        <label class="toggle-line compact"><input data-owned-input type="checkbox" ${owned.owned ? "checked" : ""} /><span>所持している</span></label>
        <label class="select-line"><span>状態</span><select data-owned-status>${ownershipStatuses.map((status) => `<option value="${status}" ${owned.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
        <label class="select-line"><span>凸数</span><input data-mindscape type="number" min="0" max="6" value="${owned.mindscape}" /></label>
        <label class="select-line"><span>音動機</span><input data-weapon value="${escapeHtml(owned.weapon)}" placeholder="装備中の音動機" /></label>
        <label class="select-line"><span>音動機ランク</span><input data-weapon-rank type="number" min="1" max="5" value="${owned.weaponRank}" /></label>
        <label class="select-line wide"><span>タグ</span><input data-owned-tags value="${escapeHtml(tags.join("、"))}" placeholder="厳選中、危局用、会心不足..." /></label>
        <div class="tag-suggestions">
          ${quickTagOptions.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
        <label class="select-line wide"><span>メモ</span><textarea data-owned-memo placeholder="厳選方針、次にやること">${escapeHtml(owned.memo)}</textarea></label>
      </div>
    </section>
  `;
}

function materialEstimate(materials) {
  const target = materialPlans[materials.targetLevel] || materialPlans[60];
  const currentRatio = Math.min(Math.max((materials.currentLevel - 1) / (materials.targetLevel - 1 || 1), 0), 1);
  const skillRatio = Math.min(Math.max(materials.skillGoal / 12, 0), 1);
  const coreRatio = Math.min(Math.max(materials.coreGoal / 6, 0), 1);
  return {
    denny: Math.max(0, Math.round(target.denny * (1 - currentRatio) + target.denny * 0.45 * skillRatio + target.denny * 0.25 * coreRatio)),
    exp: Math.max(0, Math.round(target.exp * (1 - currentRatio))),
    promotion: Math.max(0, Math.round(target.promotion * (1 - currentRatio))),
    skill: Math.max(0, Math.round(target.skill * skillRatio)),
    core: Math.max(0, Math.round(target.core * coreRatio)),
    battery: Math.max(0, Math.round(target.battery * (1 - currentRatio) + 180 * skillRatio + 120 * coreRatio))
  };
}

function materialShortage(estimate, materials) {
  return {
    denny: Math.max(0, estimate.denny - (materials.ownedDenny || 0)),
    exp: Math.max(0, estimate.exp - (materials.ownedExp || 0)),
    promotion: Math.max(0, estimate.promotion - (materials.ownedPromotion || 0)),
    skill: Math.max(0, estimate.skill - (materials.ownedSkill || 0)),
    core: Math.max(0, estimate.core - (materials.ownedCore || 0)),
    battery: estimate.battery
  };
}

function materialPlanRows(shortage, materials) {
  const daily = Math.max(1, Number(materials.dailyBattery || 300));
  const roughBattery = Math.max(
    0,
    Math.round(shortage.battery
      + shortage.denny / 2500
      + shortage.exp * 4
      + shortage.promotion * 12
      + shortage.skill * 8
      + shortage.core * 20)
  );
  const days = Math.max(0, Math.ceil(roughBattery / daily));
  const rows = [
    { label: "昇格/レベル", value: shortage.exp + shortage.promotion, note: shortage.exp || shortage.promotion ? "Lvと昇格素材を先に確保" : "足りています" },
    { label: "スキル", value: shortage.skill, note: shortage.skill ? "主力スキルから順に強化" : "足りています" },
    { label: "コア", value: shortage.core, note: shortage.core ? "週ボス/コア素材を確認" : "足りています" },
    { label: "ディニー", value: shortage.denny, note: shortage.denny ? "全工程で不足しやすい枠" : "足りています" }
  ].sort((a, b) => Number(b.value > 0) - Number(a.value > 0) || b.value - a.value);
  return { roughBattery, days, rows };
}

function roadmapItems(character, profile, data) {
  const comparisons = compareTargets(profile, data);
  const shortages = comparisons.filter((item) => item.status === "short").slice(0, 3);
  const discIssues = data.discs
    .map((disc) => ({ slot: disc.slot, score: discScore(profile, disc) }))
    .filter((item) => item.score < 62)
    .slice(0, 3);
  const items = [];
  if (!data.ownership.owned) items.push(`${character.name}を所持登録するか、育成予定に移動`);
  if (shortages.length) items.push(`${shortages.map((item) => statLabel(item.key)).join(" / ")}を優先して伸ばす`);
  if (discIssues.length) items.push(`${discIssues.map((item) => `${item.slot}番`).join(" / ")}ディスクを更新候補にする`);
  if (!data.materials.weeklyBossDone) items.push("週ボス素材を確認");
  items.push("今日の活性は不足素材かディスク厳選へ投入");
  return items;
}

function renderMaterialsTab(character, data) {
  const materials = data.materials;
  const estimate = materialEstimate(materials);
  const shortage = materialShortage(estimate, materials);
  const plan = materialPlanRows(shortage, materials);
  return `
    <section class="agent-page-grid">
      <div class="glass-panel metric-panel">
        <div class="panel-heading compact">
          <div>
            <p class="eyebrow">Materials</p>
            <h2>育成素材プランナー</h2>
          </div>
          <button class="pill-button primary" id="saveCompareBtn">保存</button>
        </div>
        <div class="owned-grid">
          <label class="select-line"><span>現在Lv</span><input data-current-level type="number" min="1" max="60" value="${materials.currentLevel}" /></label>
          <label class="select-line"><span>目標Lv</span><select data-target-level>${[40, 50, 60].map((level) => `<option value="${level}" ${materials.targetLevel === level ? "selected" : ""}>${level}</option>`).join("")}</select></label>
          <label class="select-line"><span>スキル目標</span><input data-skill-goal type="number" min="1" max="12" value="${materials.skillGoal}" /></label>
          <label class="select-line"><span>コア目標</span><input data-core-goal type="number" min="1" max="6" value="${materials.coreGoal}" /></label>
          <label class="select-line"><span>昇格素材タイプ</span><select data-promotion-type>${materialTypeOptions.map((item) => `<option value="${item}" ${materials.promotionType === item || (!materials.promotionType && character.role === item) ? "selected" : ""}>${item}</option>`).join("")}</select></label>
          <label class="select-line"><span>スキル素材タイプ</span><select data-skill-type>${skillTypeOptions.map((item) => `<option value="${item}" ${materials.skillType === item || (!materials.skillType && character.element === item) ? "selected" : ""}>${item}</option>`).join("")}</select></label>
          <label class="select-line"><span>週ボス素材</span><select data-weekly-boss-type>${weeklyBossOptions.map((item) => `<option value="${item}" ${materials.weeklyBossType === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
          <label class="select-line"><span>1日の活性目安</span><input data-daily-battery type="number" min="1" max="1000" value="${materials.dailyBattery || 300}" /></label>
          <label class="toggle-line compact"><input data-weekly-boss type="checkbox" ${materials.weeklyBossDone ? "checked" : ""} /><span>週ボス済み</span></label>
        </div>
      </div>
      <div class="glass-panel metric-panel">
        <p class="eyebrow">Estimate</p>
        <h2>${escapeHtml(character.name)} の概算</h2>
        <div class="summary-grid vertical">
          <div class="summary-card"><span>ディニー</span><strong>${shortage.denny.toLocaleString("ja-JP")}</strong><em>必要 ${estimate.denny.toLocaleString("ja-JP")}</em><input data-owned-denny type="number" value="${materials.ownedDenny || 0}" /></div>
          <div class="summary-card"><span>調査員記録</span><strong>${shortage.exp}</strong><em>必要 ${estimate.exp}</em><input data-owned-exp type="number" value="${materials.ownedExp || 0}" /></div>
          <div class="summary-card"><span>昇格素材</span><strong>${shortage.promotion}</strong><em>${escapeHtml(materials.promotionType || character.role)} / 必要 ${estimate.promotion}</em><input data-owned-promotion type="number" value="${materials.ownedPromotion || 0}" /></div>
          <div class="summary-card"><span>スキル素材</span><strong>${shortage.skill}</strong><em>${escapeHtml(materials.skillType || character.element)} / 必要 ${estimate.skill}</em><input data-owned-skill type="number" value="${materials.ownedSkill || 0}" /></div>
          <div class="summary-card"><span>コア素材</span><strong>${shortage.core}</strong><em>${escapeHtml(materials.weeklyBossType)} / 必要 ${estimate.core}</em><input data-owned-core type="number" value="${materials.ownedCore || 0}" /></div>
          <div class="summary-card"><span>必要活性</span><strong>${plan.roughBattery}</strong><em>約 ${plan.days} 日 / 1日${materials.dailyBattery || 300}</em></div>
        </div>
        <div class="analysis-box compact-db">
          <strong>素材優先順</strong>
          <ul>${plan.rows.map((row) => `<li>${escapeHtml(row.label)}: ${Number(row.value).toLocaleString("ja-JP")} / ${escapeHtml(row.note)}</li>`).join("")}</ul>
        </div>
      </div>
    </section>
  `;
}

function teamCharacters() {
  return state.team.slots
    .map((id) => state.characters.find((character) => String(character.id) === String(id)))
    .filter(Boolean);
}

function campName(character) {
  return campMap[character?.camp] || "陣営不明";
}

function conditionMatches(character, condition, otherMembers) {
  return otherMembers.some((other) => {
    if (condition.element && other.element !== condition.element) return false;
    if (condition.role && other.role !== condition.role) return false;
    if (condition.camp && other.camp !== condition.camp) return false;
    return true;
  });
}

function additionalAbilityStatus(character, team) {
  const others = team.filter((item) => item.id !== character.id);
  const rule = additionalAbilityRules[character.id];
  if (rule) {
    return {
      active: rule.any.some((condition) => conditionMatches(character, condition, others)),
      requirement: rule.label,
      source: "個別条件"
    };
  }
  const sameElement = others.some((other) => other.element === character.element && character.element !== "不明");
  const sameCamp = others.some((other) => other.camp && other.camp === character.camp);
  return {
    active: sameElement || sameCamp,
    requirement: `同属性(${character.element})または同陣営(${campName(character)})`,
    source: "汎用条件"
  };
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "不明";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function isDamageRole(role) {
  return ["強攻", "異常", "命破"].includes(role);
}

function isUtilityRole(role) {
  return ["撃破", "支援", "防護"].includes(role);
}

function chooseTeamAnchor(items) {
  const priority = { 命破: 4, 異常: 3, 強攻: 3, 撃破: 1, 支援: 0, 防護: 0 };
  return [...items].sort((a, b) => (priority[b.role] || 0) - (priority[a.role] || 0))[0] || null;
}

function baseKitHint(character) {
  if (!character) return { label: "", roles: [], elements: [], universal: false };
  if (teamKitHints[character.id]) return teamKitHints[character.id];
  if (character.role === "撃破") return { label: "ブレイク/火力窓作成", roles: ["強攻", "命破"], elements: [character.element], universal: false };
  if (character.role === "支援") return { label: "支援/バフ", roles: ["強攻", "異常", "命破"], elements: [character.element], universal: true };
  if (character.role === "防護") return { label: "耐久/中断耐性", roles: ["強攻", "異常", "命破"], elements: [character.element], universal: true };
  if (character.role === "異常") return { label: "状態異常/混沌", roles: ["異常"], elements: [character.element], universal: false };
  return { label: "火力", roles: [character.role], elements: [character.element], universal: false };
}

function characterMatchesName(character, names) {
  const values = [character?.name, character?.en, profileIdAliases[character?.id]]
    .map((value) => String(value || "").toLowerCase());
  return names.some((name) => values.some((value) => value.includes(String(name).toLowerCase())));
}

function pairSynergyScore(member, anchor) {
  if (!member || !anchor || member.id === anchor.id) return { score: 0, notes: [] };
  const notes = [];
  let score = 0;
  for (const rule of characterPairSynergy) {
    if (!characterMatchesName(member, rule.includes) && !characterMatchesName(anchor, rule.includes)) continue;
    const other = characterMatchesName(member, rule.includes) ? anchor : member;
    const roleOk = !rule.roles || rule.roles.includes(other.role);
    const elementOk = !rule.elements || rule.elements.includes(other.element);
    if (roleOk && elementOk) {
      score += rule.score;
      notes.push(rule.note);
    }
  }
  return { score: Math.min(18, score), notes };
}

function supportFitScore(member, anchor, items) {
  if (!member || !anchor || member.id === anchor.id) return { score: 0, notes: [] };
  const hint = baseKitHint(member);
  const notes = [];
  let score = 0;
  if (hint.universal) {
    score += 7;
    notes.push(`${member.name}: ${hint.label}`);
  }
  if (hint.roles.includes(anchor.role)) {
    score += 8;
    notes.push(`${member.name}は${anchor.role}主軸に噛み合います`);
  }
  if (hint.elements.includes(anchor.element) && anchor.element !== "不明") {
    score += 5;
    notes.push(`${member.name}は${anchor.element}主軸を補助できます`);
  }
  if (member.role === "撃破" && anchor.role === "強攻") score += 9;
  if (member.role === "撃破" && anchor.role === "命破") score += 6;
  if (member.role === "撃破" && anchor.role === "異常") {
    score -= 3;
    notes.push(`${member.name}: 異常軸では撃破より混沌相方/支援を優先する場面があります`);
  }
  if (member.role === "異常" && anchor.role === "異常" && member.element !== anchor.element) {
    score += 12;
    notes.push(`${anchor.name}+${member.name}: 異属性混沌を狙えます`);
  }
  if (member.role === "異常" && anchor.role === "異常" && member.element === anchor.element) {
    score += 3;
    notes.push(`${anchor.name}+${member.name}: 同属性異常は混沌頻度が落ちます`);
  }
  const ability = additionalAbilityStatus(member, items);
  if (ability.active) score += 3;
  const pair = pairSynergyScore(member, anchor);
  score += pair.score;
  pair.notes.forEach((note) => notes.push(note));
  return { score, notes };
}

function teamArchetype(items, roleCounts) {
  const hasAttack = (roleCounts.強攻 || 0) >= 1;
  const hasAnomaly = (roleCounts.異常 || 0) >= 1;
  const hasDoubleAnomaly = (roleCounts.異常 || 0) >= 2;
  const hasRupture = (roleCounts.命破 || 0) >= 1;
  const hasStun = (roleCounts.撃破 || 0) >= 1;
  const hasSupport = (roleCounts.支援 || 0) >= 1 || (roleCounts.防護 || 0) >= 1;
  if (hasDoubleAnomaly && hasSupport) return { name: "異常/混沌", score: 21, ideal: "異常 + 異常 + 支援/防護" };
  if (hasRupture && hasStun && hasSupport) return { name: "命破ブレイク", score: 20, ideal: "命破 + 撃破 + 支援/防護" };
  if (hasAttack && hasStun && hasSupport) return { name: "強攻ブレイク", score: 20, ideal: "強攻 + 撃破 + 支援/防護" };
  if ((hasAttack || hasAnomaly || hasRupture) && hasSupport && items.filter((item) => isUtilityRole(item.role)).length >= 2) {
    return { name: "ハイパーキャリー", score: 16, ideal: "主力 + 支援/防護 + 支援/撃破" };
  }
  if ((hasAttack || hasAnomaly || hasRupture) && hasSupport) return { name: "汎用火力", score: 10, ideal: "主力 + 補助 + 追加能力" };
  return { name: "未完成", score: 2, ideal: "主力火力と補助役を選択" };
}

function teamSynergy(items) {
  const roles = items.map((item) => item.role);
  const ability = items.map((character) => ({ character, ...additionalAbilityStatus(character, items) }));
  const activeAbilityCount = ability.filter((item) => item.active).length;
  const roleCounts = countBy(items, "role");
  const elementCounts = countBy(items, "element");
  const campCounts = countBy(items, "camp");
  const anchor = chooseTeamAnchor(items);
  const dps = items.filter((item) => isDamageRole(item.role));
  const hasSupport = roles.includes("支援") || roles.includes("防護");
  const hasStun = roles.includes("撃破");
  const hasAnomalyPair = (roleCounts.異常 || 0) >= 2;
  const hasRuptureCore = roles.includes("命破");
  const hasBurstWindow = hasStun && (roles.includes("強攻") || roles.includes("命破"));
  const hasQuickSupport = roles.includes("支援") || roles.includes("防護");
  const sameElementLinks = Object.entries(elementCounts).filter(([element, count]) => element !== "不明" && count >= 2);
  const sameCampLinks = Object.entries(campCounts).filter(([camp, count]) => Number(camp) && count >= 2);
  const archetype = teamArchetype(items, roleCounts);
  const fit = items.map((item) => supportFitScore(item, anchor, items));
  const notes = [];
  const scoreParts = [
    archetype.score,
    Math.round((activeAbilityCount / Math.max(items.length, 1)) * 15),
    Math.min(8, sameElementLinks.length * 4 + sameCampLinks.length * 4),
    Math.min(16, fit.reduce((sum, item) => sum + item.score, 0)),
    dps.length === 1 ? 8 : dps.length === 2 ? 3 : 0,
    hasSupport ? 7 : 0,
    hasBurstWindow ? 6 : 0,
    hasQuickSupport && anchor ? 5 : 0
  ];
  const penalties = [];
  if (anchor) notes.push(`主軸: ${anchor.name} / ${anchor.role}。理想型: ${archetype.ideal}`);
  if (hasAnomalyPair) {
    scoreParts.push(5);
    notes.push("異常2名以上。ディスオーダー軸として評価します。属性をずらすほど状態異常を回しやすいです。");
  } else if (hasRuptureCore) {
    scoreParts.push(4);
    notes.push("命破軸です。HP/シアーフォース系の支援、撃破による行動機会作りを優先してください。");
  } else if (roles.includes("強攻") && hasStun && hasSupport) {
    scoreParts.push(5);
    notes.push("強攻・撃破・支援のハイパーキャリー型です。ブレイク中に主力の火力を集中できます。");
  } else if (roles.includes("強攻") && hasStun) {
    scoreParts.push(2);
    notes.push("強攻+撃破型です。支援/防護を入れると火力窓がさらに安定します。");
  }
  fit.flatMap((item) => item.notes).slice(0, 4).forEach((note) => notes.push(note));
  if (activeAbilityCount < items.length) {
    const inactive = ability.filter((item) => !item.active).map((item) => item.character.name);
    if (inactive.length) {
      penalties.push(inactive.length * 5);
      notes.push(`追加能力未発動: ${inactive.join(" / ")}。スコアを減点しています。`);
    }
  } else if (items.length) {
    notes.push("選択中キャラの追加能力はすべて発動しています。");
  }
  if (sameElementLinks.length) notes.push(`同属性リンク: ${sameElementLinks.map(([element, count]) => `${element}${count}名`).join(" / ")}`);
  if (sameCampLinks.length) notes.push(`同陣営リンク: ${sameCampLinks.map(([camp, count]) => `${campMap[camp] || camp}${count}名`).join(" / ")}`);
  if (!dps.length) {
    penalties.push(12);
    notes.push("主力火力が未選択です。強攻/異常/命破のいずれかを入れてください。");
  }
  if (!hasSupport) {
    penalties.push(10);
    notes.push("支援または防護がいません。バフ、耐久、クイック支援の枠を検討してください。");
  }
  if (dps.length >= 3) {
    penalties.push(18);
    notes.push("火力役が多すぎます。1枠は支援/防護/撃破に回すと実戦火力が伸びやすいです。");
  }
  if (hasAnomalyPair && hasStun && !hasSupport) {
    penalties.push(8);
    notes.push("異常2+撃破は支援不足になりがちです。撃破枠を支援/防護に替える候補も比較してください。");
  }
  if (items.length < 3) {
    penalties.push((3 - items.length) * 15);
    notes.push("3枠すべて選ぶと編成評価が安定します。");
  }
  const rawScore = scoreParts.reduce((sum, value) => sum + value, 0) - penalties.reduce((sum, value) => sum + value, 0);
  return {
    score: Math.max(0, Math.min(100, rawScore)),
    notes,
    scoreParts: {
      archetype: archetype.score,
      ability: Math.round((activeAbilityCount / Math.max(items.length, 1)) * 15),
      links: Math.min(8, sameElementLinks.length * 4 + sameCampLinks.length * 4),
      fit: Math.min(16, fit.reduce((sum, item) => sum + item.score, 0)),
      roleBalance: dps.length === 1 ? 8 : dps.length === 2 ? 3 : 0,
      support: hasSupport ? 7 : 0,
      burst: hasBurstWindow ? 6 : 0,
      assist: hasQuickSupport && anchor ? 5 : 0,
      penalties: penalties.reduce((sum, value) => sum + value, 0)
    },
    ability,
    anchor,
    sameElementLinks,
    sameCampLinks,
    archetype: archetype.name
  };
}

function teamMissingRoles(items, synergy) {
  const roles = items.map((item) => item.role);
  const missing = [];
  if (!roles.some((role) => isDamageRole(role))) missing.push("主力火力");
  if (!roles.includes("支援") && !roles.includes("防護")) missing.push("支援/防護");
  if (synergy.archetype === "強攻ブレイク" && !roles.includes("撃破")) missing.push("撃破");
  if (roles.includes("異常") && (countBy(items, "role").異常 || 0) < 2) missing.push("異常相方");
  if (items.length < 3) missing.push(`${3 - items.length}枠`);
  return uniqueList(missing);
}

function renderTeamSourceAudit() {
  return `
    <div class="analysis-box compact-db">
      <strong>編成データ監査</strong>
      <ul>
        <li>更新日: ${escapeHtml(teamSourceAudit.updatedAt)}</li>
        <li>${escapeHtml(teamSourceAudit.policy)}</li>
        ${teamSourceAudit.sources.map((source) => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.name)}</a>: ${escapeHtml(source.note)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function rolePatternMatches(pattern, character) {
  return String(pattern || "")
    .split("|")
    .map((role) => role.trim())
    .filter(Boolean)
    .includes(character.role);
}

function teamTemplateSuggestions(items, synergy) {
  return teamTemplateDatabase.map((template) => {
    const used = new Set();
    const matched = [];
    const missing = [];
    template.roles.forEach((pattern) => {
      const index = items.findIndex((character, itemIndex) => !used.has(itemIndex) && rolePatternMatches(pattern, character));
      if (index >= 0) {
        used.add(index);
        matched.push(items[index].name);
      } else {
        missing.push(pattern.replaceAll("|", "/"));
      }
    });
    let score = Math.round((matched.length / template.roles.length) * 60);
    if (synergy.archetype === template.name || synergy.archetype.includes(template.name.replace("ブレイク", ""))) score += 14;
    score += Math.min(9, synergy.ability.filter((item) => item.active).length * 3);
    score -= missing.length * 8;
    if (items.length < 3) score = Math.min(score, items.length * 24);
    return {
      ...template,
      score: Math.max(0, Math.min(100, score)),
      matched,
      missing
    };
  }).sort((a, b) => b.score - a.score);
}

function teamOrderAdvice(items, synergy) {
  if (!items.length) return ["キャラを選択すると推奨順を表示します。"];
  const anchor = synergy.anchor || chooseTeamAnchor(items);
  const supports = items.filter((item) => item.role === "支援" || item.role === "防護");
  const stunners = items.filter((item) => item.role === "撃破");
  const anomalyPartners = items.filter((item) => item.role === "異常" && item.id !== anchor?.id);
  const ordered = [];
  supports.forEach((item) => ordered.push(item));
  stunners.forEach((item) => ordered.push(item));
  if (anchor) ordered.push(anchor);
  anomalyPartners.forEach((item) => ordered.push(item));
  items.forEach((item) => {
    if (!ordered.some((entry) => entry.id === item.id)) ordered.push(item);
  });
  const unique = ordered.filter((item, index, list) => list.findIndex((entry) => entry.id === item.id) === index).slice(0, 3);
  const notes = [`推奨順: ${unique.map((item) => item.name).join(" -> ")}`];
  if (supports.length) notes.push("支援/防護を主力の手前に置き、バフやクイック支援を主力へ渡しやすくします。");
  if (stunners.length && anchor?.role !== "異常") notes.push("撃破は主力の前後でブレイク窓を作り、強攻/命破の火力を集中します。");
  if (anomalyPartners.length) notes.push("異常2名は属性異常を交互に入れ、混沌発生の間隔を短くします。");
  if (items.some((item) => item.name.includes("セス"))) notes.push("セス採用時は異常アタッカーの直前に置くとバフを渡しやすいです。");
  if (items.some((item) => item.name.includes("ルーシー"))) notes.push("ルーシーは強化特殊/連携後に主力へ渡す順番を優先します。");
  return notes;
}

function contentPresetSuggestions(items, templateMatches, synergy) {
  const topNames = templateMatches.slice(0, 2).map((item) => item.name);
  const roleCounts = countBy(items, "role");
  const hasSupport = (roleCounts.支援 || 0) + (roleCounts.防護 || 0) > 0;
  const hasBurstWindow = (roleCounts.撃破 || 0) > 0 || (roleCounts.異常 || 0) >= 2;
  return contentPresetDatabase.map((preset) => {
    let score = items.length === 3 ? 25 : items.length * 6;
    if (preset.prefer.some((name) => topNames.includes(name))) score += 22;
    if (hasSupport) score += 8;
    if (hasBurstWindow) score += 8;
    if (synergy.score >= 75) score += 8;
    if (synergy.score < 45) score -= 10;
    return {
      ...preset,
      score: Math.max(0, Math.min(100, score)),
      matched: preset.prefer.filter((name) => topNames.includes(name))
    };
  }).sort((a, b) => b.score - a.score);
}

function recommendedTeamPartners(items, synergy) {
  const anchor = synergy.anchor || chooseTeamAnchor(items);
  if (!anchor) return [];
  return state.characters
    .filter((candidate) => !items.some((item) => item.id === candidate.id))
    .map((candidate) => {
      const fit = supportFitScore(candidate, anchor, [...items, candidate]);
      const ability = additionalAbilityStatus(candidate, [...items, candidate]);
      let score = fit.score + (ability.active ? 8 : 0);
      if (candidate.role === "支援" || candidate.role === "防護") score += 6;
      if (anchor.role === "異常" && candidate.role === "異常" && candidate.element !== anchor.element) score += 10;
      if (anchor.role === "強攻" && candidate.role === "撃破") score += 8;
      if (anchor.role === "命破" && ["撃破", "支援", "防護"].includes(candidate.role)) score += 7;
      return {
        character: candidate,
        score: Math.max(0, Math.min(100, score)),
        notes: uniqueList([
          ...fit.notes,
          ability.active ? `追加能力条件を満たしやすいです` : `追加能力条件: ${ability.requirement}`
        ]).slice(0, 2)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

function renderTeamSimulator() {
  if (!el.teamPanel) return;
  const selected = teamCharacters();
  const synergy = teamSynergy(selected);
  const templateMatches = teamTemplateSuggestions(selected, synergy);
  const orderNotes = teamOrderAdvice(selected, synergy);
  const presetMatches = contentPresetSuggestions(selected, templateMatches, synergy);
  const partnerMatches = recommendedTeamPartners(selected, synergy);
  const missingRoles = teamMissingRoles(selected, synergy);
  const options = [`<option value="">未選択</option>`]
    .concat(state.characters.map((character) => `<option value="${character.id}">${escapeHtml(character.name)} / ${escapeHtml(character.role)} / ${escapeHtml(character.element)} / ${escapeHtml(campName(character))}</option>`))
    .join("");
  el.teamPanel.innerHTML = `
    <div class="panel-heading compact">
      <div>
        <p class="eyebrow">Team Simulator</p>
        <h2>編成シミュレーター</h2>
      </div>
      <button class="pill-button primary" id="saveTeamBtn">保存</button>
    </div>
    <div class="team-grid">
      ${state.team.slots.map((id, index) => `
        <label class="select-line">
          <span>${index + 1}枠目</span>
          <select data-team-slot="${index}">${options.replace(`value="${id}"`, `value="${id}" selected`)}</select>
        </label>
      `).join("")}
    </div>
    <div class="summary-grid">
      <div class="summary-card"><span>編成スコア</span><strong>${synergy.score}</strong><em>${escapeHtml(synergy.archetype)}</em></div>
      <div class="summary-card"><span>主軸</span><strong>${escapeHtml(synergy.anchor?.name || "未選択")}</strong><em>${escapeHtml(synergy.anchor ? `${synergy.anchor.role} / ${synergy.anchor.element}` : "火力役を選択")}</em></div>
      <div class="summary-card"><span>選択中</span><strong>${selected.length}/3</strong><em>${selected.map((item) => escapeHtml(item.name)).join(" / ") || "未選択"}</em></div>
      <div class="summary-card"><span>追加能力</span><strong>${synergy.ability.filter((item) => item.active).length}/${selected.length || 0}</strong><em>発動中</em></div>
    </div>
    <div class="team-score-breakdown">
      ${Object.entries(synergy.scoreParts).map(([key, value]) => `<span>${escapeHtml(key)} <b>${value >= 0 ? "+" : ""}${value}</b></span>`).join("")}
    </div>
    ${missingRoles.length ? `<div class="analysis-box compact-db"><strong>不足枠</strong><p>${escapeHtml(missingRoles.join(" / "))}</p></div>` : ""}
    <div class="team-synergy-grid">
      ${synergy.ability.length ? synergy.ability.map((item) => `
        <div class="synergy-card ${item.active ? "active" : "inactive"}">
          <strong>${escapeHtml(item.character.name)}</strong>
          <span>${item.active ? "発動" : "未発動"} / ${escapeHtml(item.requirement)} / ${escapeHtml(item.source)}</span>
        </div>
      `).join("") : `<div class="synergy-card inactive"><strong>追加能力</strong><span>キャラを選択すると判定します</span></div>`}
    </div>
    <div class="team-member-grid">
      ${selected.map((character) => {
        const data = loadComparisonState(character);
        const profile = profileFor(character);
        const active = { ...activeProfile(profile, data, character), scoreWeights: discWeightProfile(character, profile, data).weights };
        const avg = Math.round(data.discs.reduce((sum, disc) => sum + discScore(active, disc), 0) / 6);
        const shortage = compareTargets(active, data).filter((item) => item.status === "short").slice(0, 2);
        return `
          <article class="team-member">
            <img src="${iconPath(character)}" alt="${escapeHtml(character.name)}" />
            <div>
              <strong>${escapeHtml(character.name)}</strong>
              <span>${escapeHtml(character.role)} / ${escapeHtml(character.element)} / ${escapeHtml(campName(character))}</span>
              <em>ディスク平均 ${avg} / ${shortage.length ? shortage.map((item) => statLabel(item.key)).join("・") + "不足" : "不足少なめ"}</em>
            </div>
          </article>
        `;
      }).join("") || `<div class="empty-detail">編成に入れるキャラを選択してください。</div>`}
    </div>
    <div class="template-grid">
      ${templateMatches.slice(0, 5).map((template, index) => `
        <article class="template-card ${index === 0 ? "active" : ""}">
          <div><strong>${escapeHtml(template.name)}</strong><span>${template.score}</span></div>
          <p>${escapeHtml(template.note)}</p>
          <em>${template.missing.length ? `不足: ${template.missing.join(" / ")}` : "テンプレ役割を満たしています"}</em>
        </article>
      `).join("")}
    </div>
    <div class="analysis-box compact-db">
      <strong>編成順アドバイス</strong>
      <ul>${orderNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
    </div>
    <div class="preset-grid">
      ${presetMatches.map((preset) => `
        <article class="preset-card">
          <div><strong>${escapeHtml(preset.name)}</strong><span>${preset.score}</span></div>
          <p>${escapeHtml(preset.note)}</p>
          <em>${escapeHtml(preset.needs.join(" / "))}${preset.matched.length ? ` / 一致: ${escapeHtml(preset.matched.join("・"))}` : ""}</em>
        </article>
      `).join("")}
    </div>
    <div class="analysis-box compact-db">
      <strong>相性候補</strong>
      <ul>${partnerMatches.length ? partnerMatches.map((row) => `<li>${escapeHtml(row.character.name)} / ${escapeHtml(row.character.role)} / ${escapeHtml(row.character.element)}: ${row.score} - ${escapeHtml(row.notes.join(" / "))}</li>`).join("") : "<li>主軸キャラを選ぶと相性候補を表示します。</li>"}</ul>
    </div>
    <div class="analysis-box">
      <strong>編成メモ</strong>
      <ul>${synergy.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
    </div>
    ${renderTeamSourceAudit()}
  `;
  el.teamPanel.querySelectorAll("[data-team-slot]").forEach((select) => {
    select.addEventListener("change", () => {
      state.team.slots[Number(select.dataset.teamSlot)] = select.value;
      saveTeamState();
      renderTeamSimulator();
    });
  });
  el.teamPanel.querySelector("#saveTeamBtn")?.addEventListener("click", () => {
    saveTeamState();
    renderTeamSimulator();
  });
}

function renderSourcesTab(profile) {
  const rows = profile.sources.length
    ? profile.sources.map((source) => `<a class="source-row" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer"><strong>${escapeHtml(source.name)}</strong><span>${escapeHtml(source.url)}</span></a>`).join("")
    : `<div class="source-row muted"><strong>ソース未登録</strong><span>確認でき次第追加</span></div>`;
  return `
    <section class="glass-panel metric-panel">
      <p class="eyebrow">Sources</p>
      <h2>参照ソースとVer3.0監査</h2>
      <div class="analysis-box">
        <strong>${escapeHtml(sourceAudit.version)} データ方針</strong>
        <ul>
          <li>更新日: ${escapeHtml(sourceAudit.updatedAt)}</li>
          <li>${escapeHtml(sourceAudit.policy)}</li>
          <li>登録プロフィール: ${Object.keys(targetData.profiles || {}).length}名</li>
        </ul>
      </div>
      <div class="target-list">${profile.targets.map((target) => `
        <div class="target-row info">
          <span>${escapeHtml(statLabel(target.key))}</span>
          <strong>${escapeHtml(targetValueText(target))}</strong>
          <em>${escapeHtml(target.note || "")}</em>
        </div>
      `).join("")}</div>
      <div class="source-list">${rows}</div>
      <div class="source-list audit-list">
        ${sourceAudit.sources.map((source) => `<a class="source-row" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer"><strong>${escapeHtml(source.name)}</strong><span>${escapeHtml(source.type)} / ${escapeHtml(source.url)}</span></a>`).join("")}
      </div>
    </section>
  `;
}

function renderTargetRows(profile, data, comparisons) {
  const profileRows = profile.targets.length ? profile.targets : [];
  const customOnly = targetData.stats.filter((stat) => !profileRows.some((target) => target.key === stat.key));
  const targetRows = profileRows.map((target) => {
    const comparison = comparisons.find((item) => item.key === target.key);
    const currentText = comparison ? statValueText(comparison.current, target.key) : "未入力";
    const gapText = !comparison || comparison.status === "blank"
      ? "現在値未入力"
      : comparison.status === "ok"
        ? "達成"
        : `${statValueText(comparison.gap, target.key)}不足`;
    const progress = comparison && comparison.current !== null && target.min
      ? Math.min(100, Math.max(0, Math.round((comparison.current / target.min) * 100)))
      : 0;
    return `
      <div class="target-row ${comparison?.status || "info"}">
        <div class="target-title">
          <span>${escapeHtml(statLabel(target.key))}</span>
          <strong>${escapeHtml(gapText)}</strong>
        </div>
        <div class="target-values">
          <div><span>現在</span><b>${escapeHtml(currentText)}</b></div>
          <div><span>目標</span><b>${escapeHtml(targetValueText(target))}</b></div>
          <div><span>進捗</span><b>${progress}%</b></div>
        </div>
        <div class="target-progress" aria-hidden="true"><i style="width:${progress}%"></i></div>
        ${target.note ? `<small>${escapeHtml(target.note)}</small>` : ""}
      </div>
    `;
  }).join("");
  const customRows = customOnly.map((stat) => `
    <label class="target-row custom">
      <span>${escapeHtml(stat.label)} 目標</span>
      <input data-target-input="${stat.key}" type="number" step="${stat.step}" value="${escapeHtml(data.customTargets[stat.key] || "")}" placeholder="任意入力" />
    </label>
  `).join("");
  return `${targetRows || `<div class="target-row info"><span>目標値</span><strong>複数ソース確認待ち</strong><em>手入力目標で比較できます</em></div>`}${customRows}`;
}

function targetAdjustmentHints(character, data, profile) {
  const hints = [];
  const owned = data.ownership || {};
  const setNames = data.discs.map((disc) => normalizeDiscSetName(disc.set)).filter(Boolean);
  if (owned.weapon) hints.push(`音動機「${owned.weapon}」装備中。会心/攻撃/異常の不足は実ステータスで再確認してください。`);
  if (owned.mindscape >= 2) hints.push(`M${owned.mindscape}のため、無凸基準より火力系目標はやや緩和できます。`);
  if (setNames.includes("ウッドペッカー・エレクトロ") || setNames.includes("折枝の刀歌")) hints.push("会心系セット採用中。会心率/会心ダメージはセット効果込みで過不足を見てください。");
  if (setNames.includes("フリーダム・ブルース") || setNames.includes("ケイオス・ジャズ") || setNames.includes("「パエトーン」の歌")) hints.push("異常系セット採用中。異常マスタリー/異常掌握の目標優先度を高めます。");
  if (character.role === "支援" || character.role === "防護") hints.push("支援/防護は本人火力より、エネルギー・耐久・バフ条件の達成を優先します。");
  if (!profile.verified) hints.push("専用目標未確認のため、登録済みロール基準と手入力目標を優先します。");
  return hints;
}

function renderStatInput(stat, data) {
  return `
    <label class="stat-input">
      <span>${escapeHtml(stat.label)}</span>
      <input data-stat-input="${stat.key}" type="number" step="${stat.step}" value="${escapeHtml(data.stats[stat.key] || "")}" placeholder="現在値" />
    </label>
  `;
}

async function importStatsFromImage(character) {
  const base = readComparisonForm(loadComparisonState(character));
  state.statImportStatus = "画像を選択してください。";
  renderAgentPage(character);
  const filePath = await window.zzzApp.chooseStatImage();
  if (!filePath) {
    state.statImportStatus = "画像読み取りをキャンセルしました。";
    renderAgentPage(character);
    return;
  }
  state.statImportStatus = "画像を解析中です。数秒かかる場合があります。";
  renderAgentPage(character);
  try {
    const result = await window.zzzApp.extractStatsFromImage(filePath);
    const next = base;
    const recognized = Object.entries(result.stats || {}).filter(([, value]) => value !== "");
    for (const [key, value] of recognized) {
      next.stats[key] = value;
    }
    saveComparisonState(character, next);
    state.statImportStatus = recognized.length
      ? `${recognized.length}項目を画像から取得しました。`
      : "数値を読み取れませんでした。基本タブのステータス画面スクショを選択してください。";
  } catch (error) {
    state.statImportStatus = `画像読み取りに失敗しました: ${error.message || error}`;
  }
  renderAgentPage(character);
}

async function importDiscFromImage(character) {
  const base = readComparisonForm(loadComparisonState(character));
  state.discImportStatus = "ディスク画像を選択してください。";
  renderAgentPage(character);
  const filePath = await window.zzzApp.chooseStatImage();
  if (!filePath) {
    state.discImportStatus = "ディスク画像読み取りをキャンセルしました。";
    renderAgentPage(character);
    return;
  }
  state.discImportStatus = "ディスク画像を解析中です。読み取れない項目は手入力で補正してください。";
  renderAgentPage(character);
  try {
    const result = await window.zzzApp.extractDiscFromImage(filePath);
    const inferredSlot = inferDiscSlotForCharacter(result.main, character, base);
    const targetSlot = result.slot && discSlots.includes(result.slot)
      ? result.slot
      : inferredSlot || (base.discs.find((disc) => !discSubstatText(disc) && !disc.set && !disc.main) || base.discs[0]).slot;
    const index = targetSlot - 1;
    const current = base.discs[index];
    base.discs[index] = {
      ...current,
      slot: targetSlot,
      main: fixedDiscMainStats[targetSlot] || normalizeDiscMainName(result.main, targetSlot) || normalizeDiscMainName(current.main, targetSlot),
      set: result.set || current.set,
      substats: Array.from({ length: 4 }, (_, i) => {
        const imported = normalizeSubstat(result.substats?.[i]);
        const existing = normalizeSubstat(current.substats?.[i]);
        return {
          name: imported.name || existing.name,
          value: imported.value || existing.value
        };
      })
    };
    saveComparisonState(character, base);
    const filled = base.discs[index].substats.filter((item) => item.name || item.value).length;
    if (base.discs[index].set || base.discs[index].main || discSubstatText(base.discs[index])) {
      addDiscToWarehouse(character, base.discs[index], "画像OCR");
    }
    state.discImportStatus = `${targetSlot}番へ画像OCR結果を反映し、倉庫にも保存しました。サブステ ${filled}/4 件。`;
  } catch (error) {
    state.discImportStatus = `ディスク画像読み取りに失敗しました: ${error.message || error}`;
  }
  renderAgentPage(character);
}

async function saveBuildCard(character) {
  const data = loadComparisonState(character);
  const baseProfile = profileFor(character);
  const profile = {
    ...activeProfile(baseProfile, data, character),
    scoreWeights: discWeightProfile(character, baseProfile, data).weights
  };
  const comparisons = compareTargets(profile, data);
  const completion = buildCompletion(character, profile, data);
  const shortages = comparisons.filter((item) => item.status === "short").slice(0, 4);
  const payload = {
    character: character.name,
    note: `${profile.variant} / ${profile.status} / 完成度 ${completion.total}%`,
    summary: [
      { label: "完成度", value: `${completion.total}%` },
      { label: "ステータス", value: `${completion.statScore}%` },
      { label: "ディスク平均", value: `${completion.discScoreAvg}` },
      { label: "メイン一致", value: `${completion.mainScore}%` }
    ],
    shortages: shortages.map((item) => ({
      label: statLabel(item.key),
      value: `${statValueText(item.current, item.key)} / 目標 ${targetValueText(item)}`
    })),
    stats: targetData.stats
      .filter((stat) => numeric(data.stats[stat.key]) !== null)
      .map((stat) => ({ label: stat.label, value: statValueText(data.stats[stat.key], stat.key) })),
    discs: data.discs.map((disc) => ({
      slot: disc.slot,
      score: discScore(profile, disc),
      text: `${disc.set || "未設定"} / ${disc.main || "未設定"} / ${discSubstatText(disc) || "未入力"}`
    }))
  };
  state.statImportStatus = "ビルドカードを保存中です。";
  renderAgentPage(character);
  try {
    const saved = await window.zzzApp.saveBuildCard(payload);
    state.statImportStatus = saved ? `ビルドカードを保存しました: ${saved}` : "ビルドカード保存をキャンセルしました。";
    if (saved) saveBuildHistory(character, data, "ビルドカード");
  } catch (error) {
    state.statImportStatus = `ビルドカード保存に失敗しました: ${error.message || error}`;
  }
  renderAgentPage(character);
}

function renderMainStatsText(profile) {
  return flexibleMainSlots
    .map((slot) => `${slot}番: ${(profile.mainStats[slot] || ["未確認"]).join(" / ")}`)
    .join("、");
}

function renderDiscRow(profile, disc) {
  const recommended = profile.mainStats[disc.slot] || [];
  const fixedMain = fixedDiscMainStats[disc.slot];
  const selectedSet = normalizeDiscSetName(disc.set);
  const selectedMain = fixedMain || normalizeDiscMainName(disc.main, disc.slot);
  const setOptions = discSetOptions.map((option) => (
    `<option value="${escapeHtml(option)}" ${selectedSet === option ? "selected" : ""}>${escapeHtml(option || "未入力")}</option>`
  )).join("");
  const mainOptions = targetData.discMainOptions.map((option) => (
    `<option value="${escapeHtml(option)}" ${selectedMain === option ? "selected" : ""}>${escapeHtml(option || "未入力")}</option>`
  )).join("");
  const subSelects = Array.from({ length: 4 }, (_, i) => {
    const sub = normalizeSubstat(disc.substats?.[i]);
    return `<div class="substat-pair" data-disc-sub-row="${disc.slot}">
      <select data-disc-sub-name aria-label="${disc.slot}番サブステ${i + 1}">
        ${discSubstatOptions.map((option) => `<option value="${escapeHtml(option)}" ${sub.name === option ? "selected" : ""}>${escapeHtml(option || `サブ${i + 1}`)}</option>`).join("")}
      </select>
      <input data-disc-sub-value type="number" step="0.1" value="${escapeHtml(sub.value)}" placeholder="${substatUnit(sub.name) || "値"}" aria-label="${disc.slot}番サブステ${i + 1}数値" />
    </div>`;
  }).join("");
  const score = discScore(profile, disc);
  const detail = discScoreDetail(profile, disc);
  const matches = bestCharactersForDisc(disc);
  return `
    <article class="disc-row">
      <div class="disc-slot">${disc.slot}</div>
      <label>
        <span>セット</span>
        <select data-disc-set="${disc.slot}">${setOptions}</select>
      </label>
      <label>
        <span>メイン</span>
        ${fixedMain
          ? `<input data-disc-main="${disc.slot}" value="${escapeHtml(fixedMain)}" readonly aria-readonly="true" />`
          : `<select data-disc-main="${disc.slot}">${mainOptions}</select>`}
      </label>
      <label>
        <span>サブステ / 数値</span>
        <div class="substat-selects">${subSelects}</div>
      </label>
      <small>${fixedMain ? `メイン固定: ${escapeHtml(fixedMain)}` : `候補: ${escapeHtml(recommended.join(" / ") || "未確認")}`} / スコア ${score} ${discGrade(score)}</small>
      <div class="disc-extra">
        <span>内訳: ${escapeHtml(detail.parts.slice(0, 4).map((part) => `${part.label} +${part.value}`).join(" / ") || "未入力")}</span>
        <span>合うキャラ: ${matches.map((item) => `${escapeHtml(item.character.name)} ${item.score}`).join(" / ") || "未判定"}</span>
      </div>
    </article>
  `;
}

function renderCandidateDiscRow(profile, disc) {
  const recommended = profile.mainStats[disc.slot] || [];
  const fixedMain = fixedDiscMainStats[disc.slot];
  const selectedSet = normalizeDiscSetName(disc.set);
  const selectedMain = fixedMain || normalizeDiscMainName(disc.main, disc.slot);
  const setOptions = discSetOptions.map((option) => (
    `<option value="${escapeHtml(option)}" ${selectedSet === option ? "selected" : ""}>${escapeHtml(option || "未入力")}</option>`
  )).join("");
  const mainOptions = targetData.discMainOptions.map((option) => (
    `<option value="${escapeHtml(option)}" ${selectedMain === option ? "selected" : ""}>${escapeHtml(option || "未入力")}</option>`
  )).join("");
  const subSelects = Array.from({ length: 4 }, (_, i) => {
    const sub = normalizeSubstat(disc.substats?.[i]);
    return `<div class="substat-pair" data-candidate-sub-row="${disc.slot}">
      <select data-candidate-sub-name aria-label="${disc.slot}番候補サブステ${i + 1}">
        ${discSubstatOptions.map((option) => `<option value="${escapeHtml(option)}" ${sub.name === option ? "selected" : ""}>${escapeHtml(option || `サブ${i + 1}`)}</option>`).join("")}
      </select>
      <input data-candidate-sub-value type="number" step="0.1" value="${escapeHtml(sub.value)}" placeholder="${substatUnit(sub.name) || "値"}" aria-label="${disc.slot}番候補サブステ${i + 1}数値" />
    </div>`;
  }).join("");
  const score = discScore(profile, disc);
  return `
    <article class="disc-row candidate-row">
      <div class="disc-slot">${disc.slot}</div>
      <label>
        <span>候補セット</span>
        <select data-candidate-set="${disc.slot}">${setOptions}</select>
      </label>
      <label>
        <span>候補メイン</span>
        ${fixedMain
          ? `<input data-candidate-main="${disc.slot}" value="${escapeHtml(fixedMain)}" readonly aria-readonly="true" />`
          : `<select data-candidate-main="${disc.slot}">${mainOptions}</select>`}
      </label>
      <label>
        <span>候補サブステ / 数値</span>
        <div class="substat-selects">${subSelects}</div>
      </label>
      <small>候補: ${fixedMain ? `メイン固定 ${escapeHtml(fixedMain)}` : escapeHtml(recommended.join(" / ") || "未確認")} / 候補スコア ${score}</small>
    </article>
  `;
}

function bindAgentPageEvents(character) {
  const saveAndRender = () => {
    saveComparisonState(character, readComparisonForm(loadComparisonState(character)));
    renderAgentPage(character);
  };
  el.agentPage.querySelector("#backToAgentsBtn").addEventListener("click", () => switchView("agents"));
  el.agentPage.querySelectorAll("[data-agent-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.agentTab = btn.dataset.agentTab;
      saveComparisonState(character, readComparisonForm(loadComparisonState(character)));
      renderAgentPage(character);
    });
  });
  el.agentPage.querySelectorAll("#saveCompareBtn").forEach((btn) => btn.addEventListener("click", saveAndRender));
  el.agentPage.querySelector("#statImageImportBtn")?.addEventListener("click", () => {
    importStatsFromImage(character);
  });
  el.agentPage.querySelector("#discImageImportBtn")?.addEventListener("click", () => {
    importDiscFromImage(character);
  });
  el.agentPage.querySelector("#saveDiscHistoryBtn")?.addEventListener("click", () => {
    const data = readComparisonForm(loadComparisonState(character));
    const baseProfile = profileFor(character);
    const profile = {
      ...activeProfile(baseProfile, data, character),
      scoreWeights: discWeightProfile(character, baseProfile, data).weights
    };
    saveDiscHistory(character, data, profile);
    state.discImportStatus = "現在のディスクスコアを履歴に保存しました。";
    saveComparisonState(character, data);
    renderAgentPage(character);
  });
  el.agentPage.querySelector("#saveDiscsWarehouseBtn")?.addEventListener("click", () => {
    const data = readComparisonForm(loadComparisonState(character));
    const filled = data.discs.filter((disc) => discHasData(disc));
    filled.forEach((disc) => addDiscToWarehouse(character, disc, "キャラ装備"));
    state.discImportStatus = `${filled.length}枚をディスク倉庫へ保存しました。`;
    saveComparisonState(character, data);
    renderAgentPage(character);
    renderWarehousePanel();
  });
  el.agentPage.querySelector("#saveBuildCardBtn")?.addEventListener("click", () => {
    saveBuildCard(character);
  });
  el.agentPage.querySelector("#clearCompareBtn")?.addEventListener("click", () => {
    localStorage.removeItem(comparisonKey(character));
    renderAgentPage(character);
  });
  el.agentPage.querySelectorAll(".tag-suggestions span").forEach((tag) => {
    tag.addEventListener("click", () => {
      const input = el.agentPage.querySelector("[data-owned-tags]");
      if (!input) return;
      const tags = uniqueList(`${input.value}、${tag.textContent}`.split(/[、,\s]+/).map((item) => item.trim()).filter(Boolean));
      input.value = tags.join("、");
      saveAndRender();
    });
  });
  el.agentPage.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("change", saveAndRender);
  });
}

function renderDaily() {
  el.dailyList.innerHTML = "";
  dailyTasks.forEach((task, index) => {
    const row = document.createElement("label");
    row.className = `daily-item ${state.daily.done[index] ? "done" : ""}`;
    const source = state.daily.hoyolab?.applied?.[index];
    row.innerHTML = `<input type="checkbox" ${state.daily.done[index] ? "checked" : ""} /><span>${task}${source ? `<em>HoYoLAB: ${escapeHtml(source)}</em>` : ""}</span>`;
    row.querySelector("input").addEventListener("change", (event) => {
      state.daily.done[index] = event.target.checked;
      saveDailyState();
      renderDaily();
      updateDailyStatus();
    });
    el.dailyList.appendChild(row);
  });
  updateDailyStatus();
  updateDailyStaminaPanel();
  renderDailyCards();
  renderWeeklyTracker();
  renderHomeDashboard();
}

function formatDurationSeconds(seconds) {
  const total = Math.max(0, Number(seconds || 0));
  if (!total) return "";
  const hours = Math.floor(total / 3600);
  const minutes = Math.ceil((total % 3600) / 60);
  if (hours <= 0) return `${minutes}分`;
  if (minutes <= 0 || minutes === 60) return `${hours + (minutes === 60 ? 1 : 0)}時間`;
  return `${hours}時間${minutes}分`;
}

function staminaSnapshot() {
  const energy = state.daily.hoyolab?.energy;
  if (!energy) return null;
  const current = Number(energy.current ?? 0);
  const max = Number(energy.max ?? 0);
  const elapsed = state.daily.hoyolab?.checkedAt ? Math.floor((Date.now() - new Date(state.daily.hoyolab.checkedAt).getTime()) / 1000) : 0;
  const remaining = Math.max(0, Number(energy.restore || 0) - elapsed);
  const percent = max > 0 ? Math.min(100, Math.max(0, Math.round(current / max * 100))) : 0;
  const threshold = Math.max(1, Number(state.settings.staminaThreshold || 220));
  return {
    current,
    max,
    percent,
    threshold,
    remaining,
    restoreText: formatDurationSeconds(remaining),
    isFull: max > 0 && current >= max,
    nearFull: max > 0 && current >= Math.max(threshold, Math.floor(max * 0.9))
  };
}

function updateDailyStaminaPanel() {
  if (!el.dailyStamina) return;
  const snap = staminaSnapshot();
  if (!snap) {
    el.dailyStamina.innerHTML = `<span>現在の活性</span><strong>未取得</strong><em>HoYoLAB完了検知で更新します</em>`;
    return;
  }
  const note = snap.isFull ? "満タンです" : snap.restoreText ? `満タンまで約 ${snap.restoreText}` : "回復時間は未取得";
  el.dailyStamina.innerHTML = `
    <span>現在の活性</span>
    <strong>${snap.current}/${snap.max || "?"}</strong>
    <em>${note} / 通知 ${snap.threshold}+</em>
    <i style="--value:${snap.percent}%"><b></b></i>
  `;
}

function dailyCardRows() {
  const daily = state.daily.hoyolab || {};
  const energy = daily.energy;
  const vitality = daily.vitality;
  const applied = daily.applied || {};
  return [
    { label: "活性", value: energy ? `${energy.current}/${energy.max}` : "未取得", state: energy?.spent ? "消費済み" : "確認待ち", active: Boolean(applied[0]) },
    { label: "デイリー活躍度", value: vitality ? `${vitality.current}/${vitality.max}` : "未取得", state: vitality?.done ? "完了" : "未完了", active: Boolean(applied[1]) },
    { label: "スクラッチ", value: daily.scratch?.done ? "済み" : "未/不明", state: daily.scratch?.raw || "未取得", active: Boolean(daily.scratch?.done) },
    { label: "ビデオ屋", value: daily.shop?.state === "finished" ? "完了" : daily.shop?.state === "open" ? "販売中" : "未取得", state: daily.shop?.raw || "未取得", active: daily.shop?.state === "finished" }
  ];
}

function renderDailyCards() {
  if (!el.dailyCards) return;
  el.dailyCards.innerHTML = dailyCardRows().map((item) => `
    <article class="daily-mini-card ${item.active ? "done" : ""}">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
      <em>${escapeHtml(item.state)}</em>
    </article>
  `).join("");
}

function renderWeeklyTracker() {
  if (!el.weeklyPanel) return;
  const weeklies = state.daily.hoyolab?.weeklies;
  if (!weeklies) {
    el.weeklyPanel.innerHTML = `<div class="weekly-card"><strong>週課</strong><span>HoYoLAB完了検知で更新します</span></div>`;
    return;
  }
  const rows = [
    { label: "賞金依頼", value: `${weeklies.bounty}/${weeklies.bountyTotal}` },
    { label: "調査ポイント", value: `${weeklies.surveyPoints}/${weeklies.surveyPointsTotal}` }
  ];
  el.weeklyPanel.innerHTML = `
    <div class="weekly-card">
      <strong>週課トラッカー</strong>
      ${rows.map((row) => `<span>${escapeHtml(row.label)} <b>${escapeHtml(row.value)}</b></span>`).join("")}
    </div>
  `;
}

function renderHomeDashboard() {
  if (!el.homePanel) return;
  const left = incompleteDailyTasks().length;
  const stamina = staminaSnapshot();
  const syncHistory = loadSyncHistory();
  const latest = syncHistory[0];
  const priorities = typeof growthPriorityRows === "function" ? growthPriorityRows().slice(0, 3) : [];
  el.homePanel.innerHTML = `
    <section class="home-grid">
      <article class="home-card primary">
        <span>現在の活性</span>
        <strong>${escapeHtml(stamina ? `${stamina.current}/${stamina.max || "?"}` : "未取得")}</strong>
        <em>${stamina ? escapeHtml(stamina.isFull ? "満タン" : stamina.restoreText ? `満タンまで約 ${stamina.restoreText}` : "回復時間未取得") : "HoYoLAB検知で更新"}</em>
      </article>
      <article class="home-card">
        <span>日課</span>
        <strong>${left ? `未完了 ${left}` : "完了"}</strong>
        <em>${state.settings.autoDetect ? `自動検知 ${state.settings.autoDetectInterval}分` : "手動検知"}</em>
      </article>
      <article class="home-card">
        <span>HoYoLAB同期</span>
        <strong>${latest ? (latest.status === "failed" ? "失敗あり" : "履歴あり") : "未同期"}</strong>
        <em>${latest ? escapeHtml(new Date(latest.date).toLocaleString("ja-JP")) : "設定からログイン"}</em>
      </article>
    </section>
    <section class="home-list glass-panel">
      <div class="panel-heading compact"><div><p class="eyebrow">Priority</p><h2>育成優先</h2></div><button class="pill-button" id="homeDetectBtn">検知</button></div>
      ${priorities.length ? priorities.map((row) => `<div class="dashboard-row"><strong>${escapeHtml(row.character.name)}</strong><span>優先度 ${row.priority} / 完成度 ${row.completion.total}%</span></div>`).join("") : `<div class="empty-detail">所持キャラ同期後に表示します。</div>`}
    </section>
  `;
  el.homePanel.querySelector("#homeDetectBtn")?.addEventListener("click", () => detectDailyFromHoyolab({ silent: false }));
}

async function notifyStaminaIfNeeded() {
  if (!state.settings.staminaNotify) return;
  const snap = staminaSnapshot();
  if (!snap || snap.current < snap.threshold) return;
  const stage = snap.isFull ? "full" : snap.nearFull ? "near" : "threshold";
  const key = `${todayKey()}:${snap.threshold}:${stage}`;
  if (state.daily.staminaNotifiedKey === key) return;
  const timing = snap.isFull ? "満タンです" : snap.restoreText ? `満タンまで約 ${snap.restoreText}` : "回復中です";
  await window.zzzApp.notifyDailyIncomplete({
    title: stage === "full" ? "norma tool 活性満タン" : "norma tool 活性通知",
    body: `現在の活性 ${snap.current}/${snap.max || "?"}。${timing}。`
  });
  state.daily.staminaNotifiedKey = key;
  saveDailyState();
}

function dailyDetectionSummary(note) {
  const daily = note?.daily || {};
  const lines = [];
  if (daily.energy) lines.push(`活性 ${daily.energy.current}/${daily.energy.max}`);
  if (daily.vitality) lines.push(`デイリー ${daily.vitality.current}/${daily.vitality.max}`);
  if (daily.scratch) lines.push(`スクラッチ ${daily.scratch.done ? "済み" : "未"}`);
  if (daily.shop) lines.push(`店舗 ${daily.shop.state === "finished" ? "完了" : daily.shop.state === "open" ? "販売中" : "未確認"}`);
  return lines.join(" / ");
}

function applyDailyDetection(note) {
  const daily = note?.daily || {};
  const applied = {};
  if (daily.energy?.spent) {
    state.daily.done[0] = true;
    applied[0] = `活性 ${daily.energy.current}/${daily.energy.max}`;
  }
  if (daily.vitality?.done) {
    state.daily.done[1] = true;
    applied[1] = `活躍度 ${daily.vitality.current}/${daily.vitality.max}`;
  }
  if (daily.scratch?.done || daily.shop?.state === "finished") {
    state.daily.done[2] = true;
    applied[2] = `${daily.scratch?.done ? "スクラッチ済み" : ""}${daily.shop?.state === "finished" ? " 店舗完了" : ""}`.trim();
  }
  state.daily.hoyolab = {
    checkedAt: daily.checkedAt || new Date().toISOString(),
    summary: dailyDetectionSummary(note),
    energy: daily.energy || null,
    vitality: daily.vitality || null,
    scratch: daily.scratch || null,
    shop: daily.shop || null,
    weeklies: daily.weeklies || null,
    applied
  };
  saveDailyState();
  renderDaily();
  updateDailyStatus();
  return applied;
}

async function detectDailyFromHoyolab({ silent = false } = {}) {
  if (!window.zzzApp?.hoyolabDailyStatus) {
    if (!silent) el.dailyStatus.textContent = "HoYoLAB完了検知に未対応です";
    return;
  }
  if (!silent) el.dailyStatus.textContent = "HoYoLABで日課状態を確認中";
  try {
    const note = await window.zzzApp.hoyolabDailyStatus();
    const applied = applyDailyDetection(note);
    const count = Object.keys(applied).length;
    await notifyStaminaIfNeeded();
    if (!silent) {
      el.dailyStatus.textContent = count
        ? `HoYoLAB検知: ${count}件反映 / ${state.daily.hoyolab.summary}`
        : `HoYoLAB検知: 自動反映なし / ${state.daily.hoyolab.summary}`;
    }
  } catch (error) {
    if (!silent) el.dailyStatus.textContent = `HoYoLAB検知失敗: ${error.message || error}`;
  }
}

function incompleteDailyTasks() {
  return dailyTasks.filter((_, i) => !state.daily.done[i]);
}

function updateDailyStatus() {
  const left = incompleteDailyTasks().length;
  el.dailyStatus.textContent = left ? `未完了 ${left}件` : "デイリー完了";
}

function isDailyNotifyTime() {
  const [hour, minute] = String(state.settings.notifyTime || "21:00").split(":").map((value) => Number(value));
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return true;
  const now = new Date();
  const scheduled = new Date(now);
  scheduled.setHours(hour, minute, 0, 0);
  return now >= scheduled;
}

async function notifyIfDailyIncomplete({ force = false } = {}) {
  if (!state.settings.notifyDaily && !force) return;
  if (!force && !isDailyNotifyTime()) return;
  const left = incompleteDailyTasks();
  if (!left.length) return;
  const nowKey = todayKey();
  if (!force && state.daily.lastNotified === nowKey) return;
  await window.zzzApp.notifyDailyIncomplete({
    title: "norma tool デイリー未完了",
    body: `未完了: ${left.slice(0, 3).join(" / ")}${left.length > 3 ? " ほか" : ""}`
  });
  state.daily.lastNotified = nowKey;
  saveDailyState();
}

function setAppUpdateStatus(message) {
  if (el.appUpdateStatus) el.appUpdateStatus.textContent = message;
}

function formatReleaseDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
}

async function checkAppUpdate({ silent = false } = {}) {
  if (!window.zzzApp?.checkAppUpdate) return null;
  if (!silent) setAppUpdateStatus("GitHub Releasesを確認中です。");
  try {
    const info = await window.zzzApp.checkAppUpdate();
    state.updateInfo = info;
    if (el.openAppRelease) {
      el.openAppRelease.disabled = !info.releaseUrl;
      el.openAppRelease.dataset.releaseUrl = info.releaseUrl || "";
    }
    const releaseDate = formatReleaseDate(info.publishedAt);
    const assets = (info.assets || []).map((asset) => asset.name).filter(Boolean);
    const assetText = assets.length ? ` / 配布: ${assets.slice(0, 2).join("・")}` : "";
    if (info.hasUpdate) {
      setAppUpdateStatus(`新しい版があります: ${info.tagName || info.latestVersion}${releaseDate ? ` / ${releaseDate}` : ""}${assetText}`);
      const notifyKey = `appUpdateNotified:${info.tagName || info.latestVersion}`;
      if (!silent || localStorage.getItem(notifyKey) !== "1") {
        await window.zzzApp.notifyDailyIncomplete({
          title: "norma tool アップデート",
          body: `GitHubに ${info.tagName || info.latestVersion} が公開されています。`
        });
        localStorage.setItem(notifyKey, "1");
      }
    } else {
      setAppUpdateStatus(`最新版です: App ${info.currentVersion}${info.tagName ? ` / GitHub ${info.tagName}` : ""}${assetText}`);
    }
    return info;
  } catch (error) {
    if (!silent) setAppUpdateStatus(`確認に失敗: ${error.message || error}`);
    return null;
  }
  if (hasBurstWindow && hasQuickSupport) {
    notes.push("ブレイク窓と支援/防護がそろっています。主軸へバフを集める形で評価を加点しています。");
  }
  if (anchor && hasQuickSupport) {
    notes.push(`${anchor.name}へクイック支援/防護支援を回しやすい構成です。`);
  }
}

async function openLatestRelease() {
  const url = state.updateInfo?.releaseUrl || el.openAppRelease?.dataset.releaseUrl;
  if (!url || !window.zzzApp?.openExternalUrl) return;
  try {
    await window.zzzApp.openExternalUrl(url);
  } catch (error) {
    setAppUpdateStatus(`リリースを開けませんでした: ${error.message || error}`);
  }
}

function hoyolabHeaders(cookieHeader, extra = {}) {
  return {
    "accept": "application/json, text/plain, */*",
    "cookie": cookieHeader,
    "origin": "https://act.hoyolab.com",
    "referer": hoyolabBattleRecordUrl,
    "user-agent": "Mozilla/5.0 norma-tool-android",
    "x-rpc-language": "ja-jp",
    "x-rpc-lang": "ja-jp",
    "x-rpc-platform": "4",
    "x-rpc-page": "/zzz",
    ...extra
  };
}

async function androidHoyolabGet(url, cookieHeader) {
  const http = window.Capacitor?.Plugins?.CapacitorHttp;
  if (!http?.get) throw new Error("Android HTTPプラグインを利用できません。");
  const response = await http.get({ url, headers: hoyolabHeaders(cookieHeader), responseType: "json" });
  const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
  if (response.status && response.status >= 400) throw new Error(data?.message || `HoYoLAB HTTP ${response.status}`);
  return data;
}

async function androidFetchHoyolabRoles(cookieHeader) {
  let lastError;
  for (const endpoint of hoyolabRoleEndpoints) {
    try {
      const json = await androidHoyolabGet(`${endpoint}?game_biz=nap_global`, cookieHeader);
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
  return item.formatted_value ?? item.format_value ?? item.display_value ?? item.value_text ?? item.value_str ?? item.final_value ?? item.value ?? item.val ?? item.final ?? item.base;
}

function hoyolabPropertyValue(item) {
  if (!item || typeof item !== "object") return item;
  return item.base ?? item.formatted_value ?? item.format_value ?? item.display_value ?? item.value_text ?? item.value_str ?? item.final_value ?? item.value ?? item.val ?? item.final;
}

function statKeyFromHoyolabLabel(label) {
  const text = String(label || "").trim();
  if (!text) return "";
  const matched = hoyolabStatMap.find((item) => item.patterns.some((pattern) => pattern.test(text)));
  return matched?.key || "";
}

function collectHoyolabStatObjects(value, depth = 0, result = []) {
  if (!value || depth > 4) return result;
  if (Array.isArray(value)) {
    value.forEach((item) => collectHoyolabStatObjects(item, depth + 1, result));
    return result;
  }
  if (typeof value !== "object") return result;
  const label = value.name || value.title || value.label || value.property_name || value.full_name || value.base_name;
  const rawValue = hoyolabDisplayValue(value);
  if (label && rawValue !== undefined) result.push({ label, value: rawValue });
  for (const key of ["properties", "property_list", "attrs", "attribute_list", "final_properties", "base_properties"]) {
    if (value[key]) collectHoyolabStatObjects(value[key], depth + 1, result);
  }
  return result;
}

function normalizeHoyolabStats(avatar) {
  const stats = {};
  for (const item of collectHoyolabStatObjects(avatar)) {
    const key = statKeyFromHoyolabLabel(item.label);
    const value = numberFromHoyolab(item.value);
    if (key && value !== "") stats[key] = value;
  }
  return stats;
}

function normalizeHoyolabSubstat(item) {
  if (!item) return { name: "", value: "" };
  const name = item.property_name || item.name || item.title || item.label || item.full_name || item.stat || "";
  return { name, value: numberFromHoyolab(hoyolabPropertyValue(item)) };
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

async function androidFetchHoyolabZzzData(role, cookieHeader) {
  const roleId = role.game_uid || role.game_role_id || role.role_id;
  const server = role.region || role.region_name || role.server;
  if (!roleId || !server) throw new Error("ZZZのUIDまたはサーバー情報を取得できませんでした。");
  const query = new URLSearchParams({ role_id: String(roleId), server: String(server) });
  const basic = await androidHoyolabGet(`${hoyolabApiBase}/api/zzz/avatar/basic?${query}`, cookieHeader);
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
      const detail = await androidHoyolabGet(`${hoyolabApiBase}/api/zzz/avatar/info?${detailQuery}`, cookieHeader);
      details.push(normalizeHoyolabAvatar(detail.data || avatar));
    } catch {
      details.push(normalizeHoyolabAvatar(avatar));
    }
  }
  return {
    role: { nickname: role.nickname || role.name || "", level: role.level || "", region: server, uid: roleId },
    characters: details,
    rawCount: avatars.length
  };
}

function normalizeHoyolabDailyNote(data) {
  const vitality = data?.vitality || {};
  const energy = data?.energy || {};
  const shopState = {
    SaleStateNo: "closed",
    SaleStateDoing: "open",
    SaleStateDone: "finished"
  }[data?.vhs_sale?.sale_state] || "unknown";
  const vitalityCurrent = Number(vitality.current ?? 0);
  const vitalityMax = Number(vitality.max ?? 0);
  const energyCurrent = Number(energy.progress?.current ?? 0);
  const energyMax = Number(energy.progress?.max ?? 0);
  return {
    checkedAt: new Date().toISOString(),
    vitality: {
      current: vitalityCurrent,
      max: vitalityMax,
      done: vitalityMax > 0 && vitalityCurrent >= vitalityMax
    },
    energy: {
      current: energyCurrent,
      max: energyMax,
      spent: energyMax > 0 && energyCurrent < energyMax,
      restore: Number(energy.restore ?? 0)
    },
    scratch: {
      done: data?.card_sign === "CardSignDone",
      raw: data?.card_sign || ""
    },
    shop: {
      state: shopState,
      raw: data?.vhs_sale?.sale_state || ""
    },
    weeklies: {
      bounty: Number(data?.bounty_commission?.num ?? 0),
      bountyTotal: Number(data?.bounty_commission?.total ?? 0),
      surveyPoints: Number(data?.survey_points?.num ?? 0),
      surveyPointsTotal: Number(data?.survey_points?.total ?? 0)
    },
    raw: data || {}
  };
}

async function androidFetchHoyolabDailyNote(role, cookieHeader) {
  const roleId = role.game_uid || role.game_role_id || role.role_id;
  const server = role.region || role.region_name || role.server;
  if (!roleId || !server) throw new Error("ZZZのUIDまたはサーバー情報を取得できませんでした。");
  const query = new URLSearchParams({ role_id: String(roleId), server: String(server) });
  const json = await androidHoyolabGet(`${hoyolabNoteUrl}?${query}`, cookieHeader);
  if (json.retcode !== 0) throw new Error(json.message || `daily note retcode ${json.retcode}`);
  return {
    role: { nickname: role.nickname || role.name || "", level: role.level || "", region: server, uid: roleId },
    daily: normalizeHoyolabDailyNote(json.data)
  };
}

async function androidHoyolabSync() {
  const auth = window.Capacitor?.Plugins?.HoyolabAuth;
  if (!auth?.status) throw new Error("HoYoLABログイン機能を利用できません。");
  const loginState = await auth.status();
  if (!loginState.loggedIn || !loginState.cookieHeader) throw new Error("HoYoLABにログインしてから同期してください。");
  const roles = await androidFetchHoyolabRoles(loginState.cookieHeader);
  const role = zzzRoleFromRoles(roles);
  if (!role) throw new Error("HoYoLABアカウントにZZZのゲームロールが見つかりませんでした。");
  const data = await androidFetchHoyolabZzzData(role, loginState.cookieHeader);
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
}

async function androidHoyolabDailyStatus() {
  const status = await window.Capacitor?.Plugins?.HoyolabAuth?.status?.();
  if (!status?.loggedIn || !status.cookieHeader) throw new Error("HoYoLABにログインしてから検知してください。");
  const roles = await androidFetchHoyolabRoles(status.cookieHeader);
  const role = zzzRoleFromRoles(roles);
  if (!role) throw new Error("HoYoLABにZZZのゲームロールが見つかりませんでした。");
  return androidFetchHoyolabDailyNote(role, status.cookieHeader);
}

function setBackupStatus(message) {
  if (el.backupStatus) el.backupStatus.textContent = message;
}

function collectBackupStorage() {
  const storage = {};
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || key === "autoBackups") continue;
    storage[key] = localStorage.getItem(key);
  }
  return storage;
}

function buildLocalBackupPayload() {
  return {
    schema: "norma-tool-backup",
    version: 1,
    platform: "android",
    exportedAt: new Date().toISOString(),
    appVersion: ANDROID_APP_VERSION,
    storage: collectBackupStorage()
  };
}

function saveLocalBackup({ manual = false } = {}) {
  try {
    const payload = buildLocalBackupPayload();
    const backups = readJsonStorage("autoBackups", []);
    const next = [{ date: payload.exportedAt, payload }, ...backups].slice(0, 5);
    localStorage.setItem("autoBackups", JSON.stringify(next));
    localStorage.setItem("autoBackup:lastDate", todayKey());
    setBackupStatus(`${manual ? "手動" : "自動"}バックアップ作成済み: ${new Date(payload.exportedAt).toLocaleString("ja-JP")}`);
    return payload;
  } catch (error) {
    setBackupStatus(`バックアップに失敗: ${error.message || error}`);
    return null;
  }
}

function createAutoBackup() {
  if (!state.settings.autoBackup) return;
  if (localStorage.getItem("autoBackup:lastDate") === todayKey()) {
    const latest = readJsonStorage("autoBackups", [])[0];
    if (latest?.date) setBackupStatus(`最新バックアップ: ${new Date(latest.date).toLocaleString("ja-JP")}`);
    return;
  }
  saveLocalBackup();
}

function restoreLatestLocalBackup() {
  const latest = readJsonStorage("autoBackups", [])[0];
  if (!latest?.payload?.storage) {
    setBackupStatus("復元できるバックアップがありません。");
    return;
  }
  const ok = window.confirm("現在のローカルデータを最新バックアップで上書きします。復元しますか？");
  if (!ok) {
    setBackupStatus("バックアップ復元をキャンセルしました。");
    return;
  }
  const keepBackups = localStorage.getItem("autoBackups");
  localStorage.clear();
  for (const [key, value] of Object.entries(latest.payload.storage)) {
    localStorage.setItem(key, String(value ?? ""));
  }
  if (keepBackups) localStorage.setItem("autoBackups", keepBackups);
  setBackupStatus(`復元しました: ${new Date(latest.date).toLocaleString("ja-JP")}`);
  window.setTimeout(() => window.location.reload(), 500);
}

function hoyolabCharacterMatch(item) {
  const id = Number(item.id || 0);
  if (id) {
    const byId = state.characters.find((character) => Number(character.id) === id);
    if (byId) return byId;
  }
  const name = String(item.name || "").trim().toLowerCase();
  if (!name) return null;
  return state.characters.find((character) => {
    const alias = profileIdAliases[character.id] || "";
    return [character.name, character.en, alias].some((value) => String(value || "").trim().toLowerCase() === name);
  }) || null;
}

function mergeHoyolabDisc(baseDisc, importedDisc) {
  const slot = Number(importedDisc.slot || baseDisc.slot);
  return {
    ...baseDisc,
    slot,
    set: normalizeDiscSetName(importedDisc.set || baseDisc.set || ""),
    main: fixedDiscMainStats[slot] || normalizeDiscMainName(importedDisc.main, slot) || normalizeDiscMainName(baseDisc.main, slot),
    substats: Array.from({ length: 4 }, (_, index) => {
      const imported = normalizeSubstat(importedDisc.substats?.[index]);
      const current = normalizeSubstat(baseDisc.substats?.[index]);
      return {
        name: imported.name || current.name,
        value: imported.value || current.value
      };
    })
  };
}

function applyHoyolabSync(result) {
  const before = snapshotAccountState();
  let matched = 0;
  let statCount = 0;
  let discCount = 0;
  const unmatched = [];
  for (const item of result.characters || []) {
    const character = hoyolabCharacterMatch(item);
    if (!character) {
      unmatched.push(item.name || item.id || "unknown");
      continue;
    }
    matched += 1;
    const data = loadComparisonState(character);
    data.ownership = {
      ...data.ownership,
      owned: true,
      status: data.ownership.status === "未所持" ? "育成中" : data.ownership.status,
      mindscape: Number.isFinite(Number(item.mindscape)) ? Number(item.mindscape) : data.ownership.mindscape,
      weapon: item.weapon || data.ownership.weapon,
      weaponRank: Number(item.weaponRank || data.ownership.weaponRank || 1),
      memo: data.ownership.memo
    };
    if (item.level) data.materials.currentLevel = Math.max(data.materials.currentLevel || 1, Number(item.level));
    for (const [key, value] of Object.entries(item.stats || {})) {
      if (statByKey[key] && value !== "") {
        data.stats[key] = value;
        statCount += 1;
      }
    }
    for (const importedDisc of item.discs || []) {
      const slot = Number(importedDisc.slot);
      if (!discSlots.includes(slot)) continue;
      data.discs[slot - 1] = mergeHoyolabDisc(data.discs[slot - 1], importedDisc);
      if (discHasData(data.discs[slot - 1])) {
        addDiscToWarehouse(character, data.discs[slot - 1], "HoYoLAB同期");
      }
      discCount += 1;
    }
    saveComparisonState(character, data);
    saveBuildHistory(character, data, "HoYoLAB同期");
  }
  const diff = saveSyncDiff(before, snapshotAccountState(), result);
  renderCharacters();
  const selected = state.characters.find((character) => character.id === state.selectedId);
  if (selected && document.querySelector("#agentDetailView")?.classList.contains("active")) {
    renderAgentPage(selected);
  }
  renderAccountDashboard();
  return { matched, statCount, discCount, unmatched, diff };
}

function previewHoyolabSync(result) {
  let matched = 0;
  let newOwned = 0;
  let statCount = 0;
  let discCount = 0;
  const names = [];
  const unmatched = [];
  for (const item of result.characters || []) {
    const character = hoyolabCharacterMatch(item);
    if (!character) {
      unmatched.push(item.name || item.id || "unknown");
      continue;
    }
    matched += 1;
    names.push(character.name);
    const data = loadComparisonState(character);
    if (!data.ownership.owned) newOwned += 1;
    statCount += Object.entries(item.stats || {}).filter(([key, value]) => statByKey[key] && value !== "").length;
    discCount += (item.discs || []).filter((disc) => discSlots.includes(Number(disc.slot))).length;
  }
  return { matched, newOwned, statCount, discCount, names, unmatched };
}

function setHoyolabStatus(message) {
  if (el.hoyolabStatus) el.hoyolabStatus.textContent = message;
}

async function refreshHoyolabStatus() {
  if (!window.zzzApp?.hoyolabStatus || !el.hoyolabStatus) return;
  try {
    const status = await window.zzzApp.hoyolabStatus();
    setHoyolabStatus(status.loggedIn
      ? `ログイン済み / Cookie ${status.cookieCount}件`
      : "未ログイン");
  } catch (error) {
    setHoyolabStatus(`状態確認に失敗: ${error.message || error}`);
  }
}

async function loginHoyolab() {
  setHoyolabStatus("HoYoLABログイン画面を開いています。ログイン後に別窓を閉じてください。");
  try {
    const status = await window.zzzApp.hoyolabLogin();
    setHoyolabStatus(status.loggedIn
      ? "ログインを確認しました。同期できます。"
      : "ログインCookieを確認できませんでした。もう一度ログインしてください。");
  } catch (error) {
    setHoyolabStatus(`ログイン処理に失敗: ${error.message || error}`);
  }
}

async function syncHoyolab() {
  setHoyolabStatus("HoYoLABから所持キャラ・ステータス・ディスクを同期中です。");
  try {
    const result = await window.zzzApp.hoyolabSync();
    const preview = previewHoyolabSync(result);
    const account = result.role?.nickname ? `${result.role.nickname} / UID ${result.role.uid}` : `UID ${result.role?.uid || "不明"}`;
    const ok = window.confirm([
      `${account} の同期内容を確認してください。`,
      `一致キャラ: ${preview.matched}名`,
      `新規所持: ${preview.newOwned}名`,
      `ステータス: ${preview.statCount}項目`,
      `ディスク: ${preview.discCount}枚`,
      preview.unmatched.length ? `未一致: ${preview.unmatched.slice(0, 6).join(" / ")}` : "",
      "",
      "この内容をローカルデータへ反映しますか？"
    ].filter(Boolean).join("\n"));
    if (!ok) {
      setHoyolabStatus(`同期レビューでキャンセルしました。取得: ${preview.matched}名 / ディスク${preview.discCount}枚`);
      return;
    }
    const applied = applyHoyolabSync(result);
    setHoyolabStatus(`${account}: ${applied.matched}名同期、ステータス${applied.statCount}項目、ディスク${applied.discCount}枚を反映しました。`);
  } catch (error) {
    saveSyncFailure(error);
    setHoyolabStatus(`同期に失敗: ${error.message || error}`);
  }
}

async function disconnectHoyolab() {
  setHoyolabStatus("HoYoLAB連携を解除しています。");
  try {
    await window.zzzApp.hoyolabDisconnect();
    setHoyolabStatus("連携を解除しました。");
  } catch (error) {
    setHoyolabStatus(`連携解除に失敗: ${error.message || error}`);
  }
}

function snapshotAccountState() {
  const snapshot = {};
  for (const character of state.characters) {
    const data = loadComparisonState(character);
    snapshot[character.id] = {
      name: character.name,
      owned: Boolean(data.ownership.owned),
      status: data.ownership.status,
      mindscape: Number(data.ownership.mindscape || 0),
      level: Number(data.materials.currentLevel || 1),
      statFilled: Object.values(data.stats || {}).filter((value) => value !== "").length,
      discFilled: data.discs.filter((disc) => disc.set || disc.main || discSubstatText(disc)).length
    };
  }
  return snapshot;
}

function saveSyncDiff(before, after, result) {
  const changes = [];
  for (const [id, next] of Object.entries(after)) {
    const prev = before[id] || {};
    if (!prev.owned && next.owned) changes.push(`${next.name}: 所持として追加`);
    if ((prev.level || 1) !== next.level) changes.push(`${next.name}: Lv ${prev.level || 1} -> ${next.level}`);
    if ((prev.mindscape || 0) !== next.mindscape) changes.push(`${next.name}: M${prev.mindscape || 0} -> M${next.mindscape}`);
    if ((prev.statFilled || 0) !== next.statFilled) changes.push(`${next.name}: ステータス入力 ${prev.statFilled || 0} -> ${next.statFilled}`);
    if ((prev.discFilled || 0) !== next.discFilled) changes.push(`${next.name}: ディスク入力 ${prev.discFilled || 0} -> ${next.discFilled}`);
  }
  const entry = {
    date: new Date().toISOString(),
    account: result.role?.nickname || "",
    uid: result.role?.uid || "",
    status: "success",
    matched: Number(result.characters?.length || 0),
    changes: changes.slice(0, 40)
  };
  const history = [entry, ...readJsonStorage("hoyolabSyncHistory", [])].slice(0, 10);
  localStorage.setItem("hoyolabSyncHistory", JSON.stringify(history));
  return entry;
}

function loadSyncHistory() {
  return readJsonStorage("hoyolabSyncHistory", []);
}

function saveSyncFailure(error) {
  const entry = {
    date: new Date().toISOString(),
    account: "",
    uid: "",
    status: "failed",
    changes: [`同期失敗: ${error.message || error}`]
  };
  const history = [entry, ...loadSyncHistory()].slice(0, 10);
  localStorage.setItem("hoyolabSyncHistory", JSON.stringify(history));
  renderAccountDashboard();
}

function growthPriorityRows() {
  return state.characters
    .map((character) => {
      const data = loadComparisonState(character);
      const profile = profileFor(character);
      const active = {
        ...activeProfile(profile, data, character),
        scoreWeights: discWeightProfile(character, profile, data).weights
      };
      const comparisons = compareTargets(active, data);
      const shortages = comparisons.filter((item) => item.status === "short").length;
      const discAvg = Math.round(data.discs.reduce((sum, disc) => sum + discScore(active, disc), 0) / 6);
      const completion = buildCompletion(character, active, data);
      const owned = data.ownership.owned;
      const levelGap = Math.max(0, 60 - Number(data.materials.currentLevel || 1));
      const levelScore = Math.min(20, levelGap / 2);
      const shortageScore = shortages * 12;
      const discPenaltyScore = Math.max(0, 72 - discAvg);
      const completionScore = Math.max(0, 85 - completion.total) / 3;
      const priority = (owned ? 35 : 0) + shortageScore + discPenaltyScore + levelScore + completionScore + (profile.verified ? 8 : 0);
      const reasons = [
        owned ? "所持済み" : "未所持/同期待ち",
        levelGap > 0 ? `Lv差 ${levelGap}` : "Lv完了",
        shortages ? `目標不足 ${shortages}件` : "目標不足少なめ",
        discAvg < 72 ? `ディスク平均 ${discAvg}` : "ディスク良好",
        `完成度 ${completion.total}%`
      ];
      return {
        character,
        data,
        priority: Math.round(priority),
        shortages,
        discAvg,
        completion,
        reasons,
        breakdown: {
          所持: owned ? 35 : 0,
          不足: Math.round(shortageScore),
          ディスク: Math.round(discPenaltyScore),
          レベル: Math.round(levelScore),
          完成度: Math.round(completionScore),
          ソース: profile.verified ? 8 : 0
        }
      };
    })
    .filter((row) => row.data.ownership.owned || row.priority >= 45)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 10);
}

function renderAccountDashboard() {
  if (!el.accountPanel) return;
  const rows = growthPriorityRows();
  const syncHistory = loadSyncHistory();
  const latest = syncHistory[0];
  const totalOwned = state.characters.filter((character) => loadComparisonState(character).ownership.owned).length;
  const totalHistory = state.characters.reduce((sum, character) => sum + loadBuildHistory(character).length, 0);
  el.accountPanel.innerHTML = `
    <div class="panel-heading compact">
      <div>
        <p class="eyebrow">Account Planner</p>
        <h2>育成優先度ダッシュボード</h2>
      </div>
      <button class="pill-button primary" id="accountRefreshBtn">再計算</button>
    </div>
    <div class="summary-grid">
      <div class="summary-card"><span>所持</span><strong>${totalOwned}</strong><em>HoYoLAB/手入力</em></div>
      <div class="summary-card"><span>ビルド履歴</span><strong>${totalHistory}</strong><em>保存済み</em></div>
      <div class="summary-card"><span>最新同期</span><strong>${latest ? latest.changes.length : 0}</strong><em>${latest ? escapeHtml(new Date(latest.date).toLocaleString("ja-JP")) : "なし"}</em></div>
    </div>
    <div class="dashboard-list">
      ${rows.length ? rows.map((row) => `
        <article class="dashboard-row">
          <strong>${escapeHtml(row.character.name)}</strong>
          <span>優先度 ${row.priority} / 完成度 ${row.completion.total}% / Lv${row.data.materials.currentLevel} / ディスク平均 ${row.discAvg}</span>
          <em>${escapeHtml(row.reasons.join(" / "))}</em>
          <small>${Object.entries(row.breakdown).map(([key, value]) => `${escapeHtml(key)} +${value}`).join(" / ")}</small>
        </article>
      `).join("") : `<div class="empty-detail">所持キャラまたは同期データがありません。</div>`}
    </div>
    <div class="analysis-box compact-db">
      <strong>HoYoLAB同期差分</strong>
      <ul>${latest?.changes?.length ? latest.changes.slice(0, 12).map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>同期差分なし</li>"}</ul>
    </div>
  `;
  el.accountPanel.querySelector("#accountRefreshBtn")?.addEventListener("click", renderAccountDashboard);
}

function switchView(view) {
  document.querySelectorAll(".view").forEach((node) => node.classList.remove("active"));
  document.querySelector(`#${view}View`).classList.add("active");
  document.querySelectorAll(".side-item").forEach((node) => {
    node.classList.toggle("active", node.dataset.view === view || (view === "agentDetail" && node.dataset.view === "agents"));
  });
  if (view === "team") renderTeamSimulator();
  if (view === "home") renderHomeDashboard();
  if (view === "warehouse") renderWarehousePanel();
  if (view === "account") renderAccountDashboard();
  if (view === "settings") renderSetupPanel();
}

function setupChecklist() {
  const ownedCount = state.characters.filter((character) => loadComparisonState(character).ownership.owned).length;
  return [
    { label: "キャラデータ更新", done: state.characters.length > 0, note: `${state.characters.length}名` },
    { label: "HoYoLAB同期", done: ownedCount > 0, note: ownedCount ? `所持 ${ownedCount}名` : "未同期" },
    { label: "通知設定", done: state.settings.notifyDaily, note: state.settings.notifyDaily ? `${state.settings.notifyTime || "21:00"}` : "OFF" },
    { label: "活性通知", done: state.settings.staminaNotify, note: state.settings.staminaNotify ? `${state.settings.staminaThreshold || 220}+` : "OFF" },
    { label: "HoYoLAB自動検知", done: state.settings.autoDetect, note: state.settings.autoDetect ? `${state.settings.autoDetectInterval || 30}分` : "OFF" },
    { label: "アップデート確認", done: state.settings.appUpdate, note: state.settings.appUpdate ? "ON" : "OFF" },
    { label: "自動バックアップ", done: state.settings.autoBackup, note: state.settings.autoBackup ? "ON" : "OFF" }
  ];
}

function scheduleAutoDetect() {
  if (autoDetectTimer) {
    clearInterval(autoDetectTimer);
    autoDetectTimer = null;
  }
  if (!state.settings.autoDetect) return;
  const minutes = Math.max(5, Number(state.settings.autoDetectInterval || 30));
  autoDetectTimer = setInterval(() => detectDailyFromHoyolab({ silent: true }), minutes * 60 * 1000);
  setTimeout(() => detectDailyFromHoyolab({ silent: true }), 1800);
}

function renderSetupPanel() {
  if (!el.setupPanel) return;
  const checklist = setupChecklist();
  el.setupPanel.innerHTML = `
    <div>
      <strong>初回セットアップ</strong>
      <p class="muted">配布版を入れた後に確認する項目です。</p>
    </div>
    <div class="setup-list">
      ${checklist.map((item) => `
        <span class="${item.done ? "done" : ""}">
          <b>${item.done ? "OK" : "未"}</b>
          ${escapeHtml(item.label)}
          <em>${escapeHtml(item.note)}</em>
        </span>
      `).join("")}
    </div>
    <div class="button-row">
      <button class="pill-button" id="setupRefreshDataBtn">データ更新</button>
      <button class="pill-button" id="setupCheckUpdateBtn">更新確認</button>
      <button class="pill-button primary" id="setupHoyolabBtn">HoYoLABログイン</button>
    </div>
  `;
  el.setupPanel.querySelector("#setupRefreshDataBtn")?.addEventListener("click", async () => {
    await loadCharacters({ force: true });
    renderSetupPanel();
  });
  el.setupPanel.querySelector("#setupCheckUpdateBtn")?.addEventListener("click", async () => {
    await checkAppUpdate();
    renderSetupPanel();
  });
  el.setupPanel.querySelector("#setupHoyolabBtn")?.addEventListener("click", async () => {
    await loginHoyolab();
    renderSetupPanel();
  });
}

function bindEvents() {
  document.querySelectorAll(".side-item").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });
  el.search.addEventListener("input", () => {
    state.filters.search = el.search.value;
    renderCharacters();
  });
  el.notifyNow.addEventListener("click", () => notifyIfDailyIncomplete({ force: true }));
  el.detectDaily?.addEventListener("click", detectDailyFromHoyolab);
  el.notificationToggle.checked = state.settings.notifyDaily;
  if (el.notificationTime) el.notificationTime.value = state.settings.notifyTime || "21:00";
  if (el.staminaNotifyToggle) el.staminaNotifyToggle.checked = state.settings.staminaNotify;
  if (el.staminaThreshold) el.staminaThreshold.value = state.settings.staminaThreshold || 220;
  if (el.autoDetectToggle) el.autoDetectToggle.checked = state.settings.autoDetect;
  if (el.autoDetectInterval) el.autoDetectInterval.value = state.settings.autoDetectInterval || 30;
  el.autoUpdateToggle.checked = state.settings.autoUpdate;
  el.appUpdateToggle.checked = state.settings.appUpdate;
  if (el.autoBackupToggle) el.autoBackupToggle.checked = state.settings.autoBackup;
  el.notificationToggle.addEventListener("change", () => {
    state.settings.notifyDaily = el.notificationToggle.checked;
    saveSettings();
    renderSetupPanel();
  });
  el.notificationTime?.addEventListener("change", () => {
    state.settings.notifyTime = el.notificationTime.value || "21:00";
    state.daily.lastNotified = "";
    saveDailyState();
    saveSettings();
    renderSetupPanel();
  });
  el.staminaNotifyToggle?.addEventListener("change", () => {
    state.settings.staminaNotify = el.staminaNotifyToggle.checked;
    state.daily.staminaNotifiedKey = "";
    saveDailyState();
    saveSettings();
    renderSetupPanel();
  });
  el.staminaThreshold?.addEventListener("change", () => {
    state.settings.staminaThreshold = Math.max(1, Number(el.staminaThreshold.value || 220));
    state.daily.staminaNotifiedKey = "";
    saveDailyState();
    saveSettings();
    renderSetupPanel();
  });
  el.autoDetectToggle?.addEventListener("change", () => {
    state.settings.autoDetect = el.autoDetectToggle.checked;
    saveSettings();
    scheduleAutoDetect();
    renderSetupPanel();
  });
  el.autoDetectInterval?.addEventListener("change", () => {
    state.settings.autoDetectInterval = Math.max(5, Number(el.autoDetectInterval.value || 30));
    saveSettings();
    scheduleAutoDetect();
    renderSetupPanel();
  });
  el.autoUpdateToggle.addEventListener("change", () => {
    state.settings.autoUpdate = el.autoUpdateToggle.checked;
    saveSettings();
  });
  el.appUpdateToggle.addEventListener("change", () => {
    state.settings.appUpdate = el.appUpdateToggle.checked;
    saveSettings();
    renderSetupPanel();
  });
  el.autoBackupToggle?.addEventListener("change", () => {
    state.settings.autoBackup = el.autoBackupToggle.checked;
    saveSettings();
    renderSetupPanel();
  });
  el.refreshData.addEventListener("click", () => loadCharacters({ force: true }));
  el.checkAppUpdate?.addEventListener("click", () => checkAppUpdate());
  el.openAppRelease?.addEventListener("click", openLatestRelease);
  el.createLocalBackup?.addEventListener("click", () => saveLocalBackup({ manual: true }));
  el.restoreLocalBackup?.addEventListener("click", restoreLatestLocalBackup);
  el.hoyolabLogin?.addEventListener("click", loginHoyolab);
  el.hoyolabSync?.addEventListener("click", syncHoyolab);
  el.hoyolabDisconnect?.addEventListener("click", disconnectHoyolab);
}

function finishSplash(delay = 520) {
  setTimeout(() => document.body.classList.remove("is-loading"), delay);
}

function showStartupError(error) {
  console.error("startup failed", error);
  if (el.dataStatus) el.dataStatus.textContent = `起動処理の一部に失敗: ${error?.message || error}`;
}

async function init() {
  try {
    bindEvents();
    renderFilters();
    renderDaily();
    await loadCharacters();
    renderTeamSimulator();
    renderWarehousePanel();
    renderAccountDashboard();
    renderSetupPanel();
    renderHomeDashboard();
    if (state.characters[0]) {
      state.selectedId = state.characters[0].id;
      renderCharacters();
      renderDetail(state.characters[0]);
    }
    setTimeout(() => notifyIfDailyIncomplete(), 1200);
    setInterval(() => notifyIfDailyIncomplete(), 1000 * 60 * 30);
    setInterval(() => {
      updateDailyStaminaPanel();
      renderHomeDashboard();
    }, 1000 * 60);
    scheduleAutoDetect();
    const info = await window.zzzApp.getAppInfo();
    el.appInfo.textContent = `App ${info.version} / 保存先: ${info.dataPath}`;
    if (state.settings.appUpdate) {
      setTimeout(() => checkAppUpdate({ silent: true }), 1800);
    }
    setTimeout(() => createAutoBackup(), 900);
    refreshHoyolabStatus();
  } catch (error) {
    showStartupError(error);
  } finally {
    finishSplash(160);
  }
}

setTimeout(() => finishSplash(0), 2800);
window.addEventListener("error", (event) => {
  showStartupError(event.error || event.message);
  finishSplash(0);
});
window.addEventListener("unhandledrejection", (event) => {
  showStartupError(event.reason);
  finishSplash(0);
});

init();


