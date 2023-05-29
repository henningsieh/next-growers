import { Carousel } from "@mantine/carousel";
import {
  Alert,
  Card,
  Center,
  Group,
  Image,
  Paper,
  Space,
  Text,
  createStyles,
  getStylesRef,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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

import type { Post } from "~/types";
import { Environment, type IsoReportWithPostsFromDb } from "~/types";
import { Locale } from "~/types";

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
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const [postHTMLContent, setPostHTMLContent] = useState("");
  const { report, postId } = props;

  useEffect(() => {
    const post = report.posts.find((post) => post.id === postId);
    if (post) {
      setPostHTMLContent(post.content);
    }
  }, [report, postId]);

  const { classes } = useStyles();
  const theme = useMantineTheme();
  const xs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const md = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const lg = useMediaQuery(`(max-width: ${theme.breakpoints.lg})`);
  /* 
  const xl = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`);
  */
  const getResponsiveImageHeight = xs
    ? 460
    : sm
    ? 700
    : md
    ? 900
    : lg
    ? 1180
    : 1390;

  const reportBasicData = [
    {
      label: sanatizeDateString(
        report?.createdAt,
        router.locale === Locale.DE ? Locale.DE : Locale.EN
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
        report?.updatedAt,
        router.locale === Locale.DE ? Locale.DE : Locale.EN
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

    const reportCreatedAt = new Date(report.createdAt);
    const postDate = new Date(post?.date as string);

    // Calculate the difference in milliseconds between the two dates
    const timeDifference =
      postDate.getTime() - reportCreatedAt.getTime();

    // Convert the difference to days
    const postDayOfGrow = Math.floor(
      timeDifference / (1000 * 60 * 60 * 24) + 1
    );

    // console.log(postDayOfGrow); // The difference in days

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
            router.locale === Locale.DE ? Locale.DE : Locale.EN
          ),
        },
        {
          title: t("common:post-growday"),
          value: postDayOfGrow,
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
      <div key={postBasicData.title}>
        <Text size="xs" color="dimmed" align="center">
          {postBasicData.title}
        </Text>
        <Text weight={500} size="sm" align="center">
          {postBasicData.value}
        </Text>
      </div>
    ));
    const postImagesSlides = postImages?.map((image) => (
      <Carousel.Slide key={image.id}>
        <Center>
          <Image
            alt=""
            src={image.cloudUrl}
            height={getResponsiveImageHeight / 1.6}
          />
        </Center>
      </Carousel.Slide>
    ));

    return (
      <>
        <Card h={850} p="sm" radius="sm" withBorder>
          <Group position="apart">
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
          <Text fz="sm" c="dimmed" mt="sm">
            <Paper
              fz={16}
              withBorder
              p={theme.spacing.xs}
              mb={theme.spacing.sm}
              dangerouslySetInnerHTML={{
                __html: postHTMLContent as TrustedHTML,
              }}
            />
          </Text>

          <Card.Section className={classes.section}>
            <Group position="apart"> {postData} </Group>
          </Card.Section>

          {/* 
        <div className="importedhtmlcontent">
          <div dangerouslySetInnerHTML={{ __html: postHTMLContent }}/>
        </div> */}
          {/*       
        <Card.Section className={classes.section} mt="md">
          <Group position="apart" mt="md">
            <div>
              <Text fz="xl" span fw={500} className={classes.price}>
                397$
              </Text>
              <Text span fz="sm" c="dimmed">
                {" "}
               / night
              </Text>
            </div>
            <Button radius="md">Book now</Button>
          </Group>
        </Card.Section>
        */}
          {/*//BOTTOM CAROUSEL */}
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
        </Card>
        <Space h="sm" />

        <Group position="apart" className={classes.section}>
          <Text fz="sm" c="dimmed">
            Grow data:
          </Text>
          <Text fz="md">{report.title}</Text>
          <LikeHeart itemToLike={report} itemType={"Report"} />
        </Group>

        <Group position="apart" spacing="xs">
          {reportBasics}
        </Group>
      </>
    );
  }
}
