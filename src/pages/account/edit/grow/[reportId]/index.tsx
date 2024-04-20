import {
  Box,
  Container,
  LoadingOverlay,
  Space,
  Title,
} from "@mantine/core";

import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import AccessDenied from "~/components/Atom/AccessDenied";
import PostsAccordion from "~/components/Post/Accordion";
import AddPost from "~/components/Post/AddForm";
import { EditReportForm } from "~/components/Report/EditForm";

import { authOptions } from "~/server/auth";

import { api } from "~/utils/api";

/** PROTECTED DYNAMIC PAGE with translations
 * getServerSideProps (Server-Side Rendering)
 *
 * @param GetServerSidePropsContext<{ locale: string; translations: string | string[] | undefined; }> context - The context object containing information about the request
 * @returns Promise<{ props: { [key: string]: any }; }> - A promise resolving to an object containing props to be passed to the page component
 */
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => ({
  props: {
    ...(await serverSideTranslations(context.locale as string, [
      "common",
    ])),
    session: await getServerSession(
      context.req,
      context.res,
      authOptions
    ),
  },
});

/**
 * @Page EditReportDetails
 * @param props: { trpcState: DehydratedState, reportId: string }
 * @returns HTML Component
 */
const ProtectedEditReportDetails: NextPage = () => {
  const router = useRouter();
  const queryReportId = router.query.reportId as string;

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);
  const pageTitle = t("common:report-edit-headline");

  const { data: session, status } = useSession();
  const sessionIsLoading = status === "loading";

  const {
    data: report,
    isLoading: reportIsLoading,
    isError: reportHasErrors,
  } = api.reports.getIsoReportWithPostsFromDb.useQuery(queryReportId);

  const {
    data: strains,
    isLoading: strainsAreLoading,
    isError: strainsHaveErrors,
  } = api.strains.getAllStrains.useQuery();

  if (
    !reportIsLoading &&
    !strainsAreLoading &&
    (reportHasErrors || strainsHaveErrors)
  ) {
    return <>Server Error</>;
  }

  if (
    !sessionIsLoading &&
    !reportIsLoading &&
    (status === "unauthenticated" ||
      report?.authorId != session?.user.id)
  ) {
    return <AccessDenied />;
  }

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
        <Box className="flex items-center justify-between pt-2">
          {/* // Title */}
          <Title order={1} className="inline">
            {pageTitle}
          </Title>
        </Box>
        {/* // Header End */}
        <Box pos="relative">
          <LoadingOverlay
            visible={reportIsLoading}
            transitionDuration={1200}
            overlayBlur={2}
          />

          {status === "authenticated" &&
            !reportIsLoading &&
            !reportHasErrors &&
            !strainsAreLoading &&
            !strainsHaveErrors && (
              <>
                <EditReportForm
                  report={report}
                  strains={strains}
                  user={session.user}
                />

                <Space h="xl" />
                <Space h="xl" />

                {/* AddPost Component */}
                <Container p={0}>
                  <Title order={2}>
                    {t("common:addpost-headline")}
                  </Title>
                </Container>
                <AddPost isoReport={report} post={null} />

                <Space h="xl" />
                <Space h="xl" />

                {/* PostsAccordion Component */}
                {/* Alle Updates bearbeiten*/}
                <PostsAccordion report={report && report} />
              </>
            )}
        </Box>
      </Container>
    </>
  );
};

export default ProtectedEditReportDetails;
