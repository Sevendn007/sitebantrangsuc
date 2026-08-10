// Scrape first 200 products from vankhanhjewelry (Next.js RSC embedded JSON)
const BASE = "https://web-dev.vankhanhjewelry.com.vn";
const LIMIT = 200;
const PER_PAGE = 8;

function decode(s) {
  // The embedded JSON is inside an escaped string; unescape \" etc.
  return s.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}

// Extract product objects (name/price/image/slug) from a collections page
function parseListing(html) {
  const out = [];
  // objects contain productId ... slug ; match escaped JSON blocks
  const re = /\{\\"id\\":\\"\d+\\",\\"productId\\"[\s\S]*?\\"badge\\":[^}]*\}/g;
  const matches = html.match(re) || [];
  for (const m of matches) {
    try {
      const obj = JSON.parse(decode(m).replace(/"\$undefined"/g, "null"));
      out.push({
        id: obj.productId,
        name: obj.name,
        price: obj.price,
        priceAmount: obj.priceAmount,
        image: obj.image,
        images: obj.images,
        slug: obj.slug,
        url: `${BASE}/products/${obj.slug}`,
      });
    } catch (e) {}
  }
  return out;
}

async function getDescription(slug) {
  try {
    const res = await fetch(`${BASE}/products/${slug}`);
    const html = await res.text();
    // meta description
    const meta = html.match(/name="description" content="([^"]*)"/);
    // full embedded description
    const emb = html.match(/description\\":\\"((?:[^"\\]|\\.)*?)\\","/);
    let full = emb ? decode(emb[1]).replace(/\\n/g, "\n") : null;
    return { descriptionFull: full, descriptionMeta: meta ? meta[1] : null };
  } catch (e) {
    return { descriptionFull: null, descriptionMeta: null };
  }
}

const products = [];
for (let page = 1; products.length < LIMIT; page++) {
  const url = `${BASE}/collections/all?page=${page}`;
  const html = await (await fetch(url)).text();
  const items = parseListing(html);
  if (items.length === 0) break;
  for (const it of items) {
    if (products.length >= LIMIT) break;
    products.push(it);
  }
  process.stderr.write(`listing page ${page}: ${products.length} products\n`);
}

// Fetch descriptions with limited concurrency
const CONC = 8;
for (let i = 0; i < products.length; i += CONC) {
  const batch = products.slice(i, i + CONC);
  await Promise.all(batch.map(async (p) => {
    const d = await getDescription(p.slug);
    p.description = d.descriptionFull || d.descriptionMeta;
  }));
  process.stderr.write(`descriptions: ${Math.min(i + CONC, products.length)}/${products.length}\n`);
}

const fs = await import("fs");
fs.writeFileSync("van_khanh_products.json", JSON.stringify(products, null, 2));
process.stderr.write(`DONE: ${products.length} products written to van_khanh_products.json\n`);
