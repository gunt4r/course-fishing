export interface EmailTranslations {
  subject: string;
  greeting: string;
  thankYou: string;
  orderNumber: string;
  totalAmount: string;
  products: string;
  attachedFiles: string;
  footer: string;
  support: string;
}

export const emailTranslations: Record<string, EmailTranslations> = {
  en: {
    subject: "Order Confirmation",
    greeting: "Hello!",
    thankYou: "Thank you for your purchase!",
    orderNumber: "Order Number",
    totalAmount: "Total Amount",
    products: "Products",
    attachedFiles: "Your course materials are attached to this email.",
    footer: "Best regards,\nYour Team",
    support: "If you have any questions, please contact our support.",
  },
  ru: {
    subject: "Подтверждение заказа",
    greeting: "Здравствуйте!",
    thankYou: "Спасибо за вашу покупку!",
    orderNumber: "Номер заказа",
    totalAmount: "Общая сумма",
    products: "Продукты",
    attachedFiles: "Материалы курса прикреплены к этому письму.",
    footer: "С уважением,\nВаша команда",
    support:
      "Если у вас есть вопросы, пожалуйста, свяжитесь с нашей поддержкой.",
  },
  ro: {
    subject: "Confirmarea comenzii",
    greeting: "Bună ziua!",
    thankYou: "Vă mulțumim pentru achiziție!",
    orderNumber: "Număr comandă",
    totalAmount: "Suma totală",
    products: "Produse",
    attachedFiles: "Materialele cursului sunt atașate la acest email.",
    footer: "Cu stimă,\nEchipa dvs.",
    support: "Dacă aveți întrebări, vă rugăm să contactați suportul nostru.",
  },
};

export function getEmailTranslation(locale: string) {
  return emailTranslations[locale] || emailTranslations.en;
}
