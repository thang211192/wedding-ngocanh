// Test cho trang "Ăn gì ở Hà Nội".
//
// Chỉ có MỘT seam: trang an-uong.html đã dựng, chạy trong trình duyệt thật.
// Mọi khẳng định đều ở mức người dùng nhìn thấy — DOM đã render và hành vi khi
// bấm. Không gọi thẳng hàm trong app.js, không đụng biến nội bộ. Đổi cách cài
// đặt bộ lọc mà hành vi giữ nguyên thì test phải vẫn xanh.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { startServer } from "./server.mjs";
import { AREAS, KINDS, PLACES, ROUTES } from "../tools/data.mjs";

let server;
let browser;

before(async () => {
  server = await startServer();
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  await server?.close();
});

/** Mở một trang sạch (context mới ⇒ localStorage rỗng). */
async function open(path = "/an-uong.html") {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("dialog", (d) => d.accept());
  await page.goto(server.origin + path, { waitUntil: "load" });
  return { page, errors, close: () => ctx.close() };
}

const visibleCards = (page) =>
  page.locator(".eat:not([hidden])").count();

const visibleNames = (page) =>
  page.locator(".eat:not([hidden]) .eat__name").allTextContents();

// ---------------------------------------------------------------------------

describe("dữ liệu hiển thị trên trang", () => {
  test("render đủ số quán có trong dữ liệu", async () => {
    const { page, close } = await open();
    try {
      assert.equal(await page.locator(".eat").count(), PLACES.length);
      assert.equal(await page.locator(".eat-group").count(), AREAS.length);
      assert.equal(await page.locator(".route").count(), ROUTES.length);

      const count = await page.locator("#eatCount").textContent();
      assert.match(count, new RegExp(String(PLACES.length)));

      const title = await page.locator("#danh-sach .section__title").textContent();
      assert.match(title, new RegExp(`${PLACES.length} quán, ${AREAS.length} khu vực`));
    } finally { await close(); }
  });

  test("mỗi thẻ quán có đủ các phần bắt buộc", async () => {
    const { page, close } = await open();
    try {
      const thieu = await page.evaluate(() =>
        [...document.querySelectorAll(".eat")]
          .map((el) => {
            const can = {
              ten: ".eat__name", mon: ".eat__dish", sao: ".stars",
              diem: ".eat__score", chiDuong: ".eat__find", meo: ".eat__tip",
              nhan: ".pill", banDo: ".eat__map", luu: ".eat__save",
            };
            const hong = Object.entries(can)
              .filter(([, sel]) => !el.querySelector(sel)).map(([k]) => k);
            // dl phải có đúng ba dòng: địa chỉ, giờ mở, giá
            if (el.querySelectorAll(".eat__meta dd").length !== 3) hong.push("meta");
            return hong.length ? { id: el.dataset.id, hong } : null;
          })
          .filter(Boolean));
      assert.deepEqual(thieu, []);
    } finally { await close(); }
  });

  test("định danh thẻ quán không trùng nhau", async () => {
    const { page, close } = await open();
    try {
      const ids = await page.locator(".eat").evaluateAll((els) =>
        els.map((e) => e.dataset.id));
      assert.equal(new Set(ids).size, ids.length,
        "có data-id bị trùng: " + ids.filter((v, i) => ids.indexOf(v) !== i));
      assert.ok(ids.every((id) => /^[a-z0-9-]+$/.test(id)), "data-id phải là slug thuần ASCII");
    } finally { await close(); }
  });

  // Hồi quy quan trọng nhất của trang này. Trước đây chuỗi tra là địa chỉ ngăn
  // bằng dấu phẩy ("Phở Bát Đàn, 49 Bát Đàn, Hoàn Kiếm, Hà Nội"), Google chuyển
  // sang chế độ tra địa chỉ và trả về pin "Building" thay vì thẻ quán — nút Bản
  // đồ trở thành vô dụng. Chữ số thì không sao khi nó là một phần của tên quán.
  test("không chuỗi tra bản đồ nào dùng địa chỉ ngăn bằng dấu phẩy", async () => {
    const { page, close } = await open();
    try {
      const queries = await page.locator(".eat__map").evaluateAll((els) =>
        els.map((a) => new URL(a.href).searchParams.get("query")));

      assert.equal(queries.length, PLACES.length);
      const coDauPhay = queries.filter((q) => q.includes(","));
      assert.deepEqual(coDauPhay, [], "chuỗi tra không được chứa dấu phẩy");
      assert.ok(queries.every((q) => q && q.trim().length > 3));
    } finally { await close(); }
  });

  test("link bản đồ đúng dạng và mở tab mới an toàn", async () => {
    const { page, close } = await open();
    try {
      const hong = await page.locator(".eat__map").evaluateAll((els) =>
        els.filter((a) =>
          !a.href.startsWith("https://www.google.com/maps/search/?api=1&query=") ||
          a.target !== "_blank" ||
          !a.rel.includes("noopener") ||
          !a.rel.includes("noreferrer")).map((a) => a.href));
      assert.deepEqual(hong, []);

      // Trang không được rò địa chỉ trang riêng tư này sang Google.
      const referrer = await page.locator('meta[name="referrer"]').getAttribute("content");
      assert.equal(referrer, "no-referrer");
    } finally { await close(); }
  });

  test("mọi tham chiếu icon đều trỏ tới một symbol có thật", async () => {
    const { page, close } = await open();
    try {
      const thieu = await page.evaluate(() => {
        const co = new Set([...document.querySelectorAll("symbol[id]")].map((s) => s.id));
        return [...new Set([...document.querySelectorAll('use[href^="#"]')]
          .map((u) => u.getAttribute("href").slice(1)))].filter((id) => !co.has(id));
      });
      assert.deepEqual(thieu, []);
    } finally { await close(); }
  });

  test("mọi neo nhảy tới khu vực đều có nhóm thật", async () => {
    const { page, close } = await open();
    try {
      const hong = await page.evaluate(() =>
        [...document.querySelectorAll('a[href^="#kv-"]')]
          .map((a) => a.getAttribute("href"))
          .filter((h) => !document.querySelector(h)));
      assert.deepEqual(hong, []);
    } finally { await close(); }
  });

  test("số trên chip khu vực khớp số thẻ thật trong nhóm", async () => {
    const { page, close } = await open();
    try {
      for (const area of AREAS) {
        const chip = page.locator(`[data-area-f="${area.key}"] .chip__n`);
        const that = await page.locator(`.eat[data-area="${area.key}"]`).count();
        assert.equal(Number(await chip.textContent()), that, `chip ${area.key}`);
      }
      const tatCa = await page.locator('[data-area-f="all"] .chip__n').textContent();
      assert.equal(Number(tatCa), PLACES.length);
    } finally { await close(); }
  });

  test("ba khu quanh nhà được xếp lên đầu và đánh dấu riêng", async () => {
    const { page, close } = await open();
    try {
      const thuTu = await page.locator(".eat-group").evaluateAll((els) =>
        els.map((e) => e.dataset.group));
      assert.deepEqual(thuTu, AREAS.map((a) => a.key));

      const home = AREAS.filter((a) => a.home).map((a) => a.key);
      const duocDanhDau = await page.locator(".eat-group--home").evaluateAll((els) =>
        els.map((e) => e.dataset.group));
      assert.deepEqual(duocDanhDau, home);
      assert.equal(await page.locator(".eat-group--home .eat-group__badge").count(), home.length);
    } finally { await close(); }
  });
});

