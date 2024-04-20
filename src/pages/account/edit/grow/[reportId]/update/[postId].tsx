import {
  Box,
  Container,
  createStyles,
  Loader,
  LoadingOverlay,
  Title,
} from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

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
import Link from "next/link";
import { useRouter } from "next/router";

import AccessDenied from "~/components/Atom/AccessDenied";
import AddPost from "~/components/Post/AddForm";

import { authOptions } from "~/server/auth";

import type { Post } from "~/types";

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
  const queryPostId = router.query.postId as string;

  const useStyles = createStyles((theme) => ({
    titleLink: {
      display: "inline-flex",
      color: theme.colors.orange?.[7],
    },
    title: {
      display: "inline-flex",
      // paddingBottom: 10,
      // color: theme.colors.orange?.[7],
    },
  }));
  const { classes } = useStyles();

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);
  const pageTitle = t("common:post-edit-headline");

  const { status } = useSession();
  const sessionIsLoading = status === "loading";

  if (!sessionIsLoading && status === "unauthenticated") {
    return <AccessDenied />;
  }

  const {
    data: report,
    isLoading: reportIsLoading,
    isError: reportHasErrors,
  } = api.reports.getIsoReportWithPostsFromDb.useQuery(queryReportId);

  if (!reportIsLoading && reportHasErrors) {
    return <>Server Error</>;
  }

  const reportTitle = `${report?.title as string}`;

  const queryPost = report?.posts.find(
    (post: Post) => post.id === queryPostId
  );

  return (
    <>
      <Head>
        <title>{`${pageTitle} | GrowAGram | ${reportTitle}`}</title>
        <meta
          name="description"
          content="Create your grow report on growagram.com"
        />
      </Head>

      {/* // Main Content Container */}
      <Container size="xl" className="flex flex-col space-y-2">
        {/* // Header with Title */}
        {reportIsLoading ? (
          <Loader /> // Render Loader component if reportIsLoading is true
        ) : (
          <Box className="flex items-center justify-start pt-2">
            <Link
              title="back to Update"
              href={`/grow/${report?.id as string}/update/${queryPostId}`}
            >
              <Box className={classes.titleLink}>
                <IconChevronLeft size={28} />
                {queryPost?.title}
              </Box>
            </Link>
          </Box>
        )}

        {/* // Title */}
        <Title className={classes.title} order={1}>
          {pageTitle}
        </Title>
        {/* // Header End */}

        <Box pos="relative">
          <LoadingOverlay
            visible={sessionIsLoading || reportIsLoading}
            transitionDuration={900}
            overlayBlur={2}
          />

          {status === "authenticated" &&
            !reportIsLoading &&
            !reportHasErrors && (
              <>
                <AddPost isoReport={report} post={queryPost as Post} />
              </>
            )}
        </Box>
      </Container>
    </>
  );
};

export default ProtectedEditReportDetails;
