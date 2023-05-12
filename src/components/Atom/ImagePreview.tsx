/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Blockquote,
  Box,
  Card,
  Center,
  Group,
  Space,
  Text,
  createStyles,
  getStylesRef,
  rem,
} from "@mantine/core";
import { IconEye, IconMessageCircle } from "@tabler/icons-react";

import UserAvatar from "./UserAvatar";
import { report } from "process";

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    height: rem(280),
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],

    [`&:hover .${getStylesRef("image")}`]: {
      transform: "scale(1.1)",
    },
  },

  cite: {
    color: theme.colors.gray[4],
  },

  image: {
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
      // "linear-gradient(180deg, rgba(255,102,0,1) 10%, rgba(255,255,255,0) 33%, rgba(0,0,0,0.8927171210280987) 75%)",
      // "linear-gradient(180deg, rgba(205,82,0,1) 20%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.8927171210280987) 75%)",
      "linear-gradient(180deg, rgba(0,0,0,0.8170868689272583) 20%, rgba(255,255,255,0) 70%, rgba(255,102,0,1) 100%)",
  },

  content: {
    height: "105%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    zIndex: 1,
  },
  deleteButtonWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: "0.5rem",
    zIndex: 100,
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
    color: theme.colors.dark[9],
    marginLeft: rem(7),
    fontWeight: "bold",
  },

  author: {
    color: theme.colors.dark[5],
    fontWeight: "bold",
  },
}));

interface ImageCardProps {
  publicLink: string;
  image: string;
  title: string;
  description: string;
  authorName: string;
  authorImageUrl: string;
  views: number;
  comments: number;
}

export function ImagePreview({
  publicLink,
  image,
  title,
  description,
  authorName,
  authorImageUrl,
  views,
  comments,
}: ImageCardProps) {
  const { classes, theme } = useStyles();

  return (
    <Card
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
      component="a"
      href={publicLink}
      // target="_blank"
    >
      <div
        className={classes.image}
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className={classes.overlay} />

      {/* Avatar */}
      <Box pos="absolute" className="-ml-2 pt-6">
        <UserAvatar
          userName={authorName}
          imageUrl={authorImageUrl}
          avatarRadius="md"
        />
      </Box>

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
              <IconEye
                size="1.2rem"
                stroke={2.5}
                color={theme.colors.dark[5]}
              />
              <Text size="sm" className={classes.bodyText}>
                {views}
              </Text>
            </Center>
            <Center>
              <IconMessageCircle
                size="1rem"
                stroke={2.5}
                color={theme.colors.dark[6]}
              />
              <Text size="sm" className={classes.bodyText}>
                {comments}
              </Text>
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
  );
}
