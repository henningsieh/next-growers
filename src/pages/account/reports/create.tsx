import {
  Button,
  Container,
  Group,
  Space,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import type { GetServerSidePropsContext, NextPage } from "next";

import AddReport from "~/components/Report/Add";
import Head from "next/head";
import { IconBackspace } from "@tabler/icons-react";
import Link from "next/link";
import Loading from "~/components/Atom/Loading";
import LoadingError from "~/components/Atom/LoadingError";
import { api } from "~/utils/api";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
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

        <AddReport />
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
