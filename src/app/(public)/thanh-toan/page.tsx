import CheckoutForm from "./CheckoutForm";

export const metadata = { title: "Thanh toán" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-serif text-4xl text-center mb-10">Thanh toán</h1>
      <CheckoutForm />
    </div>
  );
}
