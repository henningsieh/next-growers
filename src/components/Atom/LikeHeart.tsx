import {
  ActionIcon,
  Box,
  Center,
  createStyles,
  Flex,
  Paper,
  Transition,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import {
  dislikeSuccessfulMsg,
  httpStatusErrorMsg,
  likeGrowSuccessfulMsg,
  likeUpdateSuccessfulMsg,
} from "~/messages";

import { useEffect, useState } from "react";

// Add useEffect import

import { useSession } from "next-auth/react";

import type {
  Comment,
  IsoReportWithPostsCountFromDb,
  IsoReportWithPostsFromDb,
  Post,
} from "~/types";

import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  red: {
    color: theme.colors.red[6],
  },
}));

interface LikeHeartProps {
  itemToLike:
    | Comment
    | Post
    | IsoReportWithPostsCountFromDb
    | IsoReportWithPostsFromDb;
  itemType: "Comment" | "Post" | "Report";
}

const LikeHeart = (props: LikeHeartProps) => {
  const { data: session, status } = useSession() || {};
  const { itemToLike, itemType } = props;
  const { classes } = useStyles();

  const [itemLikes, setItemLikes] = useState(itemToLike.likes);
  const [showLikeNames, setShowLikeNames] = useState(false);

  // reset the likes state when itemToLike changes
  useEffect(() => {
    setItemLikes(itemToLike.likes);
  }, [itemToLike]);

  const trpc = api.useUtils();

  const { mutate: likeReportMutation } =
    api.like.likeReport.useMutation({
      // optimistic update to the UI with the new like
      onMutate: (newLike) => {
        addOptimisticLike(newLike);
      },
      onError: (error) => {
        // Rollback the optimistic update on error
        removeOptimisticLike();
        notifications.show(
          httpStatusErrorMsg(error.message, error.data?.httpStatus)
        );
        console.error({ error });
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
      onMutate: () => {
        removeOptimisticLike();
      },
      onError: (error, newLike) => {
        addOptimisticLike(newLike);
        notifications.show(
          httpStatusErrorMsg(error.message, error.data?.httpStatus)
        );

        console.error(error);
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
    // optimistic add the session user's like to the UI
    onMutate: (newLike) => {
      addOptimisticLike(newLike);
    },
    onError: (error) => {
      // Rollback the optimistic update on error
      removeOptimisticLike();
      notifications.show(
        httpStatusErrorMsg(error.message, error.data?.httpStatus)
      );
      console.error({ error });
    },
    onSuccess: () => {
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
      onMutate: () => {
        removeOptimisticLike();
      },
      onError: (error, newLike) => {
        addOptimisticLike(newLike);
        notifications.show(
          httpStatusErrorMsg(error.message, error.data?.httpStatus)
        );

        console.error(error);
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

  const { mutate: likeCommentMutation } =
    api.like.likeComment.useMutation({
      // optimistic add the session user's like to the UI
      onMutate: (newLike) => {
        addOptimisticLike(newLike);
      },
      onError: (error) => {
        // Rollback the optimistic update on error
        removeOptimisticLike();
        notifications.show(
          httpStatusErrorMsg(error.message, error.data?.httpStatus)
        );
        console.error({ error });
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

  const { mutate: dislikeCommentMutation } =
    api.like.dislikeComment.useMutation({
      onMutate: () => {
        removeOptimisticLike();
      },
      onError: (error, newLike) => {
        addOptimisticLike(newLike);
        notifications.show(
          httpStatusErrorMsg(error.message, error.data?.httpStatus)
        );

        console.error(error);
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

  function removeOptimisticLike() {
    // optimistic remove the session user's like from the UI
    session &&
      setItemLikes((prevData) =>
        prevData.filter((like) => like.userId !== session.user.id)
      );
  }

  function addOptimisticLike(newLike: { id: string }) {
    session &&
      setItemLikes((prevData) => [
        ...prevData,
        {
          id: newLike.id,
          userId: session.user.id,
          name: session.user.name as string,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
  }

  const handleLikeItem = () => {
    // Ensure that the user is authenticated
    if (status !== "authenticated") {
      // Redirect to login or show a login prompt
      return;
    }

    // Call the correct mutation// Call the correct mutation
    if (itemType === "Report") {
      likeReportMutation({ id: itemToLike.id });
    } else if (itemType === "Post") {
      likePostMutation({ id: itemToLike.id });
    } else if (itemType === "Comment") {
      likeCommentMutation({ id: itemToLike.id });
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
      dislikeReportMutation({ id: itemToLike.id });
    } else if (itemType === "Post") {
      // Call the dislikePost mutation
      dislikePostMutation({ id: itemToLike.id });
    } else if (itemType === "Comment") {
      // Call the dislikePost mutation
      dislikeCommentMutation({ id: itemToLike.id });
    }
  };

  // Conditionally render the component based on isError and isLoading
  return (
    <>
      <Flex pl="xs" gap={2}>
        <Center fz="sm" p={0} m={0}>
          {itemLikes.length}
        </Center>
        <Box mt={2} ml={2} className="relative">
          <ActionIcon
            size={30}
            // title="Give props to the Grower"
            variant="transparent"
            className="cursor-default"
            onMouseEnter={() => void setShowLikeNames(true)}
            onMouseLeave={() => void setShowLikeNames(false)}
            onBlur={() => setShowLikeNames(false)}
            radius="sm"
          >
            {session &&
            itemLikes?.find(
              (like) => like.userId === session.user.id
            ) ? (
              <IconHeartFilled
                onClick={handleDisLikeItem}
                size={22}
                className={`${classes.red}`}
                stroke={1}
              />
            ) : (
              <IconHeart
                onClick={handleLikeItem}
                size={22}
                stroke={2}
              />
            )}
          </ActionIcon>

          {/* // Likes Tooltip */}
          {!!itemLikes && !!itemLikes?.length && (
            <Transition
              mounted={showLikeNames}
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
                </Paper>
              )}
            </Transition>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default LikeHeart;
