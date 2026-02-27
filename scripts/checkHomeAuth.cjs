const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('response', async (res) => {
    try {
      const url = res.url();
      if (url.includes('/api/')) {
        console.log('NETWORK:', res.status(), url);
        const ct = res.headers()['content-type'] || '';
        if (ct.includes('application/json')) {
          const body = await res.text().catch(() => '[non-text]');
          console.log('NETWORK BODY:', body.slice(0, 1000));
        }
      }
    } catch (e) {}
  });

  await page.goto('http://localhost:5176/', { waitUntil: 'networkidle2' }).catch(() => {});

  // set authenticated localStorage
  await page.evaluate(() => {
    localStorage.setItem('lisan_access_token', 'dummy-token');
    localStorage.setItem('lisan_refresh_token', 'dummy-refresh');
    localStorage.setItem('lisan_current_user', JSON.stringify({ id: 't1', email: 'auto@example.com', displayName: 'Auto' }));
    localStorage.setItem('lisan_onboarding_v1', JSON.stringify({ languageCode: 'en', goalType: 'work', proficiency: 'A1', dailyMinutes: 5, completedAt: new Date().toISOString() }));
  });

  await page.goto('http://localhost:5176/home', { waitUntil: 'networkidle2' }).catch(() => {});
  await new Promise((res) => setTimeout(res, 3000));
  await browser.close();
})();