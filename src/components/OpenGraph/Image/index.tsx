import React from "react";

import Head from "next/head";

// Anpassen der Props, um ein Array von Strings zu akzeptieren
interface OpenGraphImageProps {
  imageUrls: string[] | string;
}

const OpenGraphImage: React.FC<OpenGraphImageProps> = ({
  imageUrls,
}) => {
  // just in case imageUrls is a string, convert it to an array
  if (typeof imageUrls === "string") imageUrls = [imageUrls];
  return (
    <Head>
      {imageUrls.map((url, index) => (
        <meta key={index} property="og:image" content={url} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      {imageUrls.length > 0 && (
        <meta name="twitter:image" content={imageUrls[0]} />
      )}
    </Head>
  );
};

export default OpenGraphImage;
