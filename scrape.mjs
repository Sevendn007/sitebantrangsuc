import puppeteer from 'puppeteer-core';
import fs from 'fs';

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
  
  await new Promise(r => setTimeout(r, 4000)); // wait for products to load
  
  // scroll down to load lazy images
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await new Promise(r => setTimeout(r, 1000));
  
  const products = await page.evaluate(() => {
    // Usually product cards have a specific class or structure. 
    // They usually link to /products/...
    const productLinks = Array.from(document.querySelectorAll('a[href*="/products/"]'));
    const results = [];
    
    productLinks.forEach(a => {
      // Find the closest wrapper
      const wrapper = a.closest('div[class*="group"]') || a.parentElement;
      if (!wrapper) return;
      
      const nameEl = wrapper.querySelector('h2, h3, h4, .text-lg, [class*="title"], [class*="name"]');
      let name = nameEl ? nameEl.innerText.trim() : "";
      if (!name) name = a.innerText.trim();
      
      const priceEl = wrapper.querySelector('[class*="price"], .text-red-500, .text-gold-600, b, strong');
      let priceText = priceEl ? priceEl.innerText.trim() : "0";
      let price = parseInt(priceText.replace(/\\D/g, '')) || 0;
      
      const imgs = Array.from(wrapper.querySelectorAll('img')).map(img => img.src).filter(src => src && !src.includes('data:image'));
      
      if (name && price > 0 && imgs.length > 0) {
        results.push({
          name,
          price,
          images: imgs,
          url: a.href
        });
      }
    });
    
    // Dedup
    const unique = [];
    const names = new Set();
    for (const p of results) {
      if (!names.has(p.name)) {
        names.add(p.name);
        unique.push(p);
      }
    }
    return unique;
  });
  
  console.log(`Found ${products.length} products on collections/all.`);
  fs.writeFileSync('scraped_products.json', JSON.stringify(products, null, 2));
  
  await browser.close();
}

scrape().catch(console.error);
