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
window.SHOW_DRAFTS = false; // ← false = 空き枠(draft)を隠す(公開用)。デザイン確認のときだけ true に

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
      { heading: "こだわり", text: "全体を通して、サウンドの演出とバランスを重視して制作しました。\n緊迫した場面は音数が多く物足りなさを感じにくい一方、戦闘が終わった場面は前の場面と比べて音が薄く感じられやすいため、その差を意識しながら仕上げました。演出のために、あえて音を引いた箇所もあります。\n機械モンスターの駆動音と重量感の表現にも、特に時間をかけました。" },
      { heading: "改善したい点", text: "パズルを解く場面では、音がかなり薄く感じられます。制作時は、プレイヤーが別の時間にいるような感覚と、後の場面との劇的な対比を狙い、パズルの音だけで構成しました。\nしかし、緊迫感のある音をわずかに加えたり、環境音で時間がゆっくり流れる感覚を表現したりすれば、より良くなったと考えています。" }
    ],
    links: [{ label: "制作解説書 (PDF)", url: "" }],
    en: {
      title: "Game Sound Redesign",
      notes: [
        { heading: "What I focused on", text: "Throughout the piece, I focused on how the sound directs the scene and on overall balance.\nTense scenes are dense with sound and rarely feel empty, but the moments after a battle can feel sparse by comparison, so I worked with that contrast in mind. In some places I deliberately removed sound for dramatic effect.\nI also spent a lot of time on the mechanical monster's motor sounds and its sense of weight." },
        { heading: "What I'd improve", text: "The puzzle-solving scene feels quite empty. At the time, I used only the puzzle sounds to suggest that the player had stepped into a different time, and to create a dramatic contrast with the scene that follows.\nLooking back, adding a hint of tension, or using ambience to convey time slowing down, would have made it stronger." }
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
      { heading: "こだわり", text: "前半は、ナレーションに合わせて意味深な音を多く使いました。\nドラゴンの動きと場所の特性を活かし、蛇の音を参考に音を作ったり、重い環境音を少し加えて場所の重圧感を表現したりしました。\n後半は「希望」を鐘の音で表現し、ドラゴンの威圧的な姿とあわせて、映像に沿った演出を加えました。" },
      { heading: "改善したい点", text: "ミックスが不自然な箇所や、音が重なる部分を整理しきれていない箇所があります。「希望」の演出も、もっと独自性のある表現にできたのではと感じています。\n制作中に自分の限界を感じた作品で、完成後も心残りがありますが、今後の制作に向けた大きな財産になりました。" }
    ],
    links: [{ label: "制作解説書 (PDF)", url: "" }],
    en: {
      notes: [
        { heading: "What I focused on", text: "In the first half, I used many ominous, suggestive sounds to match the narration.\nTo reflect the dragon's movement and the setting, I designed sounds with snake sounds as a reference and added a little heavy ambience to convey the oppressive weight of the place.\nIn the second half, I expressed “hope” with a bell, and built the direction around the picture together with the dragon's threatening presence." },
        { heading: "What I'd improve", text: "Some parts of the mix feel unnatural, and some overlapping sounds aren't cleaned up well. I also wonder whether I could have expressed “hope” in a more distinctive way.\nI felt the limits of my skills while making this piece, so it left me with some regrets, but it became a valuable asset for my future work." }
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
      { heading: "こだわり", text: "プレイヤーがゲーム内で何度も繰り返し聞くスキルなので、高音域が強調された音や残響の長い音は意図的に避けました。\nキャラクターの二面性(光と闇)を音で表現することを目指し、似ているようで異なるスキルには、元のスキル音に強調する音を重ねて差をつけました。" },
      { heading: "改善したい点", text: "環境音を少し加えていれば、より没入感のある映像になったと思います。\n高音域は避けたつもりでしたが、やや鋭い音が残っているように感じます。打撃感ももう少し加えれば、さらに良くなったと考えています。" }
    ],
    links: [{ label: "制作解説書 (PDF)", url: "" }],
    en: {
      notes: [
        { heading: "What I focused on", text: "Because players hear these skills again and again in game, I deliberately avoided sounds with emphasized high frequencies or long reverb tails.\nI aimed to express the character's duality (light and darkness) through sound, and for skills that look similar but differ, I layered extra accent sounds on top of the base skill sound to set them apart." },
        { heading: "What I'd improve", text: "Adding a little ambience would have made the video more immersive.\nI meant to avoid harsh highs, but some slightly sharp sounds still remain. More impact on the hits would also have made it better." }
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
