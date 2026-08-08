const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST || "smtp.gmail.com",
    port: Number(EMAIL_PORT) || 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  return transporter;
};

const sendOtpEmail = async (toEmail, code, purpose = "login") => {
  const t = getTransporter();
  if (!t) return false;

  const subjectMap = {
    login: "Your CareerNest login code",
    signup: "Verify your CareerNest account",
  };

  await t.sendMail({
    from: `"CareerNest" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: subjectMap[purpose] || "Your CareerNest verification code",
    text: `Your verification code is ${code}. It expires in 5 minutes. If you didn't request this, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #e8890c;">CareerNest</h2>
        <p>Your verification code is:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111;">${code}</p>
        <p style="color: #666; font-size: 14px;">This code expires in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  return true;
};

module.exports = { sendOtpEmail };