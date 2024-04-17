import {
  Blockquote,
  Box,
  Button,
  Card,
  createStyles,
  Group,
  rem,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

import UserAvatar from "~/components/Atom/UserAvatar";

import type { IsoReportWithPostsFromDb } from "~/types";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
  avatar: {
    border: `${rem(2)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
    }`,
  },
  cite: {
    fontFamily: `'Roboto Slab', sans-serif`,
    fontSize: "1.2rem",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    // width: "100%",
  },
}));

interface ReportHeaderProps {
  report: IsoReportWithPostsFromDb;
  image: string;
  avatar: string;
  name: string;
  job: string;
  // stats: { label: string; value: string }[];
}

export function ReportHeader({
  report,
  image,
  avatar,
  name,
  job,
}: // stats, //FIXME: not needed
ReportHeaderProps) {
  const router = useRouter();

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { classes, theme } = useStyles();

  const { data: session, status } = useSession();

  const xs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const md = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const lg = useMediaQuery(`(max-width: ${theme.breakpoints.lg})`);

  const xl = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`);

  const getResponsiveHeaderImageHeight = xs
    ? 140
    : sm
      ? 140
      : md
        ? 220
        : lg
          ? 220
          : xl
            ? 220
            : 220;

  return (
    <Card withBorder pt={0} radius="sm" className={classes.card}>
      <Link title="back to Grow" href={`/grow/${report.id as string}`}>
        <Card.Section
          sx={{
            backgroundSize: "cover",
            backgroundImage: `url(${image})`,
            backgroundPosition: "center",
            height: getResponsiveHeaderImageHeight,
          }}
        />
      </Link>
      <UserAvatar
        imageUrl={avatar}
        userName={name}
        avatarRadius={180}
        tailwindMarginTop={true}
      />
      {/* 
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {name}
      </Text> */}
      {/* Cite blockquote */}
      {/* <Center> */}
      <Box p="sm" className="-m-5">
        {/* Blockquote */}
        <Blockquote p="xs" className={classes.cite} cite={name}>
          {job}
        </Blockquote>
      </Box>
      {/* </Center> */}
      {/* 
      <Text ta="center" fz="sm" c="dimmed">
        {job}
      </Text> 
      <Group mt="md" position="center" spacing={30}>
        {items}
      </Group>*/}

      {status === "authenticated" &&
        report.authorId === session.user.id && (
          <Box className="absolute bottom-4 right-3 cursor-pointer">
            <Group className="cursor-pointer" position="right">
              <Link href={`/account/grows/${report.id as string}`}>
                <Button variant="filled" className="cursor-pointer">
                  {t("common:report-edit-button")}
                  <IconEdit className="ml-2" height={22} stroke={1.4} />
                </Button>
              </Link>
            </Group>
          </Box>
        )}
    </Card>
  );
}
