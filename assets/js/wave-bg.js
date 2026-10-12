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
    opacity: 0.5,          // 濃さ(0〜1)
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

  function pointAt(i, t, mirror) {
    var taper = Math.pow(Math.sin(Math.PI * i / (N - 1)), 0.7);
    var d = shape(i, t) * taper;
    return { x: (i / (N - 1)) * w, y: base - (mirror ? -d : d) * amp };
  }

  function path(t, mirror) {
    ctx.beginPath();
    for (var i = 0; i < N; i++) {
      var p = pointAt(i, t, mirror);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }


  /* ---------- 波の上を歩くキャラクターたち(オリジナルのドット絵) ----------
   * # = 金色 / o = 暗い金色 / w = 白(目・ハイライト)。各キャラは2コマで足踏みします。
   * 行を足したり文字を変えたりして、キャラを描き換えられます(幅は12文字)。
   */
  var SPRITES = {
    knight: {
      frames: [[
        "......#.....",
        ".....###....",
        "....#####...",
        "....#oww#...",
        "....#####...",
        "..o.#####.#.",
        ".ooo#####.#.",
        "..o.#####.#.",
        "....#####...",
        "....##.##...",
        "....##.##...",
        "...###.###.."
      ], [
        "......#.....",
        ".....###....",
        "....#####...",
        "....#oww#...",
        "....#####...",
        "..o.#####.#.",
        ".ooo#####.#.",
        "..o.#####.#.",
        "....#####...",
        ".....###....",
        "....##.##...",
        "....#...#..."
      ]]
    },
    mage: {
      frames: [[
        ".....#......",
        "....###.....",
        "...#####....",
        "..#######...",
        "....#oo#....",
        "....#wo#...#",
        "...#####...#",
        "..#######..#",
        "..#######..#",
        "...##.##...#",
        "...##.##...#",
        "..###.###..#"
      ], [
        ".....#......",
        "....###.....",
        "...#####....",
        "..#######...",
        "....#oo#....",
        "....#wo#...#",
        "...#####...#",
        "..#######..#",
        "..#######..#",
        "....###....#",
        "...##.##...#",
        "..##...##..#"
      ]]
    },
    slime: {
      frames: [[
        "....####....",
        "..########..",
        ".##########.",
        ".##w####w##.",
        ".##########.",
        "############"
      ], [
        "............",
        "...######...",
        ".##########.",
        "##w######w##",
        "############",
        "############"
      ]]
    },
    goblin: {
      frames: [[
        "#..#####..#.",
        ".#.#oww#.#..",
        "..#######...",
        "...#####..o.",
        "..#######.o.",
        "..#######.oo",
        "...#####....",
        "...##.##....",
        "..###.###..."
      ], [
        "#..#####..#.",
        ".#.#oww#.#..",
        "..#######...",
        "...#####..o.",
        "..#######.o.",
        "..#######.oo",
        "...#####....",
        "....###.....",
        "...##.##...."
      ]]
    }
  };

  // dir: 1 = 右へ / -1 = 左へ, speed: 1秒あたりの px, gap: 間隔(列の中のずれ)
  var WALKERS = [
    { s: "knight", dir: 1,  speed: 34, off: 0,   beat: 240 },
    { s: "mage",   dir: 1,  speed: 34, off: -86, beat: 260 },
    { s: "knight", dir: 1,  speed: 34, off: -172, beat: 250 },
    { s: "slime",  dir: -1, speed: 22, off: 140, beat: 420 },
    { s: "goblin", dir: -1, speed: 28, off: 520, beat: 230 },
    { s: "slime",  dir: -1, speed: 24, off: 900, beat: 380 }
  ];

  var SPRITE_COL = { "#": "rgb(" + CONFIG.line + ")", "o": "rgba(" + CONFIG.line + ", 0.5)", "w": "rgb(242, 240, 235)" };

  function lineY(x, t) {
    var f = Math.max(0, Math.min(N - 1.001, (x / w) * (N - 1)));
    var i = Math.floor(f), k = f - i;
    var a = pointAt(i, t, false).y, b = pointAt(i + 1, t, false).y;
    return a + (b - a) * k;
  }

  function drawWalkers(t) {
    var px = w < 720 ? 3 : 4;               // ドット1つの大きさ
    var span = w + 300;                      // 画面外から入って画面外へ出る
    ctx.globalAlpha = 0.95;
    for (var k = 0; k < WALKERS.length; k++) {
      var c = WALKERS[k], sp = SPRITES[c.s];
      var run = reduceMotion ? 0 : t * 0.001 * c.speed;
      var u = ((run + c.off) % span + span) % span - 150;
      var x = c.dir > 0 ? u : w - u;
      var y = lineY(x, t);
      var slope = Math.atan2(lineY(x + 8, t) - lineY(x - 8, t), 16);
      slope = Math.max(-0.3, Math.min(0.3, slope * 0.6));
      var frame = sp.frames[reduceMotion ? 0 : (Math.floor(t / c.beat) + k) % 2];
      var hop = reduceMotion ? 0 : Math.abs(Math.sin(t / c.beat * Math.PI)) * 2.5;
      var rows = frame.length, cols = frame[0].length;
      ctx.save();
      ctx.translate(x, y - hop + 1);
      ctx.rotate(slope);
      if (c.dir < 0) ctx.scale(-1, 1);
      for (var r = 0; r < rows; r++) {
        var line = frame[r];
        for (var q = 0; q < line.length; q++) {
          var ch = line.charAt(q);
          if (ch === ".") continue;
          ctx.fillStyle = SPRITE_COL[ch];
          ctx.fillRect(Math.round((q - cols / 2) * px), Math.round((r - rows) * px), px + 0.6, px + 0.6);
        }
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = CONFIG.opacity;

    ctx.strokeStyle = "rgba(242, 240, 235, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, base); ctx.lineTo(w, base);
    ctx.stroke();

    ctx.strokeStyle = "rgba(" + CONFIG.line + ", 0.16)";
    path(t, true);

    ctx.strokeStyle = "rgb(" + CONFIG.line + ")";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    path(t, false);

    ctx.globalAlpha = 1;
    drawWalkers(t);
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
