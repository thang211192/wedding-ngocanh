/* =========================================================================
   Lộ trình cưới — Thắng & Ngọc Anh
   Vanilla JS, không phụ thuộc thư viện ngoài.
   Toàn bộ nội dung nằm trong HTML; JS chỉ là lớp tăng cường
   (tính ngày, lưu tiến độ, tính chi phí). Trang vẫn đọc được khi tắt JS.
   ========================================================================= */
(function () {
  'use strict';

  /* ---------------- Helpers ---------------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var NS = 'wnc:';
  var store = {
    get: function (k, fallback) {
      try {
        var v = localStorage.getItem(NS + k);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set: function (k, v) {
      try { localStorage.setItem(NS + k, JSON.stringify(v)); return true; }
      catch (e) { return false; }
    },
    del: function (k) { try { localStorage.removeItem(NS + k); } catch (e) {} },
    clearAll: function () {
      try {
        Object.keys(localStorage)
          .filter(function (k) { return k.indexOf(NS) === 0; })
          .forEach(function (k) { localStorage.removeItem(k); });
      } catch (e) {}
    }
  };

  var nfInt = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 });
  var nf1 = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 });

  /** Số tiền lưu theo đơn vị TRIỆU đồng. */
  function mil(n) { return nf1.format(n) + ' tr'; }
  function vnd(nMillion) { return nfInt.format(Math.round(nMillion * 1e6)) + ' ₫'; }

  var DOW = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

  function parseISO(s) {
    if (!s) return null;
    var p = s.split('-');
    if (p.length !== 3) return null;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return isNaN(d.getTime()) ? null : d;
  }
  function toISO(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function fmtDate(d) { return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0'); }
  function fmtDateFull(d) { return DOW[d.getDay()] + ', ' + String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(); }
  function startOfDay(d) { var x = new Date(d.getTime()); x.setHours(0, 0, 0, 0); return x; }

  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.setAttribute('data-show', 'true');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.setAttribute('data-show', 'false'); }, 3200);
  }

  /* ---------------- 1. Theme ---------------- */
  function initTheme() {
    var root = document.documentElement;
    var saved = store.get('theme', null);
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

    var btn = $('#themeBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      if (!current) {
        current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store.set('theme', next);
      btn.setAttribute('aria-label', next === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
      renderBudget();
    });
  }

  /* ---------------- 2. Mobile menu ---------------- */
  function initMenu() {
    var sheet = $('#menuSheet');
    var openBtn = $('#menuBtn');
    var closeBtn = $('#menuClose');
    if (!sheet || !openBtn) return;

    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      sheet.setAttribute('data-open', 'true');
      sheet.removeAttribute('aria-hidden');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var first = sheet.querySelector('a, button');
      if (first) first.focus();
    }
    function close() {
      sheet.setAttribute('data-open', 'false');
      sheet.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    sheet.addEventListener('click', function (e) { if (e.target === sheet) close(); });
    $$('#menuSheet a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.getAttribute('data-open') === 'true') close();
    });
  }

  /* ---------------- 3. Scrollspy ---------------- */
  function initSpy() {
    var sections = $$('section[id]');
    if (!sections.length || !('IntersectionObserver' in window)) return;
    var links = $$('a[data-spy]');
    if (!links.length) return;

    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0; });
      var bestId = null, best = 0;
      Object.keys(visible).forEach(function (id) {
        if (visible[id] > best) { best = visible[id]; bestId = id; }
      });
      links.forEach(function (a) {
        var on = bestId && a.getAttribute('href') === '#' + bestId;
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-72px 0px -55% 0px', threshold: [0, .1, .25, .5, .75, 1] });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------------- 4. Reveal on scroll ---------------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        en.target.style.transitionDelay = Math.min(i * 45, 220) + 'ms';
        en.target.classList.add('is-in');
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- 5. Ngày cưới → countdown + lộ trình ---------------- */
  var DEFAULT_DATE = '2026-12-20';

  function getWeddingDate() {
    var saved = store.get('weddingDate', null);
    return parseISO(saved) || parseISO(DEFAULT_DATE);
  }

  function renderCountdown(wd) {
    var today = startOfDay(new Date());
    var diffMs = startOfDay(wd).getTime() - today.getTime();
    var days = Math.round(diffMs / 86400000);
    var past = days < 0;
    var abs = Math.abs(days);

    var months = Math.floor(abs / 30);
    var weeks = Math.floor(abs / 7);
    var restDays = abs % 7;

    var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    set('cdDays', nfInt.format(abs));
    set('cdWeeks', nfInt.format(weeks));
    set('cdRest', nfInt.format(restDays));
    set('cdMonths', nfInt.format(months));

    var lbl = $('#cdLabel');
    if (lbl) lbl.textContent = past ? 'Đã cưới cách đây' : 'Đếm ngược tới ngày cưới';
    var full = $('#cdFull');
    if (full) full.textContent = fmtDateFull(wd);

    var alertEl = $('#cdAlert');
    if (alertEl) {
      if (past) {
        alertEl.className = 'note note--ok';
        alertEl.querySelector('span').innerHTML = '<strong>Chúc mừng hai bạn!</strong> Phần “Sau cưới” bên dưới còn vài việc cần hoàn tất.';
      } else if (weeks <= 8) {
        alertEl.className = 'note note--danger';
        alertEl.querySelector('span').innerHTML = '<strong>Còn ' + weeks + ' tuần — rất gấp.</strong> Ưu tiên tuyệt đối 3 việc có thời gian chờ dài: đặt cọc nhà hàng, đặt lịch chụp ảnh cưới, in thiệp. Các việc khác có thể chạy song song.';
      } else if (weeks <= 20) {
        alertEl.className = 'note note--gold';
        alertEl.querySelector('span').innerHTML = '<strong>Còn ' + weeks + ' tuần.</strong> Đây là lộ trình nén — cần chốt nhà hàng và studio ảnh cưới ngay trong 2 tuần đầu vì cuối năm là cao điểm mùa cưới, dễ hết chỗ.';
      } else {
        alertEl.className = 'note note--rose';
        alertEl.querySelector('span').innerHTML = '<strong>Còn ' + weeks + ' tuần.</strong> Thời gian khá thong thả, bám theo mốc từng giai đoạn bên dưới là đủ.';
      }
    }
  }

  function renderTimelineDates(wd) {
    var today = startOfDay(new Date());
    $$('.tl__item').forEach(function (item) {
      var ws = parseInt(item.getAttribute('data-week-start'), 10);
      var we = parseInt(item.getAttribute('data-week-end'), 10);
      var whenEl = $('.tl__when', item);
      var stateEl = $('.tl__state', item);
      if (isNaN(ws) || isNaN(we) || !whenEl) return;

      // week-start/week-end tính theo số tuần TRƯỚC ngày cưới (0 = tuần cưới, âm = sau cưới)
      var start = addDays(wd, -ws * 7);
      var end = addDays(wd, -we * 7);
      whenEl.textContent = fmtDate(start) + ' → ' + fmtDate(end) + '/' + end.getFullYear();

      var state = 'todo';
      if (today > startOfDay(end)) state = 'done';
      else if (today >= startOfDay(start)) state = 'now';
      item.setAttribute('data-state', state);

      if (stateEl) {
        if (state === 'done') { stateEl.className = 'pill pill--mute tl__state'; stateEl.textContent = 'Đã qua mốc'; }
        else if (state === 'now') { stateEl.className = 'pill pill--rose tl__state'; stateEl.textContent = 'Đang trong mốc này'; }
        else { stateEl.className = 'pill pill--gold tl__state'; stateEl.textContent = 'Sắp tới'; }
      }
    });
  }

  function initWeddingDate() {
    var input = $('#weddingDate');
    var wd = getWeddingDate();
    if (input) {
      input.value = toISO(wd);
      input.addEventListener('change', function () {
        var d = parseISO(input.value);
        if (!d) return;
        store.set('weddingDate', input.value);
        renderCountdown(d);
        renderTimelineDates(d);
        toast('Đã cập nhật ngày cưới: ' + fmtDateFull(d));
      });
    }
    renderCountdown(wd);
    renderTimelineDates(wd);
  }

  /* ---------------- 6. Checklist ---------------- */
  function updateProgressBar(barEl, labelEl, done, total) {
    var pct = total ? Math.round((done / total) * 100) : 0;
    if (barEl) {
      barEl.style.width = pct + '%';
      var wrapEl = barEl.parentElement;
      if (wrapEl) {
        wrapEl.setAttribute('role', 'progressbar');
        wrapEl.setAttribute('aria-valuemin', '0');
        wrapEl.setAttribute('aria-valuemax', '100');
        wrapEl.setAttribute('aria-valuenow', String(pct));
        wrapEl.setAttribute('aria-label', 'Tiến độ ' + pct + '%');
      }
    }
    if (labelEl) labelEl.textContent = done + '/' + total + ' · ' + pct + '%';
  }

  function refreshChecklist() {
    var all = $$('.check input[type="checkbox"][data-task]');
    var doneAll = 0;

    $$('[data-group]').forEach(function (group) {
      var boxes = $$('input[type="checkbox"][data-task]', group);
      var done = boxes.filter(function (b) { return b.checked; }).length;
      updateProgressBar($('.progress__bar', group), $('.progress-head__n', group), done, boxes.length);
      var counter = $('.acc__count', group);
      if (counter) counter.textContent = done + '/' + boxes.length;
    });

    doneAll = all.filter(function (b) { return b.checked; }).length;
    updateProgressBar($('#overallBar'), $('#overallNum'), doneAll, all.length);

    var remain = $('#overallRemain');
    if (remain) {
      var left = all.length - doneAll;
      remain.textContent = left === 0 ? 'Xong hết rồi — tuyệt vời!' : 'Còn ' + left + ' việc chưa xong';
    }
  }

  function initChecklist() {
    var saved = store.get('tasks', {});
    var boxes = $$('.check input[type="checkbox"][data-task]');

    boxes.forEach(function (b) {
      var id = b.getAttribute('data-task');
      if (saved[id]) b.checked = true;
      b.addEventListener('change', function () {
        var s = store.get('tasks', {});
        if (b.checked) s[id] = 1; else delete s[id];
        store.set('tasks', s);
        refreshChecklist();
      });
    });

    var resetBtn = $('#resetTasks');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (!window.confirm('Bỏ tick toàn bộ checklist? Thao tác này không hoàn tác được.')) return;
        store.del('tasks');
        boxes.forEach(function (b) { b.checked = false; });
        refreshChecklist();
        toast('Đã xoá toàn bộ tiến độ checklist.');
      });
    }

    var expandBtn = $('#expandAll');
    if (expandBtn) {
      expandBtn.addEventListener('click', function () {
        var accs = $$('#chuan-bi .acc');
        var anyClosed = accs.some(function (a) { return !a.open; });
        accs.forEach(function (a) { a.open = anyClosed; });
        expandBtn.textContent = anyClosed ? 'Thu gọn tất cả' : 'Mở tất cả';
      });
    }

    refreshChecklist();
  }

  /* ---------------- 7. Ngân sách ---------------- */
  var CAT_COLORS_LIGHT = {
    'nghi-le': '#c2185b', 'trang-suc': '#7c3aed', 'anh-video': '#0e7490',
    'tiec': '#b45309', 'trang-tri': '#15803d', 'chuong-trinh': '#4338ca',
    'giay-to': '#6b7280', 'sau-cuoi': '#0f766e', 'du-phong': '#9a3412'
  };
  var CAT_COLORS_DARK = {
    'nghi-le': '#f472b6', 'trang-suc': '#a78bfa', 'anh-video': '#22d3ee',
    'tiec': '#fbbf24', 'trang-tri': '#4ade80', 'chuong-trinh': '#818cf8',
    'giay-to': '#a1a1aa', 'sau-cuoi': '#2dd4bf', 'du-phong': '#fb923c'
  };

  function currentTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  var budgetTier = 2;

  /**
   * Nạp giá gợi ý của một mức vào bảng.
   * fromUser = true khi người dùng bấm nút (ghi đè số đã sửa tay và lưu lại);
   * false khi khởi tạo lúc tải trang — lúc đó phải giữ nguyên số đã lưu,
   * loadCustom() sẽ chồng lên ngay sau đó.
   */
  function applyTier(tier, fromUser) {
    budgetTier = tier;
    $$('tr[data-cat]').forEach(function (row) {
      var input = $('.money-input', row);
      if (!input) return;
      var v = row.getAttribute('data-t' + tier);
      if (v !== null) input.value = v;
    });
    store.set('budgetTier', tier);
    $$('.seg__btn[data-tier]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(+b.getAttribute('data-tier') === tier));
    });
    if (fromUser) saveCustom();
  }

  function saveCustom() {
    var custom = {};
    $$('tr[data-cat]').forEach(function (row) {
      var key = row.getAttribute('data-key');
      var input = $('.money-input', row);
      if (key && input) custom[key] = { v: input.value, off: row.getAttribute('data-off') === 'true' };
    });
    store.set('budgetCustom', custom);
  }

  function loadCustom() {
    var custom = store.get('budgetCustom', null);
    if (!custom) return false;
    $$('tr[data-cat]').forEach(function (row) {
      var key = row.getAttribute('data-key');
      if (!key || !custom[key]) return;
      var input = $('.money-input', row);
      if (input) input.value = custom[key].v;
      row.setAttribute('data-off', custom[key].off ? 'true' : 'false');
      var cb = $('input[type="checkbox"]', row);
      if (cb) cb.checked = !custom[key].off;
    });
    return true;
  }

  function renderBudget() {
    var rows = $$('tr[data-cat]');
    if (!rows.length) return;

    var byCat = {};
    var subtotal = 0;

    rows.forEach(function (row) {
      var off = row.getAttribute('data-off') === 'true';
      var input = $('.money-input', row);
      var val = off ? 0 : (parseFloat(input && input.value) || 0);
      var cat = row.getAttribute('data-cat');
      byCat[cat] = (byCat[cat] || 0) + val;
      subtotal += val;
      var cell = $('.row-vnd', row);
      if (cell) cell.textContent = off ? '—' : vnd(val);
    });

    var bufPct = parseFloat(($('#bufferPct') || {}).value) || 0;
    var buffer = subtotal * (bufPct / 100);
    byCat['du-phong'] = buffer;
    var total = subtotal + buffer;

    var guests = parseFloat(($('#guestCount') || {}).value) || 0;
    var perGuest = parseFloat(($('#giftPerGuest') || {}).value) || 0;
    var income = (guests * perGuest) / 1000; // perGuest nhập theo nghìn đồng → ra triệu
    var net = total - income;

    var set = function (id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; };
    set('sumSubtotal', mil(subtotal));
    set('sumBuffer', mil(buffer));
    set('sumTotal', mil(total));
    set('sumTotalVnd', '≈ ' + vnd(total));
    set('sumIncome', mil(income));
    set('sumNet', mil(net));
    set('sumNetVnd', '≈ ' + vnd(net));

    // Khi tiền mừng bù đủ, hiển thị số dương kèm nhãn "dư ra" cho dễ đọc
    var netLabel = $('#netLabel');
    if (netLabel) netLabel.textContent = net > 0 ? 'Cần chuẩn bị (chi ròng)' : 'Dư ra sau đám cưới';
    set('sumNet', mil(Math.abs(net)));
    set('sumNetVnd', '≈ ' + vnd(Math.abs(net)));

    var netNote = $('#netNote');
    if (netNote) {
      netNote.textContent = net > 0
        ? 'Hai bạn cần chuẩn bị sẵn khoảng ' + vnd(net) + ' tiền mặt hoặc tiết kiệm.'
        : 'Ước tính tiền mừng đủ bù chi phí, dư khoảng ' + vnd(Math.abs(net)) + '.';
    }

    // Bar chart
    var bars = $('#budgetBars');
    if (bars) {
      var colors = currentTheme() === 'dark' ? CAT_COLORS_DARK : CAT_COLORS_LIGHT;
      var labels = {};
      $$('[data-cat-label]').forEach(function (el) { labels[el.getAttribute('data-cat-label')] = el.textContent.trim(); });
      labels['du-phong'] = 'Quỹ dự phòng';

      var entries = Object.keys(byCat)
        .map(function (k) { return { k: k, v: byCat[k] }; })
        .filter(function (e) { return e.v > 0; })
        .sort(function (a, b) { return b.v - a.v; });

      var max = entries.length ? entries[0].v : 1;
      bars.innerHTML = '';
      if (!entries.length) {
        bars.innerHTML = '<p class="card__body">Chưa có khoản chi nào được bật.</p>';
      }
      entries.forEach(function (e) {
        var pctTotal = total ? Math.round((e.v / total) * 100) : 0;
        var row = document.createElement('div');
        row.className = 'bar-row';
        var top = document.createElement('div');
        top.className = 'bar-top';
        var k = document.createElement('span');
        k.className = 'bar-top__k';
        k.textContent = labels[e.k] || e.k;
        var v = document.createElement('span');
        v.className = 'bar-top__v num';
        v.textContent = mil(e.v) + ' · ' + pctTotal + '%';
        top.appendChild(k); top.appendChild(v);
        var track = document.createElement('div');
        track.className = 'bar-track';
        var fill = document.createElement('div');
        fill.className = 'bar-fill';
        fill.style.width = Math.max(2, (e.v / max) * 100) + '%';
        fill.style.background = colors[e.k] || 'var(--rose)';
        track.appendChild(fill);
        row.appendChild(top); row.appendChild(track);
        row.setAttribute('title', (labels[e.k] || e.k) + ': ' + vnd(e.v) + ' (' + pctTotal + '% tổng chi)');
        bars.appendChild(row);
      });
    }
  }

  function initBudget() {
    var rows = $$('tr[data-cat]');
    if (!rows.length) return;

    var savedTier = store.get('budgetTier', 2);
    $$('.seg__btn[data-tier]').forEach(function (b) {
      b.addEventListener('click', function () {
        applyTier(+b.getAttribute('data-tier'), true);
        renderBudget();
        toast('Đã áp dụng mức: ' + b.textContent.trim());
      });
    });

    applyTier(savedTier, false);
    loadCustom();

    rows.forEach(function (row) {
      var input = $('.money-input', row);
      var cb = $('input[type="checkbox"]', row);
      if (input) {
        input.addEventListener('input', function () { renderBudget(); });
        input.addEventListener('change', function () { saveCustom(); });
      }
      if (cb) {
        cb.addEventListener('change', function () {
          row.setAttribute('data-off', cb.checked ? 'false' : 'true');
          renderBudget();
          saveCustom();
        });
      }
    });

    ['bufferPct', 'guestCount', 'giftPerGuest'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var saved = store.get('b_' + id, null);
      if (saved !== null) el.value = saved;
      el.addEventListener('input', function () {
        store.set('b_' + id, el.value);
        renderBudget();
      });
    });

    var resetBtn = $('#resetBudget');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (!window.confirm('Đưa bảng chi phí về giá trị gốc của mức đang chọn?')) return;
        store.del('budgetCustom');
        rows.forEach(function (row) {
          row.setAttribute('data-off', 'false');
          var cb = $('input[type="checkbox"]', row);
          if (cb) cb.checked = true;
        });
        applyTier(budgetTier, true);
        renderBudget();
        toast('Đã khôi phục bảng chi phí.');
      });
    }

    renderBudget();
  }

  /* ---------------- 8. Tráp ăn hỏi ---------------- */
  function renderTrap(count) {
    $$('.trap-item').forEach(function (item) {
      var min = parseInt(item.getAttribute('data-min'), 10);
      item.setAttribute('data-in', count >= min ? 'true' : 'false');
    });
    var n = $('#trapCount');
    if (n) n.textContent = count;
    var cost = $('#trapCost');
    if (cost) {
      var map = { 3: '4 – 7 triệu', 5: '6 – 11 triệu', 7: '9 – 16 triệu', 9: '13 – 24 triệu', 11: '20 – 35 triệu' };
      cost.textContent = map[count] || '—';
    }
    var people = $('#trapPeople');
    if (people) people.textContent = count + ' nam bê tráp · ' + count + ' nữ đỡ tráp';
    $$('.seg__btn[data-trap]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(+b.getAttribute('data-trap') === count));
    });
    store.set('trap', count);
  }

  function initTrap() {
    var btns = $$('.seg__btn[data-trap]');
    if (!btns.length) return;
    btns.forEach(function (b) {
      b.addEventListener('click', function () { renderTrap(+b.getAttribute('data-trap')); });
    });
    renderTrap(store.get('trap', 7));
  }

  /* ---------------- 9. Tiện ích khác ---------------- */
  function initMisc() {
    var printBtn = $('#printBtn');
    if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

    var resetAll = $('#resetAll');
    if (resetAll) {
      resetAll.addEventListener('click', function () {
        if (!window.confirm('Xoá toàn bộ dữ liệu đã lưu trên trình duyệt này (checklist, ngân sách, ngày cưới)?')) return;
        store.clearAll();
        window.location.reload();
      });
    }

    var y = $('#year');
    if (y) y.textContent = new Date().getFullYear();

    // Cảnh báo nếu localStorage không dùng được (chế độ ẩn danh…)
    if (!store.set('__probe', 1)) {
      var warn = $('#storageWarn');
      if (warn) warn.hidden = false;
    } else {
      store.del('__probe');
    }
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    toastEl = $('#toast');
    initTheme();
    initMenu();
    initSpy();
    initWeddingDate();
    initChecklist();
    initBudget();
    initTrap();
    initReveal();
    initMisc();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (!store.get('theme', null)) renderBudget();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
