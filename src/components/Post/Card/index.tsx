import {
  Alert,
  Box,
  Card,
  Center,
  Group,
  Paper,
  Space,
  Text,
  createStyles,
  getStylesRef,
  rem,
  useMantineTheme,
} from "@mantine/core";
// import { useMediaQuery } from "@mantine/hooks";
import {
  IconCalendar,
  IconClock,
  IconEye,
  IconHome,
} from "@tabler/icons-react";
import { formatLabel, sanatizeDateString } from "~/helpers";

import { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import LikeHeart from "~/components/Atom/LikeHeart";
import ImagesSlider from "~/components/ImagesSlider";
import { UserComment } from "~/components/User/Comment";

import type { Post } from "~/types";
import { Environment, type IsoReportWithPostsFromDb } from "~/types";
import { Locale } from "~/types";

import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  price: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },

  carousel: {
    "&:hover": {
      [`& .${getStylesRef("carouselControls")}`]: {
        opacity: 1,
      },
    },
  },

  carouselControls: {
    ref: getStylesRef("carouselControls"),
    transition: "opacity 150ms ease",
    opacity: 0,
  },

  carouselIndicator: {
    width: rem(4),
    height: rem(4),
    transition: "width 250ms ease",

    "&[data-active]": {
      width: rem(16),
    },
  },

  section: {
    margin: 0,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[3]
    }`,
  },

  label: {
    marginBottom: theme.spacing.xs,
    lineHeight: 1,
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    letterSpacing: rem(-0.25),
    textTransform: "uppercase",
  },

  icon: {
    marginRight: rem(5),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[5],
  },

  importedhtmlcontent: {
    margin: 0,
    padding: 0,
    listStyleType: "initial",
  },

  /* 
  footer: {
    display: "flex",
    justifyContent: "space-between",
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  }, */
}));

interface PostCardProps {
  report: IsoReportWithPostsFromDb;
  postId: string;
}

export function PostCard(props: PostCardProps) {
  const { report, postId } = props;

  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const [postHTMLContent, setPostHTMLContent] = useState("");

  // FETCH OWN REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: postComments,
    isLoading,
    isError,
  } = api.comments.getCommentsByPostId.useQuery({
    postId: postId, // Set the desired order (true for descending, false for ascending)
  });

  const comments = postComments?.map((postComment, index) => {
    // const imageUrl = URL.createObjectURL(file);
    return (
      <div key={index}>
        <UserComment comment={postComment} />
      </div>
    );
  });

  useEffect(() => {
    const post = report.posts.find((post) => post.id === postId);
    if (post) {
      setPostHTMLContent(post.content);
    }
  }, [report, postId]);

  const { classes } = useStyles();
  const theme = useMantineTheme();
  /* 
  const xs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const md = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const lg = useMediaQuery(`(max-width: ${theme.breakpoints.lg})`);
  const xl = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`);
  */ /* 
  const getResponsiveImageHeight = xs
    ? 460
    : sm
    ? 700
    : md
    ? 900
    : lg
    ? 1180
    : 1390;
 */
  const reportBasicData = [
    {
      label: sanatizeDateString(
        report?.createdAt,
        router.locale === Locale.DE ? Locale.DE : Locale.EN,
        false
      ),
      icon: IconCalendar,
    },
    {
      label:
        Environment[report.environment as keyof typeof Environment],
      icon: IconHome,
    },
    {
      label: "1468",
      icon: IconEye,
    },
    {
      label: sanatizeDateString(
        report?.updatedAt as string,
        router.locale === Locale.DE ? Locale.DE : Locale.EN,
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
        stroke={1.5}
      />
      <Text size="xs"> {growBasic.label} </Text>
    </Center>
  ));

  if (!postId) {
    return (
      <>
        <Alert p={16} bg={theme.colors.green[9]} variant="filled">
          <Text mx="auto">
            Select an Update (Grow Day) from calendar!☝️
          </Text>
        </Alert>
        <Card p="sm" radius="sm" withBorder>
          <Text fz="sm" c="dimmed" className={classes.section}>
            Grow Informations
          </Text>
          <Group position="apart" spacing="xs">
            {reportBasics}
          </Group>
        </Card>
      </>
    );
  } else {
    const post = report.posts.find((post) => post.id === postId);
    // FIXME: if (!post)...

    const postImages = post?.images;

    const postBasicData = {
      image:
        "https://images.unsplash.com/photo-1581889470536-467bdbe30cd0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
      title: "Running challenge",
      content: postHTMLContent,
      details: [
        {
          title: t("common:post-updatedate"),
          value: sanatizeDateString(
            post?.date as string,
            router.locale === Locale.DE ? Locale.DE : Locale.EN,
            false
          ),
        },
        {
          title: t("common:post-growday"),
          value: post?.growDay as number,
        },
        {
          title: t("common:post-lighthperday"),
          value: post?.lightHoursPerDay,
        },
        {
          title: "Grow Stage",
          value: formatLabel(post?.growStage as string),
        },
      ],
    };

    const postData = postBasicData.details.map((postBasicData) => (
      <Box key={postBasicData.title}>
        <Text size="xs" color="dimmed" align="center">
          {postBasicData.title}
        </Text>
        <Text weight={500} size="sm" align="center">
          {postBasicData.value}
        </Text>
      </Box>
    ));

    const postImagesPulbicUrls =
      postImages?.map((image) => image.cloudUrl) ?? [];

    const commentHtmlProps = {
      //FIXME: comment fake data
      postedAt: post?.date as string,
      body: '<p>I use <a href="https://heroku.com/" rel="noopener noreferrer" target="_blank">Heroku</a> to host my Node.js application, but MongoDB add-on appears to be too <strong>expensive</strong>. I consider switching to <a href="https://www.digitalocean.com/" rel="noopener noreferrer" target="_blank">Digital Ocean</a> VPS to save some cash.</p>',
      author: {
        name: "Jacob Warnhalter",
        image:
          "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      },
    };

    return (
      <>
        <Card p="sm" withBorder>
          <Group position="apart"> {postData} </Group>

          <Group position="apart" className={classes.section}>
            <Text fw={700} fz="xl">
              {post?.title}
            </Text>
            <LikeHeart itemToLike={post as Post} itemType={"Post"} />
          </Group>

          {/* 
        <Card.Section className={classes.section} mt="md">
          <Text fz="sm" c="dimmed" className={classes.label}>
            Grow Informations
          </Text>
  
          <Group spacing={8} mb={-8}>
            {growBasics}
          </Group>
        </Card.Section>
   */}
          <Paper
            fz={16}
            c="dimmed"
            withBorder
            p={theme.spacing.xs}
            mb={theme.spacing.sm}
            dangerouslySetInnerHTML={{
              __html: postHTMLContent as TrustedHTML,
            }}
          />
          {/* 
          <Card.Section className={classes.section}>
            <Group position="apart"> {postData} </Group>
          </Card.Section>
 */}
          <ImagesSlider cloudUrls={postImagesPulbicUrls} />

          {/* 
        <Box className="importedhtmlcontent">
          <Box dangerouslySetInnerHTML={{ __html: postHTMLContent }}/>
        </Box> */}
          {/*       
        <Card.Section className={classes.section} mt="md">
          <Group position="apart" mt="md">
            <Box>
              <Text fz="xl" span fw={500} className={classes.price}>
                397$
              </Text>
              <Text span fz="sm" c="dimmed">
                {" "}
               / night
              </Text>
            </Box>
            <Button radius="md">Book now</Button>
          </Group>
        </Card.Section>
        */}
          {/*//BOTTOM CAROUSEL */}
          {/* 
          <Card.Section>
            <Carousel
              withIndicators
              loop
              classNames={{
                root: classes.carousel,
                controls: classes.carouselControls,
                indicator: classes.carouselIndicator,
              }}
            >
              {postImagesSlides}
            </Carousel>
          </Card.Section>
           */}
        </Card>
        <Box>
          <Text pb="xs">Comments</Text>
          {comments}
        </Box>
        <Space h="xs" />

        <Group px="sm" position="apart" className={classes.section}>
          <Text fz="sm" c="dimmed">
            Grow data:
          </Text>
          <Text fz="md">{report.title}</Text>
          <LikeHeart itemToLike={report} itemType={"Report"} />
        </Group>
        <Group px="sm" position="apart" spacing="xs">
          {reportBasics}
        </Group>
      </>
    );
  }
}
