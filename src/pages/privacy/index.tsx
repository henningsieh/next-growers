import { appTitle } from "~/pages/_document";

import { useTranslation } from "react-i18next";

// import { useTranslation } from "react-i18next";
import type {
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

// import { useRouter } from "next/router";
import Privacy from "~/components/StaticPages/Privacy";

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
 * @name ContactPage
 * @returns NextPage
 */
const PublicContactPage: NextPage = () => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const pageTitle = t("common:app-impressum-contact-label");

  return (
    <>
      <Head>
        <title>{`${pageTitle}  | ${appTitle}`}</title>
        <meta
          name="description"
          content={`${pageTitle}  | ${appTitle}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Privacy />
    </>
  );
};
export default PublicContactPage;
