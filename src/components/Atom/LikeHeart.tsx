import {
  ActionIcon,
  Box,
  Center,
  createStyles,
  Paper,
  Transition,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconHeart } from "@tabler/icons-react";
import { IconHeartFilled } from "@tabler/icons-react";
import {
  createLikeErrorMsg,
  dislikeSuccessfulMsg,
  likeGrowSuccessfulMsg,
  likeUpdateSuccessfulMsg,
} from "~/messages";

import { useState } from "react";

import { useSession } from "next-auth/react";

import type { Comment, IsoReportWithPostsFromDb, Post } from "~/types";

import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  red: {
    color: theme.colors.red[6],
  },
}));

interface LikeHeartProps {
  itemToLike: Comment | Post | IsoReportWithPostsFromDb;
  itemType: "Comment" | "Post" | "Report";
}

const LikeHeart = (props: LikeHeartProps) => {
  const { data: session, status } = useSession();
  const { itemToLike: item, itemType } = props;
  const { classes } = useStyles();

  const [showLikes, setShowLikes] = useState(false);

  // FETCH ALL REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const trpc = api.useUtils();
  const {
    data: itemLikes,
    isLoading,
    isError,
  } = api.like.getLikesByItemId.useQuery(item.id as string);

  const { mutate: likeReportMutation } =
    api.like.likeReport.useMutation({
      onError: (error) => {
        notifications.show(createLikeErrorMsg(error.message));
      },
      onSuccess: () => {
        notifications.show(likeGrowSuccessfulMsg);
      },
      // Always refetch after error or success:
      onSettled: async () => {
        await trpc.like.getLikesByItemId.invalidate();
        await trpc.notifications.invalidate();
      },
    });
  const { mutate: dislikeReportMutation } =
    api.like.dislikeReport.useMutation({
      onError: (error) => {
        console.error(error);
        // Handle error, e.g., show an error message
      },
      onSuccess: () => {
        notifications.show(dislikeSuccessfulMsg);
      },
      onSettled: async () => {
        // Trigger any necessary refetch or invalidation, e.g., refetch the report data
        await trpc.like.getLikesByItemId.invalidate();
        await trpc.notifications.getNotificationsByUserId.invalidate();
      },
    });

  const { mutate: likePostMutation } = api.like.likePost.useMutation({
    onError: (error) => {
      notifications.show(createLikeErrorMsg(error.message));
    },
    onSuccess: (likedPost) => {
      notifications.show(likeUpdateSuccessfulMsg);
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await trpc.like.getLikesByItemId.invalidate();
      await trpc.notifications.invalidate();
    },
  });

  const { mutate: dislikePostMutation } =
    api.like.dislikePost.useMutation({
      onError: (error) => {
        console.error(error);
        // Handle error, e.g., show an error message
      },
      onSuccess: (res) => {
        console.log(res);
        notifications.show(dislikeSuccessfulMsg);
      },
      onSettled: async () => {
        // Trigger any necessary refetch or invalidation, e.g., refetch the report data
        await trpc.like.getLikesByItemId.invalidate();
        await trpc.notifications.getNotificationsByUserId.invalidate();
      },
    });

  const { mutate: likeCommentMutation } =
    api.like.likeComment.useMutation({
      onError: (error) => {
        notifications.show(createLikeErrorMsg(error.message));
      },
      onSuccess: (likedComment) => {
        notifications.show(likeGrowSuccessfulMsg);
        console.debug("likedReport", likedComment);
      },
      // Always refetch after error or success:
      onSettled: async () => {
        await trpc.like.getLikesByItemId.invalidate();
        await trpc.notifications.invalidate();
      },
    });

  const { mutate: dislikeCommentMutation } =
    api.like.dislikeComment.useMutation({
      onError: (error) => {
        console.error(error);
        // Handle error, e.g., show an error message
      },
      onSuccess: (res) => {
        console.debug(res);
        notifications.show(dislikeSuccessfulMsg);
      },
      onSettled: async () => {
        // Trigger any necessary refetch or invalidation, e.g., refetch the report data
        await trpc.like.getLikesByItemId.invalidate();
        await trpc.notifications.getNotificationsByUserId.invalidate();
      },
    });

  const handleLikeItem = () => {
    // Ensure that the user is authenticated
    if (!session) {
      // Redirect to login or show a login prompt
      return;
    }

    // Call the correct mutation// Call the correct mutation
    if (itemType === "Report") {
      likeReportMutation({ id: item.id as string });
    } else if (itemType === "Post") {
      likePostMutation({ id: item.id as string });
    } else if (itemType === "Comment") {
      likeCommentMutation({ id: item.id as string });
    }
  };

  const handleDisLikeItem = () => {
    // Ensure that the user is authenticated
    if (status !== "authenticated") {
      // Redirect to login or show a login prompt
      return;
    }

    // Call the correct mutation// Call the correct mutation
    if (itemType === "Report") {
      // Call the dislikeReport mutation
      dislikeReportMutation({ id: item.id as string });
    } else if (itemType === "Post") {
      // Call the dislikePost mutation
      dislikePostMutation({ id: item.id as string });
    } else if (itemType === "Comment") {
      // Call the dislikePost mutation
      dislikeCommentMutation({ id: item.id as string });
    }
  };

  // Conditionally render the component based on isError and isLoading
  return (
    <>
      {!isError && !isLoading && (
        <Box>
          <Box mt={2} ml={2} className="relative">
            <ActionIcon
              // title="Give props to the Grower"
              variant="default"
              className="cursor-default"
              onMouseEnter={() => void setShowLikes(true)}
              onMouseLeave={() => void setShowLikes(false)}
              onBlur={() => setShowLikes(false)}
              radius="sm"
            >
              {itemLikes?.find(
                (like) => like.userId === session?.user.id
              ) ? (
                <IconHeartFilled
                  onClick={handleDisLikeItem}
                  size="1.4rem"
                  className={`${classes.red}`}
                  stroke={1.8}
                />
              ) : (
                <IconHeart
                  onClick={handleLikeItem}
                  size="1.4rem"
                  stroke={1.2}
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
                    className={`absolute bottom-full right-0 z-50 m-0 p-0 -pr-1 mb-1 w-max rounded text-right`}
                    style={{ ...transitionStyles }}
                  >
                    {itemLikes &&
                      itemLikes.map((like) => (
                        <Box key={like.id} mx={10} fz={"xs"}>
                          {like.name}
                        </Box>
                      ))}
                    {/* 
                  <Text fz="xs" td="overline" pr={4} fs="italic">
                    {itemLikes && itemLikes.length} Like
                    {itemLikes && itemLikes.length > 1 ? "s" : ""} 👍
                  </Text> */}
                  </Paper>
                )}
              </Transition>
            )}
          </Box>
          <Center fz="sm" p={0} m={0}>
            {itemLikes?.length}
          </Center>
        </Box>
      )}
    </>
  );
};

export default LikeHeart;
