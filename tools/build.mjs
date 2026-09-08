// Sinh an-uong.html từ tools/data.mjs.
//
//   node tools/build.mjs      (hoặc: npm run build)
//
// an-uong.html được commit vào repo như một file đã dựng — Netlify chỉ `cp`,
// không chạy script này. Sửa dữ liệu xong thì chạy lại rồi commit cả hai.
//
// Sprite icon được rút thẳng từ index.html để hai trang không bao giờ lệch bộ
// icon. Không tách ra file .svg dùng chung vì `<use href="file.svg#id">` không
// chạy khi mở trang bằng giao thức file://, mà yêu cầu "mở thẳng file bằng
// trình duyệt là chạy được" phải giữ.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { AREAS, KINDS, PLACES, ROUTES } from "./data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const ICONS = [
  "i-heart", "i-menu", "i-x", "i-sun", "i-moon", "i-search", "i-pin",
  "i-reset", "i-info", "i-check", "i-check-circle", "i-x-circle",
  "i-utensils", "i-arrow", "i-printer", "i-alert", "i-clock", "i-compass",
];

/** Escape cho nội dung text. Dữ liệu trong data.mjs là text thô. */
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Bỏ dấu tiếng Việt để làm định danh cho thẻ quán. */
const slug = (s) =>
  s.replace(/đ/g, "d").replace(/Đ/g, "D")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const vnNum = (n) => String(n).replace(".", ",");

function sprite() {
  const src = readFileSync(join(ROOT, "index.html"), "utf8");
  return ICONS.map((id) => {
    const m = src.match(new RegExp(`<symbol id="${id}"[\\s\\S]*?</symbol>`));
    if (!m) throw new Error(`index.html thiếu icon #${id}`);
    return m[0];
  }).join("\n  ");
}

function stars(score) {
  if (score == null) return '<span class="stars" aria-label="Chưa chấm điểm riêng">—</span>';
  return `<span class="stars" style="--fill:${(score / 5) * 100}%" `
       + `role="img" aria-label="${vnNum(score)} trên 5 sao">`
       + `<i aria-hidden="true"></i></span>`;
}

function mapsUrl(query) {
  // Chuỗi tra KHÔNG được chứa số nhà — xem chú thích đầu data.mjs.
  return "https://www.google.com/maps/search/?api=1&amp;query="
       + encodeURIComponent(query);
}

const kindOf = Object.fromEntries(KINDS.map((k) => [k.key, k]));

function card(p) {
  const id = slug(p.name);
  const tags = p.kinds
    .map((k) => `<span class="pill ${kindOf[k].pill}">${esc(kindOf[k].label)}</span>`)
    .join("");
  const gg = p.gg
    ? `\n            <span class="eat__gg">Google ${esc(p.gg)}</span>`
    : "";
  const find = esc(p.find) + (p.multi
    ? " <em>(Bản đồ sẽ mở ra danh sách các quán cùng tên quanh đó, "
      + "chọn cái gần bạn nhất.)</em>"
    : "");

  return `      <article class="eat" id="quan-${id}" data-area="${p.area}" data-kind="${p.kinds.join(",")}" data-id="${id}" data-score="${p.score ?? ''}">
        <div class="eat__top">
          <div class="eat__id">
            <h4 class="eat__name">${esc(p.name)}</h4>
            <p class="eat__dish">${esc(p.dish)}</p>${gg}
            ${p.source ? `<a class="eat__source" href="${p.source}" target="_blank" rel="noopener noreferrer">${esc(p.recognition)} ↗</a><small class="eat__checked">Đối chiếu 08/09/2026</small>` : ''}
          </div>
          <div class="eat__rate">
            ${stars(p.score)}
            <span class="eat__score num">${p.score == null ? 'Chưa chấm' : vnNum(p.score)}</span>
          </div>
        </div>
        <dl class="eat__meta">
          <div><dt>Địa chỉ</dt><dd>${esc(p.addr)}</dd></div>
          <div><dt>Giờ mở</dt><dd>${esc(p.hours)}</dd></div>
          <div><dt>Giá</dt><dd>${esc(p.price)}</dd></div>
        </dl>
        <p class="eat__find">
          <svg class="ico ico-sm" aria-hidden="true"><use href="#i-pin"/></svg>
          <span><strong>Tìm thế nào:</strong> ${find}</span>
        </p>
        <p class="eat__tip"><strong>Mẹo:</strong> ${esc(p.tip)}</p>
        <div class="eat__foot">
          <div class="eat__tags">${tags}</div>
          <div class="eat__acts">
            <a class="eat__map" href="${mapsUrl(p.map)}" target="_blank" rel="noopener noreferrer">
              <svg class="ico ico-sm" aria-hidden="true"><use href="#i-pin"/></svg>
              <span>Bản đồ</span>
            </a>
            <button class="eat__save" type="button" data-save="${id}" aria-pressed="false">
              <svg class="ico ico-sm" aria-hidden="true"><use href="#i-heart"/></svg>
              <span>Muốn đi</span>
            </button>
          </div>
        </div>
      </article>
`;
}

