import { type GetServerSidePropsContext } from "next";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";

import { Container, Title } from "@mantine/core";
import AccessDenied from "~/components/Atom/AccessDenied";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/**
 * PROTECTED PAGE with translations
 * async getServerSideProps()
 *
 * @param context: GetServerSidePropsContext<{translations: string | string[] | undefined;}>
 * @returns : Promise<{props: { session: Session | null } | undefined;};}>
 */
export async function getServerSideProps(
  context: GetServerSidePropsContext<{
    translations: string | string[] | undefined;
  }>
) {
  // Fetch translations using next-i18next
  const translations = await serverSideTranslations(
    context.locale as string,
    ["common"]
  );
  return {
    props: {
      ...translations,
      session: await getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  };
}

export default function Page() {
  const pageTitle = "Your Account Settings";

  const { data: session } = useSession();

  if (!session?.user) return <AccessDenied />;

  return (
    <>
      <Head>
        <title>{`GrowAGram | ${pageTitle}`}</title>
        <meta
          name="description"
          content="Create your grow report on growagram.com"
        />
      </Head>

      {/* // Main Content Container */}
      <Container
        size="xl"
        className="flex w-full flex-col space-y-1"
      >
        {/* // Header with Title */}
        <div className="flex items-center justify-between pt-2">
          {/* // Title */}
          <Title order={1} className="inline">
            {pageTitle}
          </Title>
        </div>{" "}
        {/* // Header End */}
        <h2>Protected Page</h2>
        <p>You can view this page because you are signed in.</p>
      </Container>
    </>
  );
}
