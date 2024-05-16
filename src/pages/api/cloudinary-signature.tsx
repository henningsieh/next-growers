import { v2 as cloudinary } from "cloudinary";
// import type { SignApiOptions } from "cloudinary";
import { env } from "~/env.mjs";

import type { NextApiHandler } from "next";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "~/server/auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    // Not Signed in
    res.status(401).json({ error: "You are not authorized" });
  } else {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const api_secret = env.CLOUDINARY_API_SECRET;
      const transformation = "w_2000,h_2000,c_limit,q_auto";
      const folder = "growagram/user_uploads";
      const signature = cloudinary.utils.api_sign_request(
        {
          timestamp: timestamp,
          transformation: transformation,
          folder: folder,
        },
        api_secret
      );

      res.json({
        cloud_name: env.NEXT_PUBLIC_CLOUDINARY_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        signature: signature,
        timestamp: timestamp,
        transformation: transformation,
        folder: folder,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default handler;

// const handler: NextApiHandler = (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   try {
//     // Parse the body and specify its type
//     const body = JSON.parse(req.body as string) as {
//       paramsToSign: SignApiOptions;
//     };
//     const { paramsToSign } = body;

//     const apiSecret = env.CLOUDINARY_API_SECRET;

//     const signature = cloudinary.utils.api_sign_request(
//       paramsToSign,
//       apiSecret
//     );
//     res.json({ signature });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export default handler;
