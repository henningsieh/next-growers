import type { NotificationProps } from "@mantine/core";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCalendarOff,
  IconCannabis,
  IconEyeHeart,
  IconFileAlert,
  IconPhoto,
} from "@tabler/icons-react";

export const httpStatusErrorMsg = (
  message: string,
  httpStatus?: number | undefined
) => ({
  loading: false,
  title: `Error ${httpStatus ? `${String(httpStatus)}` : ""}`,
  message,
  color: "red",
  icon: <IconAlertTriangle size="1.2rem" stroke={2.8} />,
});

export const markAllReadMessage = {
  title: "I have read all",
  message: "All notifications were marked as read",
  color: "growgreen",
  icon: <IconEyeHeart size="1.2rem" stroke={2.8} />,
  loading: false,
};

export const noPostAtThisDay: NotificationProps & {
  message: string;
} = {
  title: "Error",
  message: "Sorry... there is no Update for this day! 😢",
  color: "red",
  icon: <IconCalendarOff size="1.2rem" stroke={2.8} />,
  loading: false,
};

export const likeGrowSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Woohoo... you ❤️ this Grow!",
  color: "growgreen",
  icon: <IconCannabis size="1.2rem" stroke={2.8} />,
  loading: false,
};

export const likeUpdateSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Woohoo... you ❤️ this Update!",
  color: "growgreen",
  icon: <IconCannabis size="1.2rem" stroke={2.8} />,
  loading: false,
};

export const commentSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Woohoo... you commented this Grow! 🥳",
  color: "growgreen",
  icon: <IconCannabis size="1.2rem" stroke={2.8} />,
  loading: false,
};

export const dislikeSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Oh no... you removed your like! 😢",
  color: "growgreen",
  icon: <IconCannabis size="1.2rem" stroke={2.8} />,
  loading: false,
};

export const commentDeletedSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Oh no... you removed your comment! 😢",
  color: "growgreen",
  icon: <IconCannabis size="1.2rem" stroke={2.8} />,
  loading: false,
};

export const setUserNameSuccessfulMsg = (userName: string) => ({
  loading: false,
  title: "Success",
  message: `Username "${userName}" has been updated successfully.`,
  color: "growgreen",
  icon: <IconCannabis size="1.2rem" stroke={2.8} />,
});

export const setUserimageSuccessfulMsg = {
  title: "Success",
  message: "Your user image has been updated successfully! ✅",
  color: "growgreen",
  icon: <IconPhoto size="1.2rem" stroke={2.8} />,
  loading: false,
};

export const likeErrorMsg = (msg: string) => ({
  loading: false,
  title: "Error",
  message: msg,
  color: "red",
  icon: <IconAlertCircle size="1.2rem" stroke={2.8} />,
});

export const createLikeErrorMsg = (msg: string) => ({
  loading: false,
  title: "Error",
  message: msg,
  color: "red",
  icon: <IconAlertCircle size="1.2rem" stroke={2.8} />,
});

export const onlyOnePostPerDayAllowed = {
  title: "Failure",
  message: "You can only post one Update per Grow and Day! 💁",
  color: "red",
  icon: <IconCalendarOff size="1.2rem" stroke={2.8} />,
  loading: false,
};

export const fileUploadErrorMsg = (
  filename: string,
  fileSizeInMB: string,
  uploadMaxSize: string
) => ({
  title: 'Error with "' + filename + '"',
  message: `File size of ${fileSizeInMB} MB exceeds the allowed maximum of ${uploadMaxSize} MB`,
  color: "red",
  icon: <IconFileAlert size="1.2rem" stroke={2.8} />,
  loading: false,
});

export const filesMaxOneErrorMsg = (filesCount: number) => ({
  title: `File count error: The count ${filesCount} exceeds the permitted files count of 1.`,
  message: ` You can only upload one image file as a user avatar.`,
  color: "red",
  icon: <IconFileAlert size="1.2rem" stroke={2.8} />,
  loading: false,
});
