import { appTitle } from "~/pages/_document";

// import { useTranslation } from "react-i18next";
import type {
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

// import { useRouter } from "next/router";
import TechStack from "~/components/TechStack";

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
 * @name TechStackPage
 * @returns NextPage
 */
const PublicTechStackPage: NextPage = () => {
  // const router = useRouter();
  // const { locale: activeLocale } = router;
  // const { t } = useTranslation(activeLocale);
  return (
    <>
      <Head>
        <title>{`Tech Stack: Open-Source - Security - Privacy  | ${appTitle}`}</title>
        <meta
          name="description"
          content="Sicherheit steht bei #GrowAGram 🪴 an erster Stelle! Keine Passwörter, keine Probleme. Nutze sichere Anmeldeverfahren per E-Mail, Twitter oder Google, unterstützt durch Hash-Links und Open-Source-Technologie von next-auth.js.org. Deine Bilder sind geschützt: Vor dem Speichern werden alle Metadaten entfernt, und sie werden sicher auf einem amerikanischen Cloud-Hoster bei cloudinary.com gespeichert. Unser Backend ist ebenfalls transparent und Open-Source unter github.com/henningsieh/next-growers. Die Software basiert auf dem renommierten React-Framework NEXT.JS, gehostet bei VERCEL in den USA. Vertraue unserer detaillierten Sicherheitsarchitektur für deine Bedenken. 📝💚🙋‍♂️"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TechStack />
    </>
  );
};
export default PublicTechStackPage;
