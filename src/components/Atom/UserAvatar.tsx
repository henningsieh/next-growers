import { Tooltip } from "@mantine/core";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { api } from "~/utils/api";

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
  const { data: session } = useSession();

  const refreshImage =
    api.user.refreshUserImageFromProvider.useMutation({
      onSuccess: (result) => {
        if (result.newImageUrl) {
          setSrc(result.newImageUrl);
        }
      },
      onError: (error) => {
        console.error("Failed to refresh user image:", error);
        setSrc(defaultImageUrl);
      },
    });

  // Reset src when imageUrl prop changes
  useEffect(() => {
    setSrc(imageUrl || defaultImageUrl);
  }, [imageUrl, userName, defaultImageUrl]);

  // Refresh image from provider on mount if it's a provider image and for current user
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (
      session?.user.id === userId &&
      imageUrl &&
      !imageUrl.includes("ui-avatars.com")
    ) {
      refreshImage.mutate();
    }
  }, [session?.user.id, userId, imageUrl, refreshImage]);

  const handleImageError = () => {
    console.debug(
      "The Grower's user avatar image could not be found and has been reset to the default setting. (404)"
    );
    if (session?.user.id === userId) {
      refreshImage.mutate();
    } else {
      setSrc(defaultImageUrl);
    }
  };

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
          onError={handleImageError}
        />
      </Link>
    </Tooltip>
  );
};

export default UserAvatar;
