import { api } from "@/app/api/axios";
import { getBaseUrl } from "@/utils/Helpers";
const PAYPAL_API_URL =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  throw new Error("Missing PayPal credentials in environment variables");
}

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;


async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await api.post(
    `${PAYPAL_API_URL}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  if (response.status !== 200) {
    throw new Error(
      `Failed to get PayPal access token: ${response.data?.error || response.statusText}`,
    );
  }

  return response.data.access_token;
}

export async function createPayPalOrder(
  orderId: string,
  amount: string,
  description: string = "Digital course payment",
): Promise<any> {
  const accessToken = await getAccessToken();
  const baseUrl = await getBaseUrl();

  const orderRequest = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: orderId,
        amount: {
          currency_code: "USD",
          value: amount,
        },
        description,
      },
    ],
    application_context: {
      brand_name: "Coursefish",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `${baseUrl}/payment/success?orderId=${orderId}`,
      cancel_url: `${baseUrl}/payment/cancel?orderId=${orderId}`,
    },
  };
  const response = await api.post(
    `${PAYPAL_API_URL}/v2/checkout/orders`,
    orderRequest,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status !== 201) {
    throw new Error(
      `Failed to create PayPal order: ${response.data?.details?.[0]?.description || response.statusText}`,
    );
  }

  return response.data;
}

export async function capturePayPalOrder(paypalOrderId: string): Promise<any> {
  const accessToken = await getAccessToken();

  const response = await api.post(
    `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status !== 201) {
    throw new Error(
      `Failed to capture PayPal order: ${response.data?.details?.[0]?.issue || response.statusText}`,
    );
  }

  return response.data;
}

export async function getPayPalOrderDetails(
  paypalOrderId: string,
): Promise<any> {
  const accessToken = await getAccessToken();

  const response = await api.get(
    `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error(
      `Failed to get PayPal order details: ${response.data?.details?.[0]?.description || response.statusText}`,
    );
  }

  return response.data;
}
