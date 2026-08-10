import fs from 'fs';
import https from 'https';

https.get('https://web-dev.vankhanhjewelry.com.vn/collections/all', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Search for patterns that look like products
    // In Next.js app router, data is serialized in self.__next_f
    const matches = data.match(/{"id":"[^"]+","title":"[^"]+","handle":"[^"]+"/g);
    
    if (matches) {
      console.log(`Found ${matches.length} matches!`);
      console.log(matches.slice(0, 5));
    } else {
      console.log('No simple JSON matches found. Searching for "price"...');
      const idx = data.indexOf('"price"');
      if (idx > -1) {
         console.log(data.substring(idx - 50, idx + 200));
      }
    }
  });
});
