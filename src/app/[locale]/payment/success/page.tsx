'use client';

import { useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing',
  );
  const [error, setError] = useState<string>('');
const t = useTranslations("Payment.success");
  useEffect(() => {
    const capturePayment = async () => {
      const paypalOrderId = searchParams.get('token');
      const orderId = searchParams.get('orderId');

      if (!paypalOrderId || !orderId) {
        setStatus('error');
        setError('Missing payment information');
        return;
      }

      try {
        const response = await fetch('/api/payment/capture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paypalOrderId,
            orderId,
            locale,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');

          setTimeout(() => {
            router.push(`/`);
          }, 3000);
        } else {
          setStatus('error');
          setError(data.error || 'Payment capture failed');
        }
      } catch (err: any) {
        console.error('Error capturing payment:', err);
        setStatus('error');
        setError(err.message || 'An error occurred');
      }
    };

    capturePayment();
  }, [searchParams, locale, router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {status === 'processing' && (
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              {t("processing")}
            </h2>
            <p className="text-gray-600">
              {t("wait_confirm")}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mb-4 inline-block rounded-full bg-green-100 p-4">
              <svg
                className="h-16 w-16 text-green-600"
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
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              {t("success")}
            </h2>
            <p className="mb-4 text-gray-600">
              {t("thanks")}
            </p>
            <p className="text-sm text-gray-500">
              {t("redirect")}
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mb-4 inline-block rounded-full bg-red-100 p-4">
              <svg
                className="h-16 w-16 text-red-600"
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
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              {t("error")}
            </h2>
            <p className="mb-4 text-gray-600">{error}</p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
            >
              {t("back")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={(
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )}
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
