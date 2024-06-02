import { appTitle } from "../../_document";
import {
  Box,
  Button,
  Container,
  createStyles,
  Flex,
  getStylesRef,
  Grid,
  Title,
} from "@mantine/core";
import {
  Card,
  Group,
  Menu,
  rem,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconDots,
  IconEye,
  IconFileZip,
  IconTrash,
  IconUserPlus,
} from "@tabler/icons-react";

import { useState } from "react";

import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";

import AccessDenied from "~/components/Atom/AccessDenied";
import UserAvatar from "~/components/Atom/UserAvatar";
import ReportCard from "~/components/Report/Card";

import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

import type {
  IsoReportWithPostsFromDb,
  UserProfileData,
} from "~/types";

/** PUBLIC DYNAMIC PAGE with translations
 * getServerSideProps (Server-Side Rendering)
 *
 * @param GetServerSidePropsContext<{ locale: string; translations: string | string[] | undefined; }> context - The context object containing information about the request
 * @returns Promise<{ props: { [key: string]: any }; }> - A promise resolving to an object containing props to be passed to the page component
 */
export const getServerSideProps: GetServerSideProps = (async (
  context
) => {
  // fetch user data from the database
  const user = (await prisma.user.findUnique({
    where: {
      id: context.params?.userId as string,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      _count: {
        select: {
          posts: {},
        },
      },
    },
  })) as UserProfileData | null;

  const ownReports = (await prisma.report
    .findMany({
      where: {
        authorId: context.params?.userId as string,
        // OR: [
        //   {
        //     title: {
        //       contains: searchstring,
        //       mode: "insensitive",
        //     },
        //   },
        //   {
        //     description: {
        //       contains: searchstring,
        //       mode: "insensitive",
        //     },
        //   },
        //   {
        //     author: {
        //       name: {
        //         contains: searchstring,
        //         mode: "insensitive",
        //       },
        //     },
        //   },
        // ],
        /*
    strains: {
      //FIXME: workaround for hiding "unready" (without strains) reports
      some: {
        name: {
          contains: strain,
          mode: "insensitive",
        },
      },
    },
    */

        // strains: strain
        //   ? {
        //       some: {
        //         name: {
        //           contains: strain,
        //           mode: "insensitive",
        //         },
        //       },
        //     }
        //   : {},
      },
      orderBy: {
        updatedAt: "desc",
      },
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
      },
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

        return {
          ...reportFromDb,
          posts: isoPosts,
          likes: isoLikes,
          createdAt: reportFromDb.createdAt.toISOString(),
          updatedAt: newestPostDate
            ? newestPostDate.toISOString()
            : reportFromDb.updatedAt.toISOString(),
        };
      });

      return isoReportsFromDb;
    })) as IsoReportWithPostsFromDb[];

  //count the number of images uploaded by the user
  const imageCount = await prisma.image.count({
    where: {
      ownerId: user?.id,
    },
  });

  //count the number of images uploaded by the user
  // const postImages = await prisma.image.findMany({
  //   where: {
  //     ownerId: user?.id,
  //   },
  //   select: {
  //     id: true,
  //     cloudUrl: true,
  //     post: true,
  //   },
  // });

  // if (!user) {
  //   // Redirect with next router
  //   router.push("/404");

  //   return {
  //     notFound: true,
  //   };
  // }

  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const translations = await serverSideTranslations(
    context.locale as string,
    ["common"]
  );

  return {
    props: {
      user,
      imageCount,
      ownReports,
      session,
      ...translations,
    },
  };
}) satisfies GetServerSideProps;

