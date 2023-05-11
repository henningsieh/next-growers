import type { GetServerSidePropsContext, NextPage } from "next";

import AddReport from "~/components/Report/AddForm";
import Head from "next/head";
import { Title } from "@mantine/core";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

const CreateReport: NextPage = () => {
  const { data: session } = useSession();

  if (session) {
    const pageTitle = "Create a Report";

    return (
      <>
        <Head>
          <title>{`GrowAGram | ${pageTitle}`}</title>
          <meta
            name="description"
            content="Create your grow report to growagram.com"
          />
        </Head>

        <Title order={1}>{pageTitle}</Title>

        <AddReport user={session.user} />
      </>
    );
  }
  return <p className="text-6xl">Access Denied</p>;
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
