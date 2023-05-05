import { type GetServerSidePropsContext } from "next";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";

import Head from "next/head";
import type { NextPage } from "next";

//import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data: session } = useSession();
  //  const etMsg = trpc.useQuery(['trpcRoute.etAPI']);

  if (session) {
    return (
      <section>
        <Head>
          <title>Edit Profile end Settings</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main id="API" className="flex h-full place-content-center">
          <div className="flex flex-col items-center">
            <h1 className="mx-5 text-2xl">Edit Profile end Settings</h1>
          </div>

          {/* CONENT */}
        </main>
      </section>
    );
  }
  return <p className="text-6xl">Access Denied</p>;
};

export default Home;

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
