import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || "noreply@d-dayengineering.com";

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/requestreset?token=${token}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #0ea5e9;">D-Day Engineering</h2>
      <p>คุณได้ขอรีเซ็ตรหัสผ่าน กรุณากดปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่</p>
      <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
        รีเซ็ตรหัสผ่าน
      </a>
      <p style="margin-top: 20px; color: #64748b; font-size: 14px;">
        ลิงก์นี้จะหมดอายุภายใน 1 ชั่วโมง หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยอีเมลนี้
      </p>
    </div>
  `;

  // If SMTP is not configured, log to console (dev mode)
  if (!process.env.SMTP_USER) {
    console.log(`[DEV] Password reset email for ${email}`);
    console.log(`[DEV] Reset link: ${resetLink}`);
    return;
  }

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "รีเซ็ตรหัสผ่าน - D-Day Engineering",
    html,
  });
}