function group(area) {
  const items = PLACES.filter((p) => p.area === area.key);
  const badge = area.home
    ? '<span class="eat-group__badge">Quanh nhà</span>'
    : "";
  return `    <div class="eat-group reveal${area.home ? " eat-group--home" : ""}" id="kv-${area.key}" data-group="${area.key}">
      <div class="eat-group__head">
        <h3 class="eat-group__t"><svg class="ico" aria-hidden="true"><use href="#i-pin"/></svg>${esc(area.title)}</h3>${badge}
        <p class="eat-group__d">${esc(area.desc)}</p>
      </div>
      <div class="eat-grid">
${items.map(card).join("")}      </div>
    </div>

`;
}

function route(r) {
  const id = slug(r.title);
  const steps = r.steps.map((s) =>
    `<li><span class="route__t num">${esc(s.at)}</span><span>`
    + `<span class="route__h">${esc(s.what)}</span>`
    + `<span class="route__d">${esc(s.note)}</span>${s.map ? `<a href="${mapsUrl(s.map)}" target="_blank" rel="noopener noreferrer">Chỉ đường ↗</a>` : ''}</span></li>`).join("");
  return `      <details class="card route reveal" data-route="${id}">
        <summary>
        <span class="pill pill--rose">${esc(r.mood || 'Đi cùng nhau')}</span>
        <h3 class="card__title">${esc(r.title)}</h3>
        <p class="route__meta">${esc(r.meta)}</p>
        <span class="route__open">Xem lịch trình & chọn ngày ↓</span></summary>
        <ol class="route__list">${steps}</ol>
        <form class="date-plan">
          <label for="date-${id}">Chọn ngày hẹn <input id="date-${id}" type="date" required aria-describedby="status-${id}"></label>
          <div class="date-plan__actions"><button class="btn btn--primary" type="submit">Lưu buổi hẹn</button><button class="btn btn--ghost" type="button" data-calendar>Tải lịch .ics</button><button class="btn btn--ghost" type="button" data-remove-date hidden>Bỏ hẹn</button></div>
          <p class="date-plan__status" id="status-${id}" role="status">Lịch gợi ý · chưa đặt bàn.</p>
        </form>
      </details>
`;
}

// --------------------------------------------------------------- con số dẫn xuất
const total = PLACES.length;
const nAreas = AREAS.length;
const nRoutes = ROUTES.length;
const nMulti = PLACES.filter((p) => p.multi).length;
const nSingle = total - nMulti;
// Số quán đã tra quanh toạ độ hai nhà — đúng những chỗ có điểm Google.
const nResearched = PLACES.filter((p) => p.gg).length;

const countIn = (key) => PLACES.filter((p) => p.area === key).length;
const countKind = (key) => PLACES.filter((p) => p.kinds.includes(key)).length;

// --------------------------------------------------------------- dựng trang
let html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Ăn gì ở Hà Nội · Thắng &amp; Ngọc Anh</title>
<meta name="description" content="Danh sách ${total} quán và khu ăn uống ở Hà Nội chia theo ${nAreas} khu vực: chấm sao, món nên gọi, địa chỉ đầy đủ, chỉ dẫn tìm đường, giờ mở, khoảng giá và mẹo riêng từng chỗ.">
<meta name="theme-color" content="#fff8fb" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#150d11" media="(prefers-color-scheme: dark)">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
<meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
<meta name="referrer" content="no-referrer">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='19' font-size='19'%3E%F0%9F%8D%9C%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap">
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="assets/css/dining.css">
</head>
<body class="dining-page">

<script>
/* Bật hiệu ứng hiện dần khi cuộn. Nếu script này không chạy (JS bị chặn),
   class "js" không được gắn và mọi nội dung hiển thị ngay — không bao giờ trắng trang. */
