import { v2 as cloudinary } from "cloudinary";
import type { SignApiOptions } from "cloudinary";

import type { NextApiHandler } from "next";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    // Parse the body and specify its type
    const body = JSON.parse(req.body as string) as {
      paramsToSign: SignApiOptions;
    };
    const { paramsToSign } = body;

    const apiSecret = "YOUR_CLOUDINARY_API_SECRET";

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );
    res.json({ signature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
