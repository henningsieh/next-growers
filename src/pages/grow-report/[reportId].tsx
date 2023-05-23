import { Box, Container, Title } from "@mantine/core";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";

import { Environment } from "~/types";
import Head from "next/head";
import { ImagePreview } from "~/components/Atom/ImagePreview";
import { IsoReportWithPostsFromDb } from "~/types";
import { PostsCarousel } from "~/components/Posts/Carousel";
import ReportDetailsHead from "~/components/Report/DetailsHead";
import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { convertDatesToISO } from "~/helpers/Intl.DateTimeFormat";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "~/server/db";
import superjson from "superjson";

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
      author: { select: { id: true, name: true, image: true } },
      image: { select: { id: true, publicId: true, cloudUrl: true } },
      strains: {
        select: {
          id: true,
          name: true,
          description: true,
          effects: true,
          flavors: true,
        },
      },
      posts: {
        include: {
          author: { select: { id: true, name: true, image: true } },
          images: { select: { id: true, publicId: true, cloudUrl: true } },
          likes: true,
          comments: true,
        },
      },
      likes: true,
    },
    where: {
      id: reportId,
    },
  });

  if (!reportFromDb) {
    // Report not found, handle the error accordingly (e.g., redirect to an error page)
    return {
      notFound: true,
    };
  }

  // Convert all Dates to IsoStrings
  /*   const isoReportFromDb = {
    ...reportFromDb,
    createdAt: reportFromDb.createdAt.toISOString(),
    updatedAt: reportFromDb.updatedAt.toISOString(),
    likes: reportFromDb.likes.map((like) => ({
      ...like,
      createdAt: like.createdAt.toISOString(),
      updatedAt: like.updatedAt.toISOString(),
    })),
    posts: reportFromDb.posts.map((post) => ({
      ...post,
      date: post.date.toISOString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      likes: post.likes.map((like) => ({
        ...like,
        createdAt: like.createdAt.toISOString(),
        updatedAt: like.updatedAt.toISOString(),
      })),
      comments: post.comments.map((comment) => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
      })),
    })),
  }; */

  const isoReportFromDb = convertDatesToISO(
    reportFromDb
  ) as IsoReportWithPostsFromDb;

  console.debug(
    "getStaticProps 🤖",
    "...prefetching the report's dataset from db"
  );

  // console.dir(isoReportFromDb, { depth: null });

  return {
    props: {
      report: isoReportFromDb,
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
  return {
    paths: reports.map((staticReport) => ({
      params: {
        reportId: staticReport.id,
      },
    })),
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
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
  const { report: staticReportFromProps } = props;
  const pageTitle = `${staticReportFromProps.title as string}`;

  return (
    <>
      <Head>
        <title>{`Grow "${pageTitle}" from ${
          staticReportFromProps.author?.name as string
        } | GrowAGram`}</title>
        <meta
          name="description"
          content="Create your grow report on growagram.com"
        />
      </Head>
      {/* // Main Content Container */}
      <Container size="xl" className="flex w-full flex-col space-y-1">
        {/* // Header with Title */}
        <div className="flex items-center justify-between pt-2">
          {/* // Title */}
          <Title order={1} className="inline">
            {`Grow "${pageTitle}" from ${
              staticReportFromProps.author?.name as string
            }`}
          </Title>
        </div>
        {/* // Header End */}
        <Container
          size="md"
          px={0}
          className="flex w-full flex-col space-y-1"
          mx="auto"
        >
          <ImagePreview
            authorName={staticReportFromProps.author?.name as string}
            publicLink={`/grow-report/${staticReportFromProps.id as string}`}
            imageUrl={staticReportFromProps.image?.cloudUrl as string}
            title={""}
            // title={staticReportFromProps.title as string}
            description={staticReportFromProps.description as string}
            authorImageUrl={staticReportFromProps.author?.image as string}
            views={0}
            comments={0}
          />
          {/* // Header with Title */}
          <div className="flex items-center justify-between pt-2">
            {/* // Title */}
            <Title order={2} className="inline">
              {
                Environment[
                  staticReportFromProps.environment as keyof typeof Environment
                ]
              }
            </Title>
          </div>
          {/* // Header End */}
          <PostsCarousel />
        </Container>
        {<ReportDetailsHead report={staticReportFromProps} />}
      </Container>
    </>
  );
}
