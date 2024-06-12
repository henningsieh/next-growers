import { appTitle } from "../../_document";
import {
  Alert,
  Box,
  Button,
  Container,
  createStyles,
  Flex,
  getStylesRef,
  Grid,
  Paper,
  Tabs,
  Title,
  useMantineColorScheme,
  useMantineTheme,
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
  IconArrowDownRight,
  IconArrowNarrowRight,
  IconArrowUpRight,
  IconDots,
  IconEye,
  IconFilePlus,
  IconGitBranch,
  IconHeart,
  IconMessage,
  IconPhotoUp,
  IconUserCircle,
  IconUserEdit,
} from "@tabler/icons-react";

import { useEffect, useState } from "react";

import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import AnimatedValue from "~/components/Atom/AnimatedValue";
import FollowButton from "~/components/Atom/FollowButton";
import UserAvatar from "~/components/Atom/UserAvatar";
import ReportCard from "~/components/Report/Card";

import { prisma } from "~/server/db";

import type { UserProfileWithoutFollow } from "~/types";
import {
  type IsoReportWithPostsFromDb,
  Locale,
  type UserProfile,
} from "~/types";

import { calculateStatsDiffInPercent } from "~/utils/helperUtils";
import {
  getUserSelectObject,
  getUserSelectObjectWithoutFollow,
} from "~/utils/repository/userSelectObject";

/** getStaticProps
 *  @param context : GetStaticPropsContext<{ userId: string }>
 *  @returns : Promise<{props{ user : UserProfile }}>
 */
