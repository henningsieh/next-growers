import type { Image } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { UploadApiResponse } from "cloudinary";
import type { Fields, File, Files } from "formidable";
import formidable from "formidable";
import path from "path";

import type { NextApiHandler, NextApiRequest } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

import cloudinary from "~/utils/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ error: "unauthorized" });
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const [fields, files] = await readUploadedFile(req, false);
  const ownerId = Array.isArray(fields["ownerId"])
    ? fields["ownerId"][0]
    : fields["ownerId"];

  if (!ownerId) {
    res.status(400).json({ error: "ownerId is missing" });
    return;
  }

  const imageIds: string[] = [];
  const imagePublicIds: string[] = [];
  const cloudUrls: string[] = [];

  const uploadedFiles = files["images"] as File | File[];

  if (!uploadedFiles) {
    res.status(400).json({ error: "no files attached" });
    return;
  }

  if (!Array.isArray(uploadedFiles)) {
    const file = uploadedFiles;
    const result = await handleFileUpload(file, ownerId);

    imageIds.push(result.id);
    imagePublicIds.push(result.publicId);
    cloudUrls.push(result.cloudUrl);
  } else {
    await Promise.all(
      uploadedFiles.map(async (file) => {
        const result = await handleFileUpload(file, ownerId);

        imageIds.push(result.id);
        imagePublicIds.push(result.publicId);
        cloudUrls.push(result.cloudUrl);
      })
    );
  }

  const response = {
    success: true,
    imageIds,
    imagePublicIds,
    cloudUrls,
  };

  res.json(response);
};

const handleFileUpload = async (
  file: File,
  ownerId: string
): Promise<Image> => {
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
    file.originalFilename?.split(".")[0] as string
  }`;

  const result: UploadApiResponse = await cloudinary.uploader.upload(
    file.filepath,
    {
      public_id: publicIdWithTimestamp,
      quality: "auto",
      width: 2000,
      flags: "lossy",
      invalidate: true,
    }
  );

  const image = await prisma.image.create({
    data: {
      ownerId: ownerId,
      cloudUrl: result.secure_url,
      publicId: result.public_id,
    },
  });

  console.debug(`✅ Successfully uploaded ${file.filepath}`);
  console.debug("ownerId", ownerId);
  console.debug("imageId", image.id);
  console.debug(`Public ID: ${result.public_id}`);
  console.debug(`URL: ${result.secure_url}`);

  return image;
};

const readUploadedFile = async (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<[Fields, Files]> => {
  const options: formidable.Options = {
    multiples: true, // Enable parsing of multiple files with the same field name
  };

  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/images");
    options.keepExtensions = true; // Keep the file extensions for multiple files
  }

  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);

  return form.parse(req);
};

export default handler;
