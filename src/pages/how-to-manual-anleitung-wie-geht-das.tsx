import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import HowTo from "~/components/HowTo";

/**
 * // PUBLIC PAGE with translations
 *
 * getServerSideProps
 */
export const getServerSideProps: GetServerSideProps = async ({
  locale,
}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common"])),
    },
  };
};
const HowToPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>GrowAGram | Show your Grow 🪴</title>
        <meta
          name="description"
          content="Manual: How does this GrowAGram thing work?"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HowTo />
    </>
  );
};
export default HowToPage;
