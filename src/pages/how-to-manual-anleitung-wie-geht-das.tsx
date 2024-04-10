import { appTitle } from "./_document";

import type { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import HowTo from "~/components/HowTo";

/** PUBLIC STATIC PAGE with translations
 *
 * getStaticProps (Static Site Generation)
 * @returns Promise<GetStaticPropsResult<Props>> | GetStaticPropsResult<Props>
 */
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

/**
 * @name HowToPage
 * @returns NextPage
 */
const PublicHowToPage: NextPage = () => {
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
export default PublicHowToPage;
