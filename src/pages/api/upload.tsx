import type { NextApiHandler, NextApiRequest } from "next";

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
    // Create local folder if not existing
    await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
  }

  const data = await readFile(req, false);

  console.log("readFile", data);

  if (!!data.files.image && !Array.isArray(data.files.image)) {
    // handle the case where image is NOT an array

    // console.log(data.files.image.filepath);
    // console.log(data.files.image.newFilename);
    console.log(data.files.image.originalFilename);
    // console.log(data.files.image.mimetype);

    /**
     * building publicId which will lead to a URL as follows:
     * https://res.cloudinary.com/CLOUDNAME/image/upload/versioning_id/ORIGINALFILENAME_DATE(NOW).jpg
     */

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
    console.log(`✅ Successfully uploaded ${localPathToImage}`);
    console.log(`URL: ${result.secure_url}`);

    // return successfully the new image cloud url
    res.json({ success: "true", cloudUrl: result.secure_url });
  }
};

export default handler;
