import {
  Blockquote,
  Box,
  Card,
  createStyles,
  getStylesRef,
  rem,
  Text,
} from "@mantine/core";

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

  cite: {
    borderLeft: `0px solid`, // no left border for this quote
    fontFamily: `'Roboto Slab', sans-serif`,
    fontSize: "1.2rem",
    color: theme.colors.gray[5],
    width: "100%",
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

  author: {
    color: theme.colors.dark[5],
    fontWeight: "bold",
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
  const { classes } = useStyles();

  return (
    <Link href={publicLink}>
      <Card
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
        {/* Avatar */}
        <Box pos="absolute" ml={-10} pt={24} className="z-20">
          <UserAvatar
            userId={authorId}
            userName={authorName}
            imageUrl={authorImageUrl}
            avatarRadius={42}
          />
        </Box>
        {/* Cite blockquote */}
        <Box pos="absolute" m={-20}>
          {/* Blockquote */}
          <Blockquote className={classes.cite} cite={authorName}>
            {description}
          </Blockquote>
        </Box>
        <Box className={classes.content}>
          {/* Title */}
          <Text size="lg" className={classes.title} weight={500}>
            {title}
          </Text>
        </Box>
        {/* <Group position="apart" spacing="xs">
          <Text size="sm" className={classes.author}>
            {authorName}
          </Text>

          <Group spacing="lg">
            <Center>
              <Text size="sm" className={classes.bodyText}>
                {views}
              </Text>
              <IconEye size="1.2rem" stroke={2.2} color="gray.4" />
            </Center>
            <Center>
              <Text size="sm" className={classes.bodyText}>
                {comments}
              </Text>
              <IconMessageCircle size="1rem" stroke={2.2} color="red" />
            </Center>
          </Group>
        </Group> */}
      </Card>
    </Link>
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
