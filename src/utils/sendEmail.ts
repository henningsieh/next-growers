// utils/sendEmail.ts
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { env } from "~/env";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: env.EMAIL_SERVER_HOST,
    port: env.EMAIL_SERVER_PORT,
    secure: env.EMAIL_SERVER_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.EMAIL_SERVER_USER,
      pass: env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.debug("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
