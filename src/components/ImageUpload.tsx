import { generateSignature } from "../utils/generateSignature";

import { useState } from "react";

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget(
        options: unknown,
        callback: unknown
      ): UploadWidget; // Specify the return type
      // Add other cloudinary methods if needed
    };
  }
}

interface UploadWidget {
  open: () => void;
  // Add other methods if needed
}

export function ImageUpload() {
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  function handleWidgetClick() {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "kennyy",
        uploadSignature: generateSignature,
        apiKey: process.env.NEXT_PUBLIC_API_KEY,
        resourceType: "image",
      },
      (error: unknown, result: { event: string; info: unknown }) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          setIsImageUploaded(true);
        } else if (error) {
          console.log(error);
        }
      }
    );
    widget.open();
  }

  return (
    <div className={""}>
      <div className={""}>
        <button
          className={""}
          type="button"
          onClick={handleWidgetClick}
        >
          Upload image
        </button>
      </div>

      {isImageUploaded ? (
        <>
          <div>Successfully uploaded</div>
        </>
      ) : null}
    </div>
  );
}
