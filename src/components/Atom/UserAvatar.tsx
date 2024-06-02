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
    <Image
      src={imageUrl}
      className={"mx-auto rounded-full"}
      alt={`${userName}'s Profile Image`}
      width={avatarRadius}
      height={avatarRadius}
      style={{ width: avatarRadius, height: avatarRadius }}
    />
  );
};

export default UserAvatar;
