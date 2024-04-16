import Head from "next/head";

// Anpassen der Props, um ein Array von Strings zu akzeptieren
interface OpenGraphDescriptionProps {
  description: string;
}

const OpenGraphDescription: React.FC<OpenGraphDescriptionProps> = ({
  description,
}) => {
  if (description.length === 0) {
    return null;
  }
  return (
    <Head>
      <meta property="og:description" content={description} />
    </Head>
  );
};

export default OpenGraphDescription;
