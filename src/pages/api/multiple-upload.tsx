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

const handler: NextApiHandler = async (req, res) => {
  const data = await readUploadedFile(req, false);
  console.debug("readFile", data);

  const files = data.files["image[]"];
  if (files) {
    if (!Array.isArray(files)) {
      // Handle the case where a single file is uploaded
      const file = files;
      await handleFileUpload(file);
    } else {
      // We have to collect all results
      await Promise.all(files.map(handleFileUpload));
    }
  }

  /** return informations about the new public images in cloudinary
    {
      success: "true",
      imageIds:                     // prisma: array of all saved Image Ids to db
      imagePublicIds:               // cloudinary: array of all public_ids 
      cloudUrls: result.secure_url, // cloudinary: array of all secure_urls
    }
  */
  res.json({ success: true });
};

const handleFileUpload = async (file: formidable.File): Promise<void> => {
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
    file.originalFilename?.split(".")[0] as string
  }`;

  const localPathToImage = file.filepath;

  const result = await cloudinary.uploader.upload(localPathToImage, {
    public_id: publicIdWithTimestamp, //FIXME: filename is buggy!
    quality: "auto",
    fetch_format: "auto",
    flags: "lossy",
    invalidate: true,
  });

  console.log(`✅ Successfully uploaded ${localPathToImage}`);
  console.log(`Public ID: ${result.public_id}`);
  console.log(`URL: ${result.secure_url}`);
  console.log("cloudinaryResult", result);

  const image = await prisma.image.create({
    data: {
      // FIXME: add connected postId
      cloudUrl: result.secure_url,
      publicId: result.public_id,
    },
  });
  console.log("prisma.image", image);
};

const readUploadedFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {
    multiples: true, // Enable parsing of multiple files with the same field name
  };

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
