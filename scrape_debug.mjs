import puppeteer from 'puppeteer-core';

async function scrape() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: "new"
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  console.log('Navigating to collections/all...');
  await page.goto('https://web-dev.vankhanhjewelry.com.vn/collections/all', { waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 4000)); 
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'collections_debug.png' });
  
  const links = await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => a.href));
  console.log("Sample links:", links.slice(0, 20));
  
  await browser.close();
}

scrape().catch(console.error);
