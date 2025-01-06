import { appTitle } from "./_document";

import type { GetStaticPropsContext, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

//import MaintenancePage from "~/components/MaintenancePage";
import LandingPage from "~/components/WelcomePage";

import { prisma } from "~/server/db";

import type { IsoReportWithPostsCountFromDb } from "~/types";

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
export async function getStaticProps(context: GetStaticPropsContext) {
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
        // count posts instead of fetching them
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
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
                const reportCreatedAt = reportFromDb?.createdAt;

                // Convert both dates to local time
                const localPostDate = new Date(postDate);
                const localReportCreatedAt = new Date(reportCreatedAt);

                // Set the time of day to midnight for both dates
                localPostDate.setHours(0, 0, 0, 0);
                localReportCreatedAt.setHours(0, 0, 0, 0);

                // Calculate the difference in milliseconds between the two dates
                const differenceInMs =
                  localPostDate.getTime() -
                  localReportCreatedAt.getTime();

                // Convert the difference from milliseconds to days
                const growDay = Math.floor(
                  differenceInMs / (1000 * 60 * 60 * 24)
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
                  createdAt: new Date(comment.createdAt).toISOString(),
                  updatedAt: new Date(comment.updatedAt).toISOString(),
                }));

                return {
                  ...post,
                  createdAt: post.createdAt.toISOString(),
                  updatedAt: post.createdAt.toISOString(),
                  date: postDate,
                  likes: isoLikes,
                  images: isoImages,
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

        // Destructure to omit 'posts'
        const { posts: _posts, ...rest } = reportFromDb;
        return {
          ...rest,
          likes: isoLikes,
          postCount: reportFromDb._count?.posts,
          updatedAt: newestPostDate
            ? newestPostDate.toISOString()
            : reportFromDb.updatedAt.toISOString(),
          createdAt: reportFromDb.createdAt.toISOString(),
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
  topLikeReports: IsoReportWithPostsCountFromDb[]; // Replace YourTypeHere with the actual type of topLikeReports
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
        <title>{`Maintenance | ${appTitle}`}</title>
        <meta
          name="description"
          content="GrowAGram is currently undergoing maintenance. We'll be back soon!"
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
