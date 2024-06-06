import { appTitle } from "../_document";
import fs from "fs";
import path from "path";

import type {
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { useTranslation } from "next-i18next";
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
 * @name PrivacyPage
 * @returns NextPage
 */
const PublicPrivacyPage: NextPage<{ htmlContent: string }> = ({
  htmlContent,
}) => {
  const { t } = useTranslation();

  const pageTitle = t("common:app-impressum-privacy-label");

  return (
    <>
      <Head>
        <title>{`${pageTitle} | ${appTitle}`}</title>
        <meta name="description" content={pageTitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Privacy htmlContent={htmlContent} />
    </>
  );
};
export default PublicPrivacyPage;
