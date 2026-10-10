// Test cho trang "Phòng cưới".
//
// Như hai bộ test kia: chỉ khẳng định ở mức người dùng nhìn thấy (DOM đã vẽ,
// hành vi khi bấm), không gọi hàm nội bộ của room.js.
// Thư viện 3D tải từ cdnjs. Máy chạy test không có mạng thì phần 3D phải báo
// lỗi nhẹ nhàng (data-state="error") chứ không được làm hỏng cả trang.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { startServer } from "./server.mjs";

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

async function open(path = "/phong-cuoi.html") {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  // Lỗi tải tài nguyên ngoài (CDN, font) khi mất mạng không tính là lỗi của trang.
  page.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
  await page.goto(server.origin + path, { waitUntil: "load" });
  return { page, errors, close: () => ctx.close() };
}

const legendCount = (page) => page.locator("#planLegend li").count();
const planLabel = (page) => page.locator("#plan svg").getAttribute("aria-label");

describe("mặt bằng", () => {
  test("vẽ phương án mới (mặc định bản tiết kiệm), chuyển sang hiện trạng và ngược lại", async () => {
    const { page, errors, close } = await open();
    try {
      assert.match(await planLabel(page), /sau cải tạo, bản tiết kiệm/);
      assert.equal(await legendCount(page), 7);
      await page.click('[data-plan-tab="cu"]');
      assert.match(await planLabel(page), /hiện trạng/);
      assert.equal(await legendCount(page), 8);
      assert.equal(await page.getAttribute('[data-plan-tab="cu"]', "aria-pressed"), "true");
      await page.click('[data-plan-tab="moi"]');
      assert.equal(await legendCount(page), 7);
      assert.deepEqual(errors, []);
    } finally { await close(); }
  });

  test("chuyển sang bản đầy đủ thì mặt bằng, các nút và bảng chi phí cùng đổi, tải lại vẫn nhớ", async () => {
    const { page, errors, close } = await open();
    try {
      await page.locator('.plan [data-variant="full"]').click();
      assert.match(await planLabel(page), /bản đầy đủ/);
      assert.equal(await legendCount(page), 12);
      assert.equal(await page.getAttribute('.v3d [data-variant="full"]', "aria-pressed"), "true");
      assert.equal(await page.getAttribute('.cost-presets [data-variant="full"]', "aria-pressed"), "true");
      assert.equal(await page.textContent("#costTotal"), "89–143 triệu");
      await page.reload();
      assert.match(await planLabel(page), /bản đầy đủ/);
      await page.locator('.plan [data-variant="tk"]').click();
      assert.equal(await legendCount(page), 7);
      assert.equal(await page.textContent("#costTotal"), "18–33 triệu");
      assert.deepEqual(errors, []);
    } finally { await close(); }
  });

  test("nhập số đo thì vẽ lại, tải lại vẫn còn, bấm về số đo theo gạch thì trả lại", async () => {
    const { page, close } = await open();
    try {
      await page.fill('#dimsForm [name="W"]', "4");
      await page.fill('#dimsForm [name="L"]', "7.2");
      await page.click('#dimsForm [type="submit"]');
      assert.match(await planLabel(page), /4 × 7,2 mét/);
      assert.equal(await page.textContent("#roomArea"), "28,8 m²");
      await page.reload();
      assert.equal(await page.inputValue('#dimsForm [name="W"]'), "4");
      assert.match(await planLabel(page), /4 × 7,2 mét/);
      await page.click("#dimsReset");
      assert.match(await planLabel(page), /2,88 × 8 mét/);
    } finally { await close(); }
  });

  test("bản tiết kiệm giữ cửa 1, bản đầy đủ mới xây thành cửa sổ", async () => {
    const { page, close } = await open();
    try {
      const labels = () => page.locator("#plan .pl-door").allTextContents();
      assert.deepEqual(await labels(), ["Cửa 1", "Cửa 2", "Cửa 3 · ra nhà tắm"]);
      await page.locator('.plan [data-variant="full"]').click();
      assert.deepEqual(await labels(), ["Cửa 1 → cửa sổ", "Cửa 2", "Cửa 3 · ra nhà tắm"]);
      await page.click('[data-plan-tab="cu"]');
      assert.deepEqual(await labels(), ["Cửa 1", "Cửa 2", "Cửa 3 · ra nhà tắm"]);
    } finally { await close(); }
  });

  test("số đo ngoài khoảng hợp lý bị kẹp lại, không vẽ phòng vô lý", async () => {
    const { page, close } = await open();
    try {
      await page.fill('#dimsForm [name="W"]', "40");
      await page.dispatchEvent("#dimsForm", "submit");
      assert.match(await planLabel(page), /5 × 8 mét/);
    } finally { await close(); }
  });
});

