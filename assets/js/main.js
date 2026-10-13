/*
 * ポートフォリオサイトの描画スクリプト。
 * 作品は data/works.js、連絡先リンクは data/site.js を編集するだけで増やせます。
 * このファイルは基本的に触らなくて大丈夫です。
 */
(function () {
  "use strict";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  /* ---------- 言語切り替え(英語ページは <html lang="en">) ---------- */
  var IS_EN = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  var T = IS_EN
    ? { noVideo: "Video coming soon", close: "Close", role: "Role", tools: "Tools", more: "View details ›", empty: "Works are coming soon.", all: "All" }
    : { noVideo: "動画準備中", close: "閉じる", role: "担当", tools: "使用ツール", more: "詳細を見る ›", empty: "作品は準備中です。", all: "すべて" };

  // データ側の en: { ... } に書いた項目で、英語ページだけ上書きする
  function localize(item) {
    if (!IS_EN || !item || !item.en) return item;
    var out = {}, k;
    for (k in item) out[k] = item[k];
    for (k in item.en) out[k] = item.en[k];
    return out;
  }

  // 一覧(カード・ショーケース)には、受賞の印だけを出す。年・種類・説明・使用ツールは詳細ポップアップに入っている
  function badgeNode(work) {
    if (!work.badge) return null;
    var p = el("p", "card-meta");
    p.appendChild(el("span", "badge", work.badge));
    return p;
  }

  function metaNode(work) {
    if (!work.category && !work.year && !work.badge) return null;
    var p = el("p", "card-meta");
    if (work.year) p.appendChild(el("span", "year", work.year));
    if (work.category) p.appendChild(el("span", "category", work.category));
    if (work.badge) p.appendChild(el("span", "badge", work.badge));   // 受賞・入賞などの小さな印
    return p;
  }

  function visibleLinks(work) {
    return (work.links || []).filter(function (l) { return l && l.url; });
  }

  function tagList(items) {
    var ul = el("ul", "tags");
    items.forEach(function (t) { ul.appendChild(el("li", "", t)); });
    return ul;
  }

  /* ---------- カードのサムネイル ---------- */
  function buildThumb(work, onOpen) {
    var m = work.media || {};
    var box = el("button", "media media-thumb");
    box.type = "button";
    box.tabIndex = -1; // キーボード操作はタイトルのボタンに任せる
    box.setAttribute("aria-hidden", "true");
    if (m.type === "youtube" && m.id) {
      box.classList.add("media-video");
      var yt = "https://i.ytimg.com/vi/" + encodeURIComponent(m.id) + "/";
      box.style.backgroundImage = "url(" + yt + "hqdefault.jpg)";
      // 高解像度(1280x720)のサムネイルがあれば差し替える。ない動画は 120x90 の代替画像が返るので、サイズで見分ける
      var hi = new Image();
      hi.onload = function () { if (hi.naturalWidth > 320) box.style.backgroundImage = "url(" + yt + "maxresdefault.jpg)"; };
      hi.src = yt + "maxresdefault.jpg";
      box.appendChild(el("span", "play"));
    } else if (work.thumb) {
      // 動画がない作品用: 画像(スクリーンショットなど)をサムネイルにする
      box.classList.add("media-video", "media-image");
      box.style.backgroundImage = 'url("' + String(work.thumb).replace(/"/g, "%22") + '")';
    } else {
      box.classList.add("media-empty");
      box.textContent = (m.type === "soundcloud" && m.url) ? "♪ AUDIO" : T.noVideo;
    }
    box.addEventListener("click", onOpen);
    return box;
  }

  /* ---------- 小さなアイコン(汎用の線画。画像に差し替えたいときは data/site.js を参照) ---------- */
  var ICON_PATHS = {
    school: "M2 9l10-5 10 5-10 5-10-5z M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5 M22 9v6",
    calendar: "M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4",
    goal: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z M12 12h.01",
    tools: "M4 7h9 M17 7h3 M4 17h3 M11 17h9 M15 7a2 2 0 1 0 0 .01 M9 17a2 2 0 1 0 0 .01",
    trophy: "M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0z M17 5h3v2a3 3 0 0 1-3 3 M7 5H4v2a3 3 0 0 0 3 3",
    award: "M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0z M17 5h3v2a3 3 0 0 1-3 3 M7 5H4v2a3 3 0 0 0 3 3",
    medal: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M8.5 14 7 21l5-3 5 3-1.5-7",
    star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
    wave: "M3 12h2 M8 7v10 M12 4v16 M16 8v8 M20 10v4",
    keys: "M3 5h18v14H3z M9 5v14 M15 5v14",
    faders: "M6 3v18 M12 3v18 M18 3v18 M4 14h4 M10 8h4 M16 16h4",
    nodes: "M6 8a2 2 0 1 0 0-.01 M18 7a2 2 0 1 0 0-.01 M12 18a2 2 0 1 0 0-.01 M7.6 9.2 10.8 16 M16.7 8.8 13.3 16.2 M8 6.6 16 6.8",
    cube: "M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5 M12 12v9 M12 12 4 7.5",
    dot: "M12 12h.01"
  };
  var TOOL_ICON = { reaper: "wave", "logic": "keys", "pro tools": "faders", protools: "faders", wwise: "nodes", fmod: "nodes", unity: "cube", unreal: "cube" };

  // name が ICON_PATHS のキーなら線画、画像のパス(/ か . を含む)なら <img>
  function iconNode(nameOrPath) {
    var span = el("span", "ic");
    span.setAttribute("aria-hidden", "true");
    if (!nameOrPath) return null;
    if (/[\/.]/.test(nameOrPath)) {
      var img = document.createElement("img");
      img.src = nameOrPath; img.alt = ""; img.loading = "lazy";
      span.appendChild(img);
      return span;
    }
    var d = ICON_PATHS[nameOrPath];
    if (!d) return null;
    span.innerHTML = '<svg viewBox="0 0 24 24" focusable="false"><path d="' + d + '"/></svg>';
    return span;
  }

  function toolIconName(name) {
    var k = String(name).toLowerCase();
    for (var key in TOOL_ICON) if (k.indexOf(key) !== -1) return TOOL_ICON[key];
    return "wave";
  }

  // About の項目名(所属・志望など)の左に小さなアイコンを付ける
  function renderFactIcons() {
    var site = window.SITE || {};
    var custom = site.icons || {};
    [].slice.call(document.querySelectorAll(".facts dt[data-icon]")).forEach(function (dt) {
      var key = dt.getAttribute("data-icon");
      var node = iconNode(custom[key] || key);
      if (node) dt.insertBefore(node, dt.firstChild);
    });
  }

  /* ---------- 詳細ポップアップ(モーダル) ---------- */
  var modal = null;

  function closeModal() {
    if (!modal) return;
    if (typeof modal.dialog.close === "function") {
      if (modal.dialog.open) modal.dialog.close();
    } else {
      modal.dialog.removeAttribute("open");
    }
    cleanupModal();
  }

  function cleanupModal() {
    if (!modal) return;
    modal.media.textContent = ""; // iframe を消して再生を止める
    document.documentElement.classList.remove("modal-open");
  }

  function buildModal() {
    var dialog = el("dialog", "modal");
    dialog.setAttribute("aria-labelledby", "modal-title");

    var panel = el("div", "modal-panel");
    var close = el("button", "modal-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", T.close);
    var media = el("div", "modal-media");
    var body = el("div", "modal-body");

    panel.appendChild(close);
    panel.appendChild(media);
    panel.appendChild(body);
    dialog.appendChild(panel);
    document.body.appendChild(dialog);

    close.addEventListener("click", closeModal);
    // 暗い背景(::backdrop)をクリックしたとき、target は dialog 自身になる
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeModal();
    });
    // Esc キーで閉じたときも後片付けをする
    dialog.addEventListener("close", cleanupModal);

    return { dialog: dialog, panel: panel, media: media, body: body };
  }

  function fillModalMedia(work) {
    var m = work.media || {};
    var frame = null;
    modal.media.textContent = "";
    modal.media.className = "modal-media";

    if (m.type === "youtube" && m.id) {
      frame = document.createElement("iframe");
      frame.className = "modal-frame";
      frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(m.id) + "?autoplay=1&rel=0";
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
    } else if (m.type === "soundcloud" && m.url) {
      frame = document.createElement("iframe");
      frame.className = "modal-frame";
      frame.src = "https://w.soundcloud.com/player/?color=%23ecd06f&visual=false&auto_play=true&url=" + encodeURIComponent(m.url);
      frame.allow = "autoplay";
      modal.media.classList.add("is-audio");
    }

    if (!frame && work.thumb) {
      frame = document.createElement("img");
      frame.className = "modal-image";
      frame.src = work.thumb;
      frame.alt = "";
    }

    if (frame) {
      if (frame.tagName === "IFRAME") frame.title = work.title || "";
      modal.media.appendChild(frame);
      modal.media.hidden = false;
      modal.panel.classList.remove("no-media");
    } else {
      modal.media.hidden = true;
      modal.panel.classList.add("no-media");
    }
  }

  function fillModalBody(work) {
    var body = modal.body;
    body.textContent = "";

    var metaEl = metaNode(work);
    if (metaEl) body.appendChild(metaEl);

    var title = el("h2", "modal-title", work.title || "Untitled");
    title.id = "modal-title";
    body.appendChild(title);

    // details(段落の配列)があればそれを、なければ description を表示
    var paragraphs = (work.details && work.details.length) ? work.details : (work.description ? [work.description] : []);
    paragraphs.forEach(function (t) { body.appendChild(el("p", "modal-text", t)); });

    var facts = el("dl", "modal-facts");
    function addFact(label, node) {
      var row = el("div");
      row.appendChild(el("dt", "", label));
      var dd = el("dd");
      dd.appendChild(node);
      row.appendChild(dd);
      facts.appendChild(row);
    }
    if (work.role) addFact(T.role, document.createTextNode(work.role));
    if (work.tools && work.tools.length) addFact(T.tools, tagList(work.tools));
    if (facts.childNodes.length) body.appendChild(facts);

    var links = visibleLinks(work);
    if (links.length) {
      var row = el("p", "modal-links");
      links.forEach(function (l) {
        var a = el("a", "", l.label || l.url);
        a.href = l.url;
        a.target = "_blank";
        a.rel = "noopener";
        row.appendChild(a);
      });
      body.appendChild(row);
    }
  }

  function openModal(work) {
    if (!modal) modal = buildModal();
    fillModalMedia(work);
    fillModalBody(work);
    modal.dialog.scrollTop = 0;
    document.documentElement.classList.add("modal-open");
    if (typeof modal.dialog.showModal === "function") {
      if (!modal.dialog.open) modal.dialog.showModal();
    } else {
      modal.dialog.setAttribute("open", "");
    }
  }

  /* ---------- 作品カード ---------- */
  function buildCard(work) {
    function open() { openModal(work); }

    var card = el("article", "card");
    var frame = el("div", "thumb-frame");
    frame.appendChild(buildThumb(work, open));
    card.appendChild(frame);

    var body = el("div", "card-body");
    var cardMeta = badgeNode(work);
    if (cardMeta) body.appendChild(cardMeta);

    var h = el("h3", "card-title");
    var titleBtn = el("button", "title-btn", work.title || "Untitled");
    titleBtn.type = "button";
    titleBtn.addEventListener("click", open);
    h.appendChild(titleBtn);
    body.appendChild(h);


    var more = el("button", "more", T.more);
    more.type = "button";
    more.tabIndex = -1;
    more.setAttribute("aria-hidden", "true");
    more.addEventListener("click", open);
    body.appendChild(more);

    card.appendChild(body);
    return card;
  }

  /* ---------- 全作品ページ用の小さなカード ---------- */
  function buildMini(work) {
    function open() { openModal(work); }
    var card = el("article", "mini");
    var frame = el("div", "thumb-frame");
    frame.appendChild(buildThumb(work, open));
    if (work.badge) frame.appendChild(el("span", "badge badge-on", work.badge));
    card.appendChild(frame);
    var body = el("div", "mini-body");
    var h = el("h3", "mini-title");
    var tb = el("button", "title-btn", work.title || "Untitled");
    tb.type = "button";
    tb.addEventListener("click", open);
    h.appendChild(tb);
    body.appendChild(h);
    card.appendChild(body);
    return card;
  }

  /* ---------- ショーケース: 大きなサムネイルが順番に切り替わる ---------- */
  function renderShowcase(box, works) {
    box.className = "showcase";
    box.setAttribute("role", "region");
    box.setAttribute("aria-roledescription", "carousel");
    box.textContent = "";

    var stage = el("div", "showcase-stage");
    var nav = el("div", "showcase-nav");
    var slides = [], tabs = [], idx = 0;

    works.forEach(function (w, i) {
      function open() { openModal(w); }
      var slide = el("div", "slide");
      slide.appendChild(buildThumb(w, open));

      var cap = el("div", "caption");
      var m = badgeNode(w);
      if (m) cap.appendChild(m);
      var h = el("h3", "card-title");
      var tb = el("button", "title-btn", w.title || "Untitled");
      tb.type = "button";
      tb.addEventListener("click", open);
      h.appendChild(tb);
      cap.appendChild(h);
      slide.appendChild(cap);
      stage.appendChild(slide);
      slides.push(slide);

      var tab = el("button", "sc-tab");
      tab.type = "button";
      tab.setAttribute("aria-label", (w.title || "Untitled"));
      // 各作品のサムネイルは一覧に並べたまま、選ばれたものがひとつ上に持ち上がって大きく映る
      var th = el("span", "sc-th");
      var mm = w.media || {};
      if (mm.type === "youtube" && mm.id) th.style.backgroundImage = "url(https://i.ytimg.com/vi/" + encodeURIComponent(mm.id) + "/mqdefault.jpg)";
      else if (w.thumb) th.style.backgroundImage = 'url("' + String(w.thumb).replace(/"/g, "%22") + '")';
      else { th.classList.add("is-empty"); th.textContent = (mm.type === "soundcloud" && mm.url) ? "♪" : "…"; }
      var bar = el("span", "sc-bar");
      bar.appendChild(document.createElement("i"));
      th.appendChild(bar);
      tab.appendChild(th);
      var label = el("span", "sc-label");
      label.appendChild(el("span", "sc-num", (i < 9 ? "0" : "") + (i + 1)));
      label.appendChild(el("span", "sc-name", w.title || "Untitled"));
      tab.appendChild(label);
      tab.addEventListener("click", function () { go(i); });
      nav.appendChild(tab);
      tabs.push(tab);
    });

    function arrow(cls, text, label, step) {
      var b = el("button", "sc-arrow " + cls, text);
      b.type = "button";
      b.setAttribute("aria-label", label);
      b.addEventListener("click", function () { go(idx + step); });
      return b;
    }
    stage.appendChild(arrow("sc-prev", "‹", IS_EN ? "Previous work" : "前の作品", -1));
    stage.appendChild(arrow("sc-next", "›", IS_EN ? "Next work" : "次の作品", 1));

    function go(n) {
      idx = (n + works.length) % works.length;
      slides.forEach(function (s, i) {
        var on = i === idx;
        s.classList.toggle("is-active", on);
        s.inert = !on;
        if (on) s.removeAttribute("aria-hidden"); else s.setAttribute("aria-hidden", "true");
      });
      tabs.forEach(function (t, i) {
        t.classList.remove("is-active");
        if (i === idx) { void t.offsetWidth; t.classList.add("is-active"); t.setAttribute("aria-current", "true"); }
        else t.removeAttribute("aria-current");
      });
    }

    // 自動で次へ: 進行バーのアニメーションが終わったら切り替える(止めると一緒に止まる)
    nav.addEventListener("animationend", function (e) {
      if (e.target && e.target.closest && e.target.closest(".sc-tab.is-active")) go(idx + 1);
    });

    // 一時停止: マウスを乗せている間 / キー操作中 / 画面外 / 詳細表示中 / タブが裏にあるとき
    var hover = false, focus = false, visible = true;
    function syncPause() {
      var modal = document.documentElement.classList.contains("modal-open");
      box.classList.toggle("is-paused", hover || focus || !visible || modal || document.hidden);
    }
    box.addEventListener("mouseenter", function () { hover = true; syncPause(); });
    box.addEventListener("mouseleave", function () { hover = false; syncPause(); });
    box.addEventListener("focusin", function () { focus = true; syncPause(); });
    box.addEventListener("focusout", function () { focus = false; syncPause(); });
    document.addEventListener("visibilitychange", syncPause);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; syncPause(); }, { threshold: 0.35 }).observe(box);
    }
    if ("MutationObserver" in window) {
      new MutationObserver(syncPause).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    }

    // 左右キーと、スマホのスワイプ
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { go(idx - 1); e.preventDefault(); }
      else if (e.key === "ArrowRight") { go(idx + 1); e.preventDefault(); }
    });
    var sx = null;
    stage.addEventListener("pointerdown", function (e) { if (e.pointerType === "touch") sx = e.clientX; });
    stage.addEventListener("pointerup", function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 48) go(idx + (dx < 0 ? 1 : -1));
    });

    box.appendChild(stage);
    box.appendChild(nav);
    go(0);
    syncPause();
  }

  /* ---------- 作品一覧 ---------- */
  function renderWorks() {
    var grid = document.getElementById("works-grid");
    if (!grid) return;

    // draft の空き枠は、確認用に日本語ページだけ表示(英語ページには出ません)
    // 全作品ページ(works/)では全部、トップでは more: true の作品(一覧ページ専用)を除いて表示
    var ARCHIVE = document.body && document.body.getAttribute("data-page") === "works";
    var works = (window.WORKS || [])
      .filter(function (w) { return w && (!w.draft || (window.SHOW_DRAFTS && !IS_EN)) && (ARCHIVE || !w.more); })
      .map(localize);
    // 英語ページだけ: en: { order: 1 } を書いた作品を先頭に(数字が小さい順)。ほかは元の順のまま
    if (IS_EN) {
      works = works
        .map(function (w, i) { return { w: w, k: typeof w.order === "number" ? w.order : 1000 + i }; })
        .sort(function (a, b) { return a.k - b.k; })
        .map(function (x) { return x.w; });
    }
    if (!works.length) {
      grid.appendChild(el("p", "empty", T.empty));
      return;
    }

    if (!ARCHIVE && window.WORKS_LAYOUT !== "grid" && works.length > 1) { renderShowcase(grid, works); return; }

    // 全作品ページ: サムネイル・タイトル・年だけの小さなカード(説明は押すと開く詳細に入っています)
    works.forEach(function (w) { grid.appendChild(ARCHIVE ? buildMini(w) : buildCard(w)); });
  }

  /* ---------- 連絡先 ---------- */
  function renderContact() {
    var site = window.SITE || {};

    var mail = document.getElementById("contact-mail");
    if (mail && site.email) {
      mail.href = "mailto:" + site.email;
      mail.textContent = site.email;
    }

    var list = document.getElementById("contact-links");
    if (list) {
      (site.links || []).forEach(function (l) {
        if (!l || !l.url) return;
        var li = el("li");
        var a = el("a", "", l.label || l.url);
        a.href = l.url;
        a.target = "_blank";
        a.rel = "noopener";
        li.appendChild(a);
        list.appendChild(li);
      });
    }
  }

  /* ---------- 使用ツール(About) ---------- */
  function renderTools() {
    var site = window.SITE || {};
    var row = document.getElementById("tools-row");
    var list = document.getElementById("tool-list");
    if (!row || !list || !site.tools || !site.tools.length) return;
    site.tools.forEach(function (t) {
      var name = typeof t === "string" ? t : (t && t.name);
      if (!name) return;
      var li = el("li");
      var ic = iconNode((t && t.icon) || toolIconName(name));
      if (ic) li.appendChild(ic);
      li.appendChild(document.createTextNode(name));
      list.appendChild(li);
    });
    row.hidden = false;
  }

  /* ---------- 受賞歴(About の使用ツールの下に小さく) ---------- */
  var EXT_ICON = '<svg class="ext-icon" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" focusable="false"><path d="M4.5 2H2.5A1 1 0 0 0 1.5 3v6.5a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1V7.5M7 1.5h3.5V5M10.5 1.5 5.5 6.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function renderAwards() {
    var site = window.SITE || {};
    var list = document.getElementById("award-list");
    var row = document.getElementById("awards-row");
    if (!list || !row) return;
    var items = (site.awards || []).filter(function (a) { return a && a.title; });
    if (!items.length) { row.hidden = true; return; }
    items.forEach(function (a) {
      var li = el("li", "award");
      var t = el("span", "award-title");
      var aic = iconNode(a.icon || "trophy");
      if (aic) t.appendChild(aic);
      t.appendChild(document.createTextNode(a.title));
      if (a.url) {
        // 文字にリンクを張る代わりに、小さな「外部リンク」アイコンを添える
        var link = el("a", "ext-link");
        link.href = a.url; link.target = "_blank"; link.rel = "noopener";
        link.setAttribute("aria-label", a.title + " (外部サイト)");
        link.innerHTML = EXT_ICON;
        t.appendChild(document.createTextNode(" "));
        t.appendChild(link);
      }
      li.appendChild(t);
      if (a.detail) li.appendChild(el("span", "award-detail", a.detail));
      list.appendChild(li);
    });
    row.hidden = false;
  }

  function init() {
    renderWorks();
    renderContact();
    renderTools();
    renderAwards();
    renderFactIcons();
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
