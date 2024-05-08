import { EditReportMenu } from "../Card";
import { Box, Card, createStyles, rem } from "@mantine/core";

import { useTranslation } from "react-i18next";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { ImagePreview } from "~/components/Atom/ImagePreview";

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
    fontFamily: `'Lato', sans-serif`,
    fontSize: "3.2rem",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    // width: "100%",
  },
}));

interface ReportHeaderProps {
  report: IsoReportWithPostsFromDb;
  image: string;
  avatar: string;
  name: string;
  description: string;
  // stats: { label: string; value: string }[];
}

export function ReportHeader({
  report,
  image,
  // name,
  // description,
}: // stats, //FIXME: not needed
ReportHeaderProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { classes, theme } = useStyles();

  const router = useRouter();

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { data: session, status } = useSession();

  return (
    <Card withBorder radius="sm" className={classes.card}>
      {/* <Link title="back to Grow" href={`/grow/${report.id}`}> */}
      {/* HEADER IMAGE */}
      <Card.Section pos="relative">
        {/*// Session buttons */}
        {status === "authenticated" &&
          !!report &&
          session.user.id == report.authorId && (
            <Box p={8} pos="absolute" className="z-20 top-1 right-1">
              <EditReportMenu
                reportId={report.id}
                labelEditGrow={t("common:report-edit-button")}
                labelAddUpdate={t("common:addpost-headline")}
              />
            </Box>
          )}
        <ImagePreview
          publicLink={`/grow/${report.id}`}
          imageUrl={image}
          title={report.title}
          description={report.description}
          authorName={report.author.name as string}
          authorImageUrl={
            report.author.image
              ? report.author.image
              : `https://ui-avatars.com/api/?name=${
                  report.author.name as string
                }`
          }
          views={0}
          comments={0}
        />
      </Card.Section>
      {/* <Card.Section
        sx={{
          backgroundSize: "cover",
          backgroundImage: `url(${image})`,
          backgroundPosition: "center",
          height: getResponsiveHeaderImageHeight,
        }}
      /> */}
      {/* </Link> */}
      {/* <UserAvatar
        imageUrl={avatar}
        userName={name}
        avatarRadius={180}
        tailwindMarginTop={true}
      /> */}
      {/* 
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {name}
      </Text> */}
      {/* Cite blockquote */}
      {/* <Center> */}
      {/* <Box p="sm" bg={"blue"} className="-m-5 absolute ">
        <Blockquote p="xs" className={classes.cite} cite={name}>
          {description}
        </Blockquote>
      </Box> */}
      {/* </Center> */}
      {/* 
      <Text ta="center" fz="sm" c="dimmed">
        {description}
      </Text> 
      <Group mt="md" position="center" spacing={30}>
        {items}
      </Group>*/}
    </Card>
  );
}
