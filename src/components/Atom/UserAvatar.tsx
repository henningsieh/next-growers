import { Avatar, Tooltip } from "@mantine/core";

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
    <Tooltip position="bottom" label={userName} color="grape" withArrow>
      <Image
        className="  border-2  rounded-full"
        width={avatarRadius}
        height={avatarRadius}
        src={imageUrl}
        alt={`${userName}'s Proile Image`}
      />
      {/* 
      <Avatar
        src={imageUrl as string}
        className="cursor-pointer"
        variant="outline"
        radius="xl"
        size={avatarRadius}
      /> */}
    </Tooltip>
  );
};

export default UserAvatar;
