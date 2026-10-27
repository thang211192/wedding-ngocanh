// Render a reusable 1200 × 630 JPEG preview using the site's local fonts/artwork.
// Run locally: node tools/render-invitation-og.mjs
// Commit the output; Netlify's static deployment does not need Playwright.
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { startServer } from '../tests/server.mjs';

const server = await startServer();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(server.origin + '/thiep-cuoi.html');
  const base64 = await page.evaluate(async origin => {
    await Promise.all([
      document.fonts.load('400 96px "Great Vibes"', 'Văn Thắng Ngọc Anh'),
      document.fonts.load('400 20px "Be Vietnam Pro"', 'Trân trọng kính mời'),
      document.fonts.load('600 20px "Be Vietnam Pro"', 'THIỆP MỜI CƯỚI')
    ]);
    const art = new Image();
    art.src = origin + '/assets/images/invitations/cherry-v2.webp';
    await art.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 1200; canvas.height = 630;
    const c = canvas.getContext('2d');
    c.fillStyle = '#fbf5ea'; c.fillRect(0, 0, 1200, 630);
    const scale = 1200 / art.naturalWidth;
    c.globalAlpha = .65;
    c.drawImage(art, 0, -(art.naturalHeight * scale - 630) / 2, 1200, art.naturalHeight * scale);
    c.globalAlpha = 1;
    const veil = c.createLinearGradient(340, 0, 1200, 0);
    veil.addColorStop(0, '#fffaf000'); veil.addColorStop(.2, '#fffaf0e8'); veil.addColorStop(1, '#fffaf0a8');
    c.fillStyle = veil; c.fillRect(0, 0, 1200, 630);
    function text(value, x, y, size, family, color, weight = 400, max = 620) {
      c.fillStyle = color; c.textAlign = 'center'; c.font = `${weight} ${size}px "${family}"`;
      while (c.measureText(value).width > max && size > 10) { size--; c.font = `${weight} ${size}px "${family}"`; }
      c.fillText(value, x, y);
    }
    // Layered paper card with a monogram, rather than placeholder event details.
    c.save(); c.translate(247, 319); c.rotate(-.075);
    c.shadowColor = '#62474a33'; c.shadowBlur = 30; c.shadowOffsetY = 12;
    c.fillStyle = '#fffbf5'; c.fillRect(-174, -233, 348, 466);
    c.shadowColor = 'transparent'; c.drawImage(art, -174, -233, 348, 466);
    c.fillStyle = '#fffaf0e8'; c.fillRect(-122, -171, 244, 346);
    c.strokeStyle = '#c4a181'; c.lineWidth = 1; c.strokeRect(-122, -171, 244, 346);
    text('THE WEDDING', 0, -125, 11, 'Be Vietnam Pro', '#927156', 600, 205);
    text('T & A', 0, -10, 76, 'Great Vibes', '#9b6374', 400, 210);
    c.strokeStyle = '#c4a181'; c.beginPath(); c.moveTo(-55, 29); c.lineTo(55, 29); c.stroke();
    text('Văn Thắng', 0, 92, 39, 'Great Vibes', '#8c5364', 400, 210);
    text('Ngọc Anh', 0, 139, 39, 'Great Vibes', '#8c5364', 400, 210);
    c.restore();
    text('THIỆP MỜI CƯỚI', 794, 125, 17, 'Be Vietnam Pro', '#987356', 600);
    text('Văn Thắng', 794, 255, 101, 'Great Vibes', '#885263');
    text('&', 794, 316, 50, 'Great Vibes', '#bb9672');
    text('Ngọc Anh', 794, 405, 101, 'Great Vibes', '#885263');
    c.strokeStyle = '#c7aa86'; c.beginPath(); c.moveTo(653, 443); c.lineTo(935, 443); c.stroke();
    text('Trân trọng kính mời bạn và gia đình', 794, 494, 18, 'Be Vietnam Pro', '#685a50');
    text('Chung vui trong ngày cưới của chúng mình.', 794, 531, 16, 'Be Vietnam Pro', '#857367');
    return canvas.toDataURL('image/jpeg', .92).split(',')[1];
  }, server.origin);
  const directory = new URL('../assets/images/og/', import.meta.url);
  await mkdir(directory, { recursive: true });
  const output = new URL('wedding-invitation-v1.jpg', directory);
  await writeFile(output, Buffer.from(base64, 'base64'));
  console.log('Rendered assets/images/og/wedding-invitation-v1.jpg (1200 × 630 JPEG)');
} finally {
  await browser.close();
  await server.close();
}