// ---------------------------------------------------------------------------

describe("lọc và tìm kiếm", () => {
  test("lọc theo từng khu vực ra đúng số thẻ và ẩn nhóm rỗng", async () => {
    const { page, close } = await open();
    try {
      for (const area of AREAS) {
        await page.click(`[data-area-f="${area.key}"]`);
        const mong = PLACES.filter((p) => p.area === area.key).length;
        assert.equal(await visibleCards(page), mong, `khu ${area.key}`);
        assert.equal(await page.locator(".eat-group:not([hidden])").count(), 1,
          `chỉ nhóm ${area.key} được hiện`);
      }
    } finally { await close(); }
  });

  test("lọc theo kiểu ăn ra đúng số thẻ", async () => {
    const { page, close } = await open();
    try {
      for (const kind of KINDS) {
        await page.click(`[data-kind-f="${kind.key}"]`);
        const mong = PLACES.filter((p) => p.kinds.includes(kind.key)).length;
        assert.equal(await visibleCards(page), mong, `kiểu ${kind.key}`);
      }
    } finally { await close(); }
  });

  test("tìm kiếm không dấu ra cùng kết quả với gõ có dấu", async () => {
    const { page, close } = await open();
    try {
      await page.fill("#eatSearch", "BÁNH ĐÚC");
      const coDau = await visibleNames(page);
      await page.fill("#eatSearch", "banh duc");
      const khongDau = await visibleNames(page);

      assert.deepEqual(khongDau, coDau);
      assert.ok(coDau.length > 0, "phải tìm được ít nhất một quán");
      assert.ok(coDau.some((n) => n.includes("Bánh đúc")));
    } finally { await close(); }
  });

  test("tìm theo mốc đường đi ra được quán quanh mốc đó", async () => {
    const { page, close } = await open();
    try {
      // "nhà thờ lớn" không nằm trong tên quán nào — chỉ có trong phần chỉ đường.
      await page.fill("#eatSearch", "nha tho lon");
      const ten = await visibleNames(page);
      assert.ok(ten.length >= 2, "mốc quen phải ra nhiều quán quanh đó");
      assert.ok(ten.every((n) => !n.toLowerCase().includes("nhà thờ")),
        "kết quả đến từ phần chỉ đường chứ không phải tên quán");
    } finally { await close(); }
  });

  test("tìm chuỗi vô nghĩa thì hiện trạng thái rỗng", async () => {
    const { page, close } = await open();
    try {
      await page.fill("#eatSearch", "zzzzzzzz");
      assert.equal(await visibleCards(page), 0);
      await assert.doesNotReject(page.locator("#eatEmpty").waitFor({ state: "visible" }));
      assert.equal(await page.locator(".eat-group:not([hidden])").count(), 0);
    } finally { await close(); }
  });

  test("bỏ lọc trả về đủ danh sách", async () => {
    const { page, close } = await open();
    try {
      await page.click('[data-area-f="tay-ho"]');
      await page.click('[data-kind-f="hen"]');
      await page.fill("#eatSearch", "ca phe");
      assert.ok(await visibleCards(page) < PLACES.length);

      await page.click("#eatReset");
      assert.equal(await visibleCards(page), PLACES.length);
      assert.equal(await page.inputValue("#eatSearch"), "");
      assert.equal(await page.locator(".eat-group:not([hidden])").count(), AREAS.length);
    } finally { await close(); }
  });
});

