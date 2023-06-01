import UserAvatar from "../Atom/UserAvatar";
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

import { useSession } from "next-auth/react";
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

  const { data: session, status } = useSession();

  return (
    <Paper
      withBorder
      p="sm"
      pt="xs"
      radius="md"
      className={classes.comment}
    >
      <Group position="apart">
        <Group position="left">
          <UserAvatar
            imageUrl={comment.author.image as string}
            userName={comment.author.name as string}
            avatarRadius={42}
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
          {status === "authenticated" &&
            session.user.id === comment.author.id && (
              <>
                <ActionIcon m={0} p={0} className=" cursor-default">
                  <Paper p={2} withBorder>
                    <IconEdit size="1.2rem" stroke={1.4} />
                  </Paper>
                </ActionIcon>
                <ActionIcon m={0} p={0} className=" cursor-default">
                  <Paper p={2} withBorder>
                    <IconTrashX size="1.2rem" stroke={1.4} />
                  </Paper>
                </ActionIcon>
              </>
            )}

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
