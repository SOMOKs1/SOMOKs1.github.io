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

  function metaNode(work) {
    if (!work.category && !work.year) return null;
    var p = el("p", "card-meta");
    if (work.year) p.appendChild(el("span", "year", work.year));
    if (work.category) p.appendChild(el("span", "category", work.category));
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

    if (work.tags && work.tags.length) body.appendChild(tagList(work.tags));

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
    var cardMeta = metaNode(work);
    if (cardMeta) body.appendChild(cardMeta);

    var h = el("h3", "card-title");
    var titleBtn = el("button", "title-btn", work.title || "Untitled");
    titleBtn.type = "button";
    titleBtn.addEventListener("click", open);
    h.appendChild(titleBtn);
    body.appendChild(h);

    if (work.description) body.appendChild(el("p", "card-desc", work.description));
    if (work.tags && work.tags.length) body.appendChild(tagList(work.tags));

    var more = el("button", "more", T.more);
    more.type = "button";
    more.tabIndex = -1;
    more.setAttribute("aria-hidden", "true");
    more.addEventListener("click", open);
    body.appendChild(more);

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
      var m = metaNode(w);
      if (m) cap.appendChild(m);
      var h = el("h3", "card-title");
      var tb = el("button", "title-btn", w.title || "Untitled");
      tb.type = "button";
      tb.addEventListener("click", open);
      h.appendChild(tb);
      cap.appendChild(h);
      if (w.description) cap.appendChild(el("p", "card-desc", w.description));
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

  /* ---------- 作品一覧(作品が7件以上でタグ絞り込みが自動で出ます) ---------- */
  function renderWorks() {
    var grid = document.getElementById("works-grid");
    var filterBox = document.getElementById("works-filter");
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

    function draw(tag) {
      grid.textContent = "";
      works
        .filter(function (w) { return !tag || (w.tags || []).indexOf(tag) !== -1; })
        .forEach(function (w) { grid.appendChild(buildCard(w)); });
    }

    var allTags = [];
    works.forEach(function (w) {
      (w.tags || []).forEach(function (t) {
        if (allTags.indexOf(t) === -1) allTags.push(t);
      });
    });

    if (filterBox && (ARCHIVE || works.length > 6) && allTags.length > 1) {
      var buttons = [];
      [T.all].concat(allTags).forEach(function (label, i) {
        var b = el("button", "chip" + (i === 0 ? " is-active" : ""), label);
        b.type = "button";
        b.addEventListener("click", function () {
          buttons.forEach(function (x) { x.classList.remove("is-active"); });
          b.classList.add("is-active");
          draw(i === 0 ? "" : label);
        });
        buttons.push(b);
        filterBox.appendChild(b);
      });
    }

    draw("");
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
    site.tools.forEach(function (name) { list.appendChild(el("li", "", name)); });
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
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
