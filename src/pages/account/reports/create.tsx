import { Container, Title } from "@mantine/core";
import type { GetServerSidePropsContext, NextPage } from "next";

import AccessDenied from "~/components/Atom/AccessDenied";
import AddReport from "~/components/Report/AddForm";
import Head from "next/head";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

const CreateReport: NextPage = () => {
  const pageTitle = "Create a Report";

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
        </div>
        {/* // Header End */}
        {/* // Add Component */}

        <AddReport user={session.user} />
      </Container>
    </>
  );
};

export default CreateReport;

/**
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
