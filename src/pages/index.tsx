import { appTitle } from "./_document";

import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import LandingPage from "~/components/LandingPage";

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
const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`Welcome | ${appTitle}`}</title>
        <meta
          name="description"
          content="GrowAGram is a cannabis home cultivation community for sharing and discovering tips, techniques, and insights for successful cannabis cultivation. Welcome! Join our image community, share your weed images and upload your own reports to share your successes and learn from others. We are in alpha version - your feedback is very appreciated!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LandingPage />
    </>
  );
};
export default Index;
