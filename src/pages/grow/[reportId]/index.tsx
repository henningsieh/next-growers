import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  Loader,
  rem,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCalendar,
  IconClock,
  IconEdit,
  IconEye,
  IconHome,
  IconPlant,
} from "@tabler/icons-react";
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

import LikeHeart from "~/components/Atom/LikeHeart";
import { generateOpenGraphMetaTagsImage } from "~/components/OpenGraph/Image";
import { PostCard } from "~/components/Post/PostCard";
import PostDatepicker from "~/components/Post/PostDatepicker";
import { ReportHeader } from "~/components/Report/Header";
import { LightWattChart } from "~/components/Report/LightWattChart/LightWattChart";

import { Environment, Locale } from "~/types";

import { api } from "~/utils/api";
import {
  compareDatesWithoutTime,
  sanatizeDateString,
} from "~/utils/helperUtils";

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

  const [postId, setPostId] = useState<string>("");

  const queryReportId = router.query.reportId as string;
  const [selectedDate, selectDate] = useState<Date | null>(null);

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const useStyles = createStyles((theme) => ({
    icon: {
      marginRight: rem(5),
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.black,
    },

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

    section: {
      marginTop: theme.spacing.xl,
      padding: theme.spacing.xs,
      borderTop: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  }));
  const { theme, classes } = useStyles();

  const { data: session, status } = useSession();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

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

  // const { scrollIntoView, targetRef } =
  //   useScrollIntoView<HTMLDivElement>({
  //     offset: 1,
  //   });

  const {
    data: grow,
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

  const dateOfnewestPost = grow.posts.reduce((maxDate, post) => {
    const postDate = new Date(post.date);
    return postDate > maxDate ? postDate : maxDate;
  }, new Date(0));

  const postDays = grow.posts.map((post) =>
    new Date(post.date).getTime()
  );

  const pageTitle = `${grow.title}`;

  const reportBasicData = [
    {
      label: sanatizeDateString(
        grow?.createdAt,
        router.locale === Locale.DE ? Locale.DE : Locale.EN,
        false,
        false
      ),
      icon: IconCalendar,
    },
    {
      label: Environment[grow.environment as keyof typeof Environment],
      icon: IconHome,
    },
    {
      label: "1468",
      icon: IconEye,
    },
    {
      label: sanatizeDateString(
        grow?.updatedAt,
        router.locale === Locale.DE ? Locale.DE : Locale.EN,
        false,
        false
      ),
      icon: IconClock,
    },
  ];

  const reportBasics = reportBasicData.map((growBasic) => (
    <Center key={growBasic.label}>
      <growBasic.icon
        size="1.05rem"
        className={classes.icon}
        stroke={1.6}
      />
      <Text size="xs"> {growBasic.label} </Text>
    </Center>
  ));

  const dateOfGermination = new Date(grow.createdAt);

  const defaultRelDate =
    dayjs(selectedDate)
      .subtract(getResponsiveColumnCount - 1, "month")
      .toDate() || dateOfGermination;

  const columnStartMonth: Date =
    defaultRelDate < dateOfGermination
      ? dateOfGermination
      : defaultRelDate;

  const handleSelectDate = (selectedDate: Date | null) => {
    if (!selectedDate) {
      return;
    }

    const matchingPost = grow.posts.find((post) => {
      const postDate = new Date(post.date);
      return compareDatesWithoutTime(selectedDate, postDate);
    });

    if (matchingPost) {
      // scrollIntoView({
      //   // alignment: "start",
      // });

      selectDate(new Date(matchingPost.date));
      setPostId(matchingPost.id);
      const newUrl = `/grow/${grow.id}/update/${matchingPost.id}`;
      void router.replace(newUrl, undefined, {
        // shallow: true,
        scroll: false,
      });
    } else {
      notifications.show(noPostAtThisDay);
    }
  };

  const imageTags = generateOpenGraphMetaTagsImage(
    grow.image?.cloudUrl as string
  );
  const description = "Create your grow report on growagram.com"; //@TODO fix me SEO
  const title = `Grow "${pageTitle}" from ${
    grow.author?.name as string
  } | GrowAGram`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          property="og:url"
          content={`https://growagram.com/grow/${grow.id || ""}`}
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
          {!!grow &&
            status === "authenticated" &&
            grow.authorId === session.user.id && (
              <Group position="right">
                {/* Edit Grow Button */}
                <Link href={`/account/edit/grow/${grow.id}/editGrow`}>
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
                <Link href={`/account/edit/grow/${grow.id}/addUpdate`}>
                  <Button
                    h={32}
                    miw={180}
                    compact
                    variant="filled"
                    color="growgreen"
                    className="cursor-pointer"
                    leftIcon={
                      <IconPlant
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
          // px={0}
          mx="auto"
          pt="xs"
          className="flex w-full flex-col space-y-4"
        >
          {grow && (
            <ReportHeader
              report={grow}
              image={grow.image?.cloudUrl as string}
              avatar={
                grow.author?.image
                  ? grow.author?.image
                  : `https://ui-avatars.com/api/?name=${
                      grow.author?.name as string
                    }`
              }
              name={grow.author?.name as string}
              description={grow.description}
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
                <PostCard postId={postId} reportFromProps={grow} />
              )}
            </>
          )}
        </Container>
      </Container>

      <Container size="xl" className="flex flex-col space-y-2">
        <Group px="sm" position="apart" className={classes.section}>
          <Title py="sm" order={3}>
            Grow
          </Title>
          <Text fz="md">{grow.title}</Text>
          <LikeHeart itemToLike={grow} itemType={"Report"} />
        </Group>

        <Group mt="xl" position="apart" spacing="xs">
          {reportBasics}
        </Group>

        <Title p="sm" order={4}>
          Grow Statistics
        </Title>
        <LightWattChart
          repordId={grow.id}
          reportStartDate={new Date(grow.createdAt)}
          dateOfnewestPost={dateOfnewestPost}
        />
      </Container>
    </>
  );
};

export default PublicReport;
