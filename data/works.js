/*
 * 作品データ
 * ----------------------------------------------------------
 * 作品を増やすときは、下の { ... }, のかたまりを1つコピーして
 * 配列の中(最後の ]; より上)に貼り付けるだけです。
 * 各かたまりの間は「},」でつなぎ、最後のかたまりだけ「}」で終わります。
 *
 * media の書き方
 *   YouTube    : { type: "youtube", id: "動画ID" }
 *                 例) https://www.youtube.com/watch?v=abc123XYZ99 の abc123XYZ99 の部分
 *   SoundCloud : { type: "soundcloud", url: "https://soundcloud.com/..." }
 *   未設定      : { type: "none" } (「動画準備中」と表示されます)
 *
 * links : 制作解説書(PDF)などの追加リンク。url が空なら表示されません。
 * en    : 英語ページ用の上書き。category / description / badge / links などを英語で書けます(書かない項目は日本語のまま)。
 * draft : true を書いた作品は、サイトに表示されません(準備用の空き枠)。公開するときは draft の行を消すだけです。
 * 並び順: 配列の上から順に表示されます。受賞作・自信作を上に置いてください(3列表示なので6件でちょうど2段)。
 * en.order : 英語ページだけの並び順。en: { order: 1 } と書いた作品が先頭に来ます(日本語ページには影響しません)。
 * SHOW_DRAFTS : 下の window.SHOW_DRAFTS を true にすると draft の空き枠も表示されます(デザイン確認用)。公開前に false に戻してください。
 * more  : true を書いた作品は、トップの Works には出ず、「全作品を見る」ページ(works/)だけに表示されます。
 *          書かない作品は、トップにも全作品ページにも表示されます。
 * notes : 詳細ポップアップの「制作メモ」。[{ heading: "見出し", text: "文章", image: "assets/img/xxx.png", caption: "画像の説明" }, ...] と並べます。
 *          image と caption は省略できます。image: "" と書くと、SHOW_DRAFTS が true の間だけ画像の空き枠が表示されます。
 * badge : 受賞・入賞などの小さな印(例: "優秀賞" "Finalist")。書いた作品にだけ表示されます。英語ページは en: { badge: "..." } で上書き。
 */
window.SHOW_DRAFTS = true; // ← デザイン確認中は true。人に見せる前に false にすると空き枠が隠れます

/*
 * WORKS_LAYOUT : 作品の見せ方。"showcase" = 大きなサムネイルが順番に切り替わる / "grid" = 一覧(カード)表示
 */
window.WORKS_LAYOUT = "showcase";

