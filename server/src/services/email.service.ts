import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"CareerHub AI" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    console.log("✉️ Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email error:", error);
    throw error;
  }
};