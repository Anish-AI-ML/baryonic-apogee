const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  console.log('Navigating to login...');
  await page.goto('http://localhost:5173/#login', { waitUntil: 'networkidle0' });
  
  console.log('Typing credentials...');
  await page.type('input[type="email"]', 'anishsundar13@gmail.com');
  await page.type('input[type="password"]', 'Anish13#');
  
  console.log('Submitting...');
  await page.click('button[type="submit"]');
  
  console.log('Waiting for Dashboard...');
  await page.waitForFunction(() => window.location.hash.includes('#dashboard'), { timeout: 10000 });
  console.log('Current URL after login:', page.url());
  
  console.log('--- REFRESHING ---');
  await page.reload({ waitUntil: 'networkidle0' });
  
  console.log('Waiting after refresh...');
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('Current URL after refresh:', page.url());
  
  const isLoginVisible = await page.$('input[type="email"]') !== null;
  console.log('Is login visible after refresh?', isLoginVisible);
  
  await browser.close();
  console.log('Done.');
})();