document.documentElement.className += ' js';
</script>

<a class="skip-link" href="#main">Bỏ qua điều hướng, tới nội dung chính</a>

<!-- ===================== ICON SPRITE ===================== -->
<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true" focusable="false">
  ${sprite()}
</svg>

<!-- ===================== HEADER ===================== -->
<header class="header">
  <div class="wrap header__inner">
    <a class="brand" href="index.html">
      <svg class="ico" aria-hidden="true"><use href="#i-heart"/></svg>
      <span>Thắng &amp; Ngọc Anh</span>
    </a>

    <nav class="nav" aria-label="Điều hướng chính">
      <ul class="nav__list">
        <li><a class="nav__link" data-spy href="#danh-sach">Danh sách quán</a></li>
        <li><a class="nav__link" data-spy href="#cung-duong">Cung đường</a></li>
        <li><a class="nav__link" data-spy href="#meo">Mẹo ăn uống</a></li>
        <li><a class="nav__link" href="index.html">Lộ trình cưới</a></li>
      </ul>
    </nav>

    <div class="header__tools">
      <button class="icon-btn theme-btn" id="themeBtn" type="button" aria-label="Chuyển giao diện sáng / tối">
        <svg class="ico ico-sun" aria-hidden="true"><use href="#i-sun"/></svg>
        <svg class="ico ico-moon" aria-hidden="true"><use href="#i-moon"/></svg>
      </button>
      <button class="icon-btn menu-btn" id="menuBtn" type="button" aria-label="Mở danh mục" aria-expanded="false" aria-controls="menuSheet">
        <svg class="ico" aria-hidden="true"><use href="#i-menu"/></svg>
      </button>
    </div>
  </div>
</header>

<!-- ===================== MOBILE MENU ===================== -->
<div class="sheet" id="menuSheet" data-open="false" aria-hidden="true">
  <div></div>
  <div class="sheet__panel" role="dialog" aria-modal="true" aria-label="Danh mục">
    <div class="sheet__grab"></div>
    <div class="sheet__head">
      <h2>Nhảy tới khu vực</h2>
      <button class="icon-btn" id="menuClose" type="button" aria-label="Đóng danh mục">
        <svg class="ico" aria-hidden="true"><use href="#i-x"/></svg>
      </button>
    </div>
    <ul class="sheet__list">
      <li><a href="#danh-sach"><svg class="ico" aria-hidden="true"><use href="#i-utensils"/></svg>Toàn bộ ${total} quán</a></li>
${AREAS.map((a) => `      <li><a href="#kv-${a.key}"><svg class="ico" aria-hidden="true"><use href="#i-pin"/></svg>${esc(a.title)}</a></li>\n`).join("")}      <li><a href="#cung-duong"><svg class="ico" aria-hidden="true"><use href="#i-clock"/></svg>${nRoutes} cung đường hẹn hò</a></li>
      <li><a href="#meo"><svg class="ico" aria-hidden="true"><use href="#i-check-circle"/></svg>Mẹo ăn uống ở Hà Nội</a></li>
      <li><a href="index.html"><svg class="ico" aria-hidden="true"><use href="#i-compass"/></svg>Về trang lộ trình cưới</a></li>
    </ul>
  </div>
</div>

<main id="main">

