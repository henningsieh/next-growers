import type { NextApiHandler, NextApiRequest } from "next";

import IncomingForm from "formidable/Formidable";
import cloudinary from "~/utils/cloudinary";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/images");
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
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/images"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
  }

  const data = await readFile(req, true);

  if (!!data.files.image && !Array.isArray(data.files.image)) {
    // handle the case where image is NOT an array
    console.log(data.files.image.filepath);
    console.log(data.files.image.newFilename);
    console.log(data.files.image.originalFilename);
    console.log(data.files.image.mimetype);

    const image = data.files.image.filepath;

    const result = await cloudinary.uploader.upload(image, {
      quality: "auto", // auto transformation destroys exif data ✅
      fetch_format: "auto",
      flags: "lossy",
      invalidate: true, // invalidate cache in case, image gets updated
      use_filename: true, // To tell Cloudinary to use the original name of the uploaded file as its public ID, include the use_filename parameter and set it to true
      unique_filename: false, // prefix identifier
      media_metadata: false,
    });
    console.log(`✅ Successfully uploaded ${image}`);
    console.log(`URL: ${result.secure_url}`);

    res.json({ success: "true", cloudUrl: result.secure_url });
  }
};

export default handler;
