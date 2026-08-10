import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

function slug(s: string) {
  return slugify(s, { lower: true, strict: true, locale: "vi" });
}

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@vankhanh.local").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hash, role: "admin" },
    create: {
      email: adminEmail,
      name: "Quản trị viên",
      password: hash,
      role: "admin",
    },
  });
  console.log(`✔ Admin: ${adminEmail} / ${adminPassword}`);

  // Categories
  const catData = [
    { name: "Nhẫn", slug: "nhan", order: 1 },
    { name: "Dây chuyền", slug: "day-chuyen", order: 2 },
    { name: "Lắc tay", slug: "lac-tay", order: 3 },
    { name: "Bông tai", slug: "bong-tai", order: 4 },
    { name: "Nhẫn cưới", slug: "nhan-cuoi", order: 5 },
    { name: "Mặt dây", slug: "mat-day", order: 6 },
  ];
  for (const c of catData) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }
  console.log("✔ Categories");

  // Banners
  const banners = [
    {
      title: "Bộ sưu tập Trang Sức Lâm Thư",
      subtitle: "Ra mắt mùa Xuân 2026",
      image: "/showroom.jpg",
      link: "/san-pham",
      order: 1,
      active: true,
    },
    {
      title: "Nhẫn cưới — Bền vững như tình yêu",
      subtitle: "Ưu đãi cặp đôi tháng 3",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=2000&q=80",
      link: "/san-pham?danh-muc=nhan-cuoi",
      order: 2,
      active: true,
    },
  ];
  for (const b of banners) {
    const existing = await prisma.banner.findFirst({ where: { title: b.title } });
    if (!existing) await prisma.banner.create({ data: b });
  }
  console.log("✔ Banners");

  // Products
  const products = [
    {
      name: "Nhẫn Kim Cương Solitaire Elysian",
      category: "nhan",
      price: 42_800_000,
      salePrice: 39_500_000,
      material: "Vàng trắng 18K, Kim cương GIA 0.5ct",
      weight: "3.2 chỉ",
      sizes: ["6", "7", "8", "9", "10", "11", "12"],
      images: [
        "https://images.unsplash.com/photo-1603561596112-db542ade8b19?w=1000&q=80",
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1000&q=80",
      ],
      featured: true,
      isNew: true,
      description: "Nhẫn Solitaire tinh xảo với viên kim cương tự nhiên GIA 0.5ct — biểu tượng của sự vĩnh cửu và thuần khiết.",
      content: `<h2>Điểm nổi bật</h2><p>Viên chủ kim cương tự nhiên, kiểm định GIA. Vàng trắng 18K ánh sáng bạch kim.</p><h3>Bảo quản</h3><p>Vệ sinh định kỳ tại showroom Lam Thu.</p>`,
    },
    {
      name: "Dây Chuyền Vàng 18K Perla",
      category: "day-chuyen",
      price: 18_500_000,
      salePrice: null,
      material: "Vàng vàng 18K, Ngọc trai Akoya",
      weight: "2.1 chỉ",
      images: [
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1000&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000&q=80",
      ],
      featured: true,
      isNew: false,
      description: "Dây chuyền vàng vàng 18K điểm xuyến ngọc trai Akoya — nét sang trọng cổ điển.",
      content: `<h2>Cảm hứng thiết kế</h2><p>Lấy cảm hứng từ ánh trăng phản chiếu trên mặt biển.</p>`,
    },
    {
      name: "Bông Tai Kim Cương Étoile",
      category: "bong-tai",
      price: 26_400_000,
      salePrice: 23_900_000,
      material: "Vàng trắng 18K, Kim cương 0.2ct x2",
      weight: "1.8 chỉ",
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000&q=80",
        "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1000&q=80",
      ],
      featured: true,
      isNew: true,
      description: "Bông tai kim cương lấp lánh, thiết kế ngôi sao đương đại.",
      content: `<h2>Đặc điểm</h2><p>Kim cương thiên nhiên đôi, kiểm định GIA. Chế tác thủ công.</p>`,
    },
    {
      name: "Lắc Tay Vàng 18K Aria",
      category: "lac-tay",
      price: 22_100_000,
      salePrice: null,
      material: "Vàng vàng 18K, Đá Sapphire",
      weight: "2.6 chỉ",
      images: [
        "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1000&q=80",
        "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=1000&q=80",
      ],
      featured: true,
      isNew: false,
      description: "Lắc tay đính Sapphire xanh sâu — nét thanh lịch quyền quý.",
      content: `<p>Sapphire xanh biểu tượng của trí tuệ và sự trung thành.</p>`,
    },
    {
      name: "Nhẫn Cưới Vàng 18K Amour",
      category: "nhan-cuoi",
      price: 15_800_000,
      salePrice: null,
      material: "Vàng vàng 18K",
      weight: "3.0 chỉ / đôi",
      sizes: ["6", "7", "8", "9", "10", "11", "12", "13"],
      images: [
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1000&q=80",
        "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=1000&q=80",
      ],
      featured: true,
      isNew: true,
      description: "Cặp nhẫn cưới thiết kế cổ điển với chi tiết khắc tay tinh xảo.",
      content: `<h2>Miễn phí khắc tên</h2><p>Lam Thu khắc tên/ ngày cưới miễn phí.</p>`,
    },
    {
      name: "Mặt Dây Ngọc Trai Louna",
      category: "mat-day",
      price: 6_900_000,
      salePrice: 5_990_000,
      material: "Vàng 18K, Ngọc trai Nam Dương",
      weight: "0.8 chỉ",
      images: [
        "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=1000&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000&q=80",
      ],
      featured: false,
      isNew: true,
      description: "Mặt dây ngọc trai Nam Dương — quà tặng thanh lịch cho phụ nữ hiện đại.",
      content: `<p>Ngọc trai Nam Dương chọn lọc.</p>`,
    },
    {
      name: "Nhẫn Emerald Regal",
      category: "nhan",
      price: 51_200_000,
      salePrice: null,
      material: "Vàng vàng 18K, Ngọc lục bảo Emerald",
      weight: "3.6 chỉ",
      sizes: ["7", "8", "9", "10", "11"],
      images: [
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1000&q=80",
        "https://images.unsplash.com/photo-1603561596112-db542ade8b19?w=1000&q=80",
      ],
      featured: true,
      isNew: false,
      description: "Nhẫn Emerald bậc thầy — viên chủ ngọc lục bảo Colombia.",
      content: `<h2>Ngọc lục bảo</h2><p>Colombian Emerald, đá quý bậc nhất thế giới.</p>`,
    },
    {
      name: "Dây Chuyền Kim Cương Étoile",
      category: "day-chuyen",
      price: 34_500_000,
      salePrice: 31_900_000,
      material: "Vàng trắng 18K, Kim cương 0.3ct",
      weight: "2.4 chỉ",
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000&q=80",
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1000&q=80",
      ],
      featured: true,
      isNew: true,
      description: "Dây chuyền kim cương lấp lánh — quà tặng cho khoảnh khắc đặc biệt.",
      content: `<p>Chế tác từ nghệ nhân Lam Thu với hơn 20 năm kinh nghiệm.</p>`,
    },
  ];

  for (const p of products) {
    const category = await prisma.category.findUnique({ where: { slug: p.category } });
    const s = slug(p.name);
    await prisma.product.upsert({
      where: { slug: s },
      update: {
        name: p.name,
        price: p.price,
        salePrice: p.salePrice,
        material: p.material,
        weight: p.weight,
        sizes: (p as any).sizes ? JSON.stringify((p as any).sizes) : null,
        images: JSON.stringify(p.images),
        featured: p.featured,
        isNew: p.isNew,
        description: p.description,
        content: p.content,
        categoryId: category?.id,
      },
      create: {
        name: p.name,
        slug: s,
        price: p.price,
        salePrice: p.salePrice,
        material: p.material,
        weight: p.weight,
        sizes: (p as any).sizes ? JSON.stringify((p as any).sizes) : null,
        images: JSON.stringify(p.images),
        featured: p.featured,
        isNew: p.isNew,
        description: p.description,
        content: p.content,
        categoryId: category?.id,
      },
    });
  }
  console.log(`✔ Products (${products.length})`);

  // Posts
  const posts = [
    {
      title: "5 điều cần biết khi chọn nhẫn cưới kim cương",
      excerpt: "Từ 4C của kim cương đến ngân sách phù hợp — bí quyết giúp bạn chọn nhẫn cưới trọn đời.",
      cover: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80",
      content: `<h2>1. Hiểu về 4C</h2><p>Cut, Color, Clarity, Carat — bốn tiêu chí đánh giá kim cương.</p><h2>2. Chọn kim loại phù hợp</h2><p>Vàng trắng, vàng vàng, hay platinum tùy phong cách.</p><h2>3. Kiểm định GIA</h2><p>Luôn ưu tiên kim cương có chứng nhận GIA.</p>`,
    },
    {
      title: "Cách bảo quản trang sức vàng để giữ vẻ đẹp lâu dài",
      excerpt: "Vệ sinh đúng cách, cất giữ khoa học — trang sức luôn như mới sau nhiều năm.",
      cover: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1400&q=80",
      content: `<h2>Vệ sinh định kỳ</h2><p>Ngâm nước ấm với xà bông trung tính, dùng bàn chải mềm.</p><h2>Cất giữ</h2><p>Bọc riêng từng món trong túi vải mềm, tránh trầy xước lẫn nhau.</p>`,
    },
    {
      title: "Xu hướng trang sức Á Đông 2026",
      excerpt: "Ngọc trai, ngọc lục bảo, và thiết kế tối giản — bản giao hưởng Đông–Tây.",
      cover: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80",
      content: `<h2>Ngọc trai lên ngôi</h2><p>Ngọc trai Akoya và Nam Dương là chất liệu chủ đạo.</p><h2>Tối giản đương đại</h2><p>Đường nét tinh gọn, đề cao chất liệu.</p>`,
    },
  ];
  for (const p of posts) {
    const s = slug(p.title);
    await prisma.post.upsert({
      where: { slug: s },
      update: { ...p },
      create: { ...p, slug: s, published: true },
    });
  }
  console.log(`✔ Posts (${posts.length})`);

  console.log("Done. 🎉");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
