import { Tooltip } from "@mantine/core";

import Image from "next/image";
import Link from "next/link";

type UserAvatarProps = {
  userId: string;
  userName: string;
  imageUrl: string | null;
  avatarRadius: number;
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  userName,
  imageUrl,
  avatarRadius,
}) => {
  return (
    <Tooltip
      transitionProps={{
        transition: "slide-up",
        duration: 150,
      }}
      position="top-start"
      label={userName}
      color="growgreen.4"
      withArrow
    >
      <Link href={`/profile/${userId}`}>
        <Image
          src={
            imageUrl
              ? imageUrl
              : `https://ui-avatars.com/api/?name=${userName}`
          }
          className={"rounded-full"}
          alt={`${userName}'s Profile Image`}
          width={avatarRadius}
          height={avatarRadius}
          style={{ width: avatarRadius, height: avatarRadius }}
        />
      </Link>
    </Tooltip>
  );
};

export default UserAvatar;
