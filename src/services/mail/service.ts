import { getEmailTranslation } from "@/libs/email/templates";
import { Order } from "@/models/order";
import nodemailer from "nodemailer";
import path from "path";
import * as fs from "fs";
interface EmailAttachment {
  filename: string;
  path: string;
}
export const sendEmail = async (
  email: string,
  subject: string,
  message: string,
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendOrderConfirmationEmail = async (
  order: Order,
  locale: string = "en",
) => {
  const translations = getEmailTranslation(locale);

  const attachments: EmailAttachment[] = [];

  for (const product of order.products) {
    if (product.document) {
      const pdfPath = path.join(process.cwd(), "public", product.document);

      if (fs.existsSync(pdfPath)) {
        attachments.push({
          filename: `${product.name}.pdf`,
          path: pdfPath,
        });
      } else {
        console.warn(
          `PDF file not found for product ${product.name}: ${pdfPath}`,
        );
      }
    }
  }

  const productsList = order.products
    .map(
      (product, index) =>
        `${index + 1}. ${product.name} - $${Number(product.price).toFixed(2)}`,
    )
    .join("\n");

  const htmlContent = generateOrderEmailHTML(order, translations);

  const textContent = `
${translations?.greeting}

${translations?.thankYou}

${translations?.orderNumber}: ${order.id}
${translations?.totalAmount}: $${Number(order.totalAmount).toFixed(2)}

${translations?.products}:
${productsList}

${translations?.attachedFiles}

${translations?.footer}

${translations?.support}
  `.trim();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.user.email,
    subject: `${translations?.subject} #${order.id.slice(0, 8)}`,
    text: textContent,
    html: htmlContent,
    attachments: attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${order.user.email}`);
    return true;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
};

function generateOrderEmailHTML(order: Order, translations: any): string {
  const productRows = order.products
    .map(
      (product) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        ${product.name}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        $${Number(product.price).toFixed(2)}
      </td>
    </tr>
  `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${translations.subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 28px;">${translations.subject}</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px; margin-bottom: 20px;">${translations.greeting}</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h2 style="color: #667eea; margin-top: 0;">${translations.thankYou}</h2>
      
      <div style="margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>${translations.orderNumber}:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${order.id}</code></p>
        <p style="margin: 5px 0;"><strong>${translations.totalAmount}:</strong> <span style="color: #667eea; font-size: 20px; font-weight: bold;">$${Number(order.totalAmount).toFixed(2)}</span></p>
      </div>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="color: #667eea; margin-top: 0;">${translations.products}</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f8f8f8;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #667eea;">Product</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #667eea;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
      </table>
    </div>
    
    <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50; margin-bottom: 20px;">
      <p style="margin: 0; color: #2e7d32;">
        <strong>📎 ${translations.attachedFiles}</strong>
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee;">
      <p style="color: #666; font-size: 14px; white-space: pre-line;">${translations.footer}</p>
      <p style="color: #999; font-size: 12px; margin-top: 15px;">${translations.support}</p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} Vlad Prangati. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();
}
