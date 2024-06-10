import {
  Box,
  Center,
  Container,
  createStyles,
  Loader,
  LoadingOverlay,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconChevronLeft } from "@tabler/icons-react";
import { httpStatusErrorMsg } from "~/messages";

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
import PostForm from "~/components/Post/PostForm";

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
const ProtectedEditPost: NextPage = () => {
  const router = useRouter();
  const queryReportId = router.query.reportId as string;
  const queryPostId = router.query.postId as string;

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const useStyles = createStyles((theme) => ({
    titleLink: {
      display: "inline-flex",
      fontWeight: "bold",
      color: dark
        ? theme.colors.groworange[4]
        : theme.colors.growgreen[5],
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

  const { data: session, status } = useSession();
  const sessionIsLoading = status === "loading";

  if (!sessionIsLoading && status === "unauthenticated") {
    return <AccessDenied />;
  }

  const {
    data: report,
    isLoading: reportIsLoading,
    isError: reportHasErrors,
    error: reportError,
  } = api.reports.getIsoReportWithPostsFromDb.useQuery(queryReportId);

  if (reportIsLoading)
    return (
      <Center>
        <Loader size="xl" m="xl" color="growgreen.4" />
      </Center>
    );
  if (reportHasErrors) {
    notifications.show(
      httpStatusErrorMsg(
        reportError.message,
        reportError.data?.httpStatus,
        true
      )
    );
    return (
      <>
        Error {reportError.data?.httpStatus}: {reportError.message}
      </>
    );
  }

  if (!sessionIsLoading && session?.user.id !== report.authorId) {
    return <AccessDenied />;
  }

  const queryPost = report?.posts.find(
    (post) => post.id === queryPostId
  );
  if (!!!queryPost) {
    return <>Error 404: Update with ID {queryPostId} was not found.</>;
  }

  return (
    <>
      <Head>
        <title>{`${pageTitle} | GrowAGram | ${report.title}`}</title>
        <meta
          name="description"
          content="Create your grow report on growagram.com"
        />
      </Head>

      {/* // Main Content Container */}
      <Container size="xl" className="flex flex-col space-y-2">
        {/* // Header with Title */}
        {reportIsLoading ? (
          <Center>
            <Loader size="xl" m="xl" color="growgreen.4" />
          </Center>
        ) : (
          <Box className="flex items-center justify-start pt-2">
            <Link
              title="back to Update"
              href={`/grow/${report?.id}/update/${queryPostId}`}
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
                <PostForm isoReport={report} post={queryPost as Post} />
              </>
            )}
        </Box>
      </Container>
    </>
  );
};

export default ProtectedEditPost;
