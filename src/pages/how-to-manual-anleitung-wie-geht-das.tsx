import { appTitle } from "./_document";

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
        <title>{`Howto / Manual | ${appTitle}`}</title>
        <meta
          name="description"
          content="Manual: How does this GrowAGram thing work? Learn everything about authentication, fulltext and strain search, security and your privacy."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HowTo />
    </>
  );
};
export default HowToPage;
