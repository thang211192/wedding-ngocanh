import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer } from './server.mjs';
let server, browser;
before(async () => { server = await startServer(); browser = await chromium.launch(); });
after(async () => { await browser?.close(); await server?.close(); });
async function open(options = {}) {
  const ctx = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'], ...options });
  const page = await ctx.newPage();
  await page.goto(server.origin + '/thiep-cuoi.html');
  await page.waitForFunction(() => {
    const canvas = document.querySelector('#heroCanvas');
    return canvas.getContext('2d').getImageData(0, 0, 1, 1).data[3] > 0;
  });
  return { ctx, page };
}
async function fill(page) {
  await page.locator('#date').fill('2026-12-20');
  await page.locator('#time').fill('11:00');
  await page.locator('#venue').fill('Tư gia nhà trai');
  await page.locator('#address').fill('Địa chỉ thử nghiệm, Nam Định');
  await page.locator('#guest').fill('Minh và gia đình');
}
test('40 mẫu khác nhau; lọc, chọn mẫu và giao diện điện thoại hoạt động', async () => {
  const { ctx, page } = await open();
  try {
    assert.equal(await page.locator('.template').count(), 40);
    const images = await page.locator('.template canvas').evaluateAll(xs => xs.map(c => c.toDataURL()));
    assert.equal(new Set(images).size, 40);
    assert.equal(await page.locator('.template-badge').count(), 24);
    for (const [filter, count] of [['formal', 14], ['minimal', 13], ['romantic', 13], ['new', 24], ['all', 40]]) {
      await page.locator(`[data-filter="${filter}"]`).click();
      assert.equal(await page.locator('.template:visible').count(), count);
    }
    for (const width of [1280, 768, 375]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    await page.locator('.template-visual').nth(15).click();
    assert.equal(await page.locator('#previewName').textContent(), 'Dấu ấn xanh rêu');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#previewDialog').isVisible(), false);
  } finally { await ctx.close(); }
});
test('không gửi thiệp thiếu thông tin; lưu dữ liệu và sao chép đúng lời mời', async () => {
  const { ctx, page } = await open();
  try {
    await page.locator('.template-visual').first().click();
    await page.locator('#copyMessage').click();
    assert.match(await page.locator('#previewStatus').textContent(), /Vui lòng điền/);
    await page.locator('#editDetails').click();
    await fill(page);
    await page.selectOption('#tone', 'friends');
    await page.reload();
    assert.equal(await page.locator('#guest').inputValue(), 'Minh và gia đình');
    assert.equal(await page.locator('#tone').inputValue(), 'friends');
    await page.locator('.template-visual').first().click();
    await page.locator('#copyMessage').click();
    await page.waitForFunction(() => document.querySelector('#previewStatus').textContent.includes('Đã sao chép'));
    const text = await page.evaluate(() => navigator.clipboard.readText());
    assert.match(text, /Văn Thắng & Ngọc Anh/);
    assert.match(text, /Minh và gia đình ơi/);
    assert.match(text, /11:00/);
    assert.match(text, /20\/12\/2026/);
    assert.equal(text.includes('[Ngày tổ chức]'), false);
  } finally { await ctx.close(); }
});
test('liên kết mở được thiệp riêng ở trình duyệt khác; tải được PNG 1500 × 2000', async () => {
  const { ctx, page } = await open();
  const recipient = await browser.newContext();
  try {
    await fill(page);
    await page.locator('.template-visual').nth(39).click();
    await page.locator('#copyInviteLink').click();
    await page.waitForFunction(() => document.querySelector('#previewStatus').textContent.includes('Đã sao chép'));
    const url = await page.evaluate(() => navigator.clipboard.readText());
    const guest = await recipient.newPage();
    await guest.setViewportSize({ width: 390, height: 844 });
    await guest.goto(url);
    assert.equal(await guest.locator('#guestView').isVisible(), true);
    assert.equal(await guest.locator('#studio').isVisible(), false);
    assert.equal(await guest.locator('#guestCover').isVisible(), true);
    assert.equal(await guest.locator('#guestReveal').isVisible(), false);
    assert.match(await guest.locator('#coverGuest').textContent(), /Minh và gia đình/);
    await guest.locator('#openGuestInvite').click();
    assert.equal(await guest.locator('#guestCover').isVisible(), false);
    assert.equal(await guest.locator('#guestReveal').isVisible(), true);
    assert.equal(await guest.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.match(await guest.locator('#guestText').textContent(), /Minh và gia đình/);
    assert.match(await guest.locator('#guestMap').getAttribute('href'), /^https:\/\/www.google.com\/maps\/search/);
    const download = await Promise.all([page.waitForEvent('download'), page.locator('#downloadInvite').click()]).then(x => x[0]);
    assert.equal(download.suggestedFilename(), 'thiep-cuoi-sakura-loi-uoc.png');
    const stream = await download.createReadStream();
    const chunks = []; for await (const chunk of stream) chunks.push(chunk);
    const bytes = Buffer.concat(chunks);
    assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
    assert.equal(bytes.readUInt32BE(16), 1500);
    assert.equal(bytes.readUInt32BE(20), 2000);
  } finally { await recipient.close(); await ctx.close(); }
});
test('liên kết lỗi, nội dung HTML và trình duyệt chặn lưu không làm hỏng trang', async () => {
  const { ctx, page } = await open();
  try {
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(server.origin + '/thiep-cuoi.html#moi=%7Bbroken');
    assert.equal(await page.locator('#studio').isVisible(), true);
    await page.evaluate(() => Object.defineProperty(Storage.prototype, 'setItem', { value() { throw Error('blocked'); } }));
    await page.locator('#guest').fill('<img src=x onerror=alert(1)>');
    assert.match(await page.locator('#saveStatus').textContent(), /chưa cho lưu/);
    assert.equal(await page.locator('img[src=x]').count(), 0);
    assert.deepEqual(errors, []);
  } finally { await ctx.close(); }
});

test('font viết tay có tiếng Việt và 14 nền minh họa tải đủ trước khi xuất thiệp', async () => {
  const { ctx, page } = await open();
  try {
    assert.equal(await page.evaluate(() => document.fonts.check('400 40px "Great Vibes"', 'Văn Thắng Ngọc Anh')), true);
    const assets = await page.evaluate(() => performance.getEntriesByType('resource').filter(x => /images\/invitations\/.*-v2.webp/.test(x.name)).map(x => x.name));
    assert.equal(new Set(assets).size, 14);
    await page.locator('.template-visual').nth(4).click();
    const popupPromise = page.waitForEvent('popup');
    await page.locator('#previewGuest').click();
    const recipient = await popupPromise;
    await recipient.waitForLoadState();
    assert.equal(await recipient.locator('#guestCover').isVisible(), true);
  } finally { await ctx.close(); }
});

test('tìm kiếm không dấu, theo số mẫu và kết hợp chủ đề không làm mất mẫu cũ', async () => {
  const { ctx, page } = await open();
  try {
    await page.locator('#templateSearch').fill('tu dang');
    assert.equal(await page.locator('.template:visible').count(), 3);
    await page.locator('#templateSearch').fill('Tử đằng');
    assert.equal(await page.locator('.template:visible').count(), 3);
    await page.locator('#templateSearch').fill('40');
    assert.equal(await page.locator('.template:visible').count(), 1);
    assert.equal(await page.locator('.template:visible h3').textContent(), 'Sakura lời ước');
    await page.locator('#templateSearch').fill('');
    await page.selectOption('#templateTheme', 'orchid');
    assert.equal(await page.locator('.template:visible').count(), 3);
    await page.locator('[data-filter="formal"]').click();
    assert.equal(await page.locator('.template:visible').count(), 1);
    await page.locator('#templateSearch').fill('không có mẫu này');
    assert.equal(await page.locator('#templateEmpty').isVisible(), true);
    await page.locator('#resetTemplateFilters').click();
    assert.equal(await page.locator('.template:visible').count(), 40);
    await page.locator('#showNewTemplates').click();
    assert.equal(await page.locator('.template:visible').count(), 24);
    await page.locator('.template-visual:visible').last().click();
    assert.equal(await page.locator('#previewTitle').textContent(), 'MẪU 40 / 40');
    assert.equal(await page.locator('#previewName').textContent(), 'Sakura lời ước');
  } finally { await ctx.close(); }
});
