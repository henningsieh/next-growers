import type { NextApiHandler, NextApiRequest } from "next";

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

  console.log(data.fields);
  console.log(data.files);

  res.json({ success: true });
};

export default handler;