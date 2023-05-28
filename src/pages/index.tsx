import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import LandingCard from "~/components/LandingCard";

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
const LandingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>GrowAGram | Show your Grow 🪴</title>
        <meta
          name="description"
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          content=""
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LandingCard />
    </>
  );
};
export default LandingPage;
