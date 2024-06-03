import type { NotificationProps } from "@mantine/core";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCalendarOff,
  IconCannabis,
  IconDeviceFloppy,
  IconEyeHeart,
  IconFileAlert,
  IconPhoto,
  IconPhotoCancel,
} from "@tabler/icons-react";

import { getFileUploadCloudinaryMaxFileSize } from "~/utils/helperUtils";

export const httpStatusErrorMsg = (
  message: string,
  httpStatus?: number | undefined,
  autoClose?: boolean | undefined
) => ({
  loading: false,
  title: `Error ${httpStatus ? `${String(httpStatus)}` : ""}`,
  message,
  color: "red",
  autoClose,
  icon: <IconAlertTriangle size="1.2rem" stroke={2.8} />,
});

export const defaultErrorMsg = (msg: string) => ({
  loading: false,
  title: "Error",
  message: msg,
  color: "red",
  icon: <IconAlertCircle size="1.2rem" stroke={2.8} />,
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

export const saveGrowSuccessfulMsg = {
  title: "Success",
  message: "Your Grow has been saved successfully! ✅",
  color: "growgreen",
  icon: <IconDeviceFloppy size="1.2rem" stroke={2.8} />,
  loading: false,
};

export const savePostSuccessfulMsg = {
  title: "Success",
  message: "Your update has been saved successfully! ✅",
  color: "growgreen",
  icon: <IconDeviceFloppy size="1.2rem" stroke={2.8} />,
  loading: false,
};

export const deletePostSuccessfulMsg = {
  title: "Success",
  message: "Your update has been deletet successfully! ✅",
  color: "growgreen",
  icon: <IconPhotoCancel size="1.2rem" stroke={2.8} />,
  loading: false,
};

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

export const fileUploadMaxFileSizeErrorMsg = (
  filename: string,
  fileSizeInMB: number
) => ({
  title: 'Error with "' + filename + '"',
  message: `File size of ${fileSizeInMB} MB exceeds the allowed maximum of ${getFileUploadCloudinaryMaxFileSize().toFixed(2)} MB`,
  color: "red",
  icon: <IconFileAlert size="1.2rem" stroke={2.8} />,
  loading: false,
});

export const fileUploadMaxFileCountErrorMsg = (
  filesCount: number,
  maxFilesCount: number
) => ({
  title: `File count error: The count ${filesCount} exceeds the permitted files count of ${maxFilesCount}.`,
  message: `You can only upload ${maxFilesCount} image files at once.`,
  color: "red",
  icon: <IconFileAlert size="1.2rem" stroke={2.8} />,
  loading: false,
});