<!-- ===================== HERO ===================== -->
<section class="hero">
  <div class="wrap">
    <span class="hero__eyebrow">
      <svg class="ico ico-sm" aria-hidden="true"><use href="#i-utensils"/></svg>
      Sổ hẹn của Thắng &amp; Ngọc Anh
    </span>

    <h1 class="hero__names hero__names--page">Ăn gì ở Hà Nội<br><em>Hẹn nhau một bữa ngon.</em></h1>

    <p class="hero__lead">
      Một bữa cơm gần nhà, một chiều đi dạo, hay một tối dành riêng cho hai đứa. Cùng khám phá
      <strong>${total} quán và khu ăn uống</strong> chia theo ${nAreas} khu vực. Mỗi chỗ có
      <strong>địa chỉ đầy đủ, chỉ dẫn tìm đường và nút mở thẳng Google Maps</strong>,
      kèm món nên gọi, giờ mở, khoảng giá và một mẹo riêng.
      Bấm <em>Muốn đi</em> để lưu lại, lần sau mở trang ra là còn nguyên.
    </p>

    <div class="hero__actions">
      <a class="btn btn--primary" href="#danh-sach">
        Khám phá ${total} địa điểm
        <svg class="ico ico-sm" aria-hidden="true"><use href="#i-arrow"/></svg>
      </a>
      <a class="btn btn--ghost" href="#cung-duong">
        <svg class="ico ico-sm" aria-hidden="true"><use href="#i-clock"/></svg>
        ${nRoutes} cung đường xếp sẵn
      </a>
      <button class="btn btn--ghost" id="printBtn" type="button">
        <svg class="ico ico-sm" aria-hidden="true"><use href="#i-printer"/></svg>
        In / Lưu PDF
      </button>
      <a class="btn btn--ghost" href="index.html">
        <svg class="ico ico-sm" aria-hidden="true"><use href="#i-compass"/></svg>
        Lộ trình cưới
      </a>
    </div>

    <div class="note note--danger" id="storageWarn" hidden style="margin-top:24px;max-width:60ch">
      <svg class="ico" aria-hidden="true"><use href="#i-alert"/></svg>
      <span>Trình duyệt đang chặn lưu trữ cục bộ (có thể do chế độ ẩn danh). Danh sách quán bấm <em>Muốn đi</em> sẽ <strong>không được lưu lại</strong> khi tải lại trang.</span>
    </div>
  </div>
</section>

<!-- ===================== DANH SÁCH QUÁN ===================== -->
<section class="section" id="danh-sach">
  <div class="wrap">
    <div class="section__head reveal">
      <span class="section__kicker">Danh sách</span>
      <h2 class="section__title">${total} quán, ${nAreas} khu vực</h2>
      <p class="section__sub">
        Lọc theo khu vực hoặc theo kiểu ăn, hoặc gõ thẳng vào ô tìm kiếm —
        <strong>không cần gõ dấu</strong> cũng ra. Ô tìm kiếm tra cả phần chỉ dẫn đường,
        nên gõ một mốc quen thuộc như <em>nhà thờ lớn</em>, <em>hồ Trúc Bạch</em> hay
        <em>chợ Hàng Da</em> là ra ngay những quán quanh đó.
      </p>
    </div>

    <div class="note note--rose reveal" style="margin-bottom:24px">
      <svg class="ico" aria-hidden="true"><use href="#i-pin"/></svg>
      <span>
        <strong>Hai đầu cầu.</strong> Anh ở <strong>Mỹ Đình</strong>, Ngọc Anh ở
        <strong>147 Khương Thượng</strong> — cách nhau khoảng 8km, xe máy 25–35 phút,
        giờ tan tầm qua Ngã Tư Sở hay Láng Hạ thì lâu hơn nữa.
        Vì vậy <strong>ba nhóm đầu danh sách</strong> là quán quanh nhà anh, quanh nhà Ngọc Anh,
        và khu giữa đường nơi mỗi người chỉ phải đi nửa quãng.
        ${nResearched} quán trong ba nhóm này được tìm quanh <em>toạ độ thật của hai nhà</em>,
        mỗi thẻ có kèm điểm Google để bạn tự cân nhắc.
      </span>
    </div>

    <div class="grid grid--3 reveal" style="margin-bottom:28px">
      <div class="stat">
        <span class="stat__k">Cách chấm sao</span>
        <span class="stat__v">★ trên 5</span>
        <p class="stat__d">Chấm theo <strong>độ đáng đi</strong>, không phải độ nổi tiếng: ngon, hợp đi hai người, và xứng với số tiền bỏ ra. 4,5★ là nên đi bằng được; 3★ là đi vì không khí chứ không vì món ăn. Nhãn vàng ghi <strong>Google</strong> là điểm của đám đông, để riêng — hai thang đo không trộn vào nhau.</p>
      </div>
      <div class="stat">
        <span class="stat__k">Sợ lạc đường</span>
        <span class="stat__v">Bấm “Bản đồ”</span>
        <p class="stat__d">Mỗi thẻ quán có dòng <strong>Tìm thế nào</strong> và nút <strong>Bản đồ</strong> mở Google Maps. ${nSingle} địa điểm có truy vấn theo tên quán; ${nMulti} địa điểm là cả một dãy quán. Kiểm tra đúng chi nhánh và giờ mở trước khi xuất phát.</p>
      </div>
      <div class="stat">
        <span class="stat__k">Giá ghi trong bảng</span>
        <span class="stat__v">Ước tính</span>
        <p class="stat__d">Là khoảng tiền thường phải trả cho một người ăn no (hoặc cho hai người, nếu ghi rõ). Quán vỉa hè lệch theo mùa; nhà hàng lệch theo món gọi thêm và đồ uống.</p>
      </div>
    </div>

    <div class="eat-tools reveal">
      <div class="eat-search">
        <svg class="ico" aria-hidden="true"><use href="#i-search"/></svg>
        <label class="sr-only" for="eatSearch">Tìm quán, món ăn hoặc địa chỉ</label>
        <input type="search" id="eatSearch" placeholder="Tìm tên quán, món ăn, tên phố hay mốc quen…" autocomplete="off">
      </div>

      <div class="chips" role="group" aria-label="Lọc theo khu vực">
        <span class="chips__lab">Khu vực</span>
        <button class="chip" type="button" data-area-f="all" aria-pressed="true">Tất cả<span class="chip__n">${total}</span></button>
