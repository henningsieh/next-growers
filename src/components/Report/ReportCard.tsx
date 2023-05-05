import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import { IconAlertTriangleFilled, IconHeart } from "@tabler/icons-react";

import type { Report } from "~/types";
import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

interface BadgeCardProps {
  image: string;
  country: string;
  badges: {
    emoji: string;
    label: string;
  }[];
}

interface ReportCardProps extends BadgeCardProps {
  report: Report; // replace `any` with the actual type of the `report` prop
}

export default function ReportCard({
  image,
  country,
  badges,
  report,
}: ReportCardProps) {
  const { classes, theme } = useStyles();

  const { id, title, description } = report;

  const trpc = api.useContext();
  const { mutate: deleteMutation } = api.reports.deleteReport.useMutation({
    onMutate: async (deleteId) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await trpc.reports.getAllReports.cancel();

      // Snapshot the previous value
      const previousReports = trpc.reports.getAllReports.getData();

      // Optimistically update to the new value
      trpc.reports.getAllReports.setData(undefined, (prev) => {
        if (!prev) return previousReports;
        return prev.filter((report) => report.id !== deleteId);
      });

      // Return a context object with the snapshotted value
      return { previousReports };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_err, _newTodo, context) => {
      // toast.error(`An error occured when deleting todo`)
      if (!context) return;
      trpc.reports.getAllReports.setData(
        undefined,
        () => context.previousReports
      );
    },
    // Always refetch after error or success:
    onSettled: async () => {
      console.log("SETTLED");
      await trpc.reports.getAllReports.invalidate();
    },
  });

  const features = badges.map((badge) => (
    <Badge
      color={theme.colorScheme === "dark" ? "dark" : "gray"}
      key={badge.label}
      leftSection={badge.emoji}
    >
      {badge.label}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={image} alt={id} height={180} />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group position="apart">
          <Text fz="lg" fw={500}>
            Title: {title}
          </Text>
          <Badge size="sm">{country}</Badge>
        </Group>
        <Text fz="sm" mt="xs">
          description: {description}
        </Text>
        {/*           <Text mt="md" className={classes.label} c="dimmed">
            updated at: {updatedAt.toLocaleString()}
          </Text> */}
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Tags:
        </Text>
        <Group spacing={7} mt={5}>
          {features}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button
          fullWidth
          variant="filled"
          color="red"
          radius="sm"
          style={{ flex: 0 }}
          className="border-1 border-red-600"
          onClick={() => {
            deleteMutation(id);
          }}
        >
          Delete{" "}
          <IconAlertTriangleFilled className="ml-2" height={18} stroke={1.5} />
        </Button>
        <Button
          className="border-orange-600"
          variant="default"
          color="orange.8"
          radius="sm"
          style={{ flex: 1 }}
        >
          Show details
        </Button>
        {/* 
          <ActionIcon variant="default" radius="sm" size={38}>
            <IconHeart width={22} className={classes.like} stroke={1.5} />
          </ActionIcon> */}
      </Group>
    </Card>
  );
}
