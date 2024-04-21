import { appTitle } from "./_document";

import type {
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import HowTo from "~/components/StaticPages/Features";

/** PUBLIC STATIC PAGE with translations
 * getStaticProps (Static Site Generation)
 *
 * @param GetStaticPropsContext<Params extends ParsedUrlQuery = ParsedUrlQuery, Preview extends PreviewData = PreviewData>
 * @returns Promise<{ props: { _nextI18Next?: { initialI18nStore: any; initialLocale: string; ns: string[]; userConfig: UserConfig | null; } | undefined; }; }>
 */
export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => ({
  props: {
    ...(await serverSideTranslations(context.locale as string, [
      "common",
    ])),
  },
});

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
