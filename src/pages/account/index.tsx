import { type GetServerSidePropsContext } from "next";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";

import { Container, Title } from "@mantine/core";
import AccessDenied from "~/components/Atom/AccessDenied";

export default function Page() {
  const { data: session } = useSession();

  // if (typeof window === "undefined") return null

  if (session) {
    return (
      <>
        <Container className="h-96">
          <Title>Your Account Settings</Title>
          <h2>Protected Page</h2>
          <p>You can view this page because you are signed in.</p>
        </Container>
      </>
    );
  }
  return <AccessDenied />;
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
