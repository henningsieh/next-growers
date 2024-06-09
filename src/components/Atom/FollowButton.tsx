import { Button, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconUserMinus, IconUserPlus } from "@tabler/icons-react";
import {
  followUserSuccessfulMsg,
  httpStatusErrorMsg,
  unfollowUserSuccessfulMsg,
} from "~/messages";

import { useSession } from "next-auth/react";

import { api } from "~/utils/api";

type FollowButtonProps = {
  growerId: string;
};

function FollowButton({ growerId: growerId }: FollowButtonProps) {
  const { data: _session, status: sessionSatus } = useSession();

  const trpc = api.useUtils();

  // tRPC procedure to follow a user
  const { mutate: tRPCfollowUser, isLoading: followUserIsLoading } =
    api.user.followUserById.useMutation({
      onError: (error) => {
        // Handle error, show an error message
        console.error(error);
        notifications.show(
          httpStatusErrorMsg(error.message, error.data?.httpStatus)
        );
      },
      onSuccess: () => {
        // Show a success message
        notifications.show(followUserSuccessfulMsg);
      },
      onSettled: async () => {
        // Trigger any necessary refetch or invalidation, e.g., refetch follwing data
        await trpc.user.isFollowingUser.refetch();
      },
    });

  // tRPC procedure to unfollow a user
  const { mutate: tRPCunfollowUser } =
    api.user.unfollowUserById.useMutation({
      onError: (error) => {
        console.error(error);
        // Handle error, e.g., show an error message
        notifications.show(
          httpStatusErrorMsg(error.message, error.data?.httpStatus)
        );
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onSuccess: (result) => {
        console.debug(result);
        notifications.show(unfollowUserSuccessfulMsg);
      },
      onSettled: async () => {
        // Trigger any necessary refetch or invalidation, e.g., refetch follwing data
        await trpc.user.isFollowingUser.refetch();
      },
    });

  // tRPC procedure to get info about isFollowingUser already
  const {
    data: isFollowingUser,
    isLoading: isFollowingUserIsLoading,
    // isSuccess: isFollowingUserIsSuccess,
    // isError: isFollowingUserIsError,
    // error: isFollowingUserError,
  } = api.user.isFollowingUser.useQuery({
    userId: growerId,
  });

  if (sessionSatus === "loading") return null;
  if (sessionSatus === "authenticated" && !isFollowingUserIsLoading) {
    // USER IS AUTHENTICATED AND FOLLOWING DATA IS LOADED
    if (!isFollowingUser) {
      // Follow button
      return (
        <Button
          h={32}
          color="growgreen.4"
          variant="outline"
          leftIcon={<IconUserPlus size={20} stroke={1.8} />}
          loading={followUserIsLoading}
          onClick={() => tRPCfollowUser({ userId: growerId })}
        >
          <Text>Follow</Text>
        </Button>
      );
    } else {
      // Unfollow button
      return (
        <Button
          h={32}
          color="red.8"
          variant="outline"
          leftIcon={<IconUserMinus size={20} stroke={1.8} />}
          loading={followUserIsLoading}
          onClick={() => tRPCunfollowUser({ userId: growerId })}
        >
          <Text>Unfollow</Text>
        </Button>
      );
    }
  }
}
export default FollowButton;
