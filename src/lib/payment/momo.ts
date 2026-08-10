import crypto from "node:crypto";

export interface MomoCreateInput {
  orderId: string;
  orderInfo: string;
  amount: number;
  extraData?: string;
}

export interface MomoCreateResult {
  payUrl?: string;
  message?: string;
  raw: any;
}

export async function createMomoPayment(input: MomoCreateInput): Promise<MomoCreateResult> {
  const {
    MOMO_PARTNER_CODE,
    MOMO_ACCESS_KEY,
    MOMO_SECRET_KEY,
    MOMO_ENDPOINT,
    MOMO_REDIRECT_URL,
    MOMO_IPN_URL,
  } = process.env;

  const partnerCode = MOMO_PARTNER_CODE || "MOMO";
  const accessKey = MOMO_ACCESS_KEY || "";
  const secretKey = MOMO_SECRET_KEY || "";
  const endpoint =
    MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";
  const redirectUrl = MOMO_REDIRECT_URL || "http://localhost:3000/thanh-toan/ket-qua";
  const ipnUrl = MOMO_IPN_URL || "http://localhost:3000/api/payment/momo/ipn";

  const requestId = `${input.orderId}-${Date.now()}`;
  const requestType = "captureWallet";
  const extraData = input.extraData || "";
  const amount = String(input.amount);
  const orderInfo = input.orderInfo;
  const orderId = input.orderId;

  const rawSig =
    `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}` +
    `&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto.createHmac("sha256", secretKey).update(rawSig).digest("hex");

  const body = {
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: "vi",
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return { payUrl: data.payUrl, message: data.message, raw: data };
  } catch (e: any) {
    return { message: e?.message || "MoMo error", raw: null };
  }
}

export function verifyMomoIpn(params: Record<string, string>): boolean {
  const secretKey = process.env.MOMO_SECRET_KEY || "";
  const accessKey = process.env.MOMO_ACCESS_KEY || "";
  const {
    amount = "",
    extraData = "",
    message = "",
    orderId = "",
    orderInfo = "",
    orderType = "",
    partnerCode = "",
    payType = "",
    requestId = "",
    responseTime = "",
    resultCode = "",
    transId = "",
    signature = "",
  } = params;
  const raw =
    `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}` +
    `&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}` +
    `&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}` +
    `&transId=${transId}`;
  const check = crypto.createHmac("sha256", secretKey).update(raw).digest("hex");
  return check === signature;
}