window.WORKS = [
  /* ---- 1〜2 : 受賞・入賞作(最初に見てもらう枠) ---- */
  {
    title: "CAPCOM Contest",
    badge: "優秀賞",
    category: "ゲーム映像 サウンドリデザイン",
    year: "2026",
    description: "使用ツール:Logic Pro。ライブラリ:Soundly、Splice。自分で収録したFoleyも使用。制作期間約40時間。",
    media: { type: "youtube", id: "CBrUTeC69t4" },
    notes: [
      { heading: "こだわり", text: "【サンプル】特にこだわった点をここに書きます。例:衝撃音は低域のインパクトに金属のFoleyを重ねて、質感を出した。" },
      { heading: "改善したい点", text: "【サンプル】次に直したい点、まだ足りないと感じる点をここに書きます。" }
    ],
    links: [{ label: "制作解説書 (PDF)", url: "" }],
    en: {
      title: "Game Sound Redesign",
      notes: [
        { heading: "What I focused on", text: "[Sample] Describe what you cared about most. e.g. Layered a low-end impact with metal Foley to add texture to the hits." },
        { heading: "What I'd improve", text: "[Sample] Describe what you would fix next, or what still feels lacking." }
      ],
      badge: "Excellence Award",
      category: "Game footage sound redesign",
      description: "Tools: Logic Pro. Libraries: Soundly, Splice. Also used Foley I recorded myself. Production time: approx. 40 hours.",
      links: [{ label: "Production notes (PDF)", url: "" }]
    }
  },
  {
    title: "BIFSC 2026 Finalist",
    badge: "Finalist",
    category: "映像 サウンドリデザイン (Berlin International Sound Design Competition)",
    year: "2026",
    description: "使用ツール:Logic Pro。ライブラリ:Soundly、Splice。自分で収録したFoleyも使用。制作期間1か月。",
    media: { type: "youtube", id: "zdIdv4i0clI" },
    notes: [
      { heading: "こだわり", text: "【サンプル】特にこだわった点をここに書きます。" },
      { heading: "改善したい点", text: "【サンプル】次に直したい点、まだ足りないと感じる点をここに書きます。" }
    ],
    links: [{ label: "制作解説書 (PDF)", url: "" }],
    en: {
      notes: [
        { heading: "What I focused on", text: "[Sample] Describe what you cared about most." },
        { heading: "What I'd improve", text: "[Sample] Describe what you would fix next, or what still feels lacking." }
      ],
      category: "Film sound redesign (Berlin International Sound Design Competition)",
      description: "Tools: Logic Pro. Libraries: Soundly, Splice. Also used Foley I recorded myself. Production time: 1 month.",
      order: 1, // 英語ページでは先頭に表示
      links: [{ label: "Production notes (PDF)", url: "" }]
    }
  },

  /* ---- 3 : 公開中 ---- */
  {
    title: "Game Skill Redesign",
    category: "ゲーム映像 サウンドリデザイン (黒い砂漠)",
    year: "2026",
    description: "使用ツール:Logic Pro。ライブラリ:Soundly、Splice。制作期間1週間。",
    media: { type: "youtube", id: "-uvS4SlQrh0" },
    notes: [
      { heading: "こだわり", text: "【サンプル】特にこだわった点をここに書きます。" },
      { heading: "改善したい点", text: "【サンプル】次に直したい点、まだ足りないと感じる点をここに書きます。" }
    ],
    links: [{ label: "制作解説書 (PDF)", url: "" }],
    en: {
      notes: [
        { heading: "What I focused on", text: "[Sample] Describe what you cared about most." },
        { heading: "What I'd improve", text: "[Sample] Describe what you would fix next, or what still feels lacking." }
      ],
      category: "Game footage sound redesign (Black Desert)",
      description: "Tools: Logic Pro. Libraries: Soundly, Splice. Production time: 1 week.",
      links: [{ label: "Production notes (PDF)", url: "" }]
    }
  },

  /* ---- 4 : 空き枠A(次に入れる1本)。埋めたら draft の行を消してください ---- */
  {
    draft: true,
    title: "作品タイトル A",
    category: "ゲーム映像 サウンドリデザイン",
    year: "2026",
    description: "使用ツール:Logic Pro。ライブラリ:Soundly、Splice。制作期間○○。",
    media: { type: "youtube", id: "" },
    notes: [
      { heading: "こだわり", text: "【サンプル】特にこだわった点をここに書きます。" },
      { heading: "改善したい点", text: "【サンプル】次に直したい点、まだ足りないと感じる点をここに書きます。" }
    ],
    links: [{ label: "制作解説書 (PDF)", url: "" }],
    en: {
      notes: [
        { heading: "What I focused on", text: "[Sample] Describe what you cared about most." },
        { heading: "What I'd improve", text: "[Sample] Describe what you would fix next, or what still feels lacking." }
      ],
      category: "Game sound redesign",
      description: "Tools: Logic Pro. Libraries: Soundly, Splice. Production time: ...",
      links: [{ label: "Production notes (PDF)", url: "" }]
    }
  },

  /* ---- 5 : 空き枠B(予備)。使わなければ draft のままで OK ---- */
  {
    draft: true,
    title: "作品タイトル B",
    category: "ゲーム映像 サウンドリデザイン",
    year: "2026",
    description: "使用ツール:Logic Pro。ライブラリ:Soundly、Splice。制作期間○○。",
    media: { type: "youtube", id: "" },
    notes: [
      { heading: "こだわり", text: "【サンプル】特にこだわった点をここに書きます。" },
      { heading: "改善したい点", text: "【サンプル】次に直したい点、まだ足りないと感じる点をここに書きます。" }
    ],
    links: [{ label: "制作解説書 (PDF)", url: "" }],
    en: {
      notes: [
        { heading: "What I focused on", text: "[Sample] Describe what you cared about most." },
        { heading: "What I'd improve", text: "[Sample] Describe what you would fix next, or what still feels lacking." }
      ],
      category: "Game sound redesign",
      description: "Tools: Logic Pro. Libraries: Soundly, Splice. Production time: ...",
      links: [{ label: "Production notes (PDF)", url: "" }]
    }
  },

  /* ---- 6 : 映像なし作品(最後に置く枠) ---- */
  {
    title: "Borrowed Skin",
    category: "ゲームジャム作品 (Brackeys Game Jam 2026.2)",
    year: "2026",
    description: "一人称視点のナラティブホラー。担当:効果音(SFX)。クレジット名:SoMok0617。",
    media: { type: "none" },
    thumb: "https://img.itch.zone/aW1nLzI5NjExNjgwLnBuZw==/508x254%23mb/UWWhdy.png",
    notes: [
      { heading: "担当範囲", text: "【サンプル】担当した音(効果音・環境音など)の範囲をここに書きます。" },
      { heading: "制作過程", text: "【サンプル】作り方の流れ(収録・加工・実装など)をここに書きます。" }
    ],
    links: [{ label: "itch.io でプレイ", url: "https://luvbytes404.itch.io/borrowed-skin-moonmoss" }],
    en: {
      notes: [
        { heading: "Scope of work", text: "[Sample] Describe which sounds you handled (SFX, ambience, etc.)." },
        { heading: "Process", text: "[Sample] Describe your workflow (recording, editing, implementation, etc.)." }
      ],
      category: "Game jam entry (Brackeys Game Jam 2026.2)",
      description: "A first-person narrative horror game. Role: sound effects (SFX). Credited as SoMok0617.",
      links: [{ label: "Play on itch.io", url: "https://luvbytes404.itch.io/borrowed-skin-moonmoss" }]
    }
  }
];
