const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('response', async (res) => {
    try {
      const url = res.url();
      if (url.includes('/api/v1/auth/register') || url.includes('/api/v1/auth/login')) {
        console.log('NETWORK:', url, res.status());
        const txt = await res.text();
        console.log('NETWORK BODY:', txt.slice(0, 1000));
      }
    } catch (e) {
      // ignore
    }
  });

  const rand = Math.random().toString(36).slice(2,9);
  const email = `test+${rand}@example.com`;
  const password = `Passw0rd!${rand}`;

  await page.goto('http://localhost:5176/');
  await page.waitForSelector('form');

  // Ensure register mode
  const toggleSelector = 'button[role="button"]';

  // Fill name, email, password — type into inputs so React receives events
  const inputs = await page.$$('input');
  if (inputs[0]) await inputs[0].click({ clickCount: 3 }).then(() => inputs[0].type('Automated Tester'));
  if (inputs[1]) await inputs[1].click({ clickCount: 3 }).then(() => inputs[1].type(email));
  if (inputs[2]) await inputs[2].click({ clickCount: 3 }).then(() => inputs[2].type(password));

  // Submit
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {}),
  ]);

  console.log('After submit, url:', page.url());

  // Wait a bit and capture any console errors
  await new Promise((res) => setTimeout(res, 3000));

  await browser.close();
})();