// import { useRouter } from "next/router";
// import Privacy from "~/components/StaticPages/Privacy";
import {
  Box,
  Container,
  createStyles,
  rem,
  Title,
} from "@mantine/core";
import fs from "fs";
import path from "path";
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

/** PUBLIC STATIC PAGE with translations
 * getStaticProps (Static Site Generation)
 *
 * @param GetStaticPropsContext<Params extends ParsedUrlQuery = ParsedUrlQuery, Preview extends PreviewData = PreviewData>
 * @returns Promise<{ props: { _nextI18Next?: { initialI18nStore: any; initialLocale: string; ns: string[]; userConfig: UserConfig | null; } | undefined; }; }>
 */
export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const privacyHtmlFilePath = path.join(
    process.cwd(),
    "src",
    "components",
    "StaticPages",
    "Privacy",
    "index.html"
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

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: `'Roboto Slab', sans-serif`,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    fontSize: rem(34),
    [theme.fn.smallerThan("lg")]: {
      fontSize: rem(28),
      // textAlign: "left",
    },
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(19),
      textAlign: "left",
    },
  },
}));

/**
 * @name ContactPage
 * @returns NextPage
 */
const PublicContactPage: NextPage<{ htmlContent: string }> = ({
  htmlContent,
}) => {
  const router = useRouter();
  const { classes } = useStyles();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const pageTitle = t("common:app-impressum-privacy-label");

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
      <Container size="md" className="space-y-4 ">
        <Title order={1} className={classes.title}>
          {pageTitle}
        </Title>
        <Box
          className="prose-lg prose-underline"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <style jsx global>{`
          .prose a {
            text-decoration: underline;
          }
        `}</style>
      </Container>
    </>
  );
};

export default PublicContactPage;
