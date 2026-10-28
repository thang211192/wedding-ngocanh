import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve('assets/images/invitations');
const names = (await fs.readdir(root)).filter(name => name.endsWith('-v2.webp'));
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<canvas id="canvas"></canvas>');

for (const name of names) {
  const source = `data:image/webp;base64,${(await fs.readFile(path.join(root, name))).toString('base64')}`;
  const jpeg = await page.evaluate(async data => {
    const image = new Image();
    image.src = data;
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
    const canvas = document.querySelector('#canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext('2d').drawImage(image, 0, 0);
    return canvas.toDataURL('image/jpeg', .9).split(',')[1];
  }, source);
  await fs.writeFile(path.join(root, name.replace('.webp', '.jpg')), Buffer.from(jpeg, 'base64'));
}

await browser.close();
console.log(`Rendered ${names.length} JPEG fallbacks.`);
