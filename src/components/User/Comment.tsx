import {
  Avatar,
  Group,
  Paper,
  Text,
  TypographyStylesProvider,
  createStyles,
  rem,
} from "@mantine/core";
import { sanatizeDateString } from "~/helpers";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { Locale } from "~/types";

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
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
  postedAt: string;
  body: string;
  author: {
    name: string;
    image: string;
  };
}

export function UserComment({
  postedAt,
  body,
  author,
}: CommentHtmlProps) {
  const { classes } = useStyles();
  const router = useRouter();
  const { t } = useTranslation(router.locale);

  return (
    <Paper withBorder radius="md" className={classes.comment}>
      <Group>
        <Avatar src={author.image} alt={author.name} radius="xl" />
        <div>
          <Text fz="sm">{author.name}</Text>
          <Text fz="xs" c="dimmed">
            {sanatizeDateString(
              postedAt,
              router.locale === Locale.DE ? Locale.DE : Locale.EN,
              true
            )}
          </Text>
        </div>
      </Group>
      <TypographyStylesProvider className={classes.body}>
        <div
          className={classes.content}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </TypographyStylesProvider>
    </Paper>
  );
}
