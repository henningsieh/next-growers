import type { Dispatch, SetStateAction } from "react";
import type { IsoReportWithPostsFromDb, MultiUploadResponse } from "~/types";

import axios from "axios";

export const handleMultipleDrop = async (
  files: File[],
  report: IsoReportWithPostsFromDb,
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

    formData.append("ownerId", report.authorId as string);

    console.debug("formData", formData);
    try {
      const { data }: { data: MultiUploadResponse } = await axios.post(
        "/api/multiple-upload",
        formData
      );

      if (data.success) {
        // add the image informations to the component state
        setImageIds((prevImageIds) => [...prevImageIds, ...data.imageIds]);
        setImagePublicIds((prevImagePublicIds) => [
          ...prevImagePublicIds,
          ...data.imagePublicIds,
        ]);
        setCloudUrls((prevCloudUrls) => [...prevCloudUrls, ...data.cloudUrls]);

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
