import { Box, Container, useMantineTheme } from "@mantine/core";
import { useMediaQuery, useScrollIntoView } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { convert } from "html-to-text";
import { noPostAtThisDay } from "~/messages";

import { useEffect, useState } from "react";

import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import { generateOpenGraphMetaTagsImage } from "~/components/OpenGraph/Image";
import { PostCard } from "~/components/Post/PostCard";
import PostDatepicker from "~/components/Post/PostDatepicker";
import { GrowBasicData } from "~/components/Report/GrowBasicData";
import { ReportHeader } from "~/components/Report/Header";

import { prisma } from "~/server/db";

import { compareDatesWithoutTime } from "~/utils/helperUtils";

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
  const growId = context.params?.reportId as string;
  const updateId = context.params?.postId as string;

  // Prefetching the report from prisma
  const grow = await prisma.report.findUnique({
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
      plants: {
        select: {
          id: true,
          plantName: true,
          seedfinderStrain: {
            select: {
              id: true,
              name: true,
              picture_url: true,
              strainId: true,
              breeder_name: true,
              breeder_logo_url: true,
              breederId: true,
              type: true,
              cbd: true,
              description: true,
              flowering_days: true,
              flowering_info: true,
              flowering_automatic: true,
              seedfinder_ext_url: true,
              breeder_description: true,
              breeder_website_url: true,
            },
          },
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
              postOrder: true,
            },
            orderBy: {
              postOrder: "asc", // Sort images by postOrder in ascending order
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
          LightWatts: { select: { watt: true } }, // Select only the 'watt' field from LightWatts
        },
      },
    },
    where: {
      id: growId,
    },
  });

  // Report not found, handle the error accordingly (e.g., redirect to an error page)
  if (!grow) {
    return {
      notFound: true,
    };
  }
  // Convert all Dates to IsoStrings
  const newestPostDate = grow?.posts.reduce((prevDate, post) => {
    const postDate = new Date(post.date);
    return postDate > prevDate ? postDate : prevDate;
  }, new Date(grow.createdAt));

  const isoReportFromDb = {
    ...grow,
    createdAt: grow?.createdAt.toISOString(),
    updatedAt: newestPostDate
      ? newestPostDate.toISOString()
      : grow?.updatedAt.toISOString(),

    likes: grow?.likes.map(({ id, createdAt, updatedAt, user }) => ({
      id,
      userId: user.id,
      name: user.name,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    })),

    posts: (grow?.posts || []).map((post) => {
      const postDate = new Date(post.date);
      const reportCreatedAt = grow?.createdAt;

      // Convert both dates to local time
      const localPostDate = new Date(postDate);
      const localReportCreatedAt = new Date(reportCreatedAt);

      // Set the time of day to midnight for both dates
      localPostDate.setHours(0, 0, 0, 0);
      localReportCreatedAt.setHours(0, 0, 0, 0);

      // Calculate the difference in milliseconds between the two dates
      const differenceInMs =
        localPostDate.getTime() - localReportCreatedAt.getTime();

      // Convert the difference from milliseconds to days
      const growDay = Math.floor(
        differenceInMs / (1000 * 60 * 60 * 24)
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

      const isoImages = post.images.map(
        ({ id, cloudUrl, publicId, postOrder }) => ({
          id,
          publicId,
          cloudUrl,
          postOrder: postOrder == null ? 0 : postOrder,
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
        date: postDate?.toISOString(),
        likes: isoLikes,
        images: isoImages,
        comments: isoComments,
        growDay,
      };
    }),
    strains: grow?.strains || [],
  };

  // Fetch translations using next-i18next
  const translations = await serverSideTranslations(
    context.locale as string,
    ["common"]
  );

  console.debug(
    `🏭 (getStaticProps)`,
    `prefetching Update ${updateId} from db`
  );

  return {
    props: {
      ...translations,
      report: isoReportFromDb,
      postId: updateId,
    },
    revalidate: 1,
  };
}

/** getStaticPaths
 *  @param reports: { id: string; }[]
 *  @returns { paths[] }
 */
export const getStaticPaths: GetStaticPaths = () => {
  //FIXME: NOT PRERENDERING POSTS
  return {
    paths: [],
    fallback: "blocking",
  };
};

/** ReportDetails
 * @returns React Functional Component
 * @param props
 */
function PublicReportPost(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const router = useRouter();

  const { report: grow, postId: updateId } = props;
  const thisPost = grow.posts.find((post) => post.id === updateId);

  const postDate = new Date(thisPost ? thisPost.date : "");
  const [selectedDate, selectDate] = useState<Date | null>(postDate);

  const theme = useMantineTheme();

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

  const { scrollIntoView, targetRef } =
    useScrollIntoView<HTMLDivElement>({
      offset: 0,
    });

  useEffect(() => {
    scrollIntoView({
      alignment: "start",
    });
  }, [scrollIntoView]);

  useEffect(() => {
    const post = grow.posts.find((post) => post.id === updateId);
    const postDate = new Date(post?.date as string);
    selectDate(postDate);
  }, [updateId, grow.posts]);

  // If the post is not found, redirect to the 404 page
  if (thisPost === undefined) {
    return (
      <>Error 404: Update with Id: {updateId} could not be found!</>
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
      //   alignment: "start",
      // });
      selectDate(new Date(matchingPost.date));
      // setPostId(matchingPost.id);
      const newUrl = `/grow/${grow.id}/update/${matchingPost.id}`;
      void router.push({ pathname: newUrl }, undefined, {
        scroll: false,
      });
    } else {
      notifications.show(noPostAtThisDay);
    }
  };
  //const images = thisPost?.images.map((image) => image.cloudUrl);

  const sortedImages = [...(thisPost?.images || [])].sort((a, b) => {
    const orderA = a.postOrder ?? 0;
    const orderB = b.postOrder ?? 0;
    return orderA - orderB;
  });

  const images = sortedImages?.map((image) => image.cloudUrl);

  const imageTags = generateOpenGraphMetaTagsImage(images);

  const slicedContent = convert(thisPost?.content, { wordwrap: 25 });

  return (
    <>
      <Head>
        <title>{`Grow "${pageTitle}" from ${
          grow.author?.name as string
        } | GrowAGram`}</title>
        <meta
          name="description"
          content="Create your grow report on growagram.com" //FIXME: SEO description
        />
        <meta
          property="og:url"
          content={`/grow/${grow.id}/update/${thisPost.id}`}
        />
        <meta property="og:title" content={thisPost.title} />
        <meta property="og:description" content={slicedContent} />
        {imageTags &&
          imageTags.map((tag, index) => <meta key={index} {...tag} />)}
      </Head>

      {/* // Main Content Container */}
      <Container size="xl" className="flex flex-col space-y-2">
        {/* // Header with Title */}
        {/* <Box pt={theme.spacing.sm} className={classes.title}>
          <Link title="back to Grow" href={`/grow/${grow.id}`}>
            <Box className={classes.titleLink}>
              <IconChevronLeft size={28} />
              {grow.title}
            </Box>
          </Link>            
        </Box> */}

        {/* // Header End */}

        <Container
          size="xl"
          px={0}
          mx="auto"
          pt="xs"
          className="flex w-full flex-col space-y-4"
        >
          {/* Grow Header */}
          <ReportHeader grow={grow} />

          {/* // Posts Date Picker */}
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
          <Box ref={targetRef}>
            <PostCard updateId={thisPost.id} grow={grow} />
          </Box>
        </Container>
      </Container>

      {/* // GrowBasicData / Strains / Statistics */}
      <GrowBasicData grow={grow} dateOfnewestPost={dateOfnewestPost} />
    </>
  );
}

export default PublicReportPost;
