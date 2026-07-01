window.ZZZ_TARGET_DATA = {
  stats: [
    { key: "hp", label: "HP", unit: "", step: 1 },
    { key: "atk", label: "攻撃力", unit: "", step: 1 },
    { key: "def", label: "防御力", unit: "", step: 1 },
    { key: "impact", label: "衝撃力", unit: "", step: 0.1 },
    { key: "critRate", label: "会心率", unit: "%", step: 0.1 },
    { key: "critDmg", label: "会心ダメージ", unit: "%", step: 0.1 },
    { key: "ap", label: "異常マスタリー", unit: "", step: 1 },
    { key: "anomalyProf", label: "異常掌握", unit: "", step: 1 },
    { key: "energy", label: "エネルギー自動回復", unit: "", step: 0.01 },
    { key: "pen", label: "貫通値", unit: "", step: 1 },
    { key: "penRatio", label: "貫通率", unit: "%", step: 0.1 }
  ],
  discMainOptions: [
    "",
    "HP%",
    "攻撃力%",
    "防御力%",
    "会心率",
    "会心ダメージ",
    "異常マスタリー",
    "異常掌握",
    "衝撃力",
    "エネルギー自動回復",
    "物理属性ダメージ",
    "炎属性ダメージ",
    "氷属性ダメージ",
    "電気属性ダメージ",
    "エーテル属性ダメージ",
    "風属性ダメージ",
    "貫通率"
  ],
  roleTemplates: {
    強攻: {
      status: "未確認",
      note: "このキャラ専用の複数ソース確認済み目標値は未登録です。数値は手入力して比較してください。",
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"]
    },
    撃破: {
      status: "未確認",
      note: "このキャラ専用の複数ソース確認済み目標値は未登録です。数値は手入力して比較してください。",
      mainStats: { 4: ["会心率", "会心ダメージ", "攻撃力%"], 5: ["属性ダメージ", "攻撃力%"], 6: ["衝撃力"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"]
    },
    異常: {
      status: "未確認",
      note: "このキャラ専用の複数ソース確認済み目標値は未登録です。数値は手入力して比較してください。",
      mainStats: { 4: ["異常マスタリー"], 5: ["属性ダメージ", "攻撃力%"], 6: ["異常掌握", "攻撃力%"] },
      subStats: ["異常マスタリー", "攻撃力%"]
    },
    支援: {
      status: "未確認",
      note: "このキャラ専用の複数ソース確認済み目標値は未登録です。数値は手入力して比較してください。",
      mainStats: { 4: ["攻撃力%", "異常マスタリー", "会心率"], 5: ["攻撃力%", "属性ダメージ"], 6: ["エネルギー自動回復", "攻撃力%"] },
      subStats: ["攻撃力%", "エネルギー自動回復", "異常マスタリー"]
    },
    防護: {
      status: "未確認",
      note: "このキャラ専用の複数ソース確認済み目標値は未登録です。数値は手入力して比較してください。",
      mainStats: { 4: ["防御力%", "HP%", "攻撃力%"], 5: ["防御力%", "HP%", "攻撃力%"], 6: ["防御力%", "HP%", "エネルギー自動回復"] },
      subStats: ["防御力%", "HP%", "攻撃力%"]
    },
    命破: {
      status: "未確認",
      note: "このキャラ専用の複数ソース確認済み目標値は未登録です。数値は手入力して比較してください。",
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["HP%", "属性ダメージ"], 6: ["HP%", "攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "HP%"]
    }
  },
  profiles: {
    "Velina": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 2471, note: "確認ソース目標値" },
        { key: "ap", min: 365, note: "確認ソース目標値。確認ソースは320以上/理想350を提示" }
      ],
      mainStats: { 4: ["異常マスタリー"], 5: ["風属性ダメージ"], 6: ["エネルギー自動回復"] },
      subStats: ["異常マスタリー", "攻撃力%"],
      sets: ["風鳴りのサロン 4", "月光騎士の讃歌 2"],
      note: "数値は確認ソース、メイン/サブ方針と異常マスタリー重視は確認ソースでも確認。",
      sources: [
        { name: "GameWith", url: "https://gamewith.jp/zenless/550723" },
        { name: "takugame", url: "https://takugame.com/verina/" }
      ]
    },
    "Starlight - Billy": {
      status: "複数ソース一致",
      variant: "モチーフ想定",
      targets: [
        { key: "hp", min: 19194, note: "確認ソース目標値" },
        { key: "critRate", min: 67.4, note: "複数ソースで一致" },
        { key: "critDmg", min: 98, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率"], 5: ["物理属性ダメージ"], 6: ["HP%"] },
      subStats: ["会心率", "会心ダメージ", "HP%"],
      sets: ["雲嶽は我に似たり 4", "ウッドペッカーエレクトロ 2"],
      note: "会心率67.4%は複数ソースで確認。戦闘中/装備効果込みで100%付近を狙う構成。",
      sources: [
        { name: "GameWith", url: "https://gamewith.jp/zenless/551848" },
        { name: "takugame", url: "https://takugame.com/billys/" }
      ]
    },
    "Sunna": {
      status: "複数ソース一致",
      variant: "支援バフ上限想定",
      targets: [
        { key: "atk", min: 3500, note: "複数ソースで一致" }
      ],
      mainStats: { 4: ["攻撃力%"], 5: ["攻撃力%"], 6: ["エネルギー自動回復"] },
      subStats: ["攻撃力%", "攻撃力実数"],
      sets: ["月光騎士の讃歌 4", "スイングジャズ 2"],
      note: "攻撃力3500でバフ上限を狙う方針。",
      sources: [
        { name: "GameWith", url: "https://gamewith.jp/zenless/538067" },
        { name: "takugame", url: "https://takugame.com/%E3%80%90%E3%82%BC%E3%83%B3%E3%82%BC%E3%83%AD%E3%80%91%E5%8D%83%E5%A4%8F%E3%81%AE%E3%83%87%E3%82%A3%E3%82%B9%E3%82%AF%E5%8E%B3%E9%81%B8%EF%BD%9C%E7%90%86%E6%83%B3%E3%83%BB%E7%9B%AE%E6%A8%99%E3%82%B9/" }
      ]
    },
    "Cissia": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "critRate", min: 57.8, note: "確認ソース目標値。確認ソースは57%を提示" },
        { key: "critDmg", min: 122, note: "確認ソース目標値。確認ソースは150%前後を理想として提示" },
        { key: "energy", min: 3.68, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率"], 5: ["電気属性ダメージ"], 6: ["エネルギー自動回復"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      sets: ["暁に咲く花 4", "月光騎士の讃歌 2"],
      note: "会心率目標は複数ソースで近似一致。エネ回復は確認ソースの追加目標。",
      sources: [
        { name: "GameWith", url: "https://gamewith.jp/zenless/545038" },
        { name: "takugame", url: "https://takugame.com/cecilia/" }
      ]
    },
    "Promeia": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 2623, note: "確認ソース目標値" },
        { key: "ap", min: 314, note: "確認ソース目標値。確認ソースは320以上/理想350を提示" }
      ],
      mainStats: { 4: ["異常マスタリー"], 5: ["氷属性ダメージ"], 6: ["異常掌握"] },
      subStats: ["異常マスタリー", "攻撃力%"],
      sets: ["獄中の手記 4", "パエトーンの歌 2"],
      note: "数値は確認ソース、異常マスタリー重視と4/5/6構成は確認ソースでも確認。",
      sources: [
        { name: "GameWith", url: "https://gamewith.jp/zenless/551847" },
        { name: "takugame", url: "https://takugame.com/promeia/" }
      ]
    },
    "Seed": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 2943 },
        { key: "critRate", min: 85 },
        { key: "critDmg", min: 126.8 }
      ],
      mainStats: { 4: ["会心率"], 5: ["電気属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      sets: ["暁に咲く花 4", "ウッドペッカーエレクトロ 2"],
      note: "確認ソースの目標値。会心率85%を優先。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/511371" }]
    },
    "Yanagi": {
      status: "数値確認済み",
      targets: [
        { key: "atk", min: 2947 },
        { key: "ap", min: 326, note: "最低300" }
      ],
      mainStats: { 4: ["異常マスタリー"], 5: ["電気属性ダメージ", "攻撃力%"], 6: ["異常掌握", "攻撃力%"] },
      subStats: ["異常マスタリー", "攻撃力%"],
      note: "確認ソースの目標値。異常マスタリー300以上を最優先。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/464499" }]
    },
    "Yuzuha": {
      status: "数値確認済み",
      targets: [
        { key: "atk", min: 3000 },
        { key: "anomalyProf", min: 200 },
        { key: "ap", min: null, note: "あればあるだけ" }
      ],
      mainStats: { 4: ["攻撃力%", "異常マスタリー"], 5: ["攻撃力%", "物理属性ダメージ"], 6: ["異常掌握"] },
      subStats: ["攻撃力%", "異常マスタリー"],
      note: "確認ソースの目標値。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/502024" }]
    },
    "Lighter": {
      status: "数値確認済み",
      targets: [
        { key: "impact", min: 194, note: "A級音動機なら190目安" },
        { key: "critRate", min: 40 },
        { key: "critDmg", min: 100 }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["炎属性ダメージ", "攻撃力%"], 6: ["衝撃力"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "確認ソースの目標値。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/464584" }]
    },
    "Ellen": {
      status: "数値確認済み",
      targets: [
        { key: "critRate", min: 80 },
        { key: "critDmg", min: 130 }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["氷属性ダメージ"], 6: ["攻撃力%", "HP%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "確認ソースの目標値。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/455323" }]
    },
    "Ye Shunguang": {
      status: "数値確認済み",
      targets: [
        { key: "atk", min: 2501 },
        { key: "critRate", min: 48.2 },
        { key: "critDmg", min: 234 }
      ],
      mainStats: { 4: ["会心ダメージ"], 5: ["物理属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "確認ソースの目標値。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/525771" }]
    },
    "Harumasa": {
      status: "数値確認済み",
      targets: [{ key: "critRate", min: 43 }],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["電気属性ダメージ"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "確認ソースの目標値。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/457556" }]
    },
    "Alice": {
      status: "数値確認済み",
      targets: [
        { key: "atk", min: 2960 },
        { key: "ap", min: 330 }
      ],
      mainStats: { 4: ["異常マスタリー"], 5: ["物理属性ダメージ", "攻撃力%"], 6: ["異常掌握"] },
      subStats: ["異常マスタリー", "攻撃力%"],
      note: "確認ソースの目標値。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/502052" }]
    },
    "Dialyn": {
      status: "数値確認済み",
      targets: [
        { key: "atk", min: 1988 },
        { key: "critRate", min: 99.4 },
        { key: "critDmg", min: 117.2 }
      ],
      mainStats: { 4: ["会心率", "攻撃力%"], 5: ["物理属性ダメージ", "エネルギー自動回復"], 6: ["衝撃力"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "確認ソースの目標値。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/522882" }]
    },
    "Yixuan": {
      status: "数値確認済み",
      targets: [
        { key: "hp", min: 21000 },
        { key: "critRate", min: 67.4 },
        { key: "critDmg", min: 128 }
      ],
      mainStats: { 4: ["会心率"], 5: ["HP%"], 6: ["HP%"] },
      subStats: ["会心率", "会心ダメージ", "HP%"],
      note: "確認ソースの目標値。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/493803" }]
    },
    "Banyue": {
      status: "数値確認済み",
      targets: [
        { key: "hp", min: 18174 },
        { key: "critRate", min: 56.2 },
        { key: "critDmg", min: 155.6 }
      ],
      mainStats: { 4: ["会心ダメージ"], 5: ["炎属性ダメージ", "HP%"], 6: ["HP%"] },
      subStats: ["会心率", "会心ダメージ", "HP%"],
      note: "確認ソースの目標値。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/522956" }]
    },
    "Nekomata": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 3000, note: "確認ソースモチーフあり目標。確認ソースは会心系優先方針を確認" },
        { key: "critRate", min: 70, note: "確認ソース目標値" },
        { key: "critDmg", min: 170, note: "確認ソースモチーフあり目標" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["物理属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      sets: ["獣牙のヘヴィメタル 4", "ウッドペッカーエレクトロ 2"],
      note: "確認ソースの目標表を採用。確認ソースでは背面攻撃/会心系重視の運用方針を確認。",
      sources: [
        { name: "Game8", url: "https://game8.jp/zenless/607805" },
        { name: "GameWith", url: "https://gamewith.jp/zenless/455333" }
      ]
    },
    "Soldier 11": {
      status: "複数ソース確認",
      variant: "確認ソース 4番会心率・5番貫通率想定",
      targets: [
        { key: "atk", min: 2936, note: "確認ソース目標値。確認ソースはモチーフあり攻撃力3000を提示" },
        { key: "critRate", min: 72.2, note: "確認ソース目標値。確認ソースは50%以上を提示" },
        { key: "critDmg", min: 138, note: "確認ソース目標値。確認ソースは150%を提示" }
      ],
      mainStats: { 4: ["会心率"], 5: ["貫通率", "炎属性ダメージ"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      sets: ["炎獄のヘヴィメタル 4", "ウッドペッカーエレクトロ 2"],
      note: "確認ソースと確認ソースで前提が異なるため、確認ソースの具体ビルド値を採用し差分を注記。",
      sources: [
        { name: "GameWith", url: "https://gamewith.jp/zenless/455328" },
        { name: "Game8", url: "https://game8.jp/zenless/607804" }
      ]
    },
    "Koleda": {
      status: "数値確認済み",
      variant: "撃破基本",
      targets: [
        { key: "impact", min: 190, note: "確認ソース目標値" },
        { key: "atk", min: 2500, note: "確認ソースモチーフあり/なし共通目標" },
        { key: "critRate", min: 50, note: "確認ソース目標値" },
        { key: "critDmg", min: 100, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["炎属性ダメージ", "攻撃力%"], 6: ["衝撃力"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      sets: ["ショックスター・ディスコ 4", "スイング・ジャズ 2"],
      note: "具体目標は確認ソース。確認ソースではモチーフ音動機の衝撃力上昇と撃破運用を確認。",
      sources: [
        { name: "Game8", url: "https://game8.jp/zenless/607803" },
        { name: "GameWith", url: "https://gamewith.jp/zenless/455332" }
      ]
    },
    "Lycaon": {
      status: "複数ソース一致",
      variant: "モチーフ想定",
      targets: [
        { key: "impact", min: 194, note: "確認ソース目標値。確認ソースもモチーフあり194を提示" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["氷属性ダメージ", "攻撃力%"], 6: ["衝撃力"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      sets: ["ショックスター・ディスコ 4", "スイング・ジャズ 2"],
      note: "衝撃力194を採用。A級音動機では190目安。",
      sources: [
        { name: "GameWith", url: "https://gamewith.jp/zenless/455326" },
        { name: "Game8", url: "https://game8.jp/zenless/607802" }
      ]
    },
    "Rina": {
      status: "数値確認済み",
      variant: "貫通率バフ想定",
      targets: [
        { key: "penRatio", min: 70.4, note: "確認ソースモチーフあり目標。確認ソースは最大70.4%到達を確認" }
      ],
      mainStats: { 4: ["異常マスタリー", "攻撃力%"], 5: ["貫通率"], 6: ["エネルギー自動回復"] },
      subStats: ["貫通値", "異常マスタリー", "攻撃力%"],
      sets: ["スイング・ジャズ 4", "パファー・エレクトロ 2"],
      note: "貫通率はサブステで伸びないため、音動機/5番/2セット/コア強化前提。",
      sources: [
        { name: "Game8", url: "https://game8.jp/zenless/607799" },
        { name: "GameWith", url: "https://gamewith.jp/zenless/455325" }
      ]
    },
    "Grace": {
      status: "数値確認済み",
      variant: "モチーフなし汎用",
      targets: [
        { key: "atk", min: 2500, note: "確認ソース目標値" },
        { key: "ap", min: 350, note: "確認ソースモチーフなし目標" }
      ],
      mainStats: { 4: ["異常マスタリー"], 5: ["電気属性ダメージ", "貫通率"], 6: ["異常掌握", "攻撃力%"] },
      subStats: ["異常マスタリー", "攻撃力%"],
      sets: ["フリーダム・ブルース 4", "スイング・ジャズ 2"],
      note: "確認ソースの目標表を採用。確認ソースでは複合コンパイラで異常マスタリーを伸ばす方針を確認。",
      sources: [
        { name: "Game8", url: "https://game8.jp/zenless/607801" },
        { name: "GameWith", url: "https://gamewith.jp/zenless/455330" }
      ]
    },
    "Soukaku": {
      status: "数値確認済み",
      variant: "支援バフ上限想定",
      targets: [
        { key: "atk", min: 2500, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["攻撃力%"], 5: ["攻撃力%", "氷属性ダメージ"], 6: ["エネルギー自動回復", "攻撃力%"] },
      subStats: ["攻撃力%", "攻撃力実数", "エネルギー自動回復"],
      sets: ["スイング・ジャズ 4", "ホルモン・パンク 2"],
      note: "味方全体への攻撃力バフを活かすための攻撃力2500目標。",
      sources: [
        { name: "Game8", url: "https://game8.jp/zenless/607795" }
      ]
    },
    "Miyabi": {
      status: "数値確認済み",
      variant: "無凸モチーフ想定",
      targets: [
        { key: "atk", min: 2800, note: "確認ソース目標値" },
        { key: "critRate", min: 68, note: "確認ソース目標値" },
        { key: "critDmg", min: 150, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["氷属性ダメージ", "攻撃力%"], 6: ["攻撃力%", "異常掌握"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      sets: ["折枝の刀歌 4", "ウッドペッカーエレクトロ 2"],
      note: "確認ソースの無凸モチーフ目標。戦闘中バフ前のステータス画面値。",
      sources: [
        { name: "Game8", url: "https://game8.jp/zenless/619923" }
      ]
    },
    "Zhu Yuan": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 3500, note: "確認ソースモチーフあり目標" },
        { key: "critRate", min: 40, note: "確認ソース目標値。戦闘中バフで過剰にしない" },
        { key: "critDmg", min: 175, note: "確認ソースモチーフあり目標" }
      ],
      mainStats: { 4: ["会心ダメージ", "会心率"], 5: ["エーテル属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心ダメージ", "攻撃力%", "会心率"],
      sets: ["混沌のヘヴィメタル 4", "ウッドペッカーエレクトロ 2"],
      note: "確認ソースの目標表を採用。会心率は追加能力や編成バフ込みで溢れやすいため40%目安。",
      sources: [
        { name: "Game8", url: "https://game8.jp/zenless/609201" }
      ]
    },
    "Hugo": {
      status: "複数ソース確認",
      variant: "4番会心率想定",
      targets: [
        { key: "atk", min: 3000, note: "確認ソース目標値。確認ソースは2500を提示" },
        { key: "critRate", min: 88, note: "複数ソースで一致" },
        { key: "critDmg", min: 130, note: "複数ソースで概ね一致" }
      ],
      mainStats: { 4: ["会心率"], 5: ["氷属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      sets: ["ホルモン・パンク 4", "ウッドペッカーエレクトロ 2"],
      note: "会心率88%を最優先。安定性重視ビルドでは会心ダメージ150%も候補。",
      sources: [
        { name: "GameWith", url: "https://gamewith.jp/zenless/489300" },
        { name: "Game8", url: "https://game8.jp/zenless/666110" }
      ]
    },
    "Ju Fufu": {
      status: "数値確認済み",
      variant: "6番エネルギー回復想定",
      targets: [
        { key: "atk", min: 3400, note: "確認ソース目標値" },
        { key: "critRate", min: 69.8, note: "確認ソース目標値。バフ上限目的の最低は50%" },
        { key: "critDmg", min: 79, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率"], 5: ["攻撃力%"], 6: ["エネルギー自動回復", "衝撃力", "攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      sets: ["大山を統べる者 4", "静寂のアストラ 2"],
      note: "確認ソースの目標値。攻撃力3400と会心率50%以上で会心ダメージバフ上限を狙う。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/493825" }]
    },
    "Orphie & Magus": {
      status: "数値確認済み",
      variant: "4番会心率想定",
      targets: [
        { key: "atk", min: 2311, note: "確認ソースモチーフ目標。代用音動機は2170" },
        { key: "critRate", min: 43.4, note: "確認ソースモチーフ目標。代用音動機は63.4%" },
        { key: "critDmg", min: 117.2, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["炎属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      sets: ["シャドウハーモニー 4", "ウッドペッカーエレクトロ 2"],
      note: "確認ソースの開幕ステータス目標。自己バフ/モチーフで会心率が伸びる前提。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/511491" }]
    },
    "Lucia": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "hp", min: 24240, note: "確認ソースモチーフ目標。代用音動機は21698" }
      ],
      mainStats: { 4: ["HP%"], 5: ["HP%"], 6: ["HP%"] },
      subStats: ["HP%", "HP実数"],
      sets: ["月光騎士の讃歌 4", "雲嶽は我に似たり 2"],
      note: "確認ソースの開幕HP目標。HPがバフ量に関わるためHP優先。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/514875" }]
    },
    "Zhao": {
      status: "数値確認済み",
      variant: "支援型防護",
      targets: [
        { key: "hp", min: 27000, note: "確認ソースの追加能力条件目標" }
      ],
      mainStats: { 4: ["HP%", "会心率"], 5: ["HP%", "エーテル属性ダメージ"], 6: ["HP%", "エネルギー自動回復"] },
      subStats: ["HP%", "会心率", "会心ダメージ"],
      sets: ["雪うさぎのソナタ 4", "雲嶽は我に似たり 2"],
      note: "HP27000到達後は会心率/会心ダメージへ切り替える方針。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/525762" }]
    },
    "Manato": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "hp", min: 21432, note: "確認ソース目標値" },
        { key: "critRate", min: 56.2, note: "確認ソース目標値" },
        { key: "critDmg", min: 114, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率"], 5: ["HP%"], 6: ["HP%"] },
      subStats: ["会心率", "会心ダメージ", "HP%"],
      sets: ["雲嶽は我に似たり 2", "ウッドペッカーエレクトロ 2", "折枝の刀歌 2"],
      note: "確認ソースの目標値。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/514876" }]
    },
    "Pan Yinhu": {
      status: "数値確認済み",
      variant: "汎用サポート",
      targets: [
        { key: "atk", min: 3000, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["攻撃力%"], 5: ["攻撃力%"], 6: ["エネルギー自動回復"] },
      subStats: ["攻撃力%"],
      sets: ["静寂のアストラ 4", "スイング・ジャズ 2"],
      note: "攻撃力3000で透徹力バフ量上限を狙う。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/495253" }]
    },
    "Billy": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 3000, note: "確認ソース目標値" },
        { key: "critRate", min: 50, note: "確認ソース目標値" },
        { key: "critDmg", min: 150, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["物理属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "会心ダメージ150%以上を目標にしつつ、会心率50%以上を確保。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/607806" }]
    },
    "Nicole": {
      status: "数値確認済み",
      targets: [
        { key: "energy", min: 3.58, note: "確認ソースモチーフあり目標。モチーフなしは3.20" }
      ],
      mainStats: { 4: ["異常マスタリー", "攻撃力%"], 5: ["エーテル属性ダメージ", "攻撃力%"], 6: ["エネルギー自動回復"] },
      subStats: ["エネルギー自動回復", "異常マスタリー"],
      sets: ["スイング・ジャズ 4"],
      note: "支援効果自体はステータス依存が薄いため、回転率目的のエネルギー自動回復を目標値として登録。",
      sources: [
        { name: "Game8", url: "https://game8.jp/zenless/607758" },
        { name: "GameWith", url: "https://gamewith.jp/zenless/455336" }
      ]
    },
    "Anby": {
      status: "数値確認済み",
      targets: [
        { key: "impact", min: 189, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["電気属性ダメージ", "攻撃力%"], 6: ["衝撃力"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "撃破役として衝撃力189を最優先。火力寄せする場合は会心系も候補。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/607757" }]
    },
    "Anton": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 3000, note: "確認ソース目標値" },
        { key: "critRate", min: 50, note: "確認ソース目標値" },
        { key: "critDmg", min: 150, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["電気属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "会心ダメージ150%以上、会心率50%以上を目安に攻撃力も確保。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/607797" }]
    },
    "Ben": {
      status: "数値確認済み",
      targets: [
        { key: "def", min: 2000, note: "確認ソース目標値" },
        { key: "critDmg", min: 150, note: "確認ソースモチーフあり目標" }
      ],
      mainStats: { 4: ["防御力%"], 5: ["防御力%"], 6: ["防御力%", "エネルギー自動回復"] },
      subStats: ["防御力%", "会心率", "会心ダメージ"],
      note: "防御力2000以上が主目標。モチーフ運用では会心ダメージも伸ばす。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/607796" }]
    },
    "Corin": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 3000, note: "確認ソース目標値" },
        { key: "critRate", min: 50, note: "確認ソース目標値" },
        { key: "critDmg", min: 150, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["物理属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "会心ダメージ150%以上、会心率50%以上を確保。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/607798" }]
    },
    "Lucy": {
      status: "数値確認済み",
      targets: [
        { key: "atk", min: 2266, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["攻撃力%"], 5: ["攻撃力%"], 6: ["エネルギー自動回復", "攻撃力%"] },
      subStats: ["攻撃力%", "攻撃力実数"],
      note: "コアパッシブの攻撃力バフ上限目的で攻撃力2266以上。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/622470" }]
    },
    "Piper": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 3000, note: "確認ソース目標値" },
        { key: "ap", min: 350, note: "確認ソース目標値。モチーフなしは400" }
      ],
      mainStats: { 4: ["異常マスタリー"], 5: ["物理属性ダメージ", "攻撃力%"], 6: ["異常掌握"] },
      subStats: ["異常マスタリー", "攻撃力%"],
      note: "異常マスタリー350以上を最優先。モチーフなしでは400目標。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/622469" }]
    },
    "Seth": {
      status: "数値確認済み",
      targets: [
        { key: "atk", min: 3750, note: "確認ソース目標値。妥協は3200" }
      ],
      mainStats: { 4: ["攻撃力%", "異常マスタリー"], 5: ["電気属性ダメージ", "攻撃力%"], 6: ["エネルギー自動回復", "攻撃力%"] },
      subStats: ["攻撃力%", "異常マスタリー"],
      note: "開幕攻撃力の80%をシールドへ変換するため、上限目的で攻撃力3750を目指す。",
      sources: [
        { name: "Game8", url: "https://game8.jp/zenless/625560" },
        { name: "Game8 X", url: "https://x.com/ZZZ_Game8/status/1831646993208504496" }
      ]
    },
    "Pulchra": {
      status: "数値確認済み",
      targets: [
        { key: "critRate", min: 50, note: "確認ソースで大山4バフ条件として確認" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["物理属性ダメージ", "攻撃力%"], 6: ["衝撃力"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "大山4セットの追加会心ダメージバフ条件として会心率50%以上を確保。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/665675" }]
    },
    "Qingyi": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "impact", min: 193, note: "確認ソース目標値" },
        { key: "atk", min: 2500, note: "確認ソース目標値" },
        { key: "critRate", min: 50, note: "確認ソース目標値" },
        { key: "critDmg", min: 100, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["電気属性ダメージ", "攻撃力%"], 6: ["衝撃力"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "衝撃力193を最優先。サブアタッカー運用なら会心系も確保。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/623185" }]
    },
    "Jane": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 2500, note: "確認ソース目標値" },
        { key: "ap", min: 450, note: "確認ソースモチーフあり目標。モチーフなしは400" }
      ],
      mainStats: { 4: ["異常マスタリー"], 5: ["物理属性ダメージ", "攻撃力%"], 6: ["異常掌握"] },
      subStats: ["異常マスタリー", "攻撃力%"],
      note: "強撃会心率を高めるため異常マスタリー400以上、モチーフありは450目標。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/625565" }]
    },
    "Caesar": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "impact", min: 170, note: "確認ソースモチーフあり目標。モチーフなしは150" },
        { key: "atk", min: 2500, note: "確認ソースモチーフあり目標" }
      ],
      mainStats: { 4: ["会心率", "防御力%"], 5: ["物理属性ダメージ", "防御力%"], 6: ["衝撃力"] },
      subStats: ["会心率", "会心ダメージ", "防御力%"],
      note: "シールドとブレイク性能に関わる衝撃力を優先。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/632404" }]
    },
    "Burnice": {
      status: "数値確認済み",
      targets: [
        { key: "ap", min: 300, note: "確認ソースでパッシブ最大化目標として確認" }
      ],
      mainStats: { 4: ["異常マスタリー"], 5: ["炎属性ダメージ", "攻撃力%"], 6: ["異常掌握", "エネルギー自動回復"] },
      subStats: ["異常マスタリー", "攻撃力%"],
      note: "異常マスタリー300以上でパッシブ効果最大化を狙い、残りは攻撃力を伸ばす。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/632431" }]
    },
    "Astra Yao": {
      status: "複数ソース一致",
      variant: "支援バフ上限想定",
      targets: [
        { key: "atk", min: 3429, note: "確認ソース目標値。確認ソースは上限3430として確認" }
      ],
      mainStats: { 4: ["攻撃力%"], 5: ["攻撃力%"], 6: ["エネルギー自動回復"] },
      subStats: ["攻撃力%", "攻撃力実数"],
      sets: ["静寂のアストラ 4", "スイング・ジャズ 2"],
      note: "開幕攻撃力3429/3430付近で攻撃力バフ上限を狙う。モチーフや攻撃力音動機なら6番はエネルギー自動回復優先。",
      sources: [
        { name: "Game8", url: "https://game8.jp/zenless/658087" },
        { name: "GameWith", url: "https://gamewith.jp/zenless/478723" }
      ]
    },
    "Evelyn": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 2500, note: "確認ソース目標値" },
        { key: "critRate", min: 80, note: "確認ソースモチーフあり目標" },
        { key: "critDmg", min: 180, note: "確認ソースモチーフあり目標" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["炎属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "会心率80%、会心ダメージ180%を目標。モチーフなしは会心率60%、会心ダメージ150%目安。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/658085" }]
    },
    "Trigger": {
      status: "複数ソース一致",
      variant: "シャドウハーモニー4想定",
      targets: [
        { key: "critRate", min: 78, note: "画面値目標。シャドウ4の+12%込みで90%" },
        { key: "impact", min: 154, note: "個人攻略で理想値として確認。複数ソースは会心率優先方針を確認" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["電気属性ダメージ", "攻撃力%"], 6: ["衝撃力"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      sets: ["シャドウハーモニー 4", "ウッドペッカーエレクトロ 2"],
      note: "追加能力の上限は会心率90%。シャドウ4運用ではステータス画面78%を目安にし、届かない場合も会心率を最優先。",
      sources: [
        { name: "GameWith", url: "https://gamewith.jp/zenless/482972" },
        { name: "Game8", url: "https://game8.jp/zenless/665774" },
        { name: "すこれる", url: "https://www.sukoreru.com/zzz-trigger" },
        { name: "遠野蜜柑ブログ", url: "https://touno-mitsuki.hatenablog.com/entry/2025/09/08/093000" }
      ]
    },
    "Vivian": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 2500, note: "確認ソース目標値" },
        { key: "ap", min: 420, note: "確認ソースモチーフあり目標。モチーフなしは370" },
        { key: "anomalyProf", min: 200, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["異常マスタリー"], 5: ["エーテル属性ダメージ", "攻撃力%"], 6: ["異常掌握", "攻撃力%"] },
      subStats: ["異常マスタリー", "攻撃力%"],
      note: "異常マスタリー420を目標。異常掌握200以上も確保。",
      sources: [{ name: "Game8", url: "https://game8.jp/zenless/666112" }]
    },
    "Soldier 0 - Anby": {
      status: "複数ソース確認",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 2500, note: "確認ソースモチーフあり目標" },
        { key: "critRate", min: 70, note: "確認ソース目標値。確認ソースも画面70%前後を推奨" },
        { key: "critDmg", min: 180, note: "確認ソースモチーフあり目標" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["電気属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      sets: ["シャドウハーモニー 4", "ウッドペッカーエレクトロ 2"],
      note: "追加能力+シャドウ4で戦闘中会心率が上がるため、画面70%前後を確保して残りは会心ダメージ優先。",
      sources: [
        { name: "Game8", url: "https://game8.jp/zenless/665676" },
        { name: "GameWith", url: "https://gamewith.jp/zenless/482934" }
      ]
    },
    "Aria": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "ap", min: 460, note: "確認ソース目標値。代用音動機は412" },
        { key: "energy", min: 2.4, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["異常マスタリー"], 5: ["エーテル属性ダメージ", "攻撃力%"], 6: ["異常掌握", "攻撃力%"] },
      subStats: ["異常マスタリー", "攻撃力%"],
      note: "異常マスタリー460を最優先。エネルギー自動回復は戦闘中バフ込みで約2.4を目標。",
      sources: [
        { name: "GameWith", url: "https://gamewith.jp/zenless/525767" },
        { name: "Game8", url: "https://game8.jp/zenless/754122" }
      ]
    },
    "Nangong Yu": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "impact", min: 185, note: "確認ソース目標値" },
        { key: "critRate", min: 57.8, note: "確認ソース目標値" },
        { key: "critDmg", min: 152, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["エーテル属性ダメージ", "攻撃力%"], 6: ["衝撃力"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "衝撃力185を確保しつつ会心率/会心ダメージを伸ばす。",
      sources: [
        { name: "GameWith", url: "https://gamewith.jp/zenless/525775" },
        { name: "Game8", url: "https://game8.jp/zenless/754125" }
      ]
    },
    "Pyrois": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "atk", min: 2389, note: "確認ソース目標値" },
        { key: "critRate", min: 68.4, note: "確認ソース目標値" },
        { key: "critDmg", min: 184.4, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["エーテル属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "確認ソースの開幕目標値。4番会心率想定で会心ダメージを伸ばす。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/550725" }]
    },
    "Norma": {
      status: "数値確認済み",
      variant: "モチーフ想定",
      targets: [
        { key: "critRate", min: 68.4, note: "確認ソース目標値" },
        { key: "critDmg", min: 157.2, note: "確認ソース目標値" },
        { key: "energy", min: 3.68, note: "確認ソース目標値。モチーフなしは3.20" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["炎属性ダメージ", "攻撃力%"], 6: ["衝撃力"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "会心率/会心ダメージとエネルギー自動回復を両立する目標。",
      sources: [{ name: "GameWith", url: "https://gamewith.jp/zenless/550713" }]
    },
    "Yidhari": {
      status: "数値確認済み",
      variant: "HPビルド",
      targets: [
        { key: "hp", min: 21886, note: "確認ソース目標値" },
        { key: "critRate", min: 68, note: "確認ソース目標値" },
        { key: "critDmg", min: 128, note: "確認ソース目標値" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["氷属性ダメージ", "HP%"], 6: ["HP%"] },
      subStats: ["会心率", "会心ダメージ", "HP%"],
      note: "HPスケール火力を想定し、HPと会心系を確保。",
      sources: [
        { name: "GameWith", url: "https://gamewith.jp/zenless/493790" },
        { name: "Game8", url: "https://game8.jp/zenless/686301" }
      ]
    },
    "Avatar_Female_Size02_Remielle": {
      status: "公式未実装",
      targets: [
        { key: "ap", min: null, note: "公式未実装/仮名データのため、確認できる目標値なし" }
      ],
      mainStats: { 4: ["異常マスタリー"], 5: ["属性ダメージ", "攻撃力%"], 6: ["異常掌握"] },
      subStats: ["異常マスタリー", "攻撃力%"],
      note: "nanokaデータ上の仮名/未確定キャラ。攻略ソースで数値確認できるまで、目標値は空欄扱い。"
    },
    "Avatar_Female_Size03_Sigrid": {
      status: "公式未実装",
      targets: [
        { key: "critRate", min: null, note: "公式未実装/仮名データのため、確認できる目標値なし" }
      ],
      mainStats: { 4: ["会心率", "会心ダメージ"], 5: ["氷属性ダメージ", "攻撃力%"], 6: ["攻撃力%"] },
      subStats: ["会心率", "会心ダメージ", "攻撃力%"],
      note: "nanokaデータ上の仮名/未確定キャラ。攻略ソースで数値確認できるまで、目標値は空欄扱い。"
    }
  }
};
