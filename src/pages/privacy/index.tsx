import { appTitle } from "../_document";
import fs from "fs";
import path from "path";

import type {
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import Privacy from "~/components/StaticPages/Privacy";

import type { Locale } from "~/types";

/** PUBLIC STATIC PAGE with translations
 * getStaticProps (Static Site Generation)
 *
 * @param GetStaticPropsContext<Params extends ParsedUrlQuery = ParsedUrlQuery, Preview extends PreviewData = PreviewData>
 * @returns Promise<{ props: { _nextI18Next?: { initialI18nStore: any; initialLocale: string; ns: string[]; userConfig: UserConfig | null; } | undefined; }; }>
 */
export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  // Access the locale/language from the context object
  const locale: Locale = context.locale as Locale;

  console.debug("LOCALE: ", locale);

  const privacyHtmlFilePath = path.join(
    process.cwd(),
    "src",
    "components",
    "StaticPages",
    "Privacy",
    `index_${locale}.html`
  );
  const privacyHtmlContent = fs.readFileSync(
    privacyHtmlFilePath,
    "utf8"
  );

  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, [
        "common",
      ])),
      htmlContent: privacyHtmlContent,
    },
  };
};

/**
 * @name HowToPage
 * @returns NextPage
 */
const PublicContactPage: NextPage<{ htmlContent: string }> = ({
  htmlContent,
}) => {
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

      <Privacy htmlContent={htmlContent} />
    </>
  );
};
export default PublicContactPage;
