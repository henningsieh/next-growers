import {
  Alert,
  Box,
  Button,
  Container,
  createStyles,
  LoadingOverlay,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconEdit } from "@tabler/icons-react";
import dayjs from "dayjs";
import { noPostAtThisDay } from "~/messages";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { generateOpenGraphMetaTagsImage } from "~/components/OpenGraph/Image";
import PostsDatePicker from "~/components/Post/Datepicker";
import { PostCard } from "~/components/Post/PostCard";
import { ReportHeader } from "~/components/Report/Header";

import type { IsoReportWithPostsFromDb } from "~/types";

import { api } from "~/utils/api";

/** PUBLIC DYNAMIC PAGE with translations
 * getServerSideProps (Server-Side Rendering)
 *
 * @param GetServerSidePropsContext<ParsedUrlQuery, Record<string, string | string[]>> context - The context object containing information about the request
 * @returns Promise<GetServerSidePropsResult<Props>> - A promise resolving to an object containing props to be passed to the page component
 */
export const getServerSideProps: GetServerSideProps = async (
  context
) => ({
  props: {
    ...(await serverSideTranslations(context.locale as string, [
      "common",
    ])),
  },
});

/**
 * @Page ReportDetails
 * @param props: { trpcState: DehydratedState, reportId: string }
 * @returns NextPage
 */
const PublicReport: NextPage = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const useStyles = createStyles((theme) => ({
    titleLink: {
      display: "inline-flex",
      color: dark
        ? theme.colors.growgreen?.[4]
        : theme.colors.growgreen?.[4],
    },

    title: {
      display: "flex",
      [theme.fn.smallerThan("md")]: {
        flexDirection: "column",
      },
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: theme.spacing.sm,
    },
  }));
  const { classes } = useStyles();

  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { data: session, status } = useSession();

  const queryReportId = router.query.reportId as string;

  const {
    data: report,
    isLoading: reportIsLoading,
    //isError: reportHasErrors,
  } = api.reports.getIsoReportWithPostsFromDb.useQuery(queryReportId);

  const pageTitle = `${report?.title as string}`;

  // const { locale: activeLocale } = router;
  // const { t } = useTranslation(activeLocale);

  const xs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const md = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const lg = useMediaQuery(`(max-width: ${theme.breakpoints.lg})`);
  const xl = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`);
  const getResponsiveColumnCount = xs
    ? 1
    : sm
      ? 1
      : md
        ? 2
        : lg
          ? 3
          : xl
            ? 4
            : 5;

  const dateOfnewestPost = report?.posts.reduce((maxDate, post) => {
    const postDate = new Date(post.date);
    return postDate > maxDate ? postDate : maxDate;
  }, new Date(0));

  const [postId, setPostId] = useState<string>("");
  const [selectedDate, selectDate] = useState<Date | null>(null);

  if (reportIsLoading)
    return (
      <LoadingOverlay
        ml={42}
        mt={12}
        radius="sm"
        visible={reportIsLoading}
        transitionDuration={150}
        loaderProps={{
          size: "sm",
          variant: "dots",
        }}
      />
    );
  console.debug("report:", report);

  const postDays = report?.posts.map((post) =>
    new Date(post.date).getTime()
  );
  const dateOfGermination = new Date(report?.createdAt as string);

  const defaultRelDate =
    dayjs(selectedDate)
      .subtract(getResponsiveColumnCount - 1, "month")
      .toDate() || dateOfGermination;

  const columnStartMonth: Date =
    defaultRelDate < dateOfGermination
      ? dateOfGermination
      : defaultRelDate;

  // const { scrollIntoView, targetRef } =
  //   useScrollIntoView<HTMLDivElement>({
  //     offset: 1,
  //   });

  const handleSelectDate = (selectedDate: Date | null) => {
    if (!selectedDate) {
      return;
    }

    const matchingPost = report?.posts.find((post) => {
      const postDate = new Date(post.date);
      return selectedDate.toISOString() === postDate.toISOString();
    });

    if (matchingPost) {
      // scrollIntoView({
      //   alignment: "start",
      // });
      selectDate(new Date(matchingPost.date));
      setPostId(matchingPost.id);
      const newUrl = `/grow/${report?.id as string}/update/${matchingPost.id}`;
      void router.replace(newUrl, undefined, {
        shallow: true,
        scroll: false,
      });
    } else {
      notifications.show(noPostAtThisDay);
    }
  };

  const imageTags = generateOpenGraphMetaTagsImage(
    report?.image?.cloudUrl as string
  );
  const description = "Create your grow report on growagram.com"; //@TODO fix me SEO
  const title = `Grow "${pageTitle}" from ${
    report?.author?.name as string
  } | GrowAGram`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          property="og:url"
          content={`https://growagram.com/grow/${report?.id || ""}`}
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {imageTags &&
          imageTags.map((tag, index) => <meta key={index} {...tag} />)}
      </Head>
      {/* // Main Content Container */}
      <Container
        size="xl"
        className="mb-8 flex w-full flex-col space-y-1"
      >
        {/* // Header with Title */}
        <Box className={classes.title}>
          <Title mb={6} order={1} className="inline">
            {`${pageTitle}`}
          </Title>

          {!!report &&
            status === "authenticated" &&
            report.authorId === session.user.id && (
              <Link
                href={`/account/edit/grow/${report?.id as string}#editGrow`}
              >
                <Button
                  h={32}
                  compact
                  variant="filled"
                  color="groworange"
                  className="cursor-pointer"
                  rightIcon={
                    <IconEdit className="ml-1" size={22} stroke={1.6} />
                  }
                >
                  {t("common:report-edit-button")}
                </Button>
              </Link>
            )}
        </Box>
        {/* // Header End */}
        <Container
          size="xl"
          px={0}
          mx="auto"
          pt="xs"
          className="flex w-full flex-col space-y-4"
        >
          {report && (
            <ReportHeader
              report={report}
              image={report?.image?.cloudUrl as string}
              avatar={
                report?.author?.image
                  ? report?.author?.image
                  : `https://ui-avatars.com/api/?name=${
                      report?.author?.name as string
                    }`
              }
              name={report?.author?.name as string}
              description={report?.description as string}
            />
          )}
          {/* // Posts Date Picker */}
          {/* <Box ref={targetRef}> */}

          <Box>
            <PostsDatePicker
              defaultDate={
                selectedDate ? columnStartMonth : dateOfGermination
              }
              postDays={postDays as number[]}
              selectedDate={selectedDate}
              handleSelectDate={handleSelectDate}
              dateOfnewestPost={dateOfnewestPost as Date}
              dateOfGermination={dateOfGermination}
              responsiveColumnCount={getResponsiveColumnCount}
            />
          </Box>

          {postDays?.length === 0 ? (
            <>
              <Alert
                p={16}
                bg={theme.colors.groworange[5]}
                variant="filled"
              >
                <Text mx="auto">
                  Dieser Grow hat bisher leider noch keine Updates! 😪
                </Text>
              </Alert>
            </>
          ) : (
            <>
              {selectedDate === null ? (
                <Alert
                  p={16}
                  bg={theme.colors.green[9]}
                  variant="filled"
                >
                  <Text mx="auto">
                    Select an Update (Grow Day) from calendar!☝️
                  </Text>
                </Alert>
              ) : (
                <PostCard
                  postId={postId}
                  report={report as IsoReportWithPostsFromDb}
                />
              )}
            </>
          )}
        </Container>
      </Container>
    </>
  );
};

export default PublicReport;
