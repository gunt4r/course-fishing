"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const capturePayment = async () => {
      const paypalOrderId = searchParams.get("token");
      const orderId = searchParams.get("orderId");

      if (!paypalOrderId || !orderId) {
        setStatus("error");
        setError("Missing payment information");
        return;
      }

      try {
        const response = await fetch("/api/payment/capture", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paypalOrderId,
            orderId,
            locale,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("success");

          setTimeout(() => {
            router.push(`/`);
          }, 3000);
        } else {
          setStatus("error");
          setError(data.error || "Payment capture failed");
        }
      } catch (err: any) {
        console.error("Error capturing payment:", err);
        setStatus("error");
        setError(err.message || "An error occurred");
      }
    };

    capturePayment();
  }, [searchParams, locale, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === "processing" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Processing Payment...
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
              <svg
                className="w-16 h-16 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. A confirmation email with your course
              materials has been sent to your email address.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your order...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 inline-block mb-4">
              <svg
                className="w-16 h-16 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
