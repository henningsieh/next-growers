import type { NextApiHandler, NextApiRequest } from "next";

import { authOptions } from "~/server/auth";
import cloudinary from "~/utils/cloudinary";
import formidable from "formidable";
import { getServerSession } from "next-auth/next";
import path from "path";
import { prisma } from "~/server/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ error: "unauthorized" });
  } else {
    const data = await readUploadedFile(req, false);
    if (!!data.files.image && !Array.isArray(data.files.image)) {
      // now handle the case where image is NOT an array
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const formattedTimestamp = `${year}${month
        .toString()
        .padStart(2, "0")}${day.toString().padStart(2, "0")}${hours
        .toString()
        .padStart(2, "0")}${minutes.toString().padStart(2, "0")}${seconds
        .toString()
        .padStart(2, "0")}`;

      const publicIdWithTimestamp = `${formattedTimestamp}_${
        data.files.image.originalFilename?.split(".")[0] as string
      }`;

      const localPathToImage = data.files.image.filepath;

      const result = await cloudinary.uploader.upload(localPathToImage, {
        public_id: publicIdWithTimestamp,
        quality: "auto", // ⚠️ auto transformation destroys exif data ✅
        fetch_format: "auto",
        flags: "lossy", // let's save some data, quality seems fine
        invalidate: true, // invalidate cache in case, image gets updated
      });

      // console.log("cloudinaryResult", result);
      console.log(`✅ Successfully uploaded ${localPathToImage}`);
      console.log(`Public ID: ${result.public_id}`);
      console.log(`URL: ${result.secure_url}`);

      // Create image in db
      const image = await prisma.image.create({
        data: {
          ownerId: session.user.id,
          cloudUrl: result.secure_url,
          publicId: result.public_id,
        },
      });
      console.log("prisma.image", image);

      // return informations about the public image in the cloud
      res.json({
        success: "true",
        imageId: image.id, // cloudinary public_id of uploaded image
        // reportId: image.reportId, // cloudinary public_id of uploaded image
        imagePublicId: result.public_id, // cloudinary public_id of uploaded image
        cloudUrl: result.secure_url, // cloudinary public secure_url to uploaded image
      });
    }
  }
};

const readUploadedFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};

  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/images");
    options.keepExtensions = true; // Keep the file extensions for multiple files
  }

  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default handler;
