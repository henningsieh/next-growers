import {
  Alert,
  Box,
  Card,
  Center,
  createStyles,
  getStylesRef,
  Group,
  Paper,
  rem,
  Space,
  Text,
  TypographyStylesProvider,
  useMantineTheme,
} from "@mantine/core";
// import { useMediaQuery } from "@mantine/hooks";
import {
  IconCalendar,
  IconClock,
  IconEye,
  IconHome,
} from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";

import { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import LikeHeart from "~/components/Atom/LikeHeart";
import ImagesSlider from "~/components/ImagesSlider";
import PostComments from "~/components/Post/PostComments";

import type { Post } from "~/types";
import {
  Environment,
  GrowStage,
  type IsoReportWithPostsFromDb,
} from "~/types";
import { Locale } from "~/types";

import { sanatizeDateString } from "~/utils/helperUtils";

const useStyles = createStyles((theme) => ({
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
  postId: string | undefined;
}

export function PostCard(props: PostCardProps) {
  const { report, postId } = props;

  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const [postHTMLContent, setPostHTMLContent] = useState("");

  useEffect(() => {
    const post = report.posts.find((post) => post.id === postId);
    if (post) {
      parseAndReplaceAmazonLinks(post.content)
        .then((parsedContent) => {
          setPostHTMLContent(parsedContent);
        })
        .catch((error) => {
          console.error(
            "Error parsing and replacing Amazon links:",
            error
          );
        });
    }
  }, [report, postId]);

  const parseAndReplaceAmazonLinks = async (
    content: string
  ): Promise<string> => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    const links = doc.querySelectorAll('a[href^="https://amzn.to"]');

    for (const link of links) {
      const shortenedUrl = link.getAttribute("href");
      try {
        const response: AxiosResponse<{ resolvedUrl: string }> =
          await axios.get(
            `/api/resolveAmazonUrl?shortenedUrl=${shortenedUrl as string}&newTag=growagram-21`
          );
        const resolvedUrl = response.data.resolvedUrl;
        link.setAttribute("href", resolvedUrl);
      } catch (error) {
        console.error("Error resolving Amazon URL:", error);
      }
    }

    return doc.documentElement.innerHTML;
  };

  const { classes } = useStyles();
  const theme = useMantineTheme();

  const reportBasicData = [
    {
      label: sanatizeDateString(
        report?.createdAt,
        router.locale === Locale.DE ? Locale.DE : Locale.EN,
        false,
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
        report?.updatedAt,
        router.locale === Locale.DE ? Locale.DE : Locale.EN,
        false,
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
        stroke={1.6}
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

    const postImages = post?.images;

    // sort postImages ascending by publicId (publicId format: "timespamp_[original_filename]]")
    if (postImages) {
      postImages.sort((a, b) => {
        const publicIdA = a.publicId;
        const publicIdB = b.publicId;

        if (publicIdA < publicIdB) {
          return -1;
        }
        if (publicIdA > publicIdB) {
          return 1;
        }
        return 0;
      });
    }

    const postBasicData = {
      // FIXME: this is fake data
      image:
        "https://images.unsplash.com/photo-1581889470536-467bdbe30cd0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
      title: "Running challenge", // FIXME: this is fake data
      content: postHTMLContent,
      details: [
        {
          title: t("common:post-updatedate"),
          value: sanatizeDateString(
            post?.date as string,
            router.locale === Locale.DE ? Locale.DE : Locale.EN,
            false,
            false
          ),
        },
        {
          title: t("common:post-addform-growday"),
          value: post?.growDay as number,
        },
        {
          title: t("common:post-lighthperday"),
          value: post?.lightHoursPerDay,
        },
        {
          title: "Growth Stage",
          value: GrowStage[post?.growStage as keyof typeof GrowStage],
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

    return (
      <>
        <Paper
          bg={
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[2]
          }
          p="sm"
          withBorder
        >
          <Group position="apart">
            <Text fw={700} fz="xl">
              {post?.title}
            </Text>
            <LikeHeart itemToLike={post as Post} itemType={"Post"} />
          </Group>
          <Box my={"sm"}>
            <ImagesSlider
              cloudUrls={
                postImages?.map((image) => image.cloudUrl) ?? []
              }
            />
          </Box>
          <TypographyStylesProvider>
            <Paper
              fz={16}
              p={theme.spacing.xs}
              mb={theme.spacing.sm}
              m={0}
              dangerouslySetInnerHTML={{
                __html: postHTMLContent as TrustedHTML,
              }}
            />
            <Group position="apart" px={2} className={classes.section}>
              {postData}
            </Group>
          </TypographyStylesProvider>
        </Paper>

        <PostComments reportId={report.id} postId={postId} />

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
