import LoginForm from "./LoginForm";

export const metadata = { title: "Đăng nhập quản trị" };

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-luxe p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-luxe p-8 border border-gold-100">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-gold-400 to-gold-700 grid place-items-center text-white font-serif text-xl">
            V
          </div>
          <h1 className="mt-3 font-serif text-2xl">Trang quản trị</h1>
          <p className="text-sm text-ink-800/60">Lam Thu Jewelry CMS</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
