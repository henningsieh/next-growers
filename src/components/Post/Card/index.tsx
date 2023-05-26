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
  Alert,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconEye,
  IconEyeglass,
  IconGasStation,
  IconGauge,
  IconHome,
  IconManualGearbox,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";

import { Carousel } from "@mantine/carousel";
import { Environment, Post, type IsoReportWithPostsFromDb } from "~/types";
import { useEffect, useState } from "react";
import { formatLabel, sanatizeDateString } from "~/helpers";
import { Locale } from "~/types";

import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useMediaQuery } from "@mantine/hooks";
import LikeHeart from "~/components/Atom/LikeHeart";

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
    borderTop: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
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
  const { locales, locale: activeLocale, defaultLocale } = router;
  const { t, i18n } = useTranslation(activeLocale);

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
      label: Environment[report.environment as keyof typeof Environment],
      icon: IconHome,
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
    <Center key= { growBasic.label } >
    <growBasic.icon size="1.05rem" className = { classes.icon } stroke = { 1.5} />
    <Text size="xs" > { growBasic.label } < /Text>
  < /Center>
  ));

  if (!postId) {
    return (
      <Card p= "sm" radius = "sm" withBorder >
        <Alert withCloseButton bg = "yellow" >
          Select a date with update from calendar
            < /Alert>
            < Text fz = "sm" c = "dimmed" className = { classes.section } >
              Grow Informations
                < /Text>
                < Group position = "apart" spacing = "xs" >
                  { reportBasics }
                  < /Group>
                  < /Card>
    );
  } else {
    const post = report.posts.find((post) => post.id === postId);

    const reportCreatedAt = new Date(report.createdAt);
    const postDate = new Date(post?.date as string);

    // Calculate the difference in milliseconds between the two dates
    const timeDifference = postDate.getTime() - reportCreatedAt.getTime();

    // Convert the difference to days
    const postDayOfGrow = Math.floor(
      timeDifference / (1000 * 60 * 60 * 24) + 1
    );

    console.log(postDayOfGrow); // The difference in days

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
          title: "Grow Stage",
          value: formatLabel(post?.growStage as string),
        },
        {
          title: t("common:post-lighthperday"),
          value: post?.lightHoursPerDay,
        },
      ],
    };
    const postData = postBasicData.details.map((basicData) => (
      <div key= { basicData.title } >
      <Text size="xs" color = "dimmed" align = "center" >
      { basicData.title }
      < /Text>
      < Text weight = { 500} size = "sm" align = "center" >
      { basicData.value }
      < /Text>
      < /div>
    ));
    const postImagesSlides = postImages?.map((image) => (
      <Carousel.Slide key= { image.id } >
      <Center>
      <Image
            alt=""
            src = { image.cloudUrl }
            height = { getResponsiveImageHeight / 1.6}
  />
    < /Center>
    < /Carousel.Slide>
    ));

  return (
    <Card p= "sm" radius = "sm" withBorder >
      <Group position="apart" >
        <Text fw={ 700 } fz = "xl" >
          { post?.title }
          < /Text>

          < Group spacing = { 4} >
            <IconEye size="1rem" />
              <Text fz="xs" fw = { 500} >
                1468
                < /Text>
                < /Group>
  {/* <LikeHeart itemToLike={post as Post} /> */ }
  </Group>

    < Card.Section className = { classes.section } >
      <Group position="apart" > { postData } < /Group>
        < /Card.Section>
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
  <Text fz="sm" c = "dimmed" mt = "sm" >
    <Paper
            fz={ 18 }
  withBorder
  p = { theme.spacing.xs }
  mb = { theme.spacing.sm }
  dangerouslySetInnerHTML = {{ __html: postHTMLContent as TrustedHTML }
}
/>
  < /Text>
{/* 
        <div className="importedhtmlcontent">
          <div dangerouslySetInnerHTML={{ __html: postHTMLContent }} />
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
{/* //BOTTOM CAROUSEL */ }
<Card.Section>
  <Carousel
            withIndicators
loop
classNames = {{
  root: classes.carousel,
    controls: classes.carouselControls,
      indicator: classes.carouselIndicator,
            }}
          >
  { postImagesSlides }
  < /Carousel>
  < /Card.Section>

  < Text fz = "sm" c = "dimmed" className = { classes.section } >
    Grow data:
</Text>

  < Group position = "apart" spacing = "xs" >
    { reportBasics }
    < /Group>
    < /Card>
    );
  }
}
