import type { GetServerSideProps, NextPage } from "next";

import Head from "next/head";
import LandingCard from "~/components/LandingCard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common"])),
    },
  };
};

const LandingPage: NextPage = () => {
  const router = useRouter();
  const {
    locale: activeLocale,
    locales: availableLocales,
    defaultLocale,
  } = router;

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
