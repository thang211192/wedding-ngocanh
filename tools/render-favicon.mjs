import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const svg = await fs.readFile('assets/images/favicon.svg', 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
await page.setContent(`<style>html,body{margin:0;width:180px;height:180px}svg{display:block;width:180px;height:180px}</style>${svg}`);
const png = await page.screenshot({ type: 'png', omitBackground: true });
await fs.writeFile('assets/images/favicon-180.png', png);
await browser.close();
console.log('Rendered assets/images/favicon-180.png');