export async function getStaticProps(
  context: GetStaticPropsContext<{ userId: string }>
) {
  // FETCH USER DATA FROM THE DATABASE
  const growerId = context.params?.userId as string;
  const growerProfileData = (await prisma.user.findUnique({
    where: {
      id: growerId,
    },
    select: getUserSelectObject(growerId),
  })) as UserProfile;

  // INITIALIZE FOLLOWERS AND FOLLOWINGS ARRAY
  const followers = await Promise.all(
    growerProfileData.followers.map(async (follower) => {
      // fetch each follower data as UserProfile from the database
      const followerData = await prisma.user.findUnique({
        where: {
          id: follower.followerId,
        },
        select: getUserSelectObject(follower.followerId),
      });

      return followerData as UserProfile;
    })
  );
  const followings = await Promise.all(
    growerProfileData.following.map(async (following) => {
      // fetch each following data as UserProfile from the database
      const followingData = await prisma.user.findUnique({
        where: {
          id: following.followingId,
        },
        select: getUserSelectObject(following.followingId),
      });

      return followingData as UserProfile;
    })
  );

  // INITIALIZE HISTORICAL USER DATA
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const historicalProfileData = (await prisma.user.findUnique({
    where: {
      id: growerId,
    },
    select: getUserSelectObjectWithoutFollow(growerId),
  })) as UserProfileWithoutFollow;

  // INITIALIZE GROWER REPORTS
  const growerReports = (await prisma.report
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
  const translations = await serverSideTranslations(
    context.locale as string,
    ["common"]
  );

  return {
    props: {
      growerProfileData,
      historicalProfileData,
      growerReports,
      followers,
      followings,
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
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  const paths = users.flatMap((user) => {
    return [
      {
        params: {
          userId: user.id,
        },
        locale: "en", // English version
      },
      {
        params: {
          userId: user.id,
        },
        locale: "de", // German version
      },
    ];
  });

  return {
    paths,
    fallback: "blocking",
  };
};

const PublicProfile: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({
  growerProfileData,
  historicalProfileData,
  growerReports,
  followers,
  followings,
}) => {
  const pageTitle = `Grower Profile`;

  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";

  const router = useRouter();
  const { locale: activeLocale } = router;
  const { data: session, status } = useSession();

  const [_searchString, setSearchString] = useState("");

  // const xs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
  const xs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const md = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  // const lg = useMediaQuery(`(max-width: ${theme.breakpoints.lg})`);
  const responsiveStatsColumnCount = xs ? 1 : md ? 2 : 4;

  const tab = useRouter().query.tab as string | undefined;

  const [activeTab, setActiveTab] = useState<string | undefined>(
    tab || "grows"
  );

  // Set the active tab based on the query string
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  // Set the active tab based on Tab mouse click
  useEffect(() => {
    if (activeTab) {
      setActiveTab(activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value);
      void router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, tab: value },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const useStyles = createStyles((theme) => ({
    header: {
      transition: "transform 250ms ease, box-shadow 250ms ease",
      zIndex: 10,
      position: "relative",
      height: rem(240),

      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[6],

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

    // STATS STYLES
    value: {
      fontSize: rem(32),
      fontWeight: "bold",
      lineHeight: 1,
    },

    diff: {
      lineHeight: 1,
      display: "flex",
      alignItems: "center",
    },

    icon: {
      color: dark ? "growgreen.4" : "growgreen.8",
    },

    title: {
      fontWeight: 700,
      textTransform: "uppercase",
    },

    // TAB STYLES
    tab: {
      marginTop: 4,
      paddingLeft: `${sm ? rem(6) : theme.spacing.md}`,
      paddingRight: `${sm ? rem(6) : theme.spacing.md}`,
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.white,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[0]
          : theme.colors.gray[9],
      "&[data-active]": dark
        ? {
            backgroundColor: theme.colors.dark[4],
          }
        : {
            backgroundColor: theme.colors.gray[1],
          },
      "&[data-active]::before": {
        height: rem(3),
        backgroundColor: theme.colors.growgreen[2],
      },
      "&:disabled": {
        opacity: 0.5,
        cursor: "default",
      },
    },
  }));
  const { classes } = useStyles();

  //FIXME: implement user profile header image
  const imageUrl =
    growerProfileData.growerProfile?.headerImg?.cloudUrl ||
    "/grow-a-gram-high-resolution-logo_800px.webp";

  const statsData = [
    {
      title: "Updates",
      icon: "posts",
      value: growerProfileData._count.posts,
      diff: calculateStatsDiffInPercent(
        growerProfileData._count.posts,
        historicalProfileData?._count.posts
      ),
    },
    {
      title: "Comments",
      icon: "comments",
      value: growerProfileData._count.comments,
      diff: calculateStatsDiffInPercent(
        growerProfileData._count.comments,
        historicalProfileData?._count.comments
      ),
    },
    {
      title: "Images",
      icon: "images",
      value: growerProfileData._count.cloudImages,
      diff: calculateStatsDiffInPercent(
        growerProfileData._count.cloudImages,
        historicalProfileData?._count.cloudImages
      ),
    },
    {
      title: "Likes",
      icon: "likes",
      value: growerProfileData._count.likes,
      diff: calculateStatsDiffInPercent(
        growerProfileData._count.likes,
        historicalProfileData?._count.likes
      ),
    },
  ] as const;

  const statIcons = {
    images: IconPhotoUp,
    comments: IconMessage,
    likes: IconHeart,
    posts: IconFilePlus,
  } as const;

  const growerStatistics = statsData.map((stat, index) => {
    const Icon = statIcons[stat.icon];
    const DiffIcon =
      stat.diff > 0
        ? IconArrowUpRight
        : stat.diff < 0
          ? IconArrowDownRight
          : IconArrowNarrowRight;

    return (
      <Paper withBorder p="sm" radius="sm" key={index}>
        <Flex justify="space-between">
          <Text size="ld" c="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size={24} stroke={1.8} />
        </Flex>

        <Group align="flex-end" spacing="xs" mt={"xl"}>
          <Text className={classes.value}>
            <AnimatedValue value={stat.value} duration={2000} />
          </Text>
          <Text
            className={classes.diff}
            c={
              stat.diff > 0 ? "teal" : stat.diff < 0 ? "red" : "yellow"
            }
            fz="md"
            fw={500}
          >
            <span>{stat.diff}%</span>
            <DiffIcon size={20} stroke={1.8} />
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          Compared to previous month
        </Text>
      </Paper>
    );
  }) as JSX.Element[];

  const grows = growerReports.map((ownIsoReport) => {
    return (
      <Grid.Col
        key={ownIsoReport.id}
        xs={12}
        sm={6}
        md={4}
        lg={4}
        xl={4}
      >
        <ReportCard
          report={ownIsoReport}
          setSearchString={setSearchString}
        />
      </Grid.Col>
    );
  }) as JSX.Element[];

  return !growerProfileData ? (
    <>Error 404: This Grower was not found</>
  ) : (
    <>
      <Head>
        <title>{`${pageTitle} of ${growerProfileData.name} | ${appTitle}`}</title>
        <meta
          name="description"
          content={`${pageTitle} | ${appTitle}`}
        />
        <meta property="og:image" content={imageUrl} />
        <meta
          property="og:title"
          content={`${pageTitle} of ${growerProfileData.name} | ${appTitle}`}
        />
        <meta
          property="og:description"
          content={`Self description ${activeLocale === Locale.DE ? `von` : `of`} ${growerProfileData.name} | ${appTitle}`}
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

        {/* // Main Content Container */}
        <Container
          size="lg"
          className="flex w-full flex-col px-0 space-y-2"
        >
          {/* // Card with User Profile */}
          <Card withBorder shadow="sm" radius="sm">
            <Card.Section p="xs" py="xs">
              <Group position="apart">
                <Text size="xl" fw="bold">
                  {growerProfileData.name}
                </Text>

                <FollowButton growerId={growerProfileData.id} />
              </Group>
            </Card.Section>

            <Card.Section className={classes.header}>
              <Flex justify="space-between" style={{ zIndex: 20 }}>
                {/* User Avatar */}
                <Box p="xs">
                  <UserAvatar
                    userId={growerProfileData.id}
                    userName={growerProfileData.name as string}
                    imageUrl={growerProfileData.image}
                    avatarRadius={120}
                  />
                </Box>
                {/* User Profile Menu */}
                {status === "authenticated" &&
                  session?.user.id === growerProfileData.id && (
                    <Box p="xs">
                      <Menu
                        classNames={classes}
                        withinPortal
                        position="bottom-end"
                        shadow="sm"
                      >
                        <Menu.Target>
                          <Button
                            p={0}
                            h={28}
                            w={28}
                            variant="filled"
                            color="groworange"
                          >
                            <IconDots size={20} />
                          </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Link href={`/profile/edit`}>
                            <Menu.Item
                              icon={<IconUserEdit size={rem(14)} />}
                            >
                              Edit Profile
                            </Menu.Item>
                          </Link>

                          <Link
                            href={`/profile/${growerProfileData.id}`}
                          >
                            <Menu.Item
                              icon={<IconEye size={rem(14)} />}
                              // onClick={(e) => {
                              //   e.preventDefault();
                              //   void router.reload();
                              // }}
                            >
                              Reload Profile
                            </Menu.Item>
                          </Link>
                        </Menu.Dropdown>
                      </Menu>
                    </Box>
                  )}
              </Flex>
              <Image
                src={imageUrl}
                className={classes.image}
                alt={`Header Image from Grow \"${growerProfileData.name}\"`}
                fill
                priority
                quality={80}
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </Card.Section>

            <Card.Section inheritPadding mt="sm" pb="md">
              <SimpleGrid cols={responsiveStatsColumnCount}>
                {growerStatistics}
              </SimpleGrid>
            </Card.Section>

            <Tabs
              variant="outline"
              allowTabDeactivation
              keepMounted={false}
              c="growgreen.4"
              color="growgreen.4"
              value={activeTab}
              onTabChange={handleTabChange}
            >
              <Tabs.List>
                <Tabs.Tab
                  disabled
                  className={classes.tab}
                  value="profile"
                >
                  Profile
                </Tabs.Tab>
                <Tabs.Tab className={classes.tab} value="grows">
                  Grows
                </Tabs.Tab>
                <Tabs.Tab
                  disabled
                  className={classes.tab}
                  value="updates"
                >
                  Updates
                </Tabs.Tab>
                <Tabs.Tab
                  disabled
                  className={classes.tab}
                  value="comments"
                >
                  Comments
                </Tabs.Tab>
                <Tabs.Tab className={classes.tab} value="followers">
                  Followers
                </Tabs.Tab>
                <Tabs.Tab className={classes.tab} value="follows">
                  Follows
                </Tabs.Tab>
              </Tabs.List>

              {/* Profile */}
              <Tabs.Panel value="profile" pt="xs">
                <Card.Section inheritPadding mt="sm" pb="md">
                  {/* // list profile links like link tree */}
                  <Grid gutter="sm">
                    <Grid.Col span={6}>
                      <Text size="xl" fw="bold">
                        Social Links
                      </Text>
                      {/* Unorderes list of facebook, twitter, etc... */}
                      {showFeatureComingSoon()}
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="xl" fw="bold">
                        About
                      </Text>
                      <Text size="sm" c="dimmed">
                        {showFeatureComingSoon()}
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Card.Section>
              </Tabs.Panel>
              {/* Grows */}
              <Tabs.Panel value="grows" pt="xs">
                <Card.Section inheritPadding mt="sm" pb="md">
                  <Grid gutter="sm">{grows}</Grid>
                </Card.Section>
              </Tabs.Panel>
              {/* Updates */}
              <Tabs.Panel value="updates" pt="xs">
                <Card.Section inheritPadding mt="sm" pb="md">
                  {showFeatureComingSoon()}
                </Card.Section>
              </Tabs.Panel>
              {/* Comments */}
              <Tabs.Panel value="comments" pt="xs">
                <Card.Section inheritPadding mt="sm" pb="md">
                  {showFeatureComingSoon()}
                </Card.Section>
              </Tabs.Panel>
              {/* Followers */}
              <Tabs.Panel value="followers" pt="xs">
                <Card.Section inheritPadding mt="sm" pb="md">
                  {followers.length ? (
                    <SimpleGrid cols={responsiveStatsColumnCount}>
                      {followers.map((follower, index) => {
                        return (
                          <Paper key={index} p="sm" withBorder>
                            <Flex>
                              <UserAvatar
                                userId={follower.id}
                                userName={follower.name as string}
                                imageUrl={follower.image}
                                avatarRadius={42}
                              />
                              <Text ml="sm">{follower.name}</Text>
                            </Flex>
                          </Paper>
                        );
                      })}
                    </SimpleGrid>
                  ) : (
                    <Alert
                      icon={<IconUserCircle size={20} stroke={1.8} />}
                      title="No Followers yet!"
                      color="growgreen.4"
                      withCloseButton
                      variant="outline"
                    >
                      <Text>
                        {growerProfileData.name} is not being followed
                        by any other Grower yet
                      </Text>
                    </Alert>
                  )}
                </Card.Section>
              </Tabs.Panel>
              {/* Follows */}
              <Tabs.Panel value="follows" pt="xs">
                <Card.Section inheritPadding mt="sm" pb="md">
                  {/* Follows */}
                  {followings.length ? (
                    <SimpleGrid cols={responsiveStatsColumnCount}>
                      {followings.map((following, index) => {
                        return (
                          <Paper key={index} p="sm" withBorder>
                            <Flex>
                              <UserAvatar
                                userId={following.id}
                                userName={following.name as string}
                                imageUrl={following.image}
                                avatarRadius={42}
                              />
                              <Text ml="sm">{following.name}</Text>
                            </Flex>
                          </Paper>
                        );
                      })}
                    </SimpleGrid>
                  ) : (
                    <Alert
                      icon={<IconUserCircle size={20} stroke={1.8} />}
                      title="No Follows yet!"
                      color="growgreen.4"
                      withCloseButton
                      variant="outline"
                    >
                      <Text>
                        {growerProfileData.name} is not following any
                        other Grower yet
                      </Text>
                    </Alert>
                  )}
                </Card.Section>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Container>
      </Container>
    </>
  );
};
export default PublicProfile;

function showFeatureComingSoon() {
  {
    /* // Alert: Feature not yet implemented */
  }
  return (
    <Alert
      icon={<IconGitBranch size={20} stroke={1.8} />}
      title="Feature not yet implemented!"
      color="gray.7"
      variant="outline"
    >
      <Text c="dimmed">
        <i>Feature coming soon...</i>
      </Text>
    </Alert>
  );
}
