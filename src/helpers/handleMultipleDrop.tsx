import type { Dispatch, SetStateAction } from "react";

import type { MultiUploadResponse } from "~/types";
import axios from "axios";

export const handleMultipleDrop = async (
  files: File[],
  reportId: string,
  setImageIds: Dispatch<SetStateAction<string[]>>,
  setImagePublicIds: Dispatch<SetStateAction<string[]>>,
  setCloudUrls: Dispatch<SetStateAction<string[]>>,
  setIsUploading: Dispatch<SetStateAction<boolean>>
): Promise<void> => {
  const formData = new FormData();

  // console.debug("handleMultipleDrop", files);

  if (files && files.length > 0) {
    // console.debug("files", files);

    files.forEach((file, index) => {
      // console.debug("file", file);
      formData.append("images", file, `${file.name}`);
    });

    formData.append("reportId", reportId);

    console.debug("formData.append", formData);
    try {
      const { data }: { data: MultiUploadResponse } = await axios.post(
        "/api/multiple-upload",
        formData
      );

      if (data.success) {
        // console.log("MultiUploadResponse", data);
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
