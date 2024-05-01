import {
  Alert,
  Box,
  Button,
  Container,
  createStyles,
  Group,
  Loader,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconEdit } from "@tabler/icons-react";
import dayjs from "dayjs";
import { httpStatusErrorMsg, noPostAtThisDay } from "~/messages";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { generateOpenGraphMetaTagsImage } from "~/components/OpenGraph/Image";
import { PostCard } from "~/components/Post/PostCard";
import PostDatepicker from "~/components/Post/PostDatepicker";
import { ReportHeader } from "~/components/Report/Header";
import { LightWattChart } from "~/components/Report/LightWattChart/LightWattChart";

import { api } from "~/utils/api";
import { compareDatesWithoutTime } from "~/utils/helperUtils";

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
  const router = useRouter();
  const queryReportId = router.query.reportId as string;

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
      display: "flex",
      [theme.fn.smallerThan("md")]: {
        flexDirection: "column",
      },

      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: theme.spacing.sm,
    },
  }));
  const { theme, classes } = useStyles();

  const { data: session, status } = useSession();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const [postId, setPostId] = useState<string>("");
  const [selectedDate, selectDate] = useState<Date | null>(null);

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

  const {
    data: report,
    isLoading: reportIsLoading,
    isError: reportHasErrors,
    error: error,
  } = api.reports.getIsoReportWithPostsFromDb.useQuery(queryReportId, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (reportIsLoading) return <Loader color="growgreen.4" />;
  if (reportHasErrors) {
    notifications.show(
      httpStatusErrorMsg(error.message, error.data?.httpStatus, true)
    );
    return (
      <>
        Error {error.data?.httpStatus}: {error.message}
      </>
    );
  }

  const pageTitle = `${report.title}`;

  const dateOfnewestPost = report.posts.reduce((maxDate, post) => {
    const postDate = new Date(post.date);
    return postDate > maxDate ? postDate : maxDate;
  }, new Date(0));

  const postDays = report.posts.map((post) =>
    new Date(post.date).getTime()
  );
  const dateOfGermination = new Date(report.createdAt);

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

    const matchingPost = report.posts.find((post) => {
      const postDate = new Date(post.date);

      return compareDatesWithoutTime(selectedDate, postDate);
      //return selectedDate.toISOString() === postDate.toISOString();
    });

    if (matchingPost) {
      // scrollIntoView({
      //   alignment: "start",
      // });
      selectDate(new Date(matchingPost.date));
      setPostId(matchingPost.id);
      const newUrl = `/grow/${report.id}/update/${matchingPost.id}`;
      void router.replace(newUrl, undefined, {
        shallow: true,
        scroll: false,
      });
    } else {
      notifications.show(noPostAtThisDay);
    }
  };

  const imageTags = generateOpenGraphMetaTagsImage(
    report.image?.cloudUrl as string
  );
  const description = "Create your grow report on growagram.com"; //@TODO fix me SEO
  const title = `Grow "${pageTitle}" from ${
    report.author?.name as string
  } | GrowAGram`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          property="og:url"
          content={`https://growagram.com/grow/${report.id || ""}`}
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {imageTags &&
          imageTags.map((tag, index) => <meta key={index} {...tag} />)}
      </Head>

      {/* // Main Content Container */}
      <Container size="xl" className="flex flex-col space-y-2">
        {/* // Header with Title */}
        <Box pt={13} className={classes.title}>
          <Title order={1} className="inline">
            {`${pageTitle}`}
          </Title>

          {/* Right side Edit Buttons */}
          {!!report &&
            status === "authenticated" &&
            report.authorId === session.user.id && (
              <Group position="right">
                {/* Edit Grow Button */}
                <Link href={`/account/edit/grow/${report.id}#editGrow`}>
                  <Button
                    h={32}
                    miw={180}
                    compact
                    variant="filled"
                    color="groworange"
                    className="cursor-pointer"
                    leftIcon={
                      <IconEdit
                        className="ml-1"
                        size={22}
                        stroke={1.6}
                      />
                    }
                  >
                    {t("common:report-edit-button")}
                  </Button>
                </Link>

                {/* Add Post Button */}
                <Link
                  href={`/account/edit/grow/${report.id}#addUpdate`}
                >
                  <Button
                    h={32}
                    miw={180}
                    compact
                    variant="filled"
                    color="growgreen"
                    className="cursor-pointer"
                    leftIcon={
                      <IconEdit
                        className="ml-1"
                        size={22}
                        stroke={1.6}
                      />
                    }
                  >
                    {t("common:addpost-headline")}
                  </Button>
                </Link>
              </Group>
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
              image={report.image?.cloudUrl as string}
              avatar={
                report.author?.image
                  ? report.author?.image
                  : `https://ui-avatars.com/api/?name=${
                      report.author?.name as string
                    }`
              }
              name={report.author?.name as string}
              description={report.description}
            />
          )}
          {/* // Posts Date Picker */}
          {/* <Box ref={targetRef}> */}

          <Box>
            <PostDatepicker
              defaultDate={
                selectedDate ? columnStartMonth : dateOfGermination
              }
              postDays={postDays}
              selectedDate={selectedDate}
              handleSelectDate={handleSelectDate}
              dateOfnewestPost={dateOfnewestPost}
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
                <PostCard postId={postId} reportFromProps={report} />
              )}
            </>
          )}
        </Container>
      </Container>

      <Container size="xl" p="md" className="flex flex-col">
        <Title py="sm" order={2}>
          Statistics
        </Title>
        <LightWattChart
          reportStartDate={new Date(report.createdAt)}
          dateOfnewestPost={dateOfnewestPost}
        />
      </Container>
    </>
  );
};

export default PublicReport;
