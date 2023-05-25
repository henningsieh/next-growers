import {
  Button,
  Card,
  Group,
  Image,
  Center,
  Paper,
  Text,
  useMantineTheme,
  createStyles,
  getStylesRef,
  rem,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconGasStation,
  IconGauge,
  IconHome,
  IconManualGearbox,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";

import { Carousel } from "@mantine/carousel";
import { type IsoReportWithPostsFromDb } from "~/types";
import { useEffect, useState } from "react";
import { sanatizeDateString } from "~/helpers";
import { Locale } from "~/types";

import { useRouter } from "next/router";

import { useMediaQuery } from "@mantine/hooks";

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
    padding: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
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

  footer: {
    display: "flex",
    justifyContent: "space-between",
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },
}));

interface PostCardProps {
  report: IsoReportWithPostsFromDb;
  postId: string;
}

export function PostCard(props: PostCardProps) {
  const [postHTMLContent, setPostHTMLContent] = useState("");

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

  const { report, postId } = props;

  const router = useRouter();

  const post = report.posts.find((post) => post.id === postId);
  const postImages = post?.images;

  const postBasicData = {
    image:
      "https://images.unsplash.com/photo-1581889470536-467bdbe30cd0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    title: "Running challenge",
    content: postHTMLContent,
    details: [
      {
        title: "Date",
        value: sanatizeDateString(
          post?.date as string,
          router.locale === "de" ? Locale.DE : Locale.EN
        ),
      },
      {
        title: "Grow Stage",
        value: post?.growStage,
      },
      {
        title: "Light (h) / Day",
        value: post?.lightHoursPerDay,
      },
    ],
  };

  const growBasicData = [
    {
      label: sanatizeDateString(
        report?.createdAt,
        router.locale === "de" ? Locale.DE : Locale.EN
      ),
      icon: IconCalendar,
    },
    { label: report?.environment, icon: IconHome },
    {
      label: sanatizeDateString(
        report?.updatedAt,
        router.locale === "de" ? Locale.DE : Locale.EN
      ),
      icon: IconClock,
    },
  ];

  const postData = postBasicData.details.map((basicData) => (
    <div key={basicData.title}>
      <Text size="xs" color="dimmed">
        {basicData.title}
      </Text>
      <Text weight={500} size="sm">
        {basicData.value}
      </Text>
    </div>
  ));

  useEffect(() => {
    const post = report.posts.find((post) => post.id === postId);
    if (post) {
      setPostHTMLContent(post.content);
    }
  }, [report, postId]);

  const growBasics = growBasicData.map((growBasic) => (
    <Center key={growBasic.label}>
      <growBasic.icon size="1.05rem" className={classes.icon} stroke={1.5} />
      <Text size="xs">{growBasic.label}</Text>
    </Center>
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
    <Card radius="md" withBorder padding="xl">
      {/* 
      <Card.Section>
        <PostImagesCarousel />
      </Card.Section> */}

      <Group position="apart">
        <Text fw={700} fz="lg">
          {post?.title}
        </Text>

        <Group spacing={5}>
          <IconStar size="1rem" />
          <Text fz="xs" fw={500}>
            4.78
          </Text>
        </Group>
      </Group>

      <Card.Section className={classes.section}>
        <Group position="apart" spacing={8} mb={-8}>
          {postData}
        </Group>
      </Card.Section>
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
          m="-md"
          px="xs"
          py="sm"
          dangerouslySetInnerHTML={{ __html: postHTMLContent as TrustedHTML }}
        />
      </Text>

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

      {/* //BOTTOM CAROUSEL */}
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

      <Card.Section className={classes.section} mt="md">
        <Text fz="sm" c="dimmed" className={classes.label}>
          Grow Informations
        </Text>

        <Group spacing={8} mb={-8}>
          {growBasics}
        </Group>
      </Card.Section>
    </Card>
  );
}
