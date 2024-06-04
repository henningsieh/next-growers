import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  createStyles,
  Flex,
  Group,
  Menu,
  Paper,
  rem,
  ScrollArea,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  // IconAlertTriangle,
  IconCalendar,
  IconCannabis,
  IconClock,
  IconDots,
  IconEdit,
  IconPlant,
} from "@tabler/icons-react";

import type { Dispatch, SetStateAction } from "react";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

import { ImagePreview } from "~/components/Atom/ImagePreview";
import LikeHeart from "~/components/Atom/LikeHeart";

import type { IsoReportWithPostsFromDb } from "~/types";
import { Locale } from "~/types";

import { sanatizeDateString } from "~/utils/helperUtils";

// import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  dropdown: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.lighten(theme.colors.dark[6], 0.0)
        : theme.fn.lighten(theme.colors.growgreen[5], 0.7),
  },
  item: {
    fontWeight: 500,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    padding: rem(8),
    marginBottom: rem(2),
  },

  edit: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.fn.lighten(theme.colors.gray[5], 0.5),
    "&[data-hovered]": {
      backgroundColor: theme.colors.groworange[4],
      color: theme.white,
    },
  },

  add: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.fn.lighten(theme.colors.gray[5], 0.5),
    "&[data-hovered]": {
      backgroundColor: theme.colors.growgreen[5],
      color: theme.white,
    },
  },

  divider: {
    borderTop: `2px ${
      theme.colorScheme === "dark"
        ? theme.colors.gray[8]
        : theme.colors.gray[5]
    }`,
    borderStyle: "solid",
  },

  card: {
    transition: "transform 150ms ease, box-shadow 150ms ease",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[2],
    "&:hover": {
      boxShadow:
        theme.colorScheme === "dark"
          ? `0 0 8px ${theme.colors.green[8]}`
          : `0 0 8px ${theme.colors.green[9]}`,
    },
  },

  section: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2]
    }`,
    padding: theme.spacing.xs,
    paddingTop: 4,
    paddingBottom: 4,
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

interface IsoReportCardProps {
  report: IsoReportWithPostsFromDb;
  setSearchString?: Dispatch<SetStateAction<string>>;
}

export default function ReportCard({
  report: isoReport,
  setSearchString,
}: IsoReportCardProps) {
  const { classes } = useStyles();
  // const trpc = api.useUtils();
  const router = useRouter();
  const theme = useMantineTheme();

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { data: session, status } = useSession();

  // const { mutate: deleteMutation } =
  //   api.reports.deleteOwnReport.useMutation({
  //     onMutate: async (deletedReportId: string) => {
  //       if (procedure == "own") {
  //         // Cancel any outgoing refetches so they don't overwrite optimistic update
  //         await trpc.reports.getOwnIsoReportsWithPostsFromDb.cancel();
  //         // Snapshot the previous value
  //         const previousReports =
  //           trpc.reports.getOwnIsoReportsWithPostsFromDb.getData();
  //         // Optimistically update to the new value
  //         trpc.reports.getOwnIsoReportsWithPostsFromDb.setData(
  //           { search: "", orderBy: "createdAt", desc: true },
  //           (prev) => {
  //             if (!prev) return previousReports;
  //             return prev.filter(
  //               (report) => report.id !== deletedReportId
  //             );
  //           }
  //         );
  //         // Return a context object with the snapshotted value
  //         return { previousReports };
  //       } else {
  //         // Cancel any outgoing refetches so they don't overwrite optimistic update
  //         await trpc.reports.getIsoReportsWithPostsFromDb.cancel();
  //         // Snapshot the previous value
  //         const previousReports =
  //           trpc.reports.getIsoReportsWithPostsFromDb.getData();
  //         // Optimistically update to the new value
  //         trpc.reports.getIsoReportsWithPostsFromDb.setData(
  //           { search: "", orderBy: "createdAt", desc: true },
  //           (prev) => {
  //             if (!prev) return previousReports;
  //             return prev.filter(
  //               (report) => report.id !== deletedReportId
  //             );
  //           }
  //         );
  //         // Return a context object with the snapshotted value
  //         return { previousReports };
  //       }
  //     },
  //     // If the mutation fails, use the context returned from onMutate to roll back
  //     onError: (_err, _variables, context) => {
  //       if (!!context) {
  //         if (procedure == "own") {
  //           trpc.reports.getOwnIsoReportsWithPostsFromDb.setData(
  //             { search: "", orderBy: "createdAt", desc: true },
  //             () => context.previousReports
  //           );
  //         } else {
  //           trpc.reports.getIsoReportsWithPostsFromDb.setData(
  //             { search: "", orderBy: "createdAt", desc: true },
  //             () => context.previousReports
  //           );
  //         }
  //       }
  //     },
  //     // Always refetch after error or success:
  //     onSettled: async () => {
  //       await trpc.reports.getOwnIsoReportsWithPostsFromDb.invalidate();
  //       await trpc.reports.getIsoReportsWithPostsFromDb.invalidate();
  //     },
  //   });

  // Create a Set to keep track of unique strains
  const uniqueStrainIds = new Set();
  const uniqueStrains = isoReport.plants?.filter((plant) => {
    // If the current seedfinderStrain ID is not in the Set, add it and return true to keep the plant
    if (!uniqueStrainIds.has(plant.seedfinderStrain.id)) {
      uniqueStrainIds.add(plant.seedfinderStrain.id);
      return true;
    }
    // If the current seedfinderStrain ID is already in the Set, return false to filter out the plant
    return false;
  });

  const plantBadges = uniqueStrains?.map((plant) => (
    <Tooltip
      key={plant.id}
      label={plant.seedfinderStrain.breeder_name}
      color="pink"
      position="top-end"
      withArrow
      arrowPosition="center"
    >
      <Badge
        className="cursor-pointer"
        onClick={() => {
          setSearchString &&
            setSearchString(`strain:"${plant.seedfinderStrain.name}"`);
        }}
        variant="gradient"
        gradient={{
          from: theme.colors.dark[4],
          to: theme.colors.green[9],
        }}
        fz={"0.72rem"}
        px={3}
        mx={0}
        leftSection={<IconCannabis stroke={1.6} size={16} />}
      >
        {plant.seedfinderStrain.name}
      </Badge>
    </Tooltip>
  ));

  // Initialize the total comment count
  let totalCommentCount = 0;

  // Iterate over each post in the isoReport
  isoReport.posts.forEach((post) => {
    // Add the number of comments in the current post to the total comment count
    totalCommentCount += post.comments.length;
  });

  return (
    <Paper withBorder p={0} m={0} radius="sm" className={classes.card}>
      {/* HEADER IMAGE */}
      <Card.Section pos="relative">
        {/*// Session buttons */}
        {status === "authenticated" &&
          !!isoReport &&
          session.user.id == isoReport.authorId && (
            <Box p={8} pos="absolute" className="z-20 bottom-0 right-0">
              <EditReportMenu
                reportId={isoReport.id}
                labelEditGrow={t("common:report-edit-button")}
                labelAddUpdate={t("common:addpost-headline")}
              />
            </Box>
          )}
        <ImagePreview
          imageUrl={isoReport.image?.cloudUrl as string}
          title={isoReport.title}
          description={isoReport.description}
          publicLink={`/grow/${isoReport.id}`}
          authorName={isoReport.author?.name as string}
          authorImageUrl={
            isoReport.author?.image
              ? isoReport.author?.image
              : `https://ui-avatars.com/api/?name=${
                  isoReport.author?.name as string
                }`
          }
          comments={totalCommentCount}
          views={183}
        />
      </Card.Section>

      {/* Strains and LikeHeart */}
      <Card.Section className={classes.section}>
        <Flex align="flex-start" justify="space-between">
          {/* Strains */}
          <ScrollArea className="overflow-visible" w={"82%"} h={42}>
            {plantBadges && plantBadges.length !== 0 ? (
              <Flex py={4} gap="xs">
                {plantBadges}
              </Flex>
            ) : session?.user.id === isoReport.authorId ? (
              <Link
                href={`/account/grows/edit/${isoReport.id}/addPlant`}
              >
                <Button
                  compact
                  variant="filled"
                  color="groworange"
                  className="cursor-pointer"
                >
                  {activeLocale === "de"
                    ? "Wählen deine Sorten aus!"
                    : "Select your Strains now!"}
                </Button>
              </Link>
            ) : (
              <Badge>
                {activeLocale === "de"
                  ? "keine Sorten ausgewählt"
                  : "no strains selected"}
              </Badge>
            )}
          </ScrollArea>

          {/* LikeHeart */}
          <Box mt={0} mr={-4}>
            <LikeHeart itemToLike={isoReport} itemType={"Report"} />
          </Box>
        </Flex>
      </Card.Section>

      {/* GROW DATES */}
      <Card.Section className={classes.section}>
        <Group position="apart" c="dimmed">
          {/*// Stage/ Date */}
          <Group position="left">
            <Tooltip
              transitionProps={{
                transition: "pop-bottom-left",
                duration: 100,
              }}
              label={t("common:reports-createdAt")}
              color={theme.colors.growgreen[5]}
              withArrow
              arrowPosition="side"
            >
              <Center>
                <Box pr={4}>
                  <IconCalendar size={16} />
                </Box>
                <Text className={`${classes.label} cursor-default`}>
                  {sanatizeDateString(
                    isoReport.createdAt,
                    router.locale === Locale.DE ? Locale.DE : Locale.EN,
                    false,
                    false
                  )}
                </Text>
              </Center>
            </Tooltip>
          </Group>
          {/*// Stage/ Date */}
          <Group position="left">
            <Tooltip
              transitionProps={{
                transition: "pop-bottom-right",
                duration: 100,
              }}
              label={t("common:reports-updatedAt")}
              color={theme.colors.growgreen[5]}
              withArrow
              arrowPosition="side"
            >
              <Center>
                <Text className={`${classes.label} cursor-default`}>
                  {sanatizeDateString(
                    isoReport.updatedAt,
                    router.locale === Locale.DE ? Locale.DE : Locale.EN,
                    false,
                    false
                  )}
                </Text>
                <Box pl={4}>
                  <IconClock size={16} />
                </Box>
              </Center>
            </Tooltip>
          </Group>
        </Group>
      </Card.Section>
    </Paper>
  );
}

interface EditReportMenuProps {
  labelEditGrow: React.ReactNode;
  labelAddUpdate: React.ReactNode;
  reportId: string;
}

export function EditReportMenu({
  reportId,
  labelEditGrow,
  labelAddUpdate,
}: EditReportMenuProps) {
  const { classes } = useStyles();
  return (
    <Flex justify="flex-end" align="center">
      <Menu
        classNames={classes}
        withinPortal={false}
        position="bottom-end"
        shadow="sm"
      >
        <Menu.Target>
          <Tooltip
            transitionProps={{
              transition: "slide-up",
              duration: 300,
            }}
            color="groworange.5"
            c="white"
            withArrow
            arrowPosition="side"
            position="top-end"
            label={labelEditGrow}
          >
            <Button
              px={2}
              w={26}
              compact
              variant="filled"
              color="groworange"
            >
              <IconDots />
            </Button>
          </Tooltip>
        </Menu.Target>

        <Menu.Dropdown>
          <Link href={`/account/grows/edit/${reportId}/editGrow`}>
            <Menu.Item
              className={classes.edit}
              icon={<IconEdit size={18} />}
            >
              {labelEditGrow}
            </Menu.Item>
          </Link>
          <Link href={`/account/grows/edit/${reportId}/addUpdate`}>
            <Menu.Item
              className={classes.add}
              icon={<IconPlant size={18} />}
            >
              {labelAddUpdate}
            </Menu.Item>
          </Link>
        </Menu.Dropdown>
      </Menu>

      {/** NO DANGEROUS DELETE BUTTON AT THE MOMENT */}
      {/* <Group m="xs" position="apart">
     <Button
    size="xs"
    radius="sm"
    style={{ flex: 0 }}
    className="hover:bg-red-600 border-red-500"
    onClick={() => {
      deleteMutation(isoReport.id as string);
    }}
  >
    {t("common:report-delete-button")}
    <IconAlertTriangle
      className="ml-2"
      height={20}
      stroke={1.6}
    />
  </Button> 
  </Group> */}
    </Flex>
  );
}