${AREAS.map((a) => `        <button class="chip${a.home ? " chip--home" : ""}" type="button" data-area-f="${a.key}" aria-pressed="false">${esc(a.short)}<span class="chip__n">${countIn(a.key)}</span></button>\n`).join("")}      </div>

      <div class="chips" role="group" aria-label="Lọc theo kiểu ăn">
        <span class="chips__lab">Kiểu</span>
        <button class="chip" type="button" data-kind-f="all" aria-pressed="true">Tất cả</button>
${KINDS.map((k) => `        <button class="chip" type="button" data-kind-f="${k.key}" aria-pressed="false">${esc(k.label)}<span class="chip__n">${countKind(k.key)}</span></button>\n`).join("")}      </div>

      <div class="chips">
        <button class="chip chip--save" type="button" id="eatSavedOnly" aria-pressed="false">
          <svg class="ico ico-sm" aria-hidden="true"><use href="#i-heart"/></svg>
          Chỉ hiện quán đã lưu<span class="chip__n" id="eatSavedN">0</span>
        </button>
        <button class="chip" type="button" id="eatReset">
          <svg class="ico ico-sm" aria-hidden="true"><use href="#i-reset"/></svg>
          Bỏ lọc
        </button>
      </div>
    </div>

    <p class="eat-count" id="eatCount" role="status" aria-live="polite">Đang hiện toàn bộ ${total} quán.</p>

${AREAS.map(group).join("")}    <p class="eat-empty" id="eatEmpty" hidden>
      Không có quán nào khớp bộ lọc. Thử bỏ bớt điều kiện hoặc bấm <strong>Bỏ lọc</strong>.
    </p>
  </div>
</section>

<!-- ===================== CUNG ĐƯỜNG ===================== -->
<section class="section section--alt" id="cung-duong">
  <div class="wrap">
    <div class="section__head reveal">
      <span class="section__kicker">Đi theo cung đường</span>
      <h2 class="section__title">${nRoutes} buổi hẹn đã xếp sẵn</h2>
      <p class="section__sub">
        Ngại nghĩ thì cứ lấy nguyên một cung đường dưới đây mà đi. Có ghi kèm địa chỉ từng điểm;
        giờ và ngân sách là dự trù cho hai người (trừ khi ghi khác). Xác nhận giờ mở, giá và bàn trống trước khi đi.
      </p>
    </div>

    <p class="date-summary" id="dateSummary" role="status">Chọn ngày để lưu buổi hẹn trên trình duyệt này. Tải lịch để thêm vào ứng dụng lịch của bạn.</p>
    <div class="grid grid--2">
${ROUTES.map(route).join("")}    </div>
  </div>
</section>

