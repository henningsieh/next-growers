import { Tooltip } from "@mantine/core";

import Image from "next/image";

type UserAvatarProps = {
  imageUrl: string;
  userName: string;
  avatarRadius: number;
  tailwindMarginTop: boolean;
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  imageUrl,
  userName,
  avatarRadius,
  tailwindMarginTop,
}) => {
  return (
    <Tooltip
      transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
      position="top"
      label={userName}
      color="growgreen.4"
      withArrow
    >
      <Image
        className={`mx-auto rounded-full ${
          tailwindMarginTop ? "-mt-16" : ""
        }`}
        width={avatarRadius}
        height={avatarRadius}
        src={imageUrl}
        alt={`${userName}'s Profile Image`}
      />
    </Tooltip>
  );
};

export default UserAvatar;
