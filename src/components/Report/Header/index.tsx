import {
  Avatar,
  Blockquote,
  Box,
  Button,
  Card,
  Center,
  Group,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import Link from "next/link";

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
    color: theme.colors.gray[4],
    // width: "100%",
  },
}));

interface ReportHeaderProps {
  report: IsoReportWithPostsFromDb;
  image: string;
  avatar: string;
  name: string;
  job: string;
  stats: { label: string; value: string }[];
}

export function ReportHeader({
  report,
  image,
  avatar,
  name,
  job,
  stats,
}: ReportHeaderProps) {
  const { classes, theme } = useStyles();

  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text ta="center" fz="lg" fw={500}>
        {stat.value}
      </Text>
      <Text ta="center" fz="sm" c="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

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
    <Card withBorder padding="sm" radius="sm" className={classes.card}>
      <Card.Section
        sx={{
          backgroundSize: "cover",
          backgroundImage: `url(${image})`,
          backgroundPosition: "center", // Add this line
          height: getResponsiveHeaderImageHeight,
        }}
      />

      <Avatar
        src={avatar}
        size={120}
        radius={120}
        mx="auto"
        mt={-30}
        className={classes.avatar}
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

      <Box className="absolute bottom-4 right-3 cursor-pointer">
        <Group className="cursor-pointer" position="right">
          <Link href={`/account/reports/${report.id as string}`}>
            <Button
              className="cursor-pointer"
              py={0}
              px={12}
              variant="outline"
              radius="sm"
              size="xs"
              fz={12}
              color={theme.colorScheme === "dark" ? undefined : "dark"}
            >
              Edit Report
            </Button>
          </Link>
        </Group>
      </Box>
    </Card>
  );
}
