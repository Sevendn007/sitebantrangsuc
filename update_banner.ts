import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.banner.updateMany({
    where: {
      title: "Bộ sưu tập Ngọc Trai Á Đông"
    },
    data: {
      title: "Bộ sưu tập Trang Sức Lâm Thư",
      subtitle: "Tinh hoa chế tác trang sức Bạc S925"
    }
  });
  console.log("Updated banner!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
