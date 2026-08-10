# Lam Thu Jewelry — Website bán trang sức

Website trang sức đầy đủ chức năng: thương mại điện tử + CMS admin.

Stack: **Next.js 14 App Router · TypeScript · Tailwind · Prisma · SQLite / PostgreSQL · TipTap WYSIWYG · Framer Motion**

## Tính năng

### Trang công khai
- **Trang chủ** hero banner motion + video-ready, USP strip, danh mục vòng tròn, sản phẩm nổi bật, brand story, new arrivals, journal, newsletter (scroll-reveal đầy đủ với Framer Motion)
- **Sản phẩm**: danh sách có filter theo danh mục / khoảng giá / chất liệu, sort giá, pagination, search box
- **Chi tiết sản phẩm**: gallery lightbox + zoom hover, size selector với hướng dẫn chọn size nhẫn, thêm giỏ / mua ngay, sản phẩm liên quan
- **Blog / Journal**: hero editorial full-bleed, reading time, related posts
- **Cart** persistent localStorage với biến thể theo size
- **Checkout**: tỉnh/quận VN dropdown, tính phí ship theo khu vực, cảnh báo mất dữ liệu khi rời trang, QR VietQR động cho chuyển khoản, 4 phương thức
- **Tra cứu đơn hàng** (`/don-hang`) — public, timeline trạng thái, bảo mật bằng last-4 SĐT
- **Trang kết quả thanh toán** verify chữ ký + amount, idempotent

### CMS admin (`/admin`)
- Auth JWT httpOnly cookie, **rate limit** 10 lần / 5 phút
- Dashboard tổng quan
- CRUD Sản phẩm, Danh mục, Bài viết, Banner
- **TipTap WYSIWYG editor** cho nội dung sản phẩm/blog + upload ảnh trong editor
- Upload ảnh: **Cloudinary** khi có key, fallback local `public/uploads/`
- Đơn hàng: search, filter theo trạng thái, pagination, chi tiết + cập nhật status
- Liên hệ: đánh dấu handled, xoá
- Cảnh báo mất data khi rời form đang chỉnh
- Pagination tất cả list

### Thanh toán an toàn
- **MoMo v2** — payment + IPN với **verify amount** + **idempotency**
- **VNPay** — sinh URL + **IPN handler đúng chuẩn** (`RspCode/Message`) + verify amount + idempotent
- **COD** + **Chuyển khoản** với QR VietQR động
- Email xác nhận qua SMTP (`nodemailer`) khi có SMTP env → cả khách + admin

### Bảo mật
- Rate limit: login, orders, contact, upload
- JWT signed HS256 (`jose`), httpOnly cookie
- Payment IPN verify chữ ký + amount + idempotency
- Validation Zod cho tất cả input
- `beforeunload` warning ở form nhạy cảm

## Cài đặt (macOS / Linux)

```bash
npm install
cp .env.example .env
npm run gen:secret       # copy AUTH_SECRET vào .env
npx prisma db push
npm run seed
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/login (`admin@vankhanh.local` / `admin123`)

## Chuyển sang PostgreSQL (production)

```bash
# 1. Thay DATABASE_URL trong .env (postgresql://...)
# 2. Overwrite schema
cp prisma/schema.postgres.prisma prisma/schema.prisma
# 3. Push + seed
npx prisma db push
npm run seed
```

## Cấu hình email (SMTP)

Đặt `SMTP_HOST/USER/PASS` trong `.env`. Gmail App Password / SendGrid / Amazon SES đều hoạt động. Bỏ trống nếu không dùng — hệ thống vẫn chạy bình thường.

## Cấu hình Cloudinary (khuyến nghị production)

Đặt `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`. Ảnh sẽ upload lên Cloudinary thay vì local — bắt buộc trên Vercel / serverless.

## Cấu hình thanh toán thật

**MoMo** — đăng ký tại https://business.momo.vn, cập nhật `MOMO_*` trong `.env`. `MOMO_IPN_URL` + `MOMO_REDIRECT_URL` phải là HTTPS công khai (dùng ngrok hoặc deploy).

**VNPay** — đăng ký sandbox tại https://sandbox.vnpayment.vn. Cấu hình trong dashboard VNPay:
- Return URL: `https://your-domain/thanh-toan/ket-qua`
- IPN URL:    `https://your-domain/api/payment/vnpay/ipn`

Whitelist IP server của bạn trong dashboard VNPay.

## Deploy

- Chuyển database sang PostgreSQL (xem trên)
- Bật Cloudinary
- `npm run gen:secret` sinh AUTH_SECRET mới cho production
- `npm run build`
- Vercel / Fly / Railway / VPS Node.js đều chạy được

## Scripts

```bash
npm run dev          # dev server
npm run build        # build production
npm run seed         # seed dữ liệu mẫu
npm run gen:secret   # sinh AUTH_SECRET ngẫu nhiên
npm run db:studio    # Prisma Studio UI
```

## Cấu trúc

```
src/
├── app/
│   ├── (public)/            # storefront
│   │   ├── page.tsx         # trang chủ (motion)
│   │   ├── san-pham/        # list (filter+search+pagination) + detail (gallery+size)
│   │   ├── bai-viet/        # blog editorial
│   │   ├── gio-hang/        # cart
│   │   ├── thanh-toan/      # checkout + kết quả
│   │   ├── don-hang/        # tra cứu đơn (public)
│   │   ├── lien-he/         # form contact
│   │   └── gioi-thieu/      # about
│   ├── admin/               # CMS bảo vệ session
│   ├── login/
│   └── api/
│       ├── auth/            # login + logout (rate limited)
│       ├── contact/         # form (rate limited)
│       ├── orders/          # tạo đơn (rate limited)
│       ├── upload/          # Cloudinary/local
│       ├── payment/momo/ipn # verify + amount check + idempotent
│       ├── payment/vnpay/ipn# RspCode standard
│       └── admin/           # CRUD (auth required)
├── components/              # HeroBanner, Reveal, ProductCard, ...
│   └── admin/               # RichEditor (TipTap), Pagination, ...
└── lib/
    ├── prisma.ts
    ├── auth.ts              # JWT jose
    ├── cart.ts              # variant by size
    ├── email.ts             # nodemailer templates
    ├── ratelimit.ts         # sliding window
    ├── storage.ts           # Cloudinary + local fallback
    ├── vn-address.ts        # 24 tỉnh + calcShipping
    └── payment/             # momo.ts + vnpay.ts
```

## Roadmap còn thiếu (nếu muốn tiến gần Chanel/Dior thêm)

- Product photography riêng (thay ảnh Unsplash) — asset, không phải code
- ZaloPay / Apple Pay / Stripe cho khách quốc tế
- Refund flow qua MoMo/VNPay API
- Real-time analytics dashboard
- A/B testing infra
- Multi-language (EN)
- CDN cho ảnh production

Chúc bạn kinh doanh phát đạt! ✨
