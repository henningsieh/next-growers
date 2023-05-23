import { Box, Container, LoadingOverlay, Space, Title } from "@mantine/core";
import type {
  GetServerSidePropsContext,
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { IsoReportWithPostsFromDb, Strains } from "~/types";
import { Link, RichTextEditor } from "@mantine/tiptap";

import AccessDenied from "~/components/Atom/AccessDenied";
import AddPost from "~/components/Post/AddForm";
import { EditForm } from "~/components/Report/EditForm";
import Head from "next/head";
import { api } from "~/utils/api";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

/**
 * PROTECTED PAGE / PRELOAD SESSION
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

/**
 * @Page ReportDetails
 * @param props: { trpcState: DehydratedState, id: string }
 * @returns HTML Component
 */
export default function EditReportDetails() {
  const pageTitle = "Edit Grow Details";

  const router = useRouter();
  const id = router.query.editReport as string;

  // FETCH OWN REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: report,
    isLoading: reportIsLoading,
    isError: reportHasErrors,
  } = api.reports.getIsoReportWithPostsFromDb.useQuery(id);
  // FETCH ALL STRAINS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: strains,
    isLoading: strainsAreLoading,
    isError: strainsHaveErrors,
  } = api.strains.getAllStrains.useQuery();

  const { data: session, status } = useSession();
  if (status === "unauthenticated") return <AccessDenied />;

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
      <Container size="xl" className="flex flex-col space-y-2">
        {/* // Header with Title */}
        <div className="flex items-center justify-between pt-2">
          {/* // Title */}
          <Title order={1} className="inline">
            {pageTitle}
          </Title>
        </div>
        {/* // Header End */}
        <Box pos="relative">
          <LoadingOverlay
            visible={status === "loading" || reportIsLoading}
            transitionDuration={600}
            overlayBlur={2}
          />

          {status === "authenticated" && !reportIsLoading && (
            <>
              <EditForm
                report={report as IsoReportWithPostsFromDb}
                strains={strains as Strains}
                user={session.user}
              />

              <Space h="xl" />

              {/* // Add Component */}
              <AddPost report={report as IsoReportWithPostsFromDb} />

              {/* ================================= */}
              {/* // Props report output */}
              <Container
                size="md"
                pt="xl"
                className="flex w-full flex-col space-y-1"
              >
                <Title order={2}>raw dataset from db*</Title>
                <Title order={3}>*still in beta 🤓</Title>

                <div>{JSON.stringify(report, null, 4)}</div>
              </Container>
            </>
          )}
        </Box>
      </Container>
    </>
  );
}
