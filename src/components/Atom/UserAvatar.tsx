import { Avatar, Tooltip } from "@mantine/core";

import Image from "next/image";

type UserAvatarProps = {
  imageUrl: string;
  userName: string;
  avatarRadius: number;
  tailwindMarginTop: number;
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
      color="grape"
      withArrow
    >
      <Image
        className={`-mt-${tailwindMarginTop} mx-auto rounded-full`}
        width={avatarRadius}
        height={avatarRadius}
        src={imageUrl}
        alt={`${userName}'s Proile Image`}
      />
    </Tooltip>
  );
};

export default UserAvatar;
