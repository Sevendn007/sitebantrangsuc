import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.banner.updateMany({
    where: {
      title: "Bộ sưu tập Trang Sức Lâm Thư"
    },
    data: {
      image: "/showroom.jpg"
    }
  });
  console.log("Updated banner image!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
