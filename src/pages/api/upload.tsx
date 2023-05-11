import type { NextApiHandler, NextApiRequest } from "next";

import cloudinary from "~/utils/cloudinary";
import formidable from "formidable";
import path from "path";
import { prisma } from "~/server/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readUploadedFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/images");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options.filename = (name, ext, path, form) => {
      return `${Date.now()}_${path.originalFilename as string}`;
    };
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

const handler: NextApiHandler = async (req, res) => {
  const data = await readUploadedFile(req, false);

  // console.log("readFile", data);

  if (!!data.files.image && !Array.isArray(data.files.image)) {
    // handle the case where image is NOT an array

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const formattedTimestamp = `${year}${month.toString().padStart(2, "0")}${day
      .toString()
      .padStart(2, "0")}${hours.toString().padStart(2, "0")}${minutes
      .toString()
      .padStart(2, "0")}${seconds.toString().padStart(2, "0")}`;

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

    console.log("cloudinaryResult", result);
    console.log(`✅ Successfully uploaded ${localPathToImage}`);
    console.log(`Public ID: ${result.public_id}`);
    console.log(`URL: ${result.secure_url}`);

    // Create image dataset in db
    const image = await prisma.image.create({
      data: {
        cloudUrl: result.secure_url,
        publicId: result.public_id,
      },
    });
    console.log("prisma.image", image);
    // return successfully the new image cloud url
    res.json({
      success: "true",
      imageId: image.id, // cloudinary public_id of uploaded image
      reportId: image.reportId, // cloudinary public_id of uploaded image
      imagePublicId: result.public_id, // cloudinary public_id of uploaded image
      cloudUrl: result.secure_url, // cloudinary public secure_url to uploaded image
    });
  }
};

export default handler;
