import {
  ActionIcon,
  Avatar,
  Box,
  Flex,
  Group,
  Paper,
  Text,
  TypographyStylesProvider,
  createStyles,
  rem,
} from "@mantine/core";
import { IconEdit, IconTrash, IconTrashX } from "@tabler/icons-react";
import { sanatizeDateString } from "~/helpers";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import LikeHeart from "~/components/Atom/LikeHeart";

import { type Comment, Locale } from "~/types";

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg} ${theme.spacing.lg}`,
  },

  body: {
    paddingLeft: rem(54),
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));

interface CommentHtmlProps {
  comment: Comment;
}

export function UserComment({ comment }: CommentHtmlProps) {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <Paper withBorder p="sm" radius="md" className={classes.comment}>
      <Group position="apart">
        <Group position="left">
          <Avatar
            src={comment.author.image}
            alt={comment.author.name as string}
            radius="xl"
          />
          <Box>
            <Text fz="sm">{comment.author.name}</Text>
            <Text fz="xs" c="dimmed">
              {sanatizeDateString(
                comment.createdAt.toISOString(),
                router.locale === Locale.DE ? Locale.DE : Locale.EN,
                true
              )}
            </Text>
          </Box>
        </Group>
        <Group position="right">
          <ActionIcon m={0} p={0} className=" cursor-default">
            <Paper p={3} withBorder>
              <IconEdit size="1.2rem" stroke={1.4} />
            </Paper>
          </ActionIcon>
          <ActionIcon m={0} p={0} className=" cursor-default">
            <Paper p={3} withBorder>
              <IconTrashX size="1.2rem" stroke={1.4} />
            </Paper>
          </ActionIcon>
          <LikeHeart itemToLike={comment} itemType={"Comment"} />
        </Group>
      </Group>
      <TypographyStylesProvider className={classes.body}>
        <Box
          className={classes.content}
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />
      </TypographyStylesProvider>
    </Paper>
  );
}
