import {
  Box,
  Button,
  Container,
  createStyles,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconChevronLeft, IconEdit } from "@tabler/icons-react";
import dayjs from "dayjs";
import { convert } from "html-to-text";
import { noPostAtThisDay } from "~/messages";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { generateOpenGraphMetaTagsImage } from "~/components/OpenGraph/Image";
import { PostCard } from "~/components/Post/Card";
import PostsDatePicker from "~/components/Post/Datepicker";

import { prisma } from "~/server/db";

/** getStaticProps
 *  @param context : GetStaticPropsContext<{ reportId: string }>
 *  @returns : Promise<{props{ report: Report }}>
 */
export async function getStaticProps(
  context: GetStaticPropsContext<{
    reportId: string;
    postId: string;
  }>
) {
  const reportId = context.params?.reportId as string;
  const postId = context.params?.postId as string;

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
    `prefetching Update ${postId} from db`
  );

  return {
    props: {
      report: isoReportFromDb,
      postId: postId,
      ...translations,
    },
    revalidate: 1,
  };
}

/** getStaticPaths
 *  @param reports: { id: string; }[]
 *  @returns { paths[] }
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const reports = await prisma.report.findMany({
    select: {
      id: true,
      posts: { select: { id: true } },
    },
  });

  const paths = reports.flatMap((staticReport) => {
    const localizedPaths = [
      {
        params: {
          reportId: staticReport.id,
        },
        locale: "en", // English version
      },
      {
        params: {
          reportId: staticReport.id,
        },
        locale: "de", // German version
      },
    ];

    return staticReport.posts.flatMap((post) =>
      localizedPaths.map((path) => ({
        ...path,
        params: {
          ...path.params,
          postId: post.id,
        },
      }))
    );
  });

  return {
    paths,
    fallback: "blocking",
  };
};

/** ReportDetails
 *  @returns React Functional Component
 * @param props
 */
export default function PublicReportPost(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { report: staticReportFromProps, postId: postIdfromProps } =
    props;

  const { data: session, status } = useSession();

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const useStyles = createStyles((theme) => ({
    titleLink: {
      display: "inline-flex",
      color: dark
        ? theme.colors.growgreen?.[4]
        : theme.colors.growgreen?.[4],
    },
  }));
  const { classes } = useStyles();

  const theme = useMantineTheme();
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

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

  const dateOfGermination = new Date(staticReportFromProps.createdAt);

  const thisPost = staticReportFromProps.posts.find(
    (post) => post.id === postIdfromProps
  );

  const postDate = new Date(thisPost ? thisPost.date : "");
  const [selectedDate, selectDate] = useState<Date | null>(postDate);

  // If the post is not found, redirect to the 404 page
  if (!thisPost) {
    // Redirect to the 404 page
    // void router.push("/404");
    // Return null to prevent rendering anything else
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const post = staticReportFromProps.posts.find(
      (post) => post.id === postIdfromProps
    );
    const postDate = new Date(post?.date as string);
    selectDate(postDate);
  }, [postIdfromProps, staticReportFromProps.posts]);

  const defaultRelDate =
    dayjs(selectedDate)
      .subtract(getResponsiveColumnCount - 1, "month")
      .toDate() || dateOfGermination;

  const columnStartMonth: Date =
    defaultRelDate < dateOfGermination
      ? dateOfGermination
      : defaultRelDate;

  const postDays = staticReportFromProps.posts.map((post) =>
    new Date(post.date).getTime()
  );

  const dateOfnewestPost = staticReportFromProps.posts.reduce(
    (maxDate, post) => {
      const postDate = new Date(post.date);
      return postDate > maxDate ? postDate : maxDate;
    },
    new Date(0)
  );

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
      // setPostId(matchingPost.id);
      const newUrl = `/grow/${staticReportFromProps.id}/update/${matchingPost.id}`;
      void router.push(newUrl, undefined, { scroll: false });
      // window.history.replaceState({}, "", newUrl);
    } else {
      notifications.show(noPostAtThisDay);
    }
  };
  const images = thisPost?.images.map((image) => image.cloudUrl);
  const imageTags = generateOpenGraphMetaTagsImage(images);
  const slicedContent = convert(thisPost?.content, { wordwrap: 25 });
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
        <meta
          property="og:url"
          content={`/grow/${staticReportFromProps.id}/update/${thisPost.id}`}
        />
        <meta property="og:title" content={thisPost.title} />
        <meta property="og:description" content={slicedContent} />
        {imageTags &&
          imageTags.map((tag, index) => <meta key={index} {...tag} />)}
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
          </Title> */}
          <Title order={1}>
            <Link
              className={classes.titleLink}
              href={`/grow/${staticReportFromProps.id}`}
            >
              <Box pr={"sm"}>
                <IconChevronLeft size={32} />
              </Box>
              {`${pageTitle}`}
            </Link>
          </Title>

          {status === "authenticated" &&
            staticReportFromProps.authorId === session.user.id && (
              <Link
                href={`/account/edit/grow/${staticReportFromProps.id}/update/${postIdfromProps}`}
              >
                <Button
                  h={30}
                  w={200}
                  compact
                  variant="filled"
                  className="cursor-pointer"
                  leftIcon={
                    <IconEdit
                      className="ml-2"
                      height={22}
                      stroke={1.4}
                    />
                  }
                >
                  {t("common:post-edit-button")}
                </Button>
              </Link>
            )}

          {/* <Box px={"sm"}>
            <IconChevronRight size={24} />
          </Box>
          <Title order={1}>
            {`${thisPost?.title as string}`} | DATE
          </Title> */}
        </Box>
        {/* // Header End */}
        <Container
          size="xl"
          px={0}
          mx="auto"
          pt="xs"
          className="flex w-full flex-col space-y-4"
        >
          {/* Update view without Header brings better UI! */}
          {/* <ReportHeader
            report={staticReportFromProps}
            image={staticReportFromProps.image?.cloudUrl as string}
            avatar={staticReportFromProps.author.image 
                                  ? staticReportFromProps.author.image
                    : `https://ui-avatars.com/api/?name=${
                        staticReportFromProps.author.name as string
                      }`
            }
            name={staticReportFromProps.author.name as string}
            description={staticReportFromProps.description}
          />  */}
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
          <PostCard
            postId={thisPost?.id}
            report={staticReportFromProps}
          />
        </Container>
      </Container>
    </>
  );
}
