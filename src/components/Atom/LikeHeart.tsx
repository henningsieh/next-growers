import type { NotificationProps } from "@mantine/core";
import {
  ActionIcon,
  Box,
  Flex,
  Paper,
  Text,
  Transition,
  createStyles,
  rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconError404 } from "@tabler/icons-react";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

import React, { useState } from "react";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import type { IsoReportWithPostsFromDb, Post } from "~/types";

import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  card: {
    transition: "transform 150ms ease, box-shadow 150ms ease",

    "&:hover": {
      // transform: "scale(1.004)",
      // color: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,

      // Add the desired box-shadow color here

      // Add the desired box-shadow color and theme's md shadow here
      boxShadow:
        theme.colorScheme === "dark"
          ? `0 0 4px ${theme.colors.pink[6]}`
          : `0 0 8px ${theme.colors.orange[8]}`,
    },
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[2]
    }`,
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },

  like: {
    color: theme.colors.red[6],
    transition: "transform 2.3s ease-in-out",
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

export const createLikeErrorMsg = (msg: string) => ({
  loading: false,
  title: "Error",
  message: msg,
  color: "red",
  icon: <IconError404 />,
});
export const likeSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  loading: false,
  title: "Success",
  message: "Woohoo... you ❤️ this Grow!",
  color: "green",
  icon: <IconCheck />,
};
export const dislikeSuccessfulMsg = {
  loading: false,
  title: "Success",
  message: "Oh no... you removed your Like! 😢",
  color: "green",
  icon: <IconCheck />,
};

interface LikeHeartProps {
  itemToLike: Post | IsoReportWithPostsFromDb;
}

const LikeHeart = (props: LikeHeartProps) => {
  const { data: session, status, update } = useSession();
  const { itemToLike: item } = props;
  const { classes } = useStyles();

  const [showLikes, setShowLikes] = useState(false);

  // FETCH ALL REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const trpc = api.useContext();
  const {
    data: itemLikes,
    isLoading,
    isError,
  } = api.like.getLikesByItemId.useQuery(item.id as string);

  console.debug(itemLikes);

  const { mutate: likeReportMutation } =
    api.like.likeReport.useMutation({
      onError: (error) => {
        notifications.show(createLikeErrorMsg(error.message));
      },
      onSuccess: (likedReport) => {
        notifications.show(likeSuccessfulMsg);
        console.debug("likedReport", likedReport);
      },
      // Always refetch after error or success:
      onSettled: async () => {
        await trpc.like.getLikesByItemId.invalidate();
        await trpc.notifications.invalidate();
      },
    });
  const { mutate: deleteLikeMutation } =
    api.like.deleteLike.useMutation({
      onError: (error) => {
        console.error(error);
        // Handle error, e.g., show an error message
      },
      onSuccess: (res) => {
        notifications.show(dislikeSuccessfulMsg);
      },
      onSettled: async () => {
        // Trigger any necessary refetch or invalidation, e.g., refetch the report data
        await trpc.like.getLikesByItemId.invalidate();
        await trpc.notifications.getNotificationsByUserId.invalidate();
      },
    });

  const handleLikeReport = () => {
    // Ensure that the user is authenticated
    if (!session) {
      // Redirect to login or show a login prompt
      return;
    }

    // Call the likeReport mutation
    likeReportMutation({ reportId: item.id as string });
  };

  const handleDisLikeReport = () => {
    // Ensure that the user is authenticated
    if (status !== "authenticated") {
      // Redirect to login or show a login prompt
      return;
    }

    // Call the likeReport mutation
    deleteLikeMutation({ reportId: item.id as string });
  };

  return (
    <Flex align="flex-start">
      {/* // ❤️ */}
      <Box fz="sm" p={1} m={1}>
        {itemLikes?.length}
      </Box>
      <Box className="relative">
        <ActionIcon
          title="Give props to the Grower"
          variant="default"
          className="cursor-default"
          onMouseEnter={() => void setShowLikes(true)}
          onMouseLeave={() => void setShowLikes(false)}
          onBlur={() => setShowLikes(false)}
          radius="sm"
          p={0}
          mr={-4}
          size={25}
        >
          {itemLikes?.find(
            (like) => like.userId === session?.user.id
          ) ? (
            <IconHeartFilled
              onClick={handleDisLikeReport}
              size="1.2rem"
              className={`${classes.like} icon-transition`}
              stroke={1.5}
            />
          ) : (
            <IconHeart
              onClick={handleLikeReport}
              size="1.2rem"
              className={`${classes.like} icon-transition`}
              stroke={1.5}
            />
          )}
        </ActionIcon>
        {/* // Likes Tooltip */}
        {!!itemLikes && !!itemLikes?.length && (
          <Transition
            mounted={showLikes}
            transition="pop-bottom-right"
            duration={100}
            timingFunction="ease-in-out"
          >
            {(transitionStyles) => (
              <Paper
                withBorder
                className={`absolute bottom-full right-0 z-40 m-0 -mr-1 mb-2 w-max rounded p-0 text-right`}
                style={transitionStyles}
              >
                {itemLikes &&
                  itemLikes.map((like) => (
                    <Box key={like.id} mx={10} fz={"xs"}>
                      {like.name}
                    </Box>
                  ))}
                <Text fz="xs" td="overline" pr={4} fs="italic">
                  {itemLikes && itemLikes.length} Like
                  {itemLikes && itemLikes.length > 1 ? "s" : ""} 👍
                </Text>
              </Paper>
            )}
          </Transition>
        )}
      </Box>
    </Flex>
  );
};

export default LikeHeart;
