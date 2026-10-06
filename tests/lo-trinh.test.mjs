// Test cho phần "Chi tiết từng bước" trong mục Lộ trình của index.html.
//
// Cùng một seam với bộ test trang ăn uống: trang thật, trình duyệt thật, chỉ
// khẳng định những gì người dùng nhìn thấy và bấm được. Điểm phải giữ bằng mọi
// giá là hai hệ tiến độ — các bước trong Lộ trình và checklist 114 việc ở mục
// Chuẩn bị — không được ghi đè lên nhau.

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

/** Mở trang chủ sạch (context mới ⇒ localStorage rỗng). */
async function open() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("dialog", (d) => d.accept());
  await page.goto(server.origin + "/index.html", { waitUntil: "load" });
  return { page, errors, close: () => ctx.close() };
}

const steps = (page) => page.locator("#lo-trinh .step input[data-step]");

describe("chi tiết từng bước", () => {
  test("mười giai đoạn đều có khối chi tiết, không giai đoạn nào rỗng", async () => {
    const { page, errors, close } = await open();
    try {
      const groups = page.locator("#lo-trinh [data-steps]");
      assert.equal(await groups.count(), 10);

      let total = 0;
      for (let i = 0; i < 10; i++) {
        const group = groups.nth(i);
        const n = await group.locator("input[data-step]").count();
        assert.ok(n >= 8, `giai đoạn ${i + 1} chỉ có ${n} bước`);
        // Số hiện trên nút phải khớp số bước thật bên trong.
        assert.equal(await group.locator(".steps__count").textContent(), `0/${n} bước`);
        total += n;
      }
      assert.equal(total, await steps(page).count());
      assert.equal(await page.locator("#stepsNum").textContent(), `0/${total} · 0%`);
      assert.deepEqual(errors, []);
    } finally {
      await close();
    }
  });

  test("mọi bước đều có id riêng — không bước nào dùng chung ô tích", async () => {
    const { page, close } = await open();
    try {
      const ids = await steps(page).evaluateAll((els) =>
        els.map((e) => e.getAttribute("data-step")),
      );
      assert.equal(new Set(ids).size, ids.length);
    } finally {
      await close();
    }
  });

  test("tick một bước thì được lưu lại, tải lại trang vẫn còn", async () => {
    const { page, close } = await open();
    try {
      const group = page.locator('[data-steps="gd1"]');
      await group.locator("summary").click();
      const box = group.locator("input[data-step]").first();
      await box.check();

      assert.equal(await group.locator(".steps__count").textContent(), "1/12 bước");

      await page.reload();
      assert.ok(await group.locator("input[data-step]").first().isChecked());
      assert.equal(await group.locator(".steps__count").textContent(), "1/12 bước");
    } finally {
      await close();
    }
  });

  test("tiến độ các bước và checklist 114 việc không ghi đè nhau", async () => {
    const { page, close } = await open();
    try {
      const group = page.locator('[data-steps="gd1"]');
      await group.locator("summary").click();
      await group.locator("input[data-step]").first().check();
      await page.locator('#chuan-bi input[data-task]').first().check();
      await page.reload();

      // Cả hai đều còn, mỗi bên lưu dưới khoá riêng.
      assert.ok(await group.locator("input[data-step]").first().isChecked());
      assert.ok(await page.locator('#chuan-bi input[data-task]').first().isChecked());

      const keys = await page.evaluate(() => Object.keys(localStorage).sort());
      assert.ok(keys.includes("wnc:steps"), keys.join(","));
      assert.ok(keys.includes("wnc:tasks"), keys.join(","));

      // Xoá tiến độ các bước không được đụng tới checklist.
      await page.locator("#resetSteps").click();
      assert.equal(await group.locator("input[data-step]").first().isChecked(), false);
      assert.ok(await page.locator('#chuan-bi input[data-task]').first().isChecked());
    } finally {
      await close();
    }
  });

  test('nút "Mở tất cả chi tiết" mở hết rồi thu gọn hết', async () => {
    const { page, close } = await open();
    try {
      const btn = page.locator("#expandSteps");
      const open_ = () => page.locator("#lo-trinh .steps[open]").count();

      assert.equal(await open_(), 0);
      await btn.click();
      assert.equal(await open_(), 10);
      await btn.click();
      assert.equal(await open_(), 0);
    } finally {
      await close();
    }
  });

  test("tắt JS thì nội dung các bước vẫn đọc được", async () => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    try {
      await page.goto(server.origin + "/index.html", { waitUntil: "load" });
      // details đóng, nhưng nội dung vẫn nằm trong DOM và mở được bằng thao tác
      // gốc của trình duyệt — trang không phụ thuộc JS để đọc nội dung.
      assert.equal(await page.locator("#lo-trinh .step").count(), 131);
      await page.locator('[data-steps="gd1"] summary').click();
      await page
        .locator('[data-steps="gd1"] .step__title')
        .first()
        .waitFor({ state: "visible" });
    } finally {
      await ctx.close();
    }
  });
});

