import puppeteer from 'puppeteer-core';

async function scrape() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: "new"
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('api') || url.includes('graphql') || url.includes('.json')) {
      if (response.request().resourceType() === 'fetch' || response.request().resourceType() === 'xhr') {
        try {
          const text = await response.text();
          if (text.includes('price') || text.includes('product')) {
            console.log('Found API:', url);
            console.log('Preview:', text.substring(0, 200));
          }
        } catch (e) {}
      }
    }
  });
  
  console.log('Navigating...');
  await page.goto('https://web-dev.vankhanhjewelry.com.vn/collections/all', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
}

scrape().catch(console.error);