describe("bảng màu", () => {
  test("chọn ở thẻ màu thì nút trên 3D cũng đổi theo, và nhớ sau khi tải lại", async () => {
    const { page, close } = await open();
    try {
      assert.equal(await page.locator(".pal").count(), 3);
      await page.click('.pal[data-palette="sage"]');
      assert.equal(await page.getAttribute('.pal[data-palette="sage"]', "aria-pressed"), "true");
      assert.equal(await page.getAttribute('.v3d__palette [data-palette="sage"]', "aria-pressed"), "true");
      assert.equal(await page.getAttribute('.v3d__palette [data-palette="kem"]', "aria-pressed"), "false");
      await page.reload();
      assert.equal(await page.getAttribute('.v3d__palette [data-palette="sage"]', "aria-pressed"), "true");
    } finally { await close(); }
  });
});

describe("dự trù chi phí", () => {
  test("bản tiết kiệm: nâng cấp mặc định không tính, tick vào thì cộng đúng", async () => {
    const { page, close } = await open();
    try {
      assert.equal(await page.textContent("#costTotal"), "18–33 triệu");
      assert.equal(await page.textContent("#costCount"), "14/21 hạng mục");
      await page.locator('[data-cost-table="tk"] input[aria-label="Tính hạng mục trần"]').check();
      assert.equal(await page.textContent("#costTotal"), "25–43 triệu");
      assert.equal(await page.textContent("#costCount"), "15/21 hạng mục");
      // bấm lại nút bản đang chọn (ở mặt bằng hay 3D) không được xoá dấu tick vừa chọn
      await page.locator('.plan [data-variant="tk"]').click();
      assert.equal(await page.textContent("#costTotal"), "25–43 triệu");
    } finally { await close(); }
  });

  test("bản đầy đủ: bỏ tick một hạng mục thì tổng trừ đúng khoảng của hạng mục đó", async () => {
    const { page, close } = await open();
    try {
      await page.locator('.cost-presets [data-variant="full"]').click();
      assert.equal(await page.textContent("#costTotal"), "89–143 triệu");
      await page.locator('[data-cost-table="full"] [data-cost][data-lo="16"] input').uncheck();
      assert.equal(await page.textContent("#costTotal"), "73–119 triệu");
      assert.equal(await page.textContent("#costCount"), "13/14 hạng mục");
    } finally { await close(); }
  });
});

describe("phối cảnh 3D", () => {
  test("dựng xong hoặc báo lỗi rõ ràng, không kẹt ở trạng thái đang tải", async () => {
    const { page, errors, close } = await open();
    try {
      await page.waitForFunction(() => document.querySelector("#view3d").dataset.state !== "loading");
      const state = await page.getAttribute("#view3d", "data-state");
      if (state === "ready") {
        assert.equal(await page.locator("#view3dCanvas canvas").count(), 1);
        await page.click('[data-cam="tren"]');
        assert.equal(await page.getAttribute('[data-cam="tren"]', "aria-pressed"), "true");
        assert.equal(await page.getAttribute('[data-cam="tong"]', "aria-pressed"), "false");
        await page.click("#weddingBtn");
        assert.equal(await page.getAttribute("#weddingBtn", "aria-pressed"), "true");
      } else {
        assert.equal(state, "error");
        assert.ok((await page.textContent("#view3dMsg")).length > 10);
      }
      assert.deepEqual(errors, []);
    } finally { await close(); }
  });
});

describe("cửa 1", () => {
  test("có hình trước / sau, và dòng chi phí dẫn tới hình", async () => {
    const { page, errors, close } = await open();
    try {
      assert.equal(await page.locator("#cua-1 .ev__svg").count(), 2);
      assert.match(await page.locator("#cua-1 .ev__svg").nth(1).getAttribute("aria-label"), /cửa sổ/);
      assert.equal(await page.locator('[data-cost] a[href="#cua-1"]').count(), 1);
      assert.equal(await page.locator('[data-cam="cua1"]').count(), 1);
      assert.deepEqual(errors, []);
    } finally { await close(); }
  });
});

describe("liên kết", () => {
  test("trang chính có đường sang trang phòng cưới", async () => {
    const { page, close } = await open("/index.html");
    try {
      assert.ok(await page.locator('a[href="phong-cuoi.html"]').count() >= 3);
    } finally { await close(); }
  });
});
