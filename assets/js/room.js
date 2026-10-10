/* =========================================================================
   Phòng cưới — mặt bằng SVG + phối cảnh 3D.

   Một nguồn số liệu duy nhất: layout(dims) trả về vị trí cửa, cửa sổ và đồ
   đạc (đơn vị mét). Mặt bằng SVG và phối cảnh 3D đều vẽ từ đó, nên đổi số đo
   ở ô nhập là cả hai cùng cập nhật.

   Hệ trục (nhìn từ trên xuống):
     x: 0 = tường phía sân (3 cửa)  →  W = tường đầu giường (tường đặc)
     z: 0 = tường cửa sổ nhỏ        →  L = tường bếp cũ
     y: chiều cao
   3D cần three.js r128 (bản global). Nếu CDN không tải được, phần 3D hiện
   thông báo, mặt bằng vẫn chạy.
   ========================================================================= */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KEY = 'wnc:room';
  var H = 3.0; // trần sau khi làm thạch cao

  // Số đo thật theo gạch lát 40 × 40 cm: 7,2 × 20 viên, vách cũ ở viên thứ 10.
  var DEFAULT = { W: 2.88, L: 8, P: 4 };
  var LIMITS = { W: [2.6, 5], L: [7, 10], P: [3.8, 6] };
  var VERSION = 2; // tăng khi DEFAULT đổi, để số cũ đã lưu không đè số đo mới

  var PALETTES = {
    kem: {
      name: 'Kem & gỗ sồi', note: 'Ấm, sáng, dễ sống lâu. Hợp phòng ít nắng.',
      wall: '#efe6da', floor: '#b98a5e', slat: '#b5895a', backing: '#6d5544',
      head: '#d8c8b2', bed: '#f7f2ea', duvet: '#e8ddcd', accent: '#8e3b46',
      wood: '#c29b6c', wardrobe: '#ece4d8', sofa: '#cbb79d', rug: '#d9ccb8'
    },
    sage: {
      name: 'Xanh sage', note: 'Mát mắt, thư giãn. Hợp phòng nóng, hướng Tây.',
      wall: '#e5e9de', floor: '#c6a27b', slat: '#8ea489', backing: '#55654f',
      head: '#b8c3af', bed: '#f8f6f0', duvet: '#dfe5d5', accent: '#c4835e',
      wood: '#cfae86', wardrobe: '#f1f1ea', sofa: '#9eaf94', rug: '#e1dbcb'
    },
    hong: {
      name: 'Hồng phấn', note: 'Ngọt, đậm không khí cưới. Nên giữ tường sáng.',
      wall: '#f2e6e2', floor: '#9b7154', slat: '#d4b0a6', backing: '#7b5350',
      head: '#e2c3bc', bed: '#fcf7f4', duvet: '#efd8d2', accent: '#b5476a',
      wood: '#a97d5d', wardrobe: '#f6eeea', sofa: '#d8b8af', rug: '#ead8d1'
    }
  };

  var store = {
    get: function () { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } },
    set: function (v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  };

  var saved = store.get();
  var savedDims = saved.v === VERSION ? saved : {};
  var dims = {
    W: num(savedDims.W, DEFAULT.W, LIMITS.W),
    L: num(savedDims.L, DEFAULT.L, LIMITS.L),
    P: num(savedDims.P, DEFAULT.P, LIMITS.P)
  };
  dims.P = Math.min(dims.P, dims.L - 2);
  var state = {
    plan: 'moi',
    palette: PALETTES[saved.palette] ? saved.palette : 'kem',
    night: false,
    wedding: false
  };

  function num(v, d, lim) {
    var n = parseFloat(v);
    if (!isFinite(n)) return d;
    return Math.min(lim[1], Math.max(lim[0], Math.round(n * 100) / 100));
  }
  function persist() { store.set({ v: VERSION, W: dims.W, L: dims.L, P: dims.P, palette: state.palette }); }
  var vn = function (n) { return String(Math.round(n * 100) / 100).replace('.', ','); };

  /* ---------------------------------------------------------------------
     1. Bố cục
     --------------------------------------------------------------------- */
  function layout(d) {
    var W = d.W, L = d.L, P = d.P;

    // Ba cửa cùng nằm trên tường phía sân, đều 80 × 190 cm, có ô kính phía trên.
    // Đánh số 1 → 3 từ tường cửa sổ nhỏ sang tường bếp cũ (theo số đo đã gửi):
    //   cửa 1 cách tường cửa sổ nhỏ 55 cm · mảng tường dưới điều hoà 160 cm ·
    //   cửa 2 hai cánh · cửa 3 cách tường bếp cũ 220 cm, là lối ra nhà tắm.
    var d1 = { wall: 'A', from: 0.55, to: 1.35, bottom: 0, top: 1.9, head: 2.3, kind: 'door', label: 'Cửa 1' };
    var d2 = { wall: 'A', from: 2.95, to: 3.75, bottom: 0, top: 1.9, head: 2.3, kind: 'door2', label: 'Cửa 2' };
    // Cửa 3 là cửa đôi mở ra ngoài, nên trong phòng không có vùng quét cánh.
    var d3 = { wall: 'A', from: L - 3.0, to: L - 2.2, bottom: 0, top: 1.9, head: 2.3, kind: 'door2', outward: true, label: 'Cửa 3 · ra nhà tắm' };
    // Phương án mới: xây bậu nửa dưới cửa 1, thành cửa sổ (giữ ánh sáng, bớt một lối ra ngoài).
    var w1 = { wall: 'A', from: 0.55, to: 1.35, bottom: 0.9, top: 2.3, kind: 'window', label: 'Cửa 1 → cửa sổ' };
    var winB = { wall: 'B', from: W / 2 - 0.4, to: W / 2 + 0.4, bottom: 1.9, top: 2.5, kind: 'window' };
    // Cửa sổ chỗ bồn rửa cũ: 80 × 100 cm, ở góc phía tường sân (cạnh cửa 3). Bậu ước 1,1 m.
    var winK = { wall: 'K', from: 0.55, to: 1.35, bottom: 1.1, top: 2.1, kind: 'window' };
    var sinkC = (winK.from + winK.to) / 2;
    var ventK = { wall: 'K', from: 1.6, to: 2.1, bottom: 2.35, top: 2.75, kind: 'window' };
    var common = [winB, winK, ventK];


    // --- Phương án mới ---
    // Giường nằm gọn trên mảng tường giữa cửa 1 và cửa 2, chân giường nhìn vào TV.
    var tvC = (d1.to + d2.from) / 2;
    var bed = { x0: W - 2.08, x1: W, z0: tvC - 0.9, z1: tvC + 0.9 };
    // Nửa bếp cũ — phương án "góc nắng cô dâu" (chấm điểm cao nhất trong 3 phương án):
    // tủ áo tường C, bàn trang điểm phủ trọn cửa sổ góc A–K, ghế văng có hộc ở góc C–K,
    // gương treo tường A cạnh bàn, lối từ giường ra cửa 3 để trống hoàn toàn.
    var wrLen = Math.max(0.6, Math.min(2.3, L - P - 1.7)); // chừa ≥ 1,6 m cho góc trà ở cuối phòng
    var wardrobe = { x0: W - 0.6, x1: W, z0: P + 0.1, z1: P + 0.1 + wrLen };
    var desk = { x0: winK.from - 0.15, x1: winK.to + 0.13, z0: L - 0.45, z1: L };
    var sofa = { x0: Math.max(desk.x1 + 0.06, W - 1.34), x1: W - 0.04, z0: L - 0.75, z1: L };
    var featZ0 = Math.max(0.05, bed.z0 - 0.65), featZ1 = Math.min(P - 0.05, bed.z1 + 0.65);

    var moi = [
      { id: 'bed', n: 1, name: 'Giường 1m8 × 2m, đầu bọc nỉ, canh giữa mảng tường giữa cửa 1 và cửa 2', x0: bed.x0, x1: bed.x1, z0: bed.z0, z1: bed.z1, kind: 'bed' },
      { id: 'ns1', n: 2, name: 'Tab đầu giường treo tường + đèn thả (×2), gầm tab để loa sub', x0: W - 0.45, x1: W, z0: bed.z0 - 0.5, z1: bed.z0 - 0.05, kind: 'wood' },
      { id: 'ns2', n: 2, name: '', x0: W - 0.45, x1: W, z0: bed.z1 + 0.05, z1: bed.z1 + 0.5, kind: 'wood' },
      { id: 'feat', n: 3, name: 'Vách lam gỗ + LED hắt sau đầu giường', x0: W - 0.06, x1: W, z0: featZ0, z1: featZ1, kind: 'feat' },
      { id: 'tv', n: 4, name: 'TV 50" treo sát mảng tường 160 cm, dưới điều hoà', x0: 0, x1: 0.08, z0: tvC - 0.6, z1: tvC + 0.6, kind: 'tv' },
      { id: 'rug', n: 5, name: 'Thảm trải dưới giường', x0: Math.max(0.15, bed.x0 - 0.5), x1: W - 0.75, z0: bed.z0 - 0.35, z1: bed.z1 + 0.35, kind: 'rug' },
      { id: 'wr', n: 6, name: 'Tủ quần áo cửa lùa ' + vn(wrLen) + ' m, hộc nóc kịch trần 3 m', x0: wardrobe.x0, x1: wardrobe.x1, z0: wardrobe.z0, z1: wardrobe.z1, kind: 'wardrobe' },
      { id: 'mirror', n: 7, name: 'Gương toàn thân treo tường, cạnh bàn trang điểm', x0: 0, x1: 0.05, z0: L - 1.1, z1: L - 0.55, kind: 'mirror' },
      { id: 'desk', n: 8, name: 'Bàn trang điểm / làm việc dưới cửa sổ 80 × 100', x0: desk.x0, x1: desk.x1, z0: desk.z0, z1: desk.z1, kind: 'wood' },
      { id: 'stool', n: 0, name: '', x0: sinkC - 0.22, x1: sinkC + 0.22, z0: L - 0.9, z1: L - 0.5, kind: 'stool' },
      { id: 'sofa', n: 9, name: 'Ghế văng 2 chỗ có hộc + bàn trà Ø42 + đèn đọc sách', x0: sofa.x0, x1: sofa.x1, z0: sofa.z0, z1: sofa.z1, kind: 'sofa' },
      { id: 'table', n: 0, name: '', x0: W - 1.13, x1: W - 0.71, z0: L - 1.55, z1: L - 1.13, kind: 'round' },
      { id: 'rug2', n: 0, name: '', x0: Math.max(desk.x1 + 0.05, W - 1.55), x1: W - 0.1, z0: Math.max(wardrobe.z1 + 0.05, L - 1.75), z1: L - 0.1, kind: 'rug' },
      { id: 'plant', n: 10, name: 'Cây xanh ×2: cạnh cửa sổ mới và góc bàn trang điểm', x0: 0.08, x1: 0.48, z0: 0.08, z1: 0.48, kind: 'plant' },
      { id: 'plant2', n: 10, name: '', x0: 0.03, x1: 0.35, z0: L - 0.4, z1: L - 0.05, kind: 'plant' },
      { id: 'shoe', n: 11, name: 'Tủ giày + móc khăn sát cửa 3 (lối ra nhà tắm)', x0: 0, x1: 0.32, z0: Math.max(d3.to + 0.1, P + 0.1), z1: Math.min(Math.max(d3.to + 1.0, P + 1.0), L - 1.15), kind: 'wood' }, // dừng trước gương
      { id: 'hooks', n: 11, name: '', x0: 0, x1: 0.06, z0: Math.max(P + 0.1, d2.to + 0.05, d3.from - 0.45), z1: d3.from - 0.05, kind: 'hooks' }
    ];

    // Móc khăn chỉ có khi còn đủ ≥ 20 cm tường giữa vách cũ và cửa 3
    moi = moi.filter(function (it) { return it.id !== 'hooks' || it.z1 - it.z0 >= 0.2; });

    // --- Hiện trạng ---
    var cu = [
      { id: 'obed', n: 1, name: 'Giường cũ 1m6, kê dọc tường cửa sổ nhỏ', x0: W - 2.0, x1: W, z0: 0.05, z1: 1.65, kind: 'bed' },
      { id: 'otv', n: 2, name: 'Tủ TV + loa', x0: W - 0.45, x1: W, z0: 1.85, z1: Math.min(P - 0.1, 3.15), kind: 'wood' },
      { id: 'ochair', n: 3, name: 'Ghế gỗ + quạt cây', x0: 0.3, x1: 0.7, z0: 0.08, z1: 0.48, kind: 'stool' },
      { id: 'opart', n: 4, name: 'Vách nhôm kính + cửa (sẽ tháo)', x0: 0, x1: W, z0: P - 0.04, z1: P + 0.04, kind: 'partition', door: { from: 0.45, to: 1.15 } },
      { id: 'otable', n: 5, name: 'Bàn ăn oval + 6 ghế', x0: W * 0.45 - 0.8, x1: W * 0.45 + 0.8, z0: P + 0.35, z1: P + 1.25, kind: 'round' },
      { id: 'ocounter', n: 6, name: 'Bệ bếp xây + bồn rửa + bếp gas (chuyển ra ngoài)', x0: 0.5, x1: W - 0.3, z0: L - 0.6, z1: L, kind: 'counter' },
      { id: 'opur', n: 7, name: 'Máy lọc nước', x0: 0.05, x1: 0.45, z0: L - 0.45, z1: L - 0.05, kind: 'wood' },
      { id: 'ofan', n: 8, name: 'Quạt treo tường', x0: 0, x1: 0.25, z0: d3.from - 0.6, z1: d3.from - 0.2, kind: 'fan' }
    ];

    return {
      W: W, L: L, P: P, moi: moi, cu: cu, tvC: tvC, bed: bed, sinkC: sinkC, sofa: sofa, wardrobe: wardrobe,
      d3: d3,
      openings: [w1, d2, d3].concat(common),
      openingsCu: [d1, d2, d3].concat(common)
    };
  }

  /* ---------------------------------------------------------------------
     2. Mặt bằng SVG
     --------------------------------------------------------------------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  var S = 100, M = 0.75, T = 0.12;

  function el(name, attrs, text) {
    var e = document.createElementNS(SVGNS, name);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }

  function renderPlan() {
    var host = $('#plan');
    if (!host) return;
    var lay = layout(dims), W = lay.W, L = lay.L, P = lay.P;
    var mode = state.plan;
    var X = function (z) { return (M + z) * S; };
    var Y = function (x) { return (M + W - x) * S; };
    var vbW = (L + 2 * M) * S, vbH = (W + 2 * M) * S;

    var svg = el('svg', { viewBox: '0 0 ' + vbW + ' ' + vbH, role: 'img', class: 'plan__svg',
      'aria-label': (mode === 'moi' ? 'Mặt bằng sau cải tạo' : 'Mặt bằng hiện trạng') + ', phòng ' + vn(W) + ' × ' + vn(L) + ' mét' });

    // Sàn
    if (mode === 'cu') {
      svg.appendChild(el('rect', { x: X(0), y: Y(W), width: P * S, height: W * S, class: 'pl-floor pl-floor--brown' }));
      svg.appendChild(el('rect', { x: X(P), y: Y(W), width: (L - P) * S, height: W * S, class: 'pl-floor pl-floor--teal' }));
    } else {
      svg.appendChild(el('rect', { x: X(0), y: Y(W), width: L * S, height: W * S, class: 'pl-floor pl-floor--wood' }));
      svg.appendChild(el('rect', { x: X(0), y: Y(W), width: P * S, height: W * S, class: 'pl-zone pl-zone--sleep' }));
      svg.appendChild(el('rect', { x: X(P), y: Y(W), width: (L - P) * S, height: W * S, class: 'pl-zone pl-zone--live' }));
    }

    // Tường
    svg.appendChild(el('rect', { x: X(0) - T * S / 2, y: Y(W) - T * S / 2, width: L * S + T * S, height: W * S + T * S, class: 'pl-wall' }));

    // Cửa & cửa sổ
    (mode === 'moi' ? lay.openings : lay.openingsCu).forEach(function (o) {
      if (o.label) svg.appendChild(el('text', { x: X((o.from + o.to) / 2), y: Y(0) + T * S / 2 + (o.outward ? 58 : 18), class: 'pl-door pl-center' }, o.label)); // cửa mở ra ngoài: chữ nằm dưới cung mở
      var g = el('g', { class: 'pl-open pl-open--' + o.kind });
      var a, b, isZ = o.wall === 'A' || o.wall === 'C';
      if (isZ) {
        var yw = o.wall === 'A' ? Y(0) : Y(W);
        a = X(o.from); b = X(o.to);
        g.appendChild(el('rect', { x: a, y: yw - T * S / 2 - 1, width: b - a, height: T * S + 2, class: 'pl-gap' }));
        if (o.kind === 'window') {
          g.appendChild(el('line', { x1: a, y1: yw, x2: b, y2: yw, class: 'pl-glass' }));
        } else {
          var dir = (o.wall === 'A' ? -1 : 1) * (o.outward ? -1 : 1); // cửa mở ra ngoài vẽ cung phía ngoài tường
          var leaves = o.kind === 'door2' ? [[a, (a + b) / 2, 1], [b, (a + b) / 2, -1]] : [[a, b, 1]];
          leaves.forEach(function (lf) {
            var hx = lf[0], len = Math.abs(lf[1] - lf[0]), s = lf[2];
            g.appendChild(el('line', { x1: hx, y1: yw, x2: hx, y2: yw + dir * len, class: 'pl-leaf' }));
            g.appendChild(el('path', { d: 'M' + hx + ' ' + (yw + dir * len) + ' A' + len + ' ' + len + ' 0 0 ' + (dir * s > 0 ? 0 : 1) + ' ' + (hx + s * len) + ' ' + yw, class: 'pl-swing' }));
          });
        }
      } else {
        var xw = o.wall === 'B' ? X(0) : X(L);
        a = Y(o.to); b = Y(o.from);
        g.appendChild(el('rect', { x: xw - T * S / 2 - 1, y: a, width: T * S + 2, height: b - a, class: 'pl-gap' }));
        g.appendChild(el('line', { x1: xw, y1: a, x2: xw, y2: b, class: 'pl-glass' }));
        if (o.bottom > 2) g.setAttribute('class', g.getAttribute('class') + ' pl-open--high');
      }
      svg.appendChild(g);
    });

    // Vách cũ (ở mặt bằng mới: nét đứt)
    if (mode === 'moi') {
      svg.appendChild(el('line', { x1: X(P), y1: Y(W), x2: X(P), y2: Y(0), class: 'pl-oldwall' }));
      // Nhãn viết dọc theo nét đứt, nằm trong phòng, để không đụng nhãn cửa và điều hoà dưới tường
      var vx = X(P) + 16, vy = Y(W * 0.42);
      svg.appendChild(el('text', { x: vx, y: vy, class: 'pl-small pl-center pl-rose', transform: 'rotate(-90 ' + vx + ' ' + vy + ')' }, 'vách cũ · 2 lớp rèm'));
    }

    // Điều hoà 9.000 BTU inverter giữ nguyên trên mảng tường 160 cm, phía trên TV (vẽ nét đứt).
    svg.appendChild(el('rect', { x: X(lay.tvC - 0.4), y: Y(0) - 52, width: 80, height: 18, rx: 3, class: 'pl-ac' })); // lùi vào để không đè số của TV
    svg.appendChild(el('text', { x: X(lay.tvC), y: Y(0) + T * S / 2 + 38, class: 'pl-small pl-center' }, mode === 'moi' ? 'điều hoà (giữ nguyên)' : 'điều hoà (trên cao)'));

    // Đồ đạc
    var items = mode === 'moi' ? lay.moi : lay.cu;
    items.forEach(function (it) {
      var x = X(it.z0), y = Y(it.x1), w = (it.z1 - it.z0) * S, h = (it.x1 - it.x0) * S;
      var g = el('g', { class: 'pl-item pl-item--' + it.kind, 'data-item': it.id });
      if (it.kind === 'round') {
        g.appendChild(el('ellipse', { cx: x + w / 2, cy: y + h / 2, rx: w / 2, ry: h / 2 }));
      } else if (it.kind === 'partition') {
        var d = it.door;
        g.appendChild(el('rect', { x: x, y: Y(W), width: w, height: (W - d.to) * S }));
        g.appendChild(el('rect', { x: x, y: Y(d.from), width: w, height: d.from * S }));
      } else if (it.kind === 'plant') {
        g.appendChild(el('circle', { cx: x + w / 2, cy: y + h / 2, r: Math.min(w, h) / 2 }));
      } else {
        g.appendChild(el('rect', { x: x, y: y, width: w, height: h, rx: it.kind === 'rug' ? 4 : 3 }));
      }
      if (it.kind === 'bed') {
        // gối ở đầu giường (phía tường x lớn)
        var pw = Math.min(0.65, (it.z1 - it.z0) / 2 - 0.1) * S;
        g.appendChild(el('rect', { x: x + 10, y: y + 14, width: pw, height: 30, rx: 8, class: 'pl-pillow' }));
        g.appendChild(el('rect', { x: x + w - 10 - pw, y: y + 14, width: pw, height: 30, rx: 8, class: 'pl-pillow' }));
      }
      if (it.n) {
        var cx = x + w / 2, cy = y + h / 2;
        if (it.kind === 'partition') { cx = x + w / 2; cy = Y(W) + 60; }
        if (it.kind === 'feat') { cx = x + w / 2; cy = y + 22; }
        if (it.kind === 'tv') { cy = y + h - 18; }
        if (it.kind === 'mirror' || it.kind === 'hooks') { cy = y - 20; }
        g.appendChild(el('circle', { cx: cx, cy: cy, r: 15, class: 'pl-badge' }));
        g.appendChild(el('text', { x: cx, y: cy + 5.5, class: 'pl-badge-t' }, String(it.n)));
      }
      svg.appendChild(g);
    });

    // Kích thước
    var dimY = Y(W) - T * S / 2 - 30;
    svg.appendChild(el('line', { x1: X(0), y1: dimY, x2: X(L), y2: dimY, class: 'pl-dim' }));
    svg.appendChild(el('text', { x: X(L / 2), y: dimY - 8, class: 'pl-dimt pl-center' }, vn(L) + ' m'));
    if (mode === 'cu') {
      svg.appendChild(el('text', { x: X(P / 2), y: dimY + 22, class: 'pl-small pl-center' }, 'phòng ngủ ' + vn(P) + ' m'));
      svg.appendChild(el('text', { x: X(P + (L - P) / 2), y: dimY + 22, class: 'pl-small pl-center' }, 'ăn + bếp ' + vn(L - P) + ' m'));
    } else {
      svg.appendChild(el('text', { x: X(P / 2), y: dimY + 22, class: 'pl-zone-label pl-center' }, 'KHU NGỦ'));
      svg.appendChild(el('text', { x: X(P + (L - P) / 2), y: dimY + 22, class: 'pl-zone-label pl-center' }, 'THAY ĐỒ · NGỒI NGHỈ'));
    }
    var dimX = X(0) - T * S / 2 - 30;
    svg.appendChild(el('line', { x1: dimX, y1: Y(W), x2: dimX, y2: Y(0), class: 'pl-dim' }));
    svg.appendChild(el('text', { x: dimX - 8, y: Y(W / 2), class: 'pl-dimt pl-center', transform: 'rotate(-90 ' + (dimX - 8) + ' ' + Y(W / 2) + ')' }, vn(W) + ' m'));

    // Tên tường
    svg.appendChild(el('text', { x: X(P / 2), y: Y(0) + T * S / 2 + 64, class: 'pl-wallname pl-center' }, 'PHÍA SÂN')); // tránh nhãn cửa 3 ở phòng ngắn
    svg.appendChild(el('text', { x: X(L) + T * S / 2 + 30, y: Y(W / 2), class: 'pl-wallname pl-center', transform: 'rotate(90 ' + (X(L) + T * S / 2 + 30) + ' ' + Y(W / 2) + ')' }, 'TƯỜNG BẾP CŨ'));

    // Diện tích
    svg.appendChild(el('text', { x: X(L), y: dimY - 8, class: 'pl-area' }, vn(Math.round(W * L * 10) / 10) + ' m²'));

    host.innerHTML = '';
    host.appendChild(svg);

    // Chú thích
    var legend = $('#planLegend');
    if (legend) {
      legend.innerHTML = '';
      items.filter(function (it) { return it.n && it.name; }).forEach(function (it) {
        var li = document.createElement('li');
        li.innerHTML = '<span class="plan__num">' + it.n + '</span><span></span>';
        li.lastChild.textContent = it.name;
        legend.appendChild(li);
      });
    }
    var area = $('#roomArea');
    if (area) area.textContent = vn(Math.round(W * L * 10) / 10) + ' m²';
  }

  function initPlan() {
    $$('[data-plan-tab]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.plan = b.getAttribute('data-plan-tab');
        $$('[data-plan-tab]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var cap = $('#planCaption');
        if (cap) cap.textContent = state.plan === 'moi'
          ? 'Sau cải tạo: bỏ vách, bếp ra ngoài, cả phòng lát một loại sàn gỗ.'
          : 'Hiện trạng như mình hiểu từ ảnh và video. Chỗ nào sai anh báo để vẽ lại.';
        renderPlan();
      });
    });

    var form = $('#dimsForm');
    if (form) {
      ['W', 'L', 'P'].forEach(function (k) { form.elements[k].value = dims[k]; });
      var apply = function () {
        dims.W = num(form.elements.W.value, dims.W, LIMITS.W);
        dims.L = num(form.elements.L.value, dims.L, LIMITS.L);
        dims.P = Math.min(num(form.elements.P.value, dims.P, LIMITS.P), dims.L - 2);
        persist();
        renderPlan();
        if (three) three.rebuild();
      };
      form.addEventListener('change', apply);
      form.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
      var reset = $('#dimsReset');
      if (reset) reset.addEventListener('click', function () {
        dims.W = DEFAULT.W; dims.L = DEFAULT.L; dims.P = DEFAULT.P;
        ['W', 'L', 'P'].forEach(function (k) { form.elements[k].value = dims[k]; });
        persist();
        renderPlan();
        if (three) three.rebuild();
      });
    }
    renderPlan();
  }

  /* ---------------------------------------------------------------------
     3. Bảng màu
     --------------------------------------------------------------------- */
  var SWATCH_KEYS = [['wall', 'Tường'], ['floor', 'Sàn'], ['slat', 'Vách lam'], ['head', 'Đầu giường'], ['wood', 'Đồ gỗ'], ['accent', 'Điểm nhấn']];

  function renderSwatches() {
    var host = $('#paletteCards');
    if (!host) return;
    host.innerHTML = '';
    Object.keys(PALETTES).forEach(function (k) {
      var p = PALETTES[k];
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'pal';
      card.setAttribute('data-palette', k);
      card.setAttribute('aria-pressed', String(state.palette === k));
      var chips = SWATCH_KEYS.map(function (s) {
        return '<span class="pal__chip" style="background:' + p[s[0]] + '"><span>' + s[1] + '</span></span>';
      }).join('');
      card.innerHTML = '<span class="pal__chips">' + chips + '</span><span class="pal__name"></span><span class="pal__note"></span>';
      $('.pal__name', card).textContent = p.name;
      $('.pal__note', card).textContent = p.note;
      card.addEventListener('click', function () { setPalette(k); });
      host.appendChild(card);
    });
  }

  function setPalette(k) {
    state.palette = k;
    persist();
    $$('[data-palette]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-palette') === k)); });
    if (three) three.recolor();
  }

  /* ---------------------------------------------------------------------
     4. Dự trù chi phí
     --------------------------------------------------------------------- */
  function initBudget() {
    var rows = $$('[data-cost]');
    if (!rows.length) return;
    var out = $('#costTotal'), outN = $('#costCount');
    var update = function () {
      var lo = 0, hi = 0, n = 0;
      rows.forEach(function (r) {
        var cb = $('input', r);
        r.setAttribute('data-off', String(!cb.checked));
        if (cb.checked) { lo += +r.getAttribute('data-lo'); hi += +r.getAttribute('data-hi'); n++; }
      });
      if (out) out.textContent = lo + '–' + hi + ' triệu';
      if (outN) outN.textContent = n + '/' + rows.length + ' hạng mục';
    };
    rows.forEach(function (r) { $('input', r).addEventListener('change', update); });
    update();
  }

  /* ---------------------------------------------------------------------
     5. Phối cảnh 3D
     --------------------------------------------------------------------- */
  var three = null;

  function initThree() {
    var host = $('#view3d');
    if (!host) return;
    var fail = function (msg) {
      host.setAttribute('data-state', 'error');
      var m = $('#view3dMsg');
      if (m) m.textContent = msg;
    };
    if (typeof window.THREE === 'undefined') {
      fail('Chưa tải được thư viện 3D (cần mạng). Mặt bằng phía trên vẫn xem được bình thường.');
      return;
    }
    try {
      three = makeThree(host);
      host.setAttribute('data-state', 'ready');
    } catch (e) {
      fail('Trình duyệt này không hỗ trợ WebGL nên không hiện được 3D. Thử mở bằng Chrome hoặc Safari bản mới.');
    }
  }

  function makeThree(host) {
    var T3 = window.THREE;
    var canvasHost = $('#view3dCanvas');
    var renderer = new T3.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = T3.sRGBEncoding;
    renderer.toneMapping = T3.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T3.PCFSoftShadowMap;
    canvasHost.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', 'Phối cảnh 3D phòng cưới. Kéo để xoay, cuộn để phóng to thu nhỏ.');
    renderer.domElement.setAttribute('role', 'img');

    var scene = new T3.Scene();
    var camera = new T3.PerspectiveCamera(50, 1, 0.05, 100);

    // --- Vật liệu dùng chung (đổi bảng màu chỉ cần đổi màu) ---
    var col = function (hex) { return new T3.Color(hex).convertSRGBToLinear(); };
    var std = function (hex, o) {
      var m = new T3.MeshStandardMaterial(Object.assign({ color: col(hex), roughness: 0.85, metalness: 0 }, o || {}));
      return m;
    };
    var mats = {
      wall: std('#efe6da', { roughness: 0.95 }),
      floor: std('#ffffff', { roughness: 0.7 }),
      slat: std('#b5895a', { roughness: 0.6 }),
      backing: std('#6d5544'),
      head: std('#d8c8b2', { roughness: 1 }),
      bed: std('#f7f2ea', { roughness: 1 }),
      duvet: std('#e8ddcd', { roughness: 1 }),
      accent: std('#8e3b46', { roughness: 1 }),
      wood: std('#c29b6c', { roughness: 0.55 }),
      wardrobe: std('#ece4d8', { roughness: 0.5 }),
      sofa: std('#cbb79d', { roughness: 1 }),
      rug: std('#d9ccb8', { roughness: 1 }),
      white: std('#f4f4f2', { roughness: 0.4 }),
      black: std('#141414', { roughness: 0.3, metalness: 0.2 }),
      screen: std('#1d2430', { roughness: 0.15, metalness: 0.3 }),
      glass: new T3.MeshStandardMaterial({ color: col('#cfe3ea'), roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.35 }),
      frame: std('#e9e9e6', { roughness: 0.4 }),
      doorWood: std('#6b4a33', { roughness: 0.6 }),
      mirror: std('#cbd8de', { roughness: 0.08, metalness: 0.25 }),
      metal: std('#b89a6a', { roughness: 0.35, metalness: 0.8 }),
      sheer: new T3.MeshStandardMaterial({ color: col('#fbf8f2'), roughness: 1, transparent: true, opacity: 0.55, side: T3.DoubleSide }),
      leaf: std('#4f7a45', { roughness: 0.9 }),
      pot: std('#d9d2c5', { roughness: 0.8 }),
      red: std('#b3232c', { roughness: 0.9 }),
      gold: std('#d7a53a', { roughness: 0.5, metalness: 0.4 }),
      led: new T3.MeshBasicMaterial({ color: col('#ffd9a0') }),
      bulb: new T3.MeshStandardMaterial({ color: col('#fff3df'), emissive: col('#ffc87a'), emissiveIntensity: 0.4, roughness: 0.4 }),
      ground: std('#d8d2c8', { roughness: 1 })
    };

    // Vân sàn gỗ vẽ bằng canvas (ván 20 cm, dài 1,2 m, so le).
    var floorCanvas = document.createElement('canvas');
    floorCanvas.width = floorCanvas.height = 512;
    var floorTex = new T3.CanvasTexture(floorCanvas);
    floorTex.wrapS = floorTex.wrapT = T3.RepeatWrapping;
    floorTex.encoding = T3.sRGBEncoding;
    floorTex.anisotropy = renderer.capabilities.getMaxAnisotropy ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 1;
    mats.floor.map = floorTex;

    function paintFloor(hex) {
      var c = floorCanvas.getContext('2d');
      var base = new T3.Color(hex);
      var seed = 7;
      var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
      var cols = 6, pw = 512 / cols;
      for (var i = 0; i < cols; i++) {
        var off = (i % 3) * 170;
        for (var j = -1; j < 2; j++) {
          var y0 = j * 512 + off;
          var tone = base.clone().offsetHSL((rnd() - 0.5) * 0.02, (rnd() - 0.5) * 0.06, (rnd() - 0.5) * 0.07);
          c.fillStyle = tone.getStyle();
          c.fillRect(i * pw, y0, pw, 512);
          c.strokeStyle = 'rgba(60,35,15,.10)';
          c.lineWidth = 1;
          for (var g = 0; g < 7; g++) {
            var gx = i * pw + 6 + rnd() * (pw - 12);
            c.beginPath();
            c.moveTo(gx, y0);
            c.bezierCurveTo(gx + 4, y0 + 150, gx - 4, y0 + 330, gx + 2, y0 + 512);
            c.stroke();
          }
          c.fillStyle = 'rgba(40,20,5,.35)';
          c.fillRect(i * pw, y0, pw, 2);
        }
        c.fillStyle = 'rgba(40,20,5,.30)';
        c.fillRect(i * pw, 0, 2, 512);
      }
      floorTex.needsUpdate = true;
    }

    // Chữ Hỷ cho chế độ "trang trí ngày cưới"
    function hyTexture() {
      var cv = document.createElement('canvas');
      cv.width = cv.height = 256;
      var c = cv.getContext('2d');
      c.fillStyle = '#b3232c';
      c.font = 'bold 210px "Noto Serif CJK SC","Songti SC","SimSun","Microsoft YaHei",serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('囍', 128, 140);
      var t = new T3.CanvasTexture(cv);
      t.encoding = T3.sRGBEncoding;
      return t;
    }
    var hyMat = new T3.MeshBasicMaterial({ map: hyTexture(), transparent: true });

    // --- Ánh sáng ---
    var hemi = new T3.HemisphereLight(0xfffaf2, 0x8a7a68, 0.75);
    scene.add(hemi);
    var sun = new T3.DirectionalLight(0xfff0dc, 0.75);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.bias = -0.0005;
    sun.shadow.radius = 4;
    scene.add(sun);
    scene.add(sun.target);
    var nightLights = [];

    // --- Điều khiển camera ---
    var target = new T3.Vector3();
    var sph = { r: 9, theta: -1.1, phi: 0.95 };
    var anim = null;
    var dirty = true;

    function placeCamera() {
      var s = Math.sin(sph.phi);
      camera.position.set(
        target.x + sph.r * s * Math.sin(sph.theta),
        target.y + sph.r * Math.cos(sph.phi),
        target.z + sph.r * s * Math.cos(sph.theta)
      );
      camera.lookAt(target);
    }

    function presets(lay) {
      var W = lay.W, L = lay.L, P = lay.P;
      // Màn hình dọc (điện thoại): lùi xa hơn, và nhìn từ trên thì xoay phòng cho chiều dài nằm dọc.
      var tall = camera.aspect < 1, far = tall ? Math.min(1.7, 0.85 / camera.aspect) : 1;
      return {
        tong: { target: [W / 2, 0.6, L / 2], pos: [W / 2 - (W / 2 + L * 0.55) * far, L * 0.95 * far, L / 2 + L * 0.45 * far] },
        tren: tall
          ? { target: [W / 2, 0, L / 2], pos: [W / 2, L * 1.45 * far * 0.8, L / 2 + 0.12] }
          : { target: [W / 2, 0, L / 2], pos: [W / 2 - 0.12, Math.max(6.5, L * 1.05), L / 2] },
        giuong: { target: [W - 0.4, 1.0, lay.bed.z0 + 0.9], pos: [0.35, 1.55, lay.bed.z0 + 0.9 + 0.15] },
        nhinra: { target: [0.9, 0.9, L - 0.9], pos: [W - 0.7, 1.6, Math.max(0.5, lay.bed.z0 - 0.2)] },
        thaydo: { target: [W - 0.9, 1.0, L - 0.6], pos: [0.45, 1.6, P + 0.1] },
        // đứng phía đầu giường nhìn ra cửa 1 (đã thành cửa sổ) và mảng tường TV
        cua1: { target: [0, 1.25, 1.0], pos: [W - 0.25, 1.55, 2.35] }
      };
    }

    function goTo(name, instant) {
      var p = presets(layout(dims))[name];
      if (!p) return;
      var t1 = new T3.Vector3().fromArray(p.target);
      var off = new T3.Vector3().fromArray(p.pos).sub(t1);
      var r1 = off.length();
      var to = { r: r1, theta: Math.atan2(off.x, off.z), phi: Math.acos(Math.max(-1, Math.min(1, off.y / r1))) };
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (instant || reduce) {
        target.copy(t1); sph.r = to.r; sph.theta = to.theta; sph.phi = to.phi;
        anim = null; dirty = true; return;
      }
      var dth = to.theta - sph.theta;
      while (dth > Math.PI) dth -= 2 * Math.PI;
      while (dth < -Math.PI) dth += 2 * Math.PI;
      anim = { t0: performance.now(), dur: 700, from: { t: target.clone(), r: sph.r, theta: sph.theta, phi: sph.phi }, to: { t: t1, r: to.r, theta: sph.theta + dth, phi: to.phi } };
      dirty = true;
    }

    var cv = renderer.domElement;
    var pointers = {};
    var pinch = 0;
    cv.addEventListener('pointerdown', function (e) {
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      try { cv.setPointerCapture(e.pointerId); } catch (err) {}
      anim = null;
    });
    cv.addEventListener('pointermove', function (e) {
      var p = pointers[e.pointerId];
      if (!p) return;
      var ids = Object.keys(pointers);
      if (ids.length === 2) {
        var a = pointers[ids[0]], b = pointers[ids[1]];
        p.x = e.clientX; p.y = e.clientY;
        var d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch) zoom(pinch / d);
        pinch = d;
        return;
      }
      var dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      sph.theta -= dx * 0.008;
      sph.phi = Math.min(1.5, Math.max(0.06, sph.phi - dy * 0.006));
      dirty = true;
    });
    var up = function (e) { delete pointers[e.pointerId]; pinch = 0; };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', function (e) {
      e.preventDefault();
      zoom(1 + Math.max(-0.3, Math.min(0.3, e.deltaY * 0.0012)));
    }, { passive: false });

    function zoom(f) {
      sph.r = Math.min(18, Math.max(0.6, sph.r * f));
      anim = null;
      dirty = true;
    }

    // --- Dựng phòng ---
    var room = null;
    var walls = [];

    function add(parent, geo, mat, x, y, z, opts) {
      var m = new T3.Mesh(geo, mat);
      m.position.set(x, y, z);
      if (!opts || opts.shadow !== false) { m.castShadow = true; m.receiveShadow = true; }
      parent.add(m);
      return m;
    }
    // Hộp theo toạ độ góc: [x0,x1] × [y0,y1] × [z0,z1]
    function box(parent, mat, x0, x1, y0, y1, z0, z1, opts) {
      var g = new T3.BoxGeometry(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0));
      return add(parent, g, mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, opts);
    }
    function cyl(parent, mat, r, h, x, y0, z, seg) {
      return add(parent, new T3.CylinderGeometry(r, r, h, seg || 32), mat, x, y0 + h / 2, z);
    }

    // Rèm: một dãy ống mảnh xếp sát nhau trông như nếp vải. axis = trục mà rèm chạy dọc theo,
    // plane = toạ độ của trục còn lại (vd. axis 'x', plane = z của mặt rèm).
    function drape(parent, axis, plane, u0, u1, y0, y1) {
      var n = Math.max(3, Math.round((u1 - u0) / 0.045));
      var step = (u1 - u0) / n, h = y1 - y0;
      var geo = new T3.CylinderGeometry(step * 0.75, step * 0.75, h, 10, 1, true);
      for (var i = 0; i < n; i++) {
        var u = u0 + step * (i + 0.5), wob = (i % 2 ? 0.018 : -0.018);
        var m = new T3.Mesh(geo, mats.sheer);
        if (axis === 'x') m.position.set(u, y0 + h / 2, plane + wob);
        else m.position.set(plane + wob, y0 + h / 2, u);
        parent.add(m);
      }
    }

    function build() {
      var lay = layout(dims), W = lay.W, L = lay.L, P = lay.P;
      if (room) {
        scene.remove(room);
        room.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
      }
      nightLights.forEach(function (l) { scene.remove(l); });
      nightLights = [];
      room = new T3.Group();
      walls = [];
      scene.add(room);

      // Nền ngoài + sàn
      box(room, mats.ground, -6, W + 6, -0.08, -0.06, -6, L + 6, { shadow: false });
      var floor = box(room, mats.floor, 0, W, -0.05, 0, 0, L);
      floor.castShadow = false;
      floorTex.repeat.set(W / 1.2, L / 1.2);

      // Tường
      var t = 0.12;
      var defs = {
        A: { normal: [-1, 0, 0], len: [-t, L + t], center: [-t / 2, H / 2, L / 2] },
        C: { normal: [1, 0, 0], len: [-t, L + t], center: [W + t / 2, H / 2, L / 2] },
        B: { normal: [0, 0, -1], len: [0, W], center: [W / 2, H / 2, -t / 2] },
        K: { normal: [0, 0, 1], len: [0, W], center: [W / 2, H / 2, L + t / 2] }
      };
      Object.keys(defs).forEach(function (k) {
        var d = defs[k];
        var g = new T3.Group();
        var wm = mats.wall.clone();
        wm.transparent = true;
        g.userData = { normal: new T3.Vector3().fromArray(d.normal), center: new T3.Vector3().fromArray(d.center), mat: wm, ghost: null };
        room.add(g);
        walls.push(g);
        var ops = lay.openings.filter(function (o) { return o.wall === k; }).sort(function (a, b) { return a.from - b.from; });
        // u: toạ độ dọc tường; trả về hộp tường đoạn u0..u1, cao y0..y1
        var seg = function (u0, u1, y0, y1) {
          if (u1 - u0 < 0.001 || y1 - y0 < 0.001) return null;
          var m;
          if (k === 'A') m = box(g, wm, -t, 0, y0, y1, u0, u1);
          else if (k === 'C') m = box(g, wm, W, W + t, y0, y1, u0, u1);
          else if (k === 'B') m = box(g, wm, u0, u1, y0, y1, -t, 0);
          else m = box(g, wm, u0, u1, y0, y1, L, L + t);
          m.userData.seg = true;
          return m;
        };
        var cur = d.len[0];
        ops.forEach(function (o) {
          seg(cur, o.from, 0, H);
          seg(o.from, o.to, 0, o.bottom);
          seg(o.from, o.to, o.head || o.top, H);
          cur = o.to;
          fillOpening(g, k, o, W, L);
        });
        seg(cur, d.len[1], 0, H);
        // Len chân tường gỗ + đường LED hắt trần
        var inset = 0.012;
        if (k === 'A') { box(g, mats.wood, 0, inset, 0, 0.08, 0, L, { shadow: false }); box(g, mats.led, 0, 0.02, H - 0.04, H - 0.02, 0.05, L - 0.05, { shadow: false }); }
        if (k === 'C') { box(g, mats.wood, W - inset, W, 0, 0.08, 0, L, { shadow: false }); box(g, mats.led, W - 0.02, W, H - 0.04, H - 0.02, 0.05, L - 0.05, { shadow: false }); }
        if (k === 'B') { box(g, mats.wood, 0, W, 0, 0.08, 0, inset, { shadow: false }); box(g, mats.led, 0.05, W - 0.05, H - 0.04, H - 0.02, 0, 0.02, { shadow: false }); }
        if (k === 'K') { box(g, mats.wood, 0, W, 0, 0.08, L - inset, L, { shadow: false }); box(g, mats.led, 0.05, W - 0.05, H - 0.04, H - 0.02, L - 0.02, L, { shadow: false }); }
      });
      // Chân tường thấp luôn hiện (để khi ẩn tường vẫn thấy ranh giới)
      box(room, mats.wall, -t, 0, 0, 0.14, -t, L + t, { shadow: false });
      box(room, mats.wall, W, W + t, 0, 0.14, -t, L + t, { shadow: false });
      box(room, mats.wall, 0, W, 0, 0.14, -t, 0, { shadow: false });
      box(room, mats.wall, 0, W, 0, 0.14, L, L + t, { shadow: false });

      buildFurniture(lay);

      // Mặt trời chiếu từ phía sân
      sun.position.set(-4, 6.5, L * 0.3);
      sun.target.position.set(W / 2, 0, L / 2);
      var sc = sun.shadow.camera;
      sc.left = -L * 0.75; sc.right = L * 0.75; sc.top = L * 0.75; sc.bottom = -L * 0.75; sc.near = 0.5; sc.far = 25;
      sc.updateProjectionMatrix();

      applyMode();
      dirty = true;
    }

    function fillOpening(g, k, o, W, L) {
      var w = o.to - o.from;
      // đặt một hộp mỏng trong ô cửa; u là toạ độ dọc tường
      var pane = function (mat, u0, u1, y0, y1, th, off) {
        th = th || 0.04; off = off || -0.06;
        if (k === 'A') return box(g, mat, off - th / 2, off + th / 2, y0, y1, u0, u1, { shadow: false });
        if (k === 'C') return box(g, mat, W - off - th / 2, W - off + th / 2, y0, y1, u0, u1, { shadow: false });
        if (k === 'B') return box(g, mat, u0, u1, y0, y1, off - th / 2, off + th / 2, { shadow: false });
        return box(g, mat, u0, u1, y0, y1, L - off - th / 2, L - off + th / 2, { shadow: false });
      };
      if (o.kind === 'window') {
        pane(mats.frame, o.from, o.to, o.bottom, o.bottom + 0.04, 0.1);
        pane(mats.frame, o.from, o.to, o.top - 0.04, o.top, 0.1);
        pane(mats.frame, o.from, o.from + 0.04, o.bottom, o.top, 0.1);
        pane(mats.frame, o.to - 0.04, o.to, o.bottom, o.top, 0.1);
        pane(mats.glass, o.from, o.to, o.bottom, o.top, 0.01);
        return;
      }
      // Ở phương án mới, cửa nào còn lại cũng là cửa đôi gỗ kính (cửa 2, cửa 3).
      var mid = (o.from + o.to) / 2;
      [[o.from, mid], [mid, o.to]].forEach(function (lf) {
        pane(mats.doorWood, lf[0] + 0.01, lf[1] - 0.01, 0, o.top, 0.045);
        for (var r = 0; r < 3; r++) {
          var y0 = 0.85 + r * 0.33;
          pane(mats.glass, lf[0] + 0.07, lf[1] - 0.07, y0, y0 + 0.26, 0.05, -0.06);
        }
      });
      if (o.head) {
        pane(mats.frame, o.from, o.to, o.top, o.top + 0.05, 0.1);
        pane(mats.glass, o.from, o.to, o.top + 0.05, o.head, 0.02);
      }
    }

    function buildFurniture(lay) {
      var W = lay.W, L = lay.L, P = lay.P;
      var get = function (id) { return lay.moi.filter(function (i) { return i.id === id; })[0]; };
      var R = room;

      // --- Vách lam gỗ đầu giường ---
      var f = get('feat');
      box(R, mats.backing, W - 0.02, W, 0.08, 2.7, f.z0, f.z1, { shadow: false });
      for (var z = f.z0 + 0.03; z < f.z1 - 0.03; z += 0.1) {
        box(R, mats.slat, W - 0.055, W - 0.02, 0.08, 2.7, z, z + 0.045);
      }
      var ledTop = box(R, mats.led, W - 0.07, W - 0.06, 2.68, 2.7, f.z0, f.z1, { shadow: false });
      ledTop.userData.led = true;

      // --- Giường ---
      var b = lay.bed;
      var bx0 = b.x0, bx1 = b.x1 - 0.1, bz0 = b.z0, bz1 = b.z1, bcx = (bx0 + bx1) / 2, bcz = (bz0 + bz1) / 2;
      box(R, mats.head, b.x1 - 0.1, b.x1 - 0.06, 0.1, 1.2, bz0 - 0.1, bz1 + 0.1); // tấm đầu giường
      for (var hz = bz0; hz <= bz1 + 0.001; hz += (bz1 - bz0 + 0.2) / 6) {
        box(R, mats.backing, b.x1 - 0.105, b.x1 - 0.1, 0.12, 1.18, hz - 0.1, hz - 0.095, { shadow: false });
      }
      box(R, mats.head, bx0, bx1, 0.06, 0.34, bz0, bz1); // khung bọc nỉ
      box(R, mats.bed, bx0 + 0.02, bx1, 0.34, 0.56, bz0 + 0.02, bz1 - 0.02); // nệm
      var duvet = box(R, mats.duvet, bx0, bx1 - 0.55, 0.3, 0.6, bz0 - 0.01, bz1 + 0.01);
      duvet.userData.role = 'duvet';
      var throwM = box(R, mats.accent, bx0 + 0.12, bx0 + 0.55, 0.29, 0.615, bz0 - 0.02, bz1 + 0.02);
      throwM.userData.role = 'throw';
      [bz0 + 0.45, bz1 - 0.45].forEach(function (pz) {
        var pl = box(R, mats.bed, bx1 - 0.45, bx1 - 0.08, 0.56, 0.72, pz - 0.33, pz + 0.33);
        pl.userData.role = 'pillow';
        var cu = box(R, mats.accent, bx1 - 0.55, bx1 - 0.45, 0.58, 0.88, pz - 0.2, pz + 0.2);
        cu.rotation.z = 0.25;
        cu.userData.role = 'cushion';
      });
      // Cánh hoa trái tim (chỉ hiện khi bật trang trí ngày cưới)
      var petals = new T3.Group();
      petals.userData.wedding = true;
      var petalGeo = new T3.CylinderGeometry(0.035, 0.035, 0.008, 10);
      for (var i = 0; i < 40; i++) {
        var tt = (i / 40) * Math.PI * 2;
        var hx = 16 * Math.pow(Math.sin(tt), 3), hy = 13 * Math.cos(tt) - 5 * Math.cos(2 * tt) - 2 * Math.cos(3 * tt) - Math.cos(4 * tt);
        var pm = new T3.Mesh(petalGeo, mats.red);
        pm.position.set(bcx - 0.15 + hy * 0.022, 0.605, bcz + hx * 0.022);
        petals.add(pm);
      }
      R.add(petals);
      var hy = new T3.Mesh(new T3.PlaneGeometry(0.8, 0.8), hyMat);
      hy.rotation.y = -Math.PI / 2;
      hy.position.set(W - 0.06, 1.9, bcz);
      hy.userData.wedding = true;
      R.add(hy);

      // --- Tab đầu giường + đèn thả ---
      // Loa sub của bộ loa cũ: đặt dưới gầm tab treo phía tường cửa sổ nhỏ (kệ TV cũ không mang vào phòng)
      var n1 = get('ns1');
      box(R, mats.black, W - 0.4, W - 0.06, 0, 0.36, (n1.z0 + n1.z1) / 2 - 0.13, (n1.z0 + n1.z1) / 2 + 0.13);

      ['ns1', 'ns2'].forEach(function (id) {
        var n = get(id);
        box(R, mats.wood, n.x0, n.x1 - 0.02, 0.38, 0.56, n.z0, n.z1);
        box(R, mats.backing, n.x0 - 0.001, n.x0, 0.47, 0.475, n.z0 + 0.04, n.z1 - 0.04, { shadow: false });
        var pz = (n.z0 + n.z1) / 2, px = (n.x0 + n.x1) / 2 - 0.02;
        cyl(R, mats.black, 0.004, H - 1.12, px, 1.12, pz, 6).castShadow = false;
        var bulb = new T3.Mesh(new T3.SphereGeometry(0.09, 24, 16), mats.bulb);
        bulb.position.set(px, 1.05, pz);
        R.add(bulb);
        var pl = new T3.PointLight(0xffb873, 0, 3.2, 2);
        pl.position.set(px, 0.98, pz);
        scene.add(pl);
        nightLights.push(pl);
        // sách + lọ hoa nhỏ
        box(R, mats.accent, n.x0 + 0.08, n.x0 + 0.26, 0.56, 0.6, n.z0 + 0.08, n.z0 + 0.22);
      });

      // --- TV + kệ treo + loa ---
      var tv = get('tv'), tz = (tv.z0 + tv.z1) / 2;
      box(R, mats.black, 0.02, 0.05, 1.0, 1.64, tz - 0.56, tz + 0.56);
      box(R, mats.screen, 0.05, 0.052, 1.02, 1.62, tz - 0.54, tz + 0.54, { shadow: false });
      box(R, mats.black, 0.02, 0.09, 0.9, 0.96, tz - 0.45, tz + 0.45); // loa thanh treo dưới TV
      // Điều hoà 9.000 BTU inverter giữ nguyên chỗ cũ, phía trên TV
      box(R, mats.white, 0, 0.22, 2.35, 2.65, tz - 0.42, tz + 0.42);

      // --- Thảm ---
      ['rug', 'rug2'].forEach(function (id) {
        var r = get(id);
        var m = box(R, mats.rug, r.x0, r.x1, 0, 0.012, r.z0, r.z1, { shadow: false });
        m.receiveShadow = true;
      });

      // --- Tủ quần áo cửa lùa ---
      var w = get('wr');
      box(R, mats.wardrobe, w.x0 + 0.02, w.x1, 0.06, H - 0.02, w.z0, w.z1);
      var nPanel = w.z1 - w.z0 > 1.8 ? 3 : 2, pw = (w.z1 - w.z0) / nPanel;
      for (var k = 0; k < nPanel; k++) {
        var z0 = w.z0 + k * pw, front = k % 2 ? w.x0 + 0.02 : w.x0;
        box(R, k === 1 ? mats.wood : mats.wardrobe, front - 0.02, front, 0.08, 2.38, z0 + 0.005, z0 + pw - 0.005);
        box(R, mats.metal, front - 0.03, front - 0.02, 0.9, 1.5, z0 + pw - 0.07, z0 + pw - 0.055, { shadow: false });
        // hộc nóc cánh lật 2,4–3,0 m
        box(R, mats.wardrobe, w.x0 - 0.02, w.x0, 2.42, H - 0.04, z0 + 0.005, z0 + pw - 0.005);
      }
      var toe = box(R, mats.led, w.x0 + 0.03, w.x0 + 0.05, 0.05, 0.06, w.z0, w.z1, { shadow: false }); // LED hắt chân tủ
      toe.userData.led = true;

      // --- Gương toàn thân ---
      var mi = get('mirror');
      // lưng gương màu sáng (khi tường sân mờ đi, nhìn từ ngoài không thành một tấm sẫm)
      box(R, mats.frame, 0, 0.025, 0.3, 2.0, mi.z0, mi.z1, { shadow: false });
      box(R, mats.mirror, 0.025, 0.03, 0.32, 1.98, mi.z0 + 0.02, mi.z1 - 0.02, { shadow: false });
      [[0.3, 0.32], [1.98, 2.0]].forEach(function (yy) { box(R, mats.metal, 0.02, 0.035, yy[0], yy[1], mi.z0, mi.z1, { shadow: false }); });
      [mi.z0, mi.z1 - 0.02].forEach(function (zz) { box(R, mats.metal, 0.02, 0.035, 0.3, 2.0, zz, zz + 0.02, { shadow: false }); });

      // --- Bàn trang điểm + ghế + gương tròn ---
      var d = get('desk'), dcx = (d.x0 + d.x1) / 2;
      box(R, mats.wood, d.x0, d.x1, 0.72, 0.76, d.z0, d.z1 - 0.01);
      box(R, mats.wardrobe, d.x0 + 0.02, d.x1 - 0.02, 0.58, 0.72, d.z0 + 0.02, d.z1 - 0.01);
      // gương LED để bàn (thấp hơn bậu cửa sổ để không che sáng)
      cyl(R, mats.metal, 0.06, 0.02, dcx - 0.3, 0.76, L - 0.25, 16);
      cyl(R, mats.metal, 0.01, 0.12, dcx - 0.3, 0.78, L - 0.25, 8);
      var rm = new T3.Mesh(new T3.CylinderGeometry(0.13, 0.13, 0.015, 40), mats.mirror);
      rm.rotation.x = Math.PI / 2;
      rm.position.set(dcx - 0.3, 0.98, L - 0.25);
      R.add(rm);
      box(R, mats.accent, dcx + 0.15, dcx + 0.35, 0.76, 0.8, L - 0.35, L - 0.2);
      var st = get('stool');
      cyl(R, mats.sofa, 0.21, 0.45, (st.x0 + st.x1) / 2, 0, (st.z0 + st.z1) / 2);
      // rèm cuốn trên cửa sổ (cửa sổ hai cánh mở ra ngoài nên không vướng bàn)
      var wk = lay.openings.filter(function (o) { return o.kind === 'window' && o.wall === 'K' && o.bottom < 2; })[0];
      box(R, mats.sheer, wk.from - 0.05, wk.to + 0.05, wk.top - 0.25, wk.top + 0.08, L - 0.1, L - 0.02, { shadow: false });

      // --- Ghế văng có hộc (lưng tựa tường bếp cũ) + bàn trà + đèn đọc sách ---
      var s = get('sofa'), smz = (s.z0 + s.z1) / 2;
      box(R, mats.sofa, s.x0, s.x1, 0.06, 0.44, s.z0 + 0.05, s.z1 - 0.02);
      box(R, mats.backing, s.x0 + 0.02, s.x1 - 0.02, 0.06, 0.1, s.z0 + 0.04, s.z0 + 0.06, { shadow: false }); // khe hộc
      box(R, mats.sofa, s.x0, s.x1, 0.06, 0.86, s.z1 - 0.18, s.z1 - 0.02);
      box(R, mats.sofa, s.x0, s.x0 + 0.12, 0.06, 0.62, s.z0 + 0.05, s.z1 - 0.02);
      box(R, mats.sofa, s.x1 - 0.12, s.x1, 0.06, 0.62, s.z0 + 0.05, s.z1 - 0.02);
      var sMid = (s.x0 + s.x1) / 2;
      box(R, mats.bed, s.x0 + 0.13, sMid - 0.01, 0.44, 0.52, s.z0 + 0.06, s.z1 - 0.18);
      box(R, mats.bed, sMid + 0.01, s.x1 - 0.13, 0.44, 0.52, s.z0 + 0.06, s.z1 - 0.18);
      var cuS = box(R, mats.accent, s.x0 + 0.18, s.x0 + 0.52, 0.52, 0.82, s.z1 - 0.32, s.z1 - 0.2);
      cuS.rotation.x = 0.2;
      var tb = get('table'), tcx = (tb.x0 + tb.x1) / 2, tcz = (tb.z0 + tb.z1) / 2;
      cyl(R, mats.wood, (tb.x1 - tb.x0) / 2, 0.03, tcx, 0.42, tcz, 48);
      cyl(R, mats.metal, 0.025, 0.42, tcx, 0, tcz, 12);
      cyl(R, mats.metal, 0.16, 0.015, tcx, 0, tcz, 24);
      cyl(R, mats.pot, 0.05, 0.16, tcx + 0.06, 0.45, tcz, 16);
      // đèn tường đọc sách trên tay ghế (tường C)
      var lz = s.z1 - 0.4;
      box(R, mats.metal, W - 0.03, W, 1.35, 1.45, lz - 0.04, lz + 0.04);
      box(R, mats.metal, W - 0.22, W - 0.03, 1.42, 1.44, lz - 0.01, lz + 0.01);
      var shade = add(R, new T3.CylinderGeometry(0.07, 0.1, 0.14, 24, 1, true), mats.bulb, W - 0.24, 1.33, lz);
      shade.material = mats.bulb;
      var fl = new T3.PointLight(0xffb873, 0, 3, 2);
      fl.position.set(W - 0.3, 1.25, lz);
      scene.add(fl);
      nightLights.push(fl);

      // --- Tủ giày + móc khăn cạnh cửa 3 ---
      var sh = get('shoe');
      box(R, mats.wardrobe, sh.x0, sh.x1, 0.1, 0.88, sh.z0, sh.z1);
      box(R, mats.wood, sh.x0, sh.x1 + 0.01, 0.88, 0.91, sh.z0, sh.z1);
      for (var sl = 0; sl < 4; sl++) { // khe thoáng trên cánh lật
        box(R, mats.backing, sh.x1, sh.x1 + 0.003, 0.6 + sl * 0.05, 0.62 + sl * 0.05, sh.z0 + 0.1, sh.z1 - 0.1, { shadow: false });
      }
      var hk = get('hooks');
      if (hk) box(R, mats.wood, 0, 0.03, 1.62, 1.7, hk.z0, hk.z1);
      for (var hi = 0; hk && hi < 4; hi++) {
        var hz = hk.z0 + 0.06 + hi * (hk.z1 - hk.z0 - 0.12) / 3;
        box(R, mats.metal, 0.03, 0.09, 1.6, 1.63, hz - 0.01, hz + 0.01, { shadow: false });
      }

      // --- Cây xanh ---
      ['plant', 'plant2'].forEach(function (id, n) {
        var pt = get(id), pcx = (pt.x0 + pt.x1) / 2, pcz = (pt.z0 + pt.z1) / 2, k = n ? 0.8 : 1;
        cyl(R, mats.pot, 0.15 * k + 0.02, 0.42, pcx, 0, pcz);
        [[0, 0.95, 0, 0.26], [0.08, 1.2, 0.05, 0.2], [-0.07, 1.15, -0.06, 0.19], [0.02, 1.38, -0.02, 0.15]].forEach(function (l) {
          add(R, new T3.SphereGeometry(l[3] * k, 16, 12), mats.leaf, pcx + l[0] * k, 0.42 + (l[1] - 0.42) * k, pcz + l[2] * k);
        });
        cyl(R, mats.doorWood, 0.02, 0.6 * k, pcx, 0.42, pcz, 6);
      });

      // --- Rèm voan chia khu: ray âm trần (không vẽ vì không có trần), rèm dồn gọn sát tường phía sân ---
      var d3o = lay.d3;
      if (!(P > d3o.from - 0.1 && P < d3o.to + 0.1)) {
      drape(R, 'x', P, 0.04, 0.4, 0.06, H - 0.04);
      // lớp rèm vải dày cạnh lớp voan: ban đêm kéo ra để điều hoà chỉ làm mát khu ngủ
      var heavy = new T3.Mesh(new T3.BoxGeometry(0.28, H - 0.1, 0.1), mats.head);
      heavy.position.set(0.56, (H - 0.04 + 0.06) / 2, P);
      R.add(heavy);
      }

      // --- Đèn LED hắt trần (ban đêm) ---
      [[W / 2, L * 0.25], [W / 2, L * 0.75]].forEach(function (p) {
        var cl = new T3.PointLight(0xffd29a, 0, 6, 2);
        cl.position.set(p[0], H - 0.25, p[1]);
        scene.add(cl);
        nightLights.push(cl);
      });
    }

    function applyMode() {
      var night = state.night, wed = state.wedding;
      hemi.intensity = night ? 0.12 : 0.75;
      sun.intensity = night ? 0 : 0.75;
      nightLights.forEach(function (l) { l.intensity = night ? 0.9 : 0; });
      mats.bulb.emissiveIntensity = night ? 2.2 : 0.4;
      mats.led.color.copy(col(night ? '#ffd9a0' : '#f3eadc'));
      scene.background = col(night ? '#1d1a24' : (document.documentElement.getAttribute('data-theme') === 'dark' ? '#2a2026' : '#f6efe9'));
      if (room) room.traverse(function (o) {
        if (o.userData.wedding) o.visible = wed;
        if (o.userData.role === 'duvet') o.material = wed ? mats.red : mats.duvet;
        if (o.userData.role === 'throw') o.material = wed ? mats.gold : mats.accent;
        if (o.userData.role === 'cushion') o.material = wed ? mats.red : mats.accent;
      });
      dirty = true;
    }

    function recolor() {
      var p = PALETTES[state.palette];
      ['wall', 'slat', 'backing', 'head', 'bed', 'duvet', 'accent', 'wood', 'wardrobe', 'sofa', 'rug'].forEach(function (k) {
        mats[k].color.copy(col(p[k]));
      });
      paintFloor(p.floor);
      walls.forEach(function (g) { g.userData.mat.color.copy(mats.wall.color); });
      dirty = true;
    }

    // Ẩn tường quay về phía camera (kiểu nhà búp bê)
    var tmp = new T3.Vector3();
    function updateWalls() {
      walls.forEach(function (g) {
        tmp.copy(camera.position).sub(g.userData.center);
        var ghost = tmp.dot(g.userData.normal) > 0.15;
        if (g.userData.ghost === ghost) return;
        g.userData.ghost = ghost;
        g.userData.mat.opacity = ghost ? 0.13 : 1;
        g.userData.mat.depthWrite = !ghost;
        g.children.forEach(function (c) {
          if (c.userData.seg) c.castShadow = !ghost;
          else c.visible = !ghost;
        });
      });
    }

    function resize() {
      var w = canvasHost.clientWidth, h = canvasHost.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w / h < 1 ? 62 : 50;
      camera.updateProjectionMatrix();
      dirty = true;
    }
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvasHost);
    window.addEventListener('resize', resize);

    function loop(now) {
      if (anim) {
        var k = Math.min(1, (now - anim.t0) / anim.dur);
        var e = 1 - Math.pow(1 - k, 3);
        target.lerpVectors(anim.from.t, anim.to.t, e);
        sph.r = anim.from.r + (anim.to.r - anim.from.r) * e;
        sph.theta = anim.from.theta + (anim.to.theta - anim.from.theta) * e;
        sph.phi = anim.from.phi + (anim.to.phi - anim.from.phi) * e;
        if (k >= 1) anim = null;
        dirty = true;
      }
      if (dirty) {
        placeCamera();
        updateWalls();
        renderer.render(scene, camera);
        dirty = false;
      }
      requestAnimationFrame(loop);
    }

    recolor();
    build();
    resize();
    goTo('tong', true);
    requestAnimationFrame(loop);

    // Theo dõi đổi giao diện sáng/tối để đổi màu nền
    new MutationObserver(applyMode).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return {
      rebuild: function () { build(); },
      recolor: recolor,
      goTo: goTo,
      zoom: zoom,
      mode: applyMode
    };
  }

  function initControls() {
    $$('[data-cam]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (!three) return;
        three.goTo(b.getAttribute('data-cam'));
        $$('[data-cam]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      });
    });
    $$('[data-zoom]').forEach(function (b) {
      b.addEventListener('click', function () { if (three) three.zoom(b.getAttribute('data-zoom') === 'in' ? 0.8 : 1.25); });
    });
    var toggle = function (id, key) {
      var b = $(id);
      if (!b) return;
      b.addEventListener('click', function () {
        state[key] = !state[key];
        b.setAttribute('aria-pressed', String(state[key]));
        if (three) three.mode();
      });
    };
    toggle('#nightBtn', 'night');
    toggle('#weddingBtn', 'wedding');
    $$('.v3d__palette [data-palette]').forEach(function (b) {
      b.addEventListener('click', function () { setPalette(b.getAttribute('data-palette')); });
    });
    $$('[data-palette]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-palette') === state.palette)); });
  }

  function init() {
    renderSwatches();
    initPlan();
    initBudget();
    initThree();
    initControls();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