<!-- ===================== MẸO ===================== -->
<section class="section" id="meo">
  <div class="wrap">
    <div class="section__head reveal">
      <span class="section__kicker">Bỏ túi</span>
      <h2 class="section__title">Mẹo ăn uống ở Hà Nội</h2>
      <p class="section__sub">
        Mấy điều nhỏ nhưng quyết định một buổi đi ăn vui hay bực — nhất là khi dẫn theo người
        vừa xa Việt Nam vài năm.
      </p>
    </div>

    <div class="do-dont reveal" style="margin-bottom:24px">
      <div class="dd dd--do">
        <h3><svg class="ico" aria-hidden="true"><use href="#i-check-circle"/></svg>Nên</h3>
        <ul>
          <li><svg class="ico ico-sm" aria-hidden="true"><use href="#i-check"/></svg><span><strong>Mở bản đồ trước khi xuất phát.</strong> Phố cổ nhiều phố một chiều và ngõ cụt; đi theo trí nhớ rất dễ vòng lại chỗ cũ. Bấm nút <em>Bản đồ</em> ở thẻ quán rồi chọn chỉ đường là xong.</span></li>
          <li><svg class="ico ico-sm" aria-hidden="true"><use href="#i-check"/></svg><span><strong>Ăn đúng nhịp của Hà Nội:</strong> phở và bánh cuốn buổi sáng, bún chả buổi trưa, ốc – nướng – lẩu buổi tối. Quán nào cũng ngon nhất vào đúng khung giờ của nó.</span></li>
          <li><svg class="ico ico-sm" aria-hidden="true"><use href="#i-check"/></svg><span><strong>Quán đông là quán tươi.</strong> Hàng vỉa hè bán hết trong buổi thì nguyên liệu không tồn qua ngày. Thấy vắng bất thường vào giờ cao điểm thì nên bỏ qua.</span></li>
          <li><svg class="ico ico-sm" aria-hidden="true"><use href="#i-check"/></svg><span><strong>Hỏi giá trước</strong> với hải sản, ốc, ghẹ, cua tính theo cân — và với chỗ gửi xe ở phố cổ dịp lễ.</span></li>
          <li><svg class="ico ico-sm" aria-hidden="true"><use href="#i-check"/></svg><span><strong>Đặt bàn</strong> với mọi nhà hàng từ 300k/người trở lên, nhất là tối thứ 6 và cuối tuần. Gọi trước một cuộc đỡ mất cả buổi tối.</span></li>
          <li><svg class="ico ico-sm" aria-hidden="true"><use href="#i-check"/></svg><span><strong>Cân bằng hai tính cách:</strong> một tối phố cổ ồn ào và đông vui cho Ngọc Anh, một tối quán yên ven hồ cho bạn. Đừng để lịch nghiêng hẳn về một phía.</span></li>
        </ul>
      </div>

      <div class="dd dd--dont">
        <h3><svg class="ico" aria-hidden="true"><use href="#i-x-circle"/></svg>Nên tránh</h3>
        <ul>
          <li><svg class="ico ico-sm" aria-hidden="true"><use href="#i-x"/></svg><span><strong>Đừng ép ăn mắm tôm, lòng lợn, tiết canh ngay tuần đầu.</strong> Ngọc Anh vừa ở Nhật về, bụng còn quen đồ nhạt và sạch. Cứ đi từ phở, bánh cuốn, bún thang rồi mới tới mấy món nặng đô.</span></li>
          <li><svg class="ico ico-sm" aria-hidden="true"><use href="#i-x"/></svg><span><strong>Đừng gửi xe tuỳ tiện ở phố cổ.</strong> Vỉa hè không người trông rất dễ bị khoá bánh hoặc mất. Tìm bãi có vé, hỏi giá trước khi dắt vào.</span></li>
          <li><svg class="ico ico-sm" aria-hidden="true"><use href="#i-x"/></svg><span><strong>Đừng chọn quán ồn cho buổi nói chuyện quan trọng</strong> — bàn chuyện cưới xin, chuyện hai nhà. Tạ Hiện và Chùa Láng vui nhưng nói không nghe thấy gì.</span></li>
          <li><svg class="ico ico-sm" aria-hidden="true"><use href="#i-x"/></svg><span><strong>Đừng đi quán nổi tiếng vào 11h30–13h và 18h–20h</strong> nếu ngại chờ. Lệch đi 45 phút là khác hẳn.</span></li>
          <li><svg class="ico ico-sm" aria-hidden="true"><use href="#i-x"/></svg><span><strong>Đừng gọi thừa món ở quán bún chả, bún đậu.</strong> Một suất ở đây nhiều hơn bạn tưởng — gọi thiếu rồi gọi thêm vẫn hơn.</span></li>
          <li><svg class="ico ico-sm" aria-hidden="true"><use href="#i-x"/></svg><span><strong>Đừng dồn hết quán ngon vào một tháng.</strong> Còn cả năm trước cưới và cả đời sau cưới — để dành vài chỗ làm quà cho những hôm cần dỗ dành.</span></li>
        </ul>
      </div>
    </div>

    <div class="note note--gold reveal">
      <svg class="ico" aria-hidden="true"><use href="#i-info"/></svg>
      <span>
        <strong>Địa chỉ và chỉ dẫn ở đây là để bạn hình dung, không phải bảo chứng.</strong>
        Quán xá Hà Nội thay đổi liên tục — đổi chủ, đổi giá, chuyển địa chỉ, nghỉ dài dịp Tết.
        Nút <em>Bản đồ</em> tra theo tên và địa chỉ, thỉnh thoảng Google trỏ lệch vài chục mét;
        đi xa hoặc dẫn người lớn đi cùng thì <strong>gọi một cuộc cho quán</strong> trước khi xuất phát.
      </span>
    </div>
  </div>
