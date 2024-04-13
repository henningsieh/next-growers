import type { NotificationProps } from "@mantine/core";
import {
  IconAlertCircle,
  IconCalendarOff,
  IconCannabis,
  IconEyeHeart,
  IconFileAlert,
  IconPhoto,
} from "@tabler/icons-react";

export const markAllReadMessage = {
  title: "Success",
  message: "All notifications have been marked as read",
  color: "green",
  icon: <IconEyeHeart />,
  loading: false,
};

export const noPostAtThisDay: NotificationProps & {
  message: string;
} = {
  title: "Error",
  message: "Sorry... there is no Update for this day! 😢",
  color: "red",
  icon: <IconCalendarOff />,
  loading: false,
};

export const likeSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Woohoo... you ❤️ this Grow!",
  color: "green",
  icon: <IconCannabis />,
  loading: false,
};

export const commentSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Woohoo... you commented this Grow! 🥳",
  color: "green",
  icon: <IconCannabis />,
  loading: false,
};

export const dislikeSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Oh no... you removed your like! 😢",
  color: "green",
  icon: <IconCannabis />,
  loading: false,
};

export const commentDeletedSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Oh no... you removed your comment! 😢",
  color: "green",
  icon: <IconCannabis />,
  loading: false,
};

export const setUserNameSuccessfulMsg = (userName: string) => ({
  loading: false,
  title: "Success",
  message: `Username "${userName}" has been updated successfully.`,
  color: "green",
  icon: <IconCannabis />,
});

export const setUserimageSuccessfulMsg = {
  title: "Success",
  message: "Your user image has been updated successfully! ✅",
  color: "green",
  icon: <IconPhoto />,
  loading: false,
};

export const likeErrorMsg = (msg: string) => ({
  loading: false,
  title: "Error",
  message: msg,
  color: "red",
  icon: <IconAlertCircle />,
});

export const createLikeErrorMsg = (msg: string) => ({
  loading: false,
  title: "Error",
  message: msg,
  color: "red",
  icon: <IconAlertCircle />,
});

export const onlyOnePostPerDayAllowed = {
  title: "Failure",
  message: "You can only post one Update per Grow and Day! 💁",
  color: "red",
  icon: <IconCalendarOff />,
  loading: false,
};

export const fileUploadErrorMsg = (
  filename: string,
  fileSizeInMB: string,
  uploadMaxSize: string
) => ({
  title: "Error " + filename,
  message: `File size of ${fileSizeInMB} MB exceeds the allowed maximum of ${uploadMaxSize} MB`,
  color: "red",
  icon: <IconFileAlert />,
  loading: false,
});

export const filesMaxOneErrorMsg = (filesCount: number) => ({
  title: `File count error: The count ${filesCount} exceeds the permitted files count of 1.`,
  message: ` You can only upload one image file as a user avatar.`,
  color: "red",
  icon: <IconFileAlert />,
  loading: false,
});
