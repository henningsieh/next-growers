import { EditReportMenu } from "../Card";
import { Box, Card, createStyles, rem } from "@mantine/core";

import { useSession } from "next-auth/react";

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
  grow: IsoReportWithPostsFromDb;
}

export function ReportHeader({ grow }: ReportHeaderProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { classes, theme } = useStyles();

  const { data: session, status } = useSession();

  return (
    <Card withBorder radius="sm" className={classes.card}>
      {/* <Link title="back to Grow" href={`/grow/${report.id}`}> */}
      {/* HEADER IMAGE */}
      <Card.Section pos="relative">
        {/*// Session buttons */}
        {status === "authenticated" &&
          !!grow &&
          session.user.id == grow.authorId && (
            <Box p={8} pos="absolute" className="z-20 top-1 right-1">
              <EditReportMenu reportId={grow.id} />
            </Box>
          )}
        <ImagePreview
          publicLink={`/grow/${grow.id}`}
          imageUrl={grow.image?.cloudUrl as string}
          title={grow.title}
          description={grow.description}
          authorName={grow.author.name as string}
          authorImageUrl={
            grow.author.image
              ? grow.author.image
              : `https://ui-avatars.com/api/?name=${
                  grow.author.name as string
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
