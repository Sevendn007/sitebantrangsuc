import nodemailer from "nodemailer";
import { formatVND } from "./utils";
import { prisma } from "./prisma";

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cachedTransporter;
}

interface OrderLike {
  id: string;
  code: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  address: string;
  total: number;
  subtotal: number;
  shipping: number;
  paymentMethod: string;
  paymentStatus: string;
}

async function loadItems(orderId: string) {
  return prisma.orderItem.findMany({ where: { orderId } });
}

function orderHtml(order: OrderLike, items: Array<{ name: string; quantity: number; price: number }>, title: string) {
  const rows = items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.name} × ${i.quantity}</td><td style="text-align:right;padding:8px 0;border-bottom:1px solid #eee">${formatVND(i.price * i.quantity)}</td></tr>`
    )
    .join("");
  const brand = process.env.NEXT_PUBLIC_SITE_NAME || "Lam Thu Jewelry";
  return `<!doctype html><html><body style="font-family:Georgia,serif;background:#fbfaf7;padding:24px">
  <div style="max-width:600px;margin:auto;background:#fff;border:1px solid #ead79f;padding:32px">
    <div style="text-align:center;border-bottom:1px solid #ead79f;padding-bottom:16px;margin-bottom:16px">
      <div style="font-size:20px;color:#8f6821;letter-spacing:4px">${brand.toUpperCase()}</div>
    </div>
    <h2 style="color:#1a1a1a;margin:0 0 4px 0">${title}</h2>
    <p style="color:#666;margin:0 0 20px 0">Xin chào ${order.customerName}, cảm ơn bạn đã tin tưởng ${brand}.</p>
    <p><strong>Mã đơn hàng:</strong> ${order.code}<br/>
    <strong>Phương thức:</strong> ${order.paymentMethod.toUpperCase()}<br/>
    <strong>Trạng thái thanh toán:</strong> ${order.paymentStatus}</p>
    <table style="width:100%;border-collapse:collapse;margin-top:12px"><tbody>${rows}
    <tr><td style="padding-top:12px">Tạm tính</td><td style="text-align:right;padding-top:12px">${formatVND(order.subtotal)}</td></tr>
    <tr><td>Vận chuyển</td><td style="text-align:right">${order.shipping ? formatVND(order.shipping) : "Miễn phí"}</td></tr>
    <tr><td style="padding-top:8px;font-weight:bold;font-size:18px;color:#8f6821">Tổng cộng</td><td style="text-align:right;padding-top:8px;font-weight:bold;font-size:18px;color:#8f6821">${formatVND(order.total)}</td></tr>
    </tbody></table>
    <p style="margin-top:20px;color:#666"><strong>Giao đến:</strong><br/>${order.address}<br/>${order.customerPhone}</p>
    <p style="color:#999;font-size:12px;text-align:center;margin-top:24px">Tra cứu đơn hàng tại <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/don-hang?code=${order.code}">website</a>.</p>
  </div>
  </body></html>`;
}

export async function sendOrderConfirmationEmail(order: OrderLike) {
  const t = getTransporter();
  if (!t) return;
  const items = await loadItems(order.id);
  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  const html = orderHtml(order, items, "Đã nhận đơn hàng của bạn");
  const tasks: Promise<any>[] = [];
  if (order.customerEmail) {
    tasks.push(
      t.sendMail({
        from,
        to: order.customerEmail,
        subject: `Đơn hàng ${order.code} — cảm ơn bạn`,
        html,
      })
    );
  }
  const adminTo = process.env.ADMIN_NOTIFY_EMAIL;
  if (adminTo) {
    tasks.push(
      t.sendMail({
        from,
        to: adminTo,
        subject: `[Đơn mới] ${order.code} — ${order.customerName}`,
        html,
      })
    );
  }
  await Promise.allSettled(tasks);
}

export async function sendOrderPaidEmail(order: OrderLike) {
  const t = getTransporter();
  if (!t) return;
  const items = await loadItems(order.id);
  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  const html = orderHtml(order, items, "Xác nhận đã thanh toán");
  const tasks: Promise<any>[] = [];
  if (order.customerEmail) {
    tasks.push(
      t.sendMail({
        from,
        to: order.customerEmail,
        subject: `Đã thanh toán đơn hàng ${order.code}`,
        html,
      })
    );
  }
  const adminTo = process.env.ADMIN_NOTIFY_EMAIL;
  if (adminTo) {
    tasks.push(
      t.sendMail({
        from,
        to: adminTo,
        subject: `[Thanh toán] ${order.code}`,
        html,
      })
    );
  }
  await Promise.allSettled(tasks);
}
