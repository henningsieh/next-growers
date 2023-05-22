/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Blockquote,
  Box,
  Card,
  Center,
  Group,
  Text,
  createStyles,
  getStylesRef,
  rem,
} from "@mantine/core";
import { IconEye, IconMessageCircle } from "@tabler/icons-react";

import Link from "next/link";
import UserAvatar from "./UserAvatar";

const useStyles = createStyles((theme) => ({
  card: {
    transition: "transform 250ms ease, box-shadow 250ms ease",
    zIndex: 40,
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
    fontFamily: `'Roboto Slab', sans-serif`,
    fontSize: "1.2rem",
    color: theme.colors.gray[4],
    width: "100%",
  },

  image: {
    width: "100%",
    ...theme.fn.cover(),
    ref: getStylesRef("image"),
    backgroundSize: "cover",
    transition: "transform 500ms ease",
  },

  overlay: {
    position: "absolute",
    top: "0%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      "linear-gradient(180deg, rgba(0,0,0,0.8170868689272583) 20%, rgba(255,255,255,0) 70%, rgba(255,102,0,1) 100%)",
  },

  content: {
    width: "100%",
    height: "105%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    zIndex: 12,
  },
  deleteButtonWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: "0.5rem",
  },

  deleteButton: {
    backgroundColor: "red",
    color: "white",
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
    color: theme.colors.dark[4],
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
  authorName,
  authorImageUrl,
  views,
  comments,
}: ImageCardProps) {
  const { classes, theme } = useStyles();

  return (
    <Link href={publicLink}>
      <Card
        withBorder
        p="lg"
        shadow="lg"
        className={classes.card}
        radius="sm"
        // component="a"
        // href={publicLink}
        style={{ display: "block", width: "100%" }}
        // target="_blank"
      >
        <div
          className={classes.image}
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <div className={classes.overlay} />

        {/* Avatar */}
        <Box pos="absolute" className=" z-20 -ml-2 pt-6">
          <UserAvatar
            userName={authorName}
            imageUrl={authorImageUrl}
            avatarRadius="md"
          />
        </Box>

        {/* Cite blockquote */}
        <Box pos="absolute" className="-m-5">
          {/* Blockquote */}
          <Blockquote className={classes.cite} cite={authorName}>
            {description}
          </Blockquote>
        </Box>

        <div className={classes.content}>
          {/* Title */}
          <Text size="lg" className={classes.title} weight={500}>
            {title}
          </Text>

          {/* Subline */}
          <Group position="apart" spacing="xs">
            <Text size="sm" className={classes.author}>
              {authorName}
            </Text>

            <Group spacing="lg">
              <Center>
                <Text size="sm" className={classes.bodyText}>
                  {views}
                </Text>
                <IconEye
                  size="1.2rem"
                  stroke={2.5}
                  color={theme.colors.dark[5]}
                />
              </Center>
              <Center>
                <Text size="sm" className={classes.bodyText}>
                  {comments}
                </Text>
                <IconMessageCircle
                  size="1rem"
                  stroke={2.5}
                  color={theme.colors.dark[6]}
                />
              </Center>
            </Group>
          </Group>

          {/* Delete Button */}
          {/*<div className={classes.deleteButtonWrapper}>
                     <button
            onClick={() => {
              alert("delete");
            }}
            className={classes.deleteButton}
          >
            Delete Image
          </button>
        </div> */}
        </div>
      </Card>
    </Link>
  );
}
