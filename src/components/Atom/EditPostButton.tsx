import { Button, createStyles, rem } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";

import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  growId: string;
  postId: string;
}

const useStyles = createStyles((theme) => ({
  button: {
    cursor: "pointer",

    height: rem(38),
    fontSize: theme.fontSizes.md,

    [theme.fn.smallerThan("sm")]: {
      height: rem(28),
      fontSize: theme.fontSizes.sm,
    },
  },
}));

export default function EditPostButton({ growId, postId }: Props) {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { classes, theme } = useStyles();
  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );

  return (
    <Link href={`/account/grows/edit/${growId}/update/${postId}`}>
      <Button
        variant="filled"
        color="groworange"
        compact={smallScreen}
        className={classes.button}
        leftIcon={
          <IconEdit size={smallScreen ? 18 : 24} stroke={1.8} />
        }
      >
        {t("common:post-edit-button")}
      </Button>
    </Link>
  );
}
