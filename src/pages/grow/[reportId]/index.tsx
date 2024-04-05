import { Box, Container, Title, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";

import { useState } from "react";

import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
// import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import { noPostAtThisDay } from "~/components/Notifications/messages";
import { PostCard } from "~/components/Post/Card";
import PostsDatePicker from "~/components/Post/Datepicker";
import { ReportHeader } from "~/components/Report/Header";

import { prisma } from "~/server/db";

/**
 * getStaticProps
 * @param context : GetStaticPropsContext<{ id: string }>
 * @returns : Promise<{props{ report: Report }}>
 */
export async function getStaticProps(
  context: GetStaticPropsContext<{ reportId: string }>
) {
  const reportId = context.params?.reportId as string;

  // Prefetching the report from prisma
  const reportFromDb = await prisma.report.findUnique({
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      image: {
        select: {
          id: true,
          publicId: true,
          cloudUrl: true,
        },
      },
      strains: {
        select: {
          id: true,
          name: true,
          description: true,
          effects: true,
          flavors: true,
        },
      },
      likes: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      posts: {
        orderBy: {
          date: "asc",
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          images: {
            select: {
              id: true,
              publicId: true,
              cloudUrl: true,
            },
          },
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          comments: true,
        },
      },
    },
    where: {
      id: reportId,
    },
  });
  // Report not found, handle the error accordingly (e.g., redirect to an error page)
  if (!reportFromDb) {
    return {
      notFound: true,
    };
  }
  // Convert all Dates to IsoStrings
  const newestPostDate = reportFromDb?.posts.reduce(
    (prevDate, post) => {
      const postDate = new Date(post.date);
      return postDate > prevDate ? postDate : prevDate;
    },
    new Date(reportFromDb.createdAt)
  );
  const isoReportFromDb = {
    ...reportFromDb,
    createdAt: reportFromDb?.createdAt.toISOString(),
    updatedAt: newestPostDate
      ? newestPostDate.toISOString()
      : reportFromDb?.updatedAt.toISOString(),

    likes: reportFromDb?.likes.map(
      ({ id, createdAt, updatedAt, user }) => ({
        id,
        userId: user.id,
        name: user.name,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      })
    ),

    posts: (reportFromDb?.posts || []).map((post) => {
      const postDate = post.date ? new Date(post.date) : null;

      const reportCreatedAt = reportFromDb?.createdAt
        ? new Date(reportFromDb.createdAt)
        : null;

      const timeDifference =
        postDate && reportCreatedAt
          ? postDate.getTime() - reportCreatedAt.getTime()
          : 0;
      const growDay = Math.floor(
        timeDifference / (1000 * 60 * 60 * 24) + 1
      );

      const isoLikes = post.likes.map(
        ({ id, createdAt, updatedAt, user }) => ({
          id,
          userId: user.id,
          name: user.name,
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
        })
      );

      const isoComments = post.comments.map((comment) => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
      }));

      return {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.createdAt.toISOString(),
        date: postDate?.toISOString() as string,
        likes: isoLikes,
        comments: isoComments,
        growDay,
      };
    }),
    strains: reportFromDb?.strains || [],
  };

  // Fetch translations using next-i18next
  const translations = await serverSideTranslations(
    context.locale as string,
    ["common"]
  );

  console.debug(
    `🏭 (getStaticProps)`,
    `prefetching Grow ${reportFromDb.id} from db`
  );

  return {
    props: {
      report: isoReportFromDb,
      ...translations,
    },
    revalidate: 10,
  };
}

/**
 * getStaticPaths
 * @param reports: { id: string; }[]
 * @returns { paths[] }
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const reports = await prisma.report.findMany({
    select: {
      id: true,
    },
  });

  const localizedPaths = reports.flatMap((staticReport) => [
    {
      params: {
        reportId: staticReport.id,
      },
      locale: "en",
    },
    {
      params: {
        reportId: staticReport.id,
      },
      locale: "de",
    },
  ]);

  return {
    paths: localizedPaths,
    fallback: "blocking",
  };
};

/**
 * @Page ReportDetails
 * @param props: { report: Report }
 * @returns React Functional Component
 */
export default function PublicReport(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const theme = useMantineTheme();
  const router = useRouter();
  // const { locale: activeLocale } = router;
  // const { t } = useTranslation(activeLocale);

  const { report: staticReportFromProps } = props;
  const pageTitle = `${staticReportFromProps.title}`;

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

  const dateOfnewestPost = staticReportFromProps.posts.reduce(
    (maxDate, post) => {
      const postDate = new Date(post.date);
      return postDate > maxDate ? postDate : maxDate;
    },
    new Date(0)
  );

  const [postId, setPostId] = useState<string>("");
  const [selectedDate, selectDate] = useState<Date | null>(null);

  const postDays = staticReportFromProps.posts.map((post) =>
    new Date(post.date).getTime()
  );
  const dateOfGermination = new Date(staticReportFromProps.createdAt);

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

    const matchingPost = staticReportFromProps.posts.find((post) => {
      const postDate = new Date(post.date);
      return selectedDate.toISOString() === postDate.toISOString();
    });

    if (matchingPost) {
      // scrollIntoView({
      //   alignment: "start",
      // });
      selectDate(new Date(matchingPost.date));
      setPostId(matchingPost.id);
      const newUrl = `/grow/${staticReportFromProps.id}/update/${matchingPost.id}`;
      void router.replace(newUrl, undefined, {
        shallow: true,
        scroll: false,
      });
    } else {
      notifications.show(noPostAtThisDay);
    }
  };

  return (
    <>
      <Head>
        <title>{`Grow "${pageTitle}" from ${
          staticReportFromProps.author?.name as string
        } | GrowAGram`}</title>
        <meta
          name="description"
          content="Create your grow report on growagram.com" //FIXME: SEO description
        />
      </Head>
      {/* // Main Content Container */}
      <Container
        size="xl"
        className="mb-8 flex w-full flex-col space-y-1"
      >
        {/* // Header with Title */}
        <Box className="flex items-center justify-between pt-2">
          {/* // Title */}
          {/* <Title order={1}>
            <Link
              // className="text-orange-600"
              href={`/grows`}
            >
              {t("common:reports-headline")}
            </Link>
          </Title>
          <Box px={"sm"}>
            <IconChevronRight size={24} />
          </Box> */}
          <Title order={1} className="inline">
            {`${pageTitle}`}
          </Title>
        </Box>
        {/* // Header End */}
        <Container
          size="xl"
          px={0}
          mx="auto"
          pt="xs"
          className="flex w-full flex-col space-y-4"
        >
          <ReportHeader
            report={staticReportFromProps}
            image={staticReportFromProps.image?.cloudUrl as string}
            avatar={staticReportFromProps.author.image as string}
            name={staticReportFromProps.author.name as string}
            job={staticReportFromProps.description}
          />
          {/* // Posts Date Picker */}
          {/* <Box ref={targetRef}> */}
          <Box>
            <PostsDatePicker
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
          <PostCard postId={postId} report={staticReportFromProps} />
        </Container>
      </Container>
    </>
  );
}
