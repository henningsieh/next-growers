import { Avatar, Tooltip } from "@mantine/core";

type UserAvatarProps = {
  imageUrl: string | null | undefined;
  userName: string | null | undefined;
  avatarRadius: "xs" | "sm" | "md" | "lg" | "xl";
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  imageUrl,
  userName,
  avatarRadius,
}) => {
  return (
    <Tooltip label={userName} /* color={theme.colors.orange[5]} */ withArrow>
      <Avatar
        src={imageUrl}
        className="cursor-pointer"
        variant="outline"
        radius="xl"
        size={avatarRadius}
      />
    </Tooltip>
  );
};

export default UserAvatar;
