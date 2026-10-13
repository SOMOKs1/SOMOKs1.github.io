/*
 * サイト共通の設定(連絡先など)
 * url が空("")のリンクは表示されません。作成したら URL を入れるだけで表示されます。
 * tools : About の「使用ツール」に並ぶ名前です。増減は自由です。空 [] なら行ごと非表示になります。
 * certs : 「資格」に並ぶ項目です。title = 日本語 / en = 英語ページ用(省略可)。空 [] なら行ごと非表示になります。
 * awards: 「受賞歴」に並ぶ項目です。上から順に表示されます。空 [] ならセクションごと非表示になります。
 *         title = 賞の名前 / detail = 作品名や補足(なくてもOK) / year = 年(書いたときだけ表示) / url = 公式ページ(書いたときだけリンク)
 */
/*
 * アイコンについて
 *   About の「所属・志望・使用ツール・受賞歴」には、小さなアイコンが付きます(初期状態は汎用の線画アイコンです)。
 *   ロゴ画像に差し替えたいときは、画像を assets/icons/ に置いて、下のように書きます。
 *     icons: { school: "assets/icons/hal.png" }                       ← 所属(HAL東京)のアイコン
 *     tools: [{ name: "Pro Tools", icon: "assets/icons/protools.png" }, "Reaper"]   ← ツールごとのアイコン
 *     awards の各項目の icon に "trophy" / "medal" / "star" または画像のパス
 *   ※ 公式ロゴは各社の規約に沿って使ってください(画像はご自身で用意したものを置きます)。
 */
window.SITE = {
  icons: {},
  email: "leeseongmin1996@gmail.com",
  tools: ["Reaper", "Logic Pro", "Pro Tools", "Wwise"],
  awards: [
    { title: "カプコン サウンドインターンシップ コンテスト SFX部門 優秀賞", detail: "PRAGMATA サウンドリデザイン", icon: "trophy" },
    { title: "バンダイナムコスタジオ サウンドMAチャレンジコンテスト 入賞", detail: "テイルズ オブ アライズ カットシーンの効果音制作・MA", icon: "trophy" },
    { title: "Berlin International Sound Design Competition 2026 (BIFSC) ファイナリスト", detail: "", icon: "medal", url: "https://www.bifsc.org/sound-design-competition" },
    { title: "学内コンテスト 入賞", detail: "", icon: "star" }
  ],
  certs: [
    { title: "日本語能力試験 (JLPT) N2", en: "JLPT N2 (Japanese-Language Proficiency Test)" },
    { title: "映像音響処理技術者認定試験 (JPPA)", en: "Video & Audio Processing Engineer Certification (JPPA)" }
  ],
  links: [
    { label: "YouTube", url: "" },
    { label: "SoundCloud", url: "" }
  ]
};
