import { PageHeader } from "@/components/admin/AdminBar";

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader title="Cài đặt" />
      <div className="bg-white p-6 rounded-lg border border-gold-100 space-y-4 max-w-2xl">
        <h2 className="font-serif text-xl">Biến môi trường</h2>
        <p className="text-sm text-ink-800/70 leading-relaxed">
          Các cài đặt hệ thống (thông tin thanh toán MoMo/VNPay, secret) được
          cấu hình qua tệp <code className="bg-gold-50 px-1">.env</code>. Xem
          <code className="bg-gold-50 px-1 mx-1">.env.example</code> để biết
          danh sách biến. Sau khi thay đổi vui lòng khởi động lại server.
        </p>
        <ul className="text-sm text-ink-800/80 list-disc list-inside space-y-1">
          <li><strong>DATABASE_URL</strong> — nơi lưu database SQLite (mặc định file:./dev.db)</li>
          <li><strong>AUTH_SECRET</strong> — chuỗi bí mật ký session</li>
          <li><strong>MOMO_*</strong> — Partner Code, Access Key, Secret Key MoMo</li>
          <li><strong>VNPAY_*</strong> — TmnCode, HashSecret VNPay</li>
        </ul>
        <p className="text-sm text-ink-800/60">
          Muốn thay đổi mật khẩu admin? Dùng cửa sổ terminal chạy
          <code className="bg-gold-50 px-1 mx-1">npm run seed</code> sau khi
          cập nhật ADMIN_EMAIL / ADMIN_PASSWORD trong .env
        </p>
      </div>
    </div>
  );
}