// ---------------------------------------------------------------------------

describe("lưu quán muốn đi", () => {
  test("bấm Muốn đi thì vẫn còn sau khi tải lại trang", async () => {
    const { page, close } = await open();
    try {
      const the = page.locator('.eat[data-id="gac-mien"]');
      await the.locator(".eat__save").click();
      assert.equal(await the.getAttribute("data-saved"), "true");
      assert.equal(await page.locator("#eatSavedN").textContent(), "1");

      await page.reload({ waitUntil: "load" });
      assert.equal(await page.locator('.eat[data-id="gac-mien"]').getAttribute("data-saved"), "true");
      assert.equal(await page.locator("#eatSavedN").textContent(), "1");
    } finally { await close(); }
  });

  test("chip chỉ hiện quán đã lưu thu hẹp đúng danh sách", async () => {
    const { page, close } = await open();
    try {
      for (const id of ["gac-mien", "bat-trang", "pho-bat-dan"]) {
        await page.locator(`.eat[data-id="${id}"] .eat__save`).click();
      }
      await page.click("#eatSavedOnly");
      assert.equal(await visibleCards(page), 3);

      await page.click("#eatReset");
      assert.equal(await visibleCards(page), PLACES.length);
    } finally { await close(); }
  });

  test("xoá danh sách quán không đụng dữ liệu của trang lộ trình cưới", async () => {
    const { page, close } = await open();
    try {
      await page.evaluate(() => {
        localStorage.setItem("wnc:tasks", JSON.stringify({ a: true }));
        localStorage.setItem("wnc:budget", JSON.stringify({ b: 1 }));
      });
      await page.locator('.eat[data-id="gac-mien"] .eat__save').click();
      assert.equal(await page.locator("#eatSavedN").textContent(), "1");

      await page.click("#resetEats");
      assert.equal(await page.locator("#eatSavedN").textContent(), "0");

      const conLai = await page.evaluate(() => ({
        eats: localStorage.getItem("wnc:eats"),
        tasks: localStorage.getItem("wnc:tasks"),
        budget: localStorage.getItem("wnc:budget"),
      }));
      assert.equal(conLai.eats, "[]");
      assert.equal(conLai.tasks, '{"a":true}');
      assert.equal(conLai.budget, '{"b":1}');
    } finally { await close(); }
  });
});

// ---------------------------------------------------------------------------

describe("trình bày", () => {
  test("không tràn ngang ở bề rộng 375px", async () => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 760 } });
    const page = await ctx.newPage();
    try {
      await page.goto(server.origin + "/an-uong.html", { waitUntil: "load" });
      const tran = await page.evaluate(() => ({
        trang: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        the: [...document.querySelectorAll(".eat")]
          .filter((e) => e.scrollWidth > e.clientWidth + 1).length,
      }));
      assert.equal(tran.trang, 0, "cả trang không được cuộn ngang");
      assert.equal(tran.the, 0, "không thẻ quán nào được tràn ngang");
    } finally { await ctx.close(); }
  });

  test("không có lỗi console khi tải trang", async () => {
    const { errors, close } = await open();
    try {
      assert.deepEqual(errors, []);
    } finally { await close(); }
  });
});

// ---------------------------------------------------------------------------

describe("liên kết với trang lộ trình cưới", () => {
  test("index.html không còn thẻ quán và có link sang trang ăn uống", async () => {
    const { page, errors, close } = await open("/index.html");
    try {
      assert.equal(await page.locator(".eat").count(), 0,
        "nội dung ăn uống phải nằm ở trang riêng");

      const link = 'a[href="an-uong.html"]';
      assert.ok(await page.locator(`.nav ${link}`).count() > 0, "thiếu link ở nav");
      assert.ok(await page.locator(`.sheet ${link}`).count() > 0, "thiếu link ở menu mobile");
      assert.ok(await page.locator(`.footer ${link}`).count() > 0, "thiếu link ở footer");
      assert.ok(await page.locator(`.hero ${link}`).count() > 0, "thiếu nút ở hero");
      assert.deepEqual(errors, []);
    } finally { await close(); }
  });
});
