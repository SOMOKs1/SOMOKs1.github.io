/*
 * ページ背景に流れる波形(装飾のみ)。
 * - クリックやマウスには反応しません。ゆっくり流れるだけです。
 * - 最初の画面(ヒーロー)の後ろに見え、下のセクションが上に重なると隠れます。
 * 色や強さを変えたいときは、下の CONFIG だけ触れば大丈夫です。
 */
(function () {
  "use strict";

  var canvas = document.getElementById("bg-wave");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  var CONFIG = {
    points: 220,           // 波形の細かさ
    line: "236, 208, 111", // 波形の色 (R, G, B)
    opacity: 0.62,         // 濃さ(0〜1)
    speed: 1               // 流れる速さ(0 で止まる)
  };

  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  var N = CONFIG.points;
  var w = 0, h = 0, dpr = 1, base = 0, amp = 0;
  var raf = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    base = h * (w < 720 ? 0.74 : 0.7);
    amp = Math.max(40, Math.min(h * 0.19, 160));
    if (reduceMotion) draw(0); else kick();
  }

  function shape(i, t) {
    t *= CONFIG.speed;
    return 0.13 * Math.sin(i * 0.07 + t * 0.0014) * Math.sin(i * 0.021 - t * 0.0006) +
           0.05 * Math.sin(i * 0.19 - t * 0.002);
  }

  // 一定間隔で「ヒット音」が鳴ったように、波紋が左右に広がって消えていく
  var pulses = [], nextPulse = 0;
  function updatePulses(t) {
    if (t >= nextPulse) {
      pulses.push({ x: 0.15 + Math.random() * 0.7, t0: t });
      nextPulse = t + 2400 + Math.random() * 2400;
    }
    pulses = pulses.filter(function (p) { return t - p.t0 < 4500; });
  }
  function pulseAt(u) {
    var v = 0;
    for (var k = 0; k < pulses.length; k++) {
      var p = pulses[k], age = (pulseT - p.t0) / 1000, d = Math.abs(u - p.x), r = age * 0.17;
      var e = Math.exp(-Math.pow((d - r) / 0.055, 2)) * Math.exp(-age * 0.65);
      v += 0.42 * e * Math.sin(d * 75 - age * 16);
    }
    return v;
  }
  var pulseT = 0;

  function taperAt(i) { return Math.pow(Math.sin(Math.PI * i / (N - 1)), 0.7); }

  // layer: 主線 / 奥の2本(位相をずらして、少し小さく)
  var LAYERS = [
    { off: 0,     gain: 1,    alpha: 1,    width: 2   },
    { off: 5200,  gain: 0.72, alpha: 0.28, width: 1.2 },
    { off: -7400, gain: 0.5,  alpha: 0.16, width: 1   }
  ];

  function valueAt(i, t, L) {
    var u = i / (N - 1);
    return (shape(i, t + L.off) * L.gain + pulseAt(u) * (L.gain === 1 ? 1 : 0.45)) * taperAt(i);
  }

  function path(t, L, mirror) {
    ctx.beginPath();
    for (var i = 0; i < N; i++) {
      var d = valueAt(i, t, L);
      var x = (i / (N - 1)) * w, y = base - (mirror ? -d : d) * amp;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  var BARS = 110;
  function draw(t) {
    pulseT = t;
    if (!reduceMotion) updatePulses(t);
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = CONFIG.opacity;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = "rgba(242, 240, 235, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, base); ctx.lineTo(w, base);
    ctx.stroke();

    // 再生ヘッドが左から右へゆっくり走り、通った所のバーが明るくなる
    var sp = CONFIG.speed;
    var ph = reduceMotion ? -1 : ((t * sp / 9000) % 1.3) - 0.15;

    // イコライザーのバー(波の大きさに合わせて上下に伸びる)
    ctx.lineWidth = 2;
    for (var j = 0; j < BARS; j++) {
      var u = j / (BARS - 1), fi = u * (N - 1);
      var env = Math.abs(shape(fi, t) + pulseAt(u)) * 1.5;
      var hh = (env * amp + 3 + 7 * (0.5 + 0.5 * Math.sin(j * 1.7 + t * sp * 0.004))) * taperAt(fi);
      var a = 0.15 + 0.55 * Math.exp(-Math.pow((u - ph) / 0.045, 2));
      ctx.strokeStyle = "rgba(" + CONFIG.line + ", " + a.toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(u * w, base - hh); ctx.lineTo(u * w, base + hh);
      ctx.stroke();
    }

    // 奥の線 → 主線の順に重ねる(反転した細い線も1本)
    for (var k = LAYERS.length - 1; k >= 0; k--) {
      var L = LAYERS[k];
      ctx.strokeStyle = "rgba(" + CONFIG.line + ", " + (L.alpha * (k === 0 ? 1 : 1)).toFixed(3) + ")";
      ctx.lineWidth = L.width;
      path(t, L, false);
      if (k === 0) { ctx.strokeStyle = "rgba(" + CONFIG.line + ", 0.16)"; ctx.lineWidth = 1; path(t, L, true); }
    }

    // 再生ヘッド(細い縦線 + 主線との交点の光)
    if (ph >= 0 && ph <= 1) {
      var px = ph * w, pi = ph * (N - 1);
      var py = base - valueAt(pi, t, LAYERS[0]) * amp;
      ctx.strokeStyle = "rgba(" + CONFIG.line + ", 0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, base - amp * 1.5); ctx.lineTo(px, base + amp * 1.5); ctx.stroke();
      ctx.fillStyle = "rgba(" + CONFIG.line + ", 0.25)";
      ctx.beginPath(); ctx.arc(px, py, 9, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "rgb(" + CONFIG.line + ")";
      ctx.beginPath(); ctx.arc(px, py, 3.2, 0, 6.2832); ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  // ヒーローが下のセクションに完全に隠れたら描画を止めて省電力
  function heroVisible() {
    return window.scrollY < h;
  }

  // ヒーローから離れるにつれて、波形をすっと消していく(セクションに背景がないため)
  function fade() {
    var o = 1 - window.scrollY / (h * 0.8);
    canvas.style.opacity = o < 0 ? 0 : o > 1 ? 1 : o.toFixed(3);
  }

  function frame(now) {
    raf = 0;
    if (document.hidden || !heroVisible()) return;
    draw(now);
    raf = requestAnimationFrame(frame);
  }

  function kick() {
    if (reduceMotion) return;
    if (!raf) raf = requestAnimationFrame(frame);
  }

  document.addEventListener("visibilitychange", kick);
  window.addEventListener("scroll", function () { fade(); kick(); }, { passive: true });

  var resizeTimer = 0;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 80);
  });

  resize();
})();
