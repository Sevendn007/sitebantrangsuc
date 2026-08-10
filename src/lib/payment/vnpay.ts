import crypto from "node:crypto";

function sortObject(obj: Record<string, string>) {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).sort();
  for (const k of keys) sorted[k] = obj[k];
  return sorted;
}

function encodeParams(params: Record<string, string>) {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v).replace(/%20/g, "+")}`)
    .join("&");
}

export interface VnpayCreateInput {
  orderId: string;
  amount: number;
  orderInfo: string;
  ipAddr?: string;
  bankCode?: string;
  locale?: "vn" | "en";
}

export function createVnpayUrl(input: VnpayCreateInput): string {
  const tmnCode = process.env.VNPAY_TMN_CODE || "";
  const secret = process.env.VNPAY_HASH_SECRET || "";
  const vnpUrl = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const returnUrl = process.env.VNPAY_RETURN_URL || "http://localhost:3000/thanh-toan/ket-qua";

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const createDate =
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());

  const params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: input.locale || "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: input.orderId,
    vnp_OrderInfo: input.orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: String(input.amount * 100),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: input.ipAddr || "127.0.0.1",
    vnp_CreateDate: createDate,
  };
  if (input.bankCode) params.vnp_BankCode = input.bankCode;

  const sorted = sortObject(params);
  const signData = encodeParams(sorted);
  const hmac = crypto.createHmac("sha512", secret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  sorted.vnp_SecureHash = signed;
  return `${vnpUrl}?${encodeParams(sorted)}`;
}

export function verifyVnpayReturn(query: Record<string, string>): {
  ok: boolean;
  txnRef: string;
  responseCode: string;
  amount: number;
} {
  const secret = process.env.VNPAY_HASH_SECRET || "";
  const { vnp_SecureHash, vnp_SecureHashType, ...rest } = query;
  const sorted = sortObject(rest);
  const signData = encodeParams(sorted);
  const hmac = crypto.createHmac("sha512", secret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  return {
    ok: signed === vnp_SecureHash,
    txnRef: query.vnp_TxnRef || "",
    responseCode: query.vnp_ResponseCode || "",
    amount: Number(query.vnp_Amount || 0) / 100,
  };
}
