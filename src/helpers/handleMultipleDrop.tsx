import type { Dispatch, SetStateAction } from "react";
import type { ImageUploadResponse, MultiUploadResponse } from "~/types";

import axios from "axios";

export const handleMultipleDrop = async (
  files: File[],
  setImageIds: Dispatch<SetStateAction<string[]>>,
  setImagePublicIds: Dispatch<SetStateAction<string[]>>,
  setCloudUrls: Dispatch<SetStateAction<string[]>>,
  setIsUploading: Dispatch<SetStateAction<boolean>>
): Promise<void> => {
  const formData = new FormData();
  console.debug("handleMultipleDrop", files);
  if (files && files.length > 0) {
    console.debug("files", files);

    files.forEach((file, index) => {
      console.debug("file", file);
      formData.append("image[]", file, `image_${index}`);
    });

    // formData.append("image", files[0]); // Assuming only one file is uploaded
    // files.map((file) => formData.append("image", file)); // Now we are handling multiple file upload

    console.debug("formData.append", formData);
    try {
      const { data }: { data: MultiUploadResponse } = await axios.post(
        "/api/multiple-upload",
        formData
      );
      console.debug("MultiUploadResponse", data);

      if (data.success) {
        console.log("File uploaded successfully");
        // setting the image informations to the component state
        setImageIds(data.imageIds);
        setImagePublicIds(data.imagePublicIds);
        setCloudUrls(data.cloudUrls);

        setIsUploading(false);
      } else {
        throw new Error("File uploaded NOT successfully");
      }
    } catch (error) {
      console.debug(error);
      throw new Error("Error uploading file");
    }
  }
};
