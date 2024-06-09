// pages/api/send-email.ts
import type {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from "next";

import sendEmail from "~/utils/sendEmail";

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    email,
    name,
    message,
  }: { email: string; name: string; message: string } = req.body as {
    email: string;
    name: string;
    message: string;
  };

  if (!email || !name || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await sendEmail({
      to: email,
      subject: `Message from ${name}`,
      text: message,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Error sending email" });
  }
};

export default handler;
