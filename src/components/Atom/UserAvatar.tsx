import { Tooltip } from "@mantine/core";

import { useEffect, useState } from "react";

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
  const defaultImageUrl = `https://ui-avatars.com/api/?name=${userName}`;
  const [src, setSrc] = useState(imageUrl || defaultImageUrl);

  // Reset src when imageUrl prop changes
  useEffect(() => {
    setSrc(imageUrl || defaultImageUrl);
  }, [imageUrl, userName, defaultImageUrl]);

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
          src={src}
          className={"rounded-full"}
          alt={`${userName}'s Profile Image`}
          width={avatarRadius}
          height={avatarRadius}
          style={{ width: avatarRadius, height: avatarRadius }}
          onError={() => {
            console.debug(
              "The Grower's user avatar image could not be found \
               and has been reset to the default setting. (404)"
            );
            setSrc(defaultImageUrl);
            //FIXME: reset the imageUrl in the database to ""
          }}
        />
      </Link>
    </Tooltip>
  );
};

export default UserAvatar;
