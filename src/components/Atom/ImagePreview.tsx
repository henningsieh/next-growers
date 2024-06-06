import {
  Blockquote,
  Box,
  Card,
  createStyles,
  getStylesRef,
  rem,
  Text,
  Tooltip,
} from "@mantine/core";

// import { useTranslation } from "react-i18next";
// import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import UserAvatar from "~/components/Atom/UserAvatar";

const useStyles = createStyles((theme) => ({
  card: {
    transition: "transform 250ms ease, box-shadow 250ms ease",
    zIndex: 10,
    position: "relative",
    height: rem(280),

    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],

    [`&:hover .${getStylesRef("image")}`]: {
      transform: "scale(1.02)",
    },
  },
  image: {
    objectFit: "cover",
    ref: getStylesRef("image"),
    transition: "transform 500ms ease",
  },

  overlay: {
    position: "absolute",
    top: "0%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      "linear-gradient(180deg,      \
        rgba(0, 0, 0, 0.9) 20%,     \
        rgba(255, 255, 255, 0) 70%, \
        rgba(30, 60, 0, .85) 90%        /* Adjusted color */ /* THIS COLOR SHOULD BE LIKE #085000 */ )",
  },

  content: {
    width: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    zIndex: 10,
  },

  deleteButtonWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: "0.5rem",
  },

  deleteButton: {
    backgroundColor: "red",
    color: theme.white,
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },

  title: {
    color: theme.white,
    marginBottom: rem(1),
  },

  bodyText: {
    color: theme.colors.gray[4],
    marginRight: rem(7),
    fontWeight: "bold",
  },

  cite: {
    borderLeft: `0px solid`, // no left border for this quote
    fontFamily: `'Roboto Slab', sans-serif`,
    fontSize: rem(20),
    color: theme.colors.gray[4],
    width: "100%",
  },
}));

interface ImageCardProps {
  publicLink: string;
  imageUrl: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorImageUrl: string;
  views: number;
  comments: number;
}

export function ImagePreview({
  publicLink,
  imageUrl,
  title,
  description,
  authorId,
  authorName,
  authorImageUrl,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  views,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  comments,
}: ImageCardProps) {
  // const router = useRouter();
  // const { locale: activeLocale } = router;
  // const { t } = useTranslation(activeLocale);

  const { classes, theme } = useStyles();

  return (
    <>
      <Tooltip
        transitionProps={{
          transition: "slide-up",
          duration: 150,
        }}
        position="top-start"
        label={authorName}
        color="growgreen.4"
        withArrow
      >
        <Box
          pos="absolute"
          component={Link}
          href={`/profile/${authorId}`}
          className="top-11 left-2 z-20 cursor-pointer"
        >
          <UserAvatar
            userName={authorName}
            imageUrl={authorImageUrl}
            avatarRadius={48}
          />
        </Box>
      </Tooltip>
      <Card
        component={Link}
        href={publicLink}
        p="lg"
        shadow="lg"
        radius="sm"
        withBorder
        className={classes.card}
      >
        <Image
          fill
          priority
          quality={80}
          src={imageUrl}
          fetchPriority="high"
          alt={`Header Image from Grow \"${title}\"`}
          className={classes.image}
          sizes="450px" // 450px is the maximum width of the RepostCard
        />
        <Box className={classes.overlay} />

        <Box pos="absolute" m={-20}>
          {/* Blockquote */}
          <Blockquote
            className={classes.cite}
            cite={authorName}
            styles={{
              cite: {
                color: theme.colors.gray[2],
              },
            }}
          >
            {description}
          </Blockquote>
        </Box>
        <Box className={classes.content}>
          {/* Title */}
          <Text size="lg" className={classes.title} weight={500}>
            {title}
          </Text>
        </Box>
      </Card>
    </>
  );
}

{
  /* Delete Button */
}
{
  /*<Box className={classes.deleteButtonWrapper}>
                     <button
            onClick={() => {
              alert("delete");
            }}
            className={classes.deleteButton}
          >
            Delete Image
          </button>
        </Box> */
}