</section>

</main>

<!-- ===================== FOOTER ===================== -->
<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div>
        <h3 style="font-style:italic;font-size:1.4rem">Ăn gì ở Hà Nội</h3>
        <p style="color:var(--ink-2);font-size:.94rem;max-width:46ch">
          Trang phụ của <a href="index.html">lộ trình cưới Thắng &amp; Ngọc Anh</a>.
          Danh sách quán bấm <em>Muốn đi</em> được lưu ngay trên trình duyệt này, không gửi đi đâu cả.
        </p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">
          <button class="btn btn--ghost btn--sm" type="button" id="resetEats">
            <svg class="ico ico-sm" aria-hidden="true"><use href="#i-reset"/></svg>
            Xoá danh sách quán đã lưu
          </button>
        </div>
      </div>

      <div>
        <h3>Khu vực</h3>
        <ul>
${AREAS.slice(0, 5).map((a) => `          <li><a href="#kv-${a.key}">${esc(a.title)}</a></li>\n`).join("")}        </ul>
      </div>

      <div>
        <h3>Trang lộ trình cưới</h3>
        <ul>
          <li><a href="index.html#lo-trinh">Lộ trình theo tuần</a></li>
          <li><a href="index.html#chuan-bi">Checklist chuẩn bị</a></li>
          <li><a href="index.html#chi-phi">Máy tính cỗ &amp; chi phí</a></li>
          <li><a href="index.html#ngay-cuoi">Kịch bản hai ngày</a></li>
          <li><a href="index.html">Về trang chính</a></li>
        </ul>
      </div>
    </div>

    <div class="footer__bottom">
      <span>© <span id="year">2026</span> · Tài liệu cá nhân</span>
      <span>Giá và giờ mở chỉ mang tính tham khảo — tra lại bản đồ trước khi đi.</span>
    </div>
  </div>
</footer>

<div class="toast" id="toast" role="status" aria-live="polite" data-show="false"></div>

<script src="assets/js/app.js" defer></script>
</body>
</html>
`;

// Put actionable date plans before the long directory.
const routesSection = html.match(/<section class="section section--alt" id="cung-duong">[\s\S]*?<\/section>/)[0];
html = html.replace(routesSection, '');
const featured = `<section class="section dining-featured" id="goi-y"><div class="wrap">
  <div class="section__head"><span class="section__kicker">Mới trong sổ hẹn</span><h2 class="section__title">Bốn địa chỉ đáng dành một buổi tối</h2><p class="section__sub">Được MICHELIN ghi nhận hoặc giới thiệu. Mở nguồn ở từng thẻ để xem đánh giá; các quán mới chưa có điểm chấm riêng.</p></div>
  <div class="featured-grid">${PLACES.filter(p => p.source).map((p, i) => `<a class="featured-place" href="#quan-${slug(p.name)}"><span class="featured-place__number">0${i + 1}</span><span class="pill pill--gold">${esc(p.recognition)}</span><h3>${esc(p.name)}</h3><p>${esc(p.dish)}</p><span>Xem địa điểm ↗</span></a>`).join('')}</div>
</div></section>`;
html = html.replace('<!-- ===================== DANH SÁCH QUÁN', featured + '\n' + routesSection + '\n<!-- ===================== DANH SÁCH QUÁN');
const out = join(ROOT, "an-uong.html");
writeFileSync(out, html.replace(/[\t ]+\r?\n/g, '\n').replace(/\r?\n/g, "\r\n"), "utf8");
console.log(`an-uong.html: ${total} quán · ${nAreas} khu vực · ${nRoutes} cung đường`);