describe("mục ăn nói", () => {
  test("có trên thanh điều hướng và đủ 24 kịch bản", async () => {
    const { page, errors, close } = await open();
    try {
      assert.equal(await page.locator('.nav__link[href="#an-noi"]').count(), 1);
      assert.equal(await page.locator("#an-noi .say").count(), 24);

      // Số ghi trên mỗi nhóm phải khớp số mục thật bên trong. Mỗi nhóm chỉ dùng
      // một loại mục, nên cộng cả bốn loại lại là ra đúng số của nhóm đó.
      const groups = page.locator("#an-noi .acc");
      assert.ok((await groups.count()) >= 12, "thiếu nhóm trong mục Ăn nói");
      for (let i = 0; i < (await groups.count()); i++) {
        const g = groups.nth(i);
        const label = await g.locator(".acc__count").textContent();
        const m = /^(\d+) (tình huống|cách nói|chủ đề|câu hỏi|mốc)$/.exec(label);
        assert.ok(m, `nhãn nhóm không đúng mẫu: ${label}`);
        const n = await g
          .locator(".say, .talk__item, .qa__item, .sched__row")
          .count();
        assert.equal(Number(m[1]), n, `nhóm "${label}" ghi lệch so với ${n} mục thật`);
      }
      assert.deepEqual(errors, []);
    } finally {
      await close();
    }
  });

  test("mọi link từ Lộ trình đều trỏ tới một nhóm có thật", async () => {
    const { page, close } = await open();
    try {
      const hrefs = await page
        .locator("#lo-trinh .steps__link a")
        .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
      // Bảy giai đoạn có kịch bản, cộng một link riêng cho buổi đặt vấn đề.
      assert.equal(hrefs.length, 8);
      for (const href of hrefs) {
        assert.equal(await page.locator(href).count(), 1, `thiếu ${href}`);
      }
    } finally {
      await close();
    }
  });

  test("buổi đặt vấn đề có đủ năm nhóm và mọi link trong trang đều trỏ đúng chỗ", async () => {
    const { page, close } = await open();
    try {
      assert.equal(await page.locator("#dat-van-de").count(), 1);
      for (const id of [
        "#noi-dat-van-de",
        "#noi-dien-bien",
        "#noi-mau-chuyen",
        "#noi-cau-hoi",
        "#noi-tinh-huong",
      ]) {
        assert.equal(await page.locator(id).count(), 1, `thiếu nhóm ${id}`);
      }

      // Toàn trang: mọi link nội bộ phải tới được một chỗ có thật. Mục Ăn nói
      // trỏ chéo sang Lộ trình và ngược lại, rất dễ gõ sai một id mà không ai
      // phát hiện — để test bắt thay.
      const hrefs = await page
        .locator('a[href^="#"]')
        .evaluateAll((els) =>
          els.map((e) => e.getAttribute("href")).filter((h) => h && h !== "#"),
        );
      assert.ok(hrefs.length > 20, `chỉ thấy ${hrefs.length} link nội bộ`);
      for (const href of new Set(hrefs)) {
        assert.equal(await page.locator(href).count(), 1, `link chết: ${href}`);
      }
    } finally {
      await close();
    }
  });

  test("in ra giấy thì các nhóm kịch bản tự mở rồi đóng lại", async () => {
    const { page, close } = await open();
    try {
      const closed = () => page.locator("#an-noi .acc:not([open])").count();
      const before = await closed();
      assert.ok(before > 0, "lẽ ra phải có nhóm đang đóng");

      await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
      assert.equal(await closed(), 0, "in mà vẫn còn nhóm đóng thì bản in thiếu nội dung");

      await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
      assert.equal(await closed(), before);
    } finally {
      await close();
    }
  });

  test("nền các mục vẫn xen kẽ, không hai mục liền nhau trùng nền", async () => {
    const { page, close } = await open();
    try {
      const alts = await page
        .locator("main section.section, body > section.section")
        .evaluateAll((els) => els.map((e) => e.classList.contains("section--alt")));
      assert.ok(alts.length >= 10, `chỉ thấy ${alts.length} mục`);
      for (let i = 1; i < alts.length; i++) {
        assert.notEqual(alts[i], alts[i - 1], `mục thứ ${i + 1} trùng nền với mục trước`);
      }
    } finally {
      await close();
    }
  });
});
