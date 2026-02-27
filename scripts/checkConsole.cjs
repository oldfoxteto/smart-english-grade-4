const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  // visit the authenticated home route to reproduce blank-screen issue
  await page.goto('http://localhost:5176/home', { waitUntil: 'networkidle2' }).catch(() => {});

  // log network responses for API calls
  page.on('response', async (res) => {
    try {
      const url = res.url();
      if (url.includes('/api/')) {
        const status = res.status();
        console.log('NETWORK:', status, url);
        const ct = res.headers()['content-type'] || '';
        if (ct.includes('application/json')) {
          const body = await res.text().catch(() => '[non-text]');
          console.log('NETWORK BODY:', body.slice(0, 1000));
        }
      }
    } catch (e) {
      // ignore
    }
  });

  // wait a short time for client scripts to run
  await new Promise((res) => setTimeout(res, 3000));
  await browser.close();
})();