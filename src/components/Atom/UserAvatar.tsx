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
          alt={`${userName}'s Profile Image`}
          width={avatarRadius}
          height={avatarRadius}
          src={imageUrl}
          style={{ width: avatarRadius, height: avatarRadius }}
          className={"mx-auto rounded-full"}
        />
      </Box>
    </Tooltip>
  );
};

export default UserAvatar;
