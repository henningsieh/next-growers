import { Box, Tooltip } from "@mantine/core";

import Image from "next/image";

type UserAvatarProps = {
  imageUrl: string;
  userName: string;
  avatarRadius: number;
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  imageUrl,
  userName,
  avatarRadius,
}) => {
  return (
    <Tooltip
      transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
      position="top"
      label={userName}
      color="growgreen.4"
      withArrow
    >
      <Box>
        <Image
          className={"mx-auto rounded-full w-auto h-auto"}
          width={avatarRadius}
          height={avatarRadius}
          src={imageUrl}
          alt={`${userName}'s Profile Image`}
        />
      </Box>
    </Tooltip>
  );
};

export default UserAvatar;
