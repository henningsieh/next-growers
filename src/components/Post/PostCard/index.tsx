import PostComments from "../PostComments";
import {
  Box,
  createStyles,
  getStylesRef,
  Group,
  Paper,
  rem,
  Text,
  TypographyStylesProvider,
  useMantineTheme,
} from "@mantine/core";

// import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import EditPostButton from "~/components/Atom/EditPostButton";
import LikeHeart from "~/components/Atom/LikeHeart";
import ImagesSlider from "~/components/ImagesSlider";

import type { Post } from "~/types";
import {
  GrowStage,
  type IsoReportWithPostsFromDb,
  Locale,
} from "~/types";

import {
  parseAndReplaceAmazonLinks,
  sanatizeDateString,
} from "~/utils/helperUtils";

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
  reportFromProps: IsoReportWithPostsFromDb;
  postId: string;
}

export function PostCard(props: PostCardProps) {
  const { reportFromProps: report, postId } = props;

  const theme = useMantineTheme();
  const { classes } = useStyles();

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

  if (!postId) {
  } else {
    const post = report.posts.find((post) => post.id === postId);

    const postImages = post?.images;

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
        // FIXME: take the last valid watt value from past posts, not value from this post
        // {
        //   title: "Watt",
        //   value: post?.LightWatts?.watt,
        // },
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
        <Paper p="sm" withBorder pos="relative">
          <Box pos="absolute" m="xs" className="bottom-0 right-0">
            <EditPostButton
              growId={report.id}
              postId={postId}
              buttonLabel={t("common:post-edit-button")}
            />
          </Box>
          <Paper>
            <Group pb={theme.spacing.xs} position="apart">
              <Text fw={700} fz="xl">
                {post?.title}
              </Text>
              <LikeHeart itemToLike={post as Post} itemType={"Post"} />
            </Group>
            <Group position="apart" pt="sm" className={classes.section}>
              {postData}
            </Group>

            <Box my={"sm"}>
              <ImagesSlider
                cloudUrls={
                  postImages?.map((image) => image.cloudUrl) ?? []
                }
              />
            </Box>
          </Paper>
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
          </TypographyStylesProvider>
        </Paper>

        <PostComments reportId={report.id} postId={postId} />
      </>
    );
  }
}
