import { type GetServerSidePropsContext } from "next";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";

import { Container, Title } from "@mantine/core";
import AccessDenied from "~/components/Atom/AccessDenied";
import Head from "next/head";

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
      <Container size="xl" className="flex w-full flex-col space-y-1">
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

/**
 *
 * PROTECTED PAGE
 */
export async function getServerSideProps(ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) {
  return {
    props: {
      session: await getServerSession(ctx.req, ctx.res, authOptions),
    },
  };
}
