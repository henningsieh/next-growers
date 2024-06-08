import { Box, Button, Text, Tooltip } from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";
import type { UseMutateFunction } from "@tanstack/react-query";

type FollowButtonProps = {
  userIdToFollow: string;
  tRPCfollowUser: UseMutateFunction<
    unknown,
    unknown,
    { userId: string },
    unknown
  >;
};

function FollowButton({
  userIdToFollow,
  tRPCfollowUser,
}: FollowButtonProps) {
  return (
    <Tooltip
      position="top-start"
      label="Follow this user to get notified about user actions on GrowAGram."
    >
      <Box>
        <Button
          h={32}
          color="growgreen"
          variant="outline"
          leftIcon={<IconUserPlus size={20} stroke={1.8} />}
          onClick={() => tRPCfollowUser({ userId: userIdToFollow })}
        >
          <Text>Follow</Text>
        </Button>
      </Box>
    </Tooltip>
  );
}

export default FollowButton;
