import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  console.log("Reading van_khanh_products.json...");
  const raw = fs.readFileSync("van_khanh_products.json", "utf-8");
  const products = JSON.parse(raw);
  
  console.log(`Found ${products.length} products. Deleting old products...`);
  await prisma.product.deleteMany({});
  
  // We need to link products to categories. Let's get the first category ID for now, 
  // or randomly assign them to existing categories.
  const categories = await prisma.category.findMany();
  const defaultCategory = categories[0]?.id;
  
  if (!defaultCategory) {
    console.error("No categories found. Please run npm run seed first to create categories.");
    process.exit(1);
  }
  
  console.log("Inserting products...");
  
  let inserted = 0;
  for (const p of products) {
    // Generate a unique slug in case of duplicates
    const slug = p.slug + "-" + Math.floor(Math.random() * 1000);
    
    // Choose category based on name keywords
    let catId = defaultCategory;
    const nameLower = p.name.toLowerCase();
    
    if (nameLower.includes("nhẫn") && nameLower.includes("cưới")) {
      catId = categories.find(c => c.slug === "nhan-cuoi")?.id || catId;
    } else if (nameLower.includes("nhẫn")) {
      catId = categories.find(c => c.slug === "nhan")?.id || catId;
    } else if (nameLower.includes("dây chuyền")) {
      catId = categories.find(c => c.slug === "day-chuyen")?.id || catId;
    } else if (nameLower.includes("lắc") || nameLower.includes("vòng")) {
      catId = categories.find(c => c.slug === "lac-tay")?.id || catId;
    } else if (nameLower.includes("bông tai")) {
      catId = categories.find(c => c.slug === "bong-tai")?.id || catId;
    }
    
    // Filter valid image URLs and remove ?v=... to keep them clean if possible
    const cleanImages = p.images.map((img: string) => img.split('?')[0]);
    
    try {
      await prisma.product.create({
        data: {
          name: p.name,
          slug: slug,
          price: p.priceAmount,
          salePrice: p.priceAmount, // no sale
          images: JSON.stringify(cleanImages),
          categoryId: catId,
          content: `<p>${p.description}</p>`,
          isNew: Math.random() > 0.5,
          featured: Math.random() > 0.8,
          material: nameLower.includes("s925") ? "Bạc S925" : (nameLower.includes("vàng") ? "Vàng" : "Hợp kim")
        }
      });
      inserted++;
    } catch (e) {
      console.error("Failed to insert:", p.name);
    }
  }
  
  console.log(`✅ Successfully inserted ${inserted} products!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
