import type { GetServerSideProps, NextPage } from "next";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

import Image from "next/image";
import type { ImageUploadResponse } from "~/types";
import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import { useRouter } from "next/router";

interface Props {
  dirs: string[];
}

const Home: NextPage<Props> = ({ dirs }) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();

  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async () => {
    try {
      if (!selectedFile) return;
      setUploading(true);
      const formData = new FormData();
      formData.append("myImage", selectedFile);
      const {
        data,
      }: {
        data: ImageUploadResponse;
      } = await axios.post("/api/image", formData);

      setUploadSuccess(data.success);
      setUploading(data.success ? false : true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log(error);
      }
    }
  };
  const handleUploadWrapper = async () => {
    await handleUpload().catch((error) => {
      console.log(error);
    });
  };
  useEffect(() => {
    if (uploadSuccess) {
      router.reload();
    }
  }, [router, uploadSuccess]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-20">
      <label>
        <input
          type="file"
          hidden
          onChange={({ target }) => {
            if (target.files && target.files[0]) {
              const file = target.files[0];
              setSelectedImage(URL.createObjectURL(file));
              setSelectedFile(file);
            }
          }}
        />
        <div className="w-420 flex aspect-video cursor-pointer items-center justify-center rounded border-2 border-dashed">
          {selectedImage ? (
            <Image src={selectedImage} height={192} width={420} alt="" />
          ) : (
            <span>Select Image</span>
          )}
        </div>
      </label>

      <button
        onClick={() => {
          void handleUploadWrapper();
        }}
        disabled={selectedImage == "" || uploading}
        style={{ opacity: uploading ? ".5" : "1" }}
        className="w-32 rounded bg-red-600 p-3 text-center text-white"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      <div className="mt-20 flex flex-col space-y-3">
        {dirs.map((item) => (
          <div key={item}>
            <Link href={"/images/" + item}>
              <p className="text-blue-500 hover:underline">{item}</p>
            </Link>

            {/* <Image src={image} alt={report.id} height={180} /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const props = { dirs: [] };
  try {
    const dirs = await fs.readdir(path.join(process.cwd(), "/public/images"));
    props.dirs = dirs as never;
    return { props };
  } catch (error) {
    return { props };
  }
};

export default Home;