const PublicProfile: NextPage<{
  user: UserProfileData | null;
  imageCount: number;
  ownReports: IsoReportWithPostsFromDb[];
}> = (props) => {
  const { user, imageCount, ownReports: ownIsoReports } = props;
  const { data: session, status } = useSession();
  const [_searchString, setSearchString] = useState("");

  console.debug("user", user);

  const pageTitle = `Grower's Profile`;

  const useStyles = createStyles((theme) => ({
    card: {
      transition: "transform 250ms ease, box-shadow 250ms ease",
      zIndex: 10,
      position: "relative",
      height: rem(240),

      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],

      [`&:hover .${getStylesRef("image")}`]: {
        transform: "scale(1.02)",
      },
    },

    image: {
      zIndex: -10,
      objectFit: "cover",
      ref: getStylesRef("image"),
      transition: "transform 500ms ease",
    },

    dropdown: {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.lighten(theme.colors.dark[6], 0.0)
          : theme.fn.lighten(theme.colors.growgreen[5], 0.7),
    },
    item: {
      fontWeight: 700,
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
      padding: rem(8),
      marginBottom: rem(2),
    },
  }));
  const { classes, theme } = useStyles();

  const xs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const md = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const responsiveColumnCount = xs ? 1 : sm ? 1 : md ? 2 : 3;

  const imageUrl =
    "https://images.unsplash.com/photo-1591754060004-f91c95f5cf05";

  const images = [
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    "https://images.unsplash.com/photo-1444723121867-7a241cacace9",
    "https://images.unsplash.com/photo-1444084316824-dc26d6657664",
  ];

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session && user) {
    return (
      <>
        <Head>
          <title>{`${pageTitle}  of  ${user.name} | ${appTitle}`}</title>
          <meta
            name="description"
            content={`${pageTitle} | ${appTitle}`}
          />
        </Head>

        {/* // Main Content Container */}
        <Container size="xl" className="flex w-full flex-col space-y-4">
          {/* // Header with Title */}
          <Box className="flex items-center justify-between pt-2">
            {/* // Title */}
            <Title order={1} className="inline">
              {pageTitle}
            </Title>
          </Box>
          {/* // Header End */}

          <Container>
            {/* // Card with User Profile */}
            <Card withBorder shadow="sm" radius="sm">
              <Card.Section p="xs" py="xs">
                <Group position="apart">
                  <Text size="xl" fw="bold">
                    {user.name}
                  </Text>

                  <Button
                    color="growgreen"
                    variant="outline"
                    leftIcon={<IconUserPlus size={22} stroke={1.8} />}
                  >
                    Follow
                  </Button>
                </Group>
              </Card.Section>

              <Card.Section className={classes.card}>
                <Flex justify="space-between" style={{ zIndex: 20 }}>
                  <Box p="xs">
                    <UserAvatar
                      userName={user.name}
                      imageUrl={user.image}
                      avatarRadius={120}
                    />
                  </Box>
                  <Box p="xs">
                    <Menu
                      classNames={classes}
                      withinPortal
                      position="bottom-end"
                      shadow="sm"
                    >
                      <Menu.Target>
                        <Button
                          compact
                          variant="filled"
                          color="groworange"
                        >
                          <IconDots size="1rem" />
                        </Button>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item
                          icon={<IconFileZip size={rem(14)} />}
                        >
                          Download zip
                        </Menu.Item>
                        <Menu.Item icon={<IconEye size={rem(14)} />}>
                          Preview all
                        </Menu.Item>
                        <Menu.Item
                          icon={<IconTrash size={rem(14)} />}
                          color="red"
                        >
                          Delete all
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Box>
                </Flex>
                <Image
                  src={imageUrl}
                  className={classes.image}
                  alt={`Header Image from Grow \"${user.name}\"`}
                  fill
                  priority
                  quality={80}
                  sizes="(max-width: 3800px) 100vw, 2000px"
                />
              </Card.Section>

              <Text mt="sm" color="dimmed" size="md">
                ... has uploaded
                <Text
                  fz="md"
                  fw="bold"
                  component="span"
                  inherit
                  color={theme.colors.groworange[4]}
                >
                  &nbsp;{imageCount} images
                </Text>
                &nbsp;within
                <Text
                  fz="md"
                  fw="bold"
                  component="span"
                  inherit
                  color={theme.colors.groworange[4]}
                >
                  &nbsp;{user._count.posts} Updates
                </Text>
              </Text>

              <Card.Section inheritPadding mt="sm" pb="md">
                <SimpleGrid cols={responsiveColumnCount}>
                  {images.map((image) => (
                    <div key={image}>
                      <Image
                        alt=""
                        src={image}
                        width={330}
                        height={330}
                        sizes="330px"
                      />
                    </div>
                  ))}
                </SimpleGrid>
              </Card.Section>

              <Text mt="sm" color="dimmed" size="md">
                ... and owns
                <Text
                  fz="md"
                  fw="bold"
                  component="span"
                  inherit
                  color={theme.colors.groworange[4]}
                >
                  &nbsp;3 Grows
                </Text>
                :
              </Text>

              <Card.Section inheritPadding mt="sm" pb="md">
                <Grid gutter="sm">
                  {ownIsoReports.map((ownIsoReport) => {
                    return (
                      <Grid.Col
                        key={ownIsoReport.id}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={3}
                      >
                        <ReportCard
                          report={ownIsoReport}
                          setSearchString={setSearchString}
                        />
                      </Grid.Col>
                    );
                  })}
                </Grid>
              </Card.Section>
            </Card>
          </Container>
        </Container>
      </>
    );
  }
  return <AccessDenied />;
};
export default PublicProfile;
