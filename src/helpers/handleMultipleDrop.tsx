import axios from "axios";

import type { Dispatch, SetStateAction } from "react";

import type {
  IsoReportWithPostsFromDb,
  MultiUploadResponse,
} from "~/types";

export const handleMultipleDrop = async (
  files: File[],
  report: IsoReportWithPostsFromDb,
  setImageIds: Dispatch<SetStateAction<string[]>>,
  setImagePublicIds: Dispatch<SetStateAction<string[]>>,
  setCloudUrls: Dispatch<SetStateAction<string[]>>,
  setIsUploading: Dispatch<SetStateAction<boolean>>
): Promise<void> => {
  try {
    setIsUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append("images", file, `${file.name}`);
      formData.append("ownerId", report.authorId as string);

      // console.debug("formData", formData);

      const { data }: { data: MultiUploadResponse } = await axios.post(
        "/api/multiple-upload",
        formData
      );

      if (data.success) {
        // Add the image information to the component state
        setImageIds((prevImageIds) => [
          ...prevImageIds,
          ...data.imageIds,
        ]);
        setImagePublicIds((prevImagePublicIds) => [
          ...prevImagePublicIds,
          ...data.imagePublicIds,
        ]);
        setCloudUrls((prevCloudUrls) => [
          ...prevCloudUrls,
          ...data.cloudUrls,
        ]);
      } else {
        throw new Error("File uploaded NOT successfully");
      }
    }

    setIsUploading(false);
  } catch (error) {
    console.debug(error);
    throw new Error("Error uploading file");
  }
};
