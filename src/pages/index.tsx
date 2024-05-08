import { appTitle } from "./_document";

import type { GetStaticPropsContext, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import LandingPage from "~/components/StaticPages/LandingPage";

import { prisma } from "~/server/db";

import type { IsoReportWithPostsFromDb } from "~/types";

/** PUBLIC DYNAMIC PAGE with translations
 * getServerSideProps (Server-Side Rendering)
 *
 * @returns Promise<GetServerSidePropsResult<Props>> - A promise resolving to an object containing props to be passed to the page component
 * @param context
 */
// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => ({
//   props: {
//     ...(await serverSideTranslations(context.locale as string, [
//       "common",
//     ])),
//   },
// });

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
  // Prefetching the report from prisma
  const topLikeReports = await prisma.report
    .findMany({
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
      orderBy: {
        // Join with likes table and aggregate the count of likes
        likes: {
          _count: "desc",
        },
      },
      take: 4,
    })
    .then((reportsFromDb) => {
      const isoReportsFromDb = reportsFromDb.map((reportFromDb) => {
        const isoPosts =
          (reportFromDb.posts || []).length > 0
            ? reportFromDb.posts.map((post) => {
                const postDate = new Date(post.date).toISOString();
                const reportCreatedAt =
                  reportFromDb.createdAt.toISOString();
                const timeDifference =
                  new Date(postDate).getTime() -
                  new Date(reportCreatedAt).getTime();
                const growDay = Math.floor(
                  timeDifference / (1000 * 60 * 60 * 24)
                );

                const isoLikes = post.likes.map(
                  ({ id, createdAt, updatedAt, user }) => ({
                    id,
                    userId: user.id,
                    name: user.name,
                    createdAt: new Date(createdAt).toISOString(),
                    updatedAt: new Date(updatedAt).toISOString(),
                  })
                );

                const isoComments = post.comments.map((comment) => ({
                  ...comment,
                  createdAt: new Date(comment.createdAt).toISOString(),
                  updatedAt: new Date(comment.updatedAt).toISOString(),
                }));

                return {
                  ...post,
                  createdAt: post.createdAt.toISOString(),
                  updatedAt: post.createdAt.toISOString(),
                  date: postDate,
                  likes: isoLikes,
                  comments: isoComments,
                  growDay,
                };
              })
            : [];

        const isoLikes = reportFromDb.likes.map(
          ({ id, createdAt, updatedAt, user }) => ({
            id,
            userId: user.id,
            name: user.name,
            createdAt: new Date(createdAt).toISOString(),
            updatedAt: new Date(updatedAt).toISOString(),
          })
        );

        const newestPostDate =
          isoPosts.length > 0
            ? new Date(
                Math.max(
                  ...isoPosts.map((post) =>
                    new Date(post.date).getTime()
                  )
                )
              )
            : null;

        return {
          ...reportFromDb,
          updatedAt: newestPostDate
            ? newestPostDate.toISOString()
            : reportFromDb.updatedAt.toISOString(),
          createdAt: reportFromDb.createdAt.toISOString(),
          likes: isoLikes,
          posts: isoPosts,
        };
      });

      return isoReportsFromDb;
    });

  // Report not found, handle the error accordingly (e.g., redirect to an error page)
  if (!topLikeReports) {
    return {
      notFound: true,
    };
  }

  // Sort the reports based on the likes count in descending order
  // const sortedReports = allReports.sort((a, b) => {
  //   const likesCountA = a.likes.length;
  //   const likesCountB = b.likes.length;
  //   return likesCountB - likesCountA;
  // });

  // Fetch translations using next-i18next
  const translations = await serverSideTranslations(
    context.locale as string,
    ["common"]
  );

  console.debug(
    `🏭 (getStaticProps)`,
    `prefetching ${topLikeReports.length} topLikeReports from db`
  );

  return {
    props: {
      topLikeReports,
      ...translations,
    },
    revalidate: 1,
  };
}

interface Props {
  topLikeReports: IsoReportWithPostsFromDb[]; // Replace YourTypeHere with the actual type of topLikeReports
  // Add other props if needed
}

/**
 * @Page PublicIndex
 * @returns NextPage
 */
const PublicIndex: NextPage<Props> = ({ topLikeReports }) => {
  return (
    <>
      <Head>
        <title>{`Welcome | ${appTitle}`}</title>
        <meta
          name="description"
          content="GrowAGram is a cannabis home cultivation community for sharing and discovering tips, techniques, and insights for successful cannabis cultivation. Welcome! Join our image community, share your weed images and upload your own reports to share your successes and learn from others. We are in alpha version - your feedback is very appreciated!"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:image"
          content="https://growagram.com/grow-a-gram-high-resolution-logo.webp"
        />
        <meta property="og:title" content={appTitle} />
      </Head>

      <LandingPage topLikeReports={topLikeReports} />
    </>
  );
};
export default PublicIndex;
