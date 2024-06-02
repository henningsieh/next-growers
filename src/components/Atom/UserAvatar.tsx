import { Tooltip } from "@mantine/core";

import Image from "next/image";
import Link from "next/link";

type UserAvatarProps = {
  imageUrl: string;
  userId: string;
  userName: string;
  avatarRadius: number;
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  imageUrl,
  userId,
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
      <Link className="z-20" href={`/profile/${userId}`}>
        <Image
          className={"mx-auto rounded-full"}
          width={avatarRadius}
          height={avatarRadius}
          src={imageUrl}
          alt={`${userName}'s Profile Image`}
        />
      </Link>
    </Tooltip>
  );
};

export default UserAvatar;
