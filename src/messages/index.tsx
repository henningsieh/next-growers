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
  IconUserMinus,
  IconUserPlus,
} from "@tabler/icons-react";

import { getFileUploadCloudinaryMaxFileSizeInByte } from "~/utils/helperUtils";

export const httpStatusErrorMsg = (
  message: string,
  httpStatus?: number | string | undefined,
  autoClose?: boolean | undefined
) => ({
  loading: false,
  title: `Error ${httpStatus ? `${String(httpStatus)}` : "500"}`,
  message,
  color: "red",
  autoClose,
  icon: <IconAlertTriangle size={20} stroke={2.8} />,
});

export const defaultErrorMsg = (msg: string) => ({
  loading: false,
  title: "Error",
  message: msg,
  color: "red",
  icon: <IconAlertCircle size={20} stroke={2.8} />,
});

export const acceptedcurrentTOSMsg = {
  title: "Success",
  message: "You have accepted the current TOS",
  color: "growgreen",
  icon: <IconCannabis size={20} stroke={2.8} />,
  loading: false,
};

export const followUserSuccessfulMsg = {
  title: "Success",
  message: "You are now following this user! 🥳",
  color: "growgreen",
  icon: <IconUserPlus size={20} stroke={2.8} />,
  loading: false,
};

export const unfollowUserSuccessfulMsg = {
  title: "Success",
  message: "You are no longer following this user! 😢",
  color: "growgreen",
  icon: <IconUserMinus size={20} stroke={2.8} />,
  loading: false,
};

export const markAllReadMessage = {
  title: "I have read all",
  message: "All notifications were marked as read",
  color: "growgreen",
  icon: <IconEyeHeart size={20} stroke={2.8} />,
  loading: false,
};

export const noPostAtThisDay: NotificationProps & {
  message: string;
} = {
  title: "Error",
  message: "Sorry... there is no Update for this day! 😢",
  color: "red",
  icon: <IconCalendarOff size={20} stroke={2.8} />,
  loading: false,
};

export const likeGrowSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Woohoo... you ❤️ this Grow!",
  color: "growgreen",
  icon: <IconCannabis size={20} stroke={2.8} />,
  loading: false,
};

export const likeUpdateSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Woohoo... you ❤️ this Update!",
  color: "growgreen",
  icon: <IconCannabis size={20} stroke={2.8} />,
  loading: false,
};

export const commentSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Woohoo... you commented this Grow! 🥳",
  color: "growgreen",
  icon: <IconCannabis size={20} stroke={2.8} />,
  loading: false,
};

export const dislikeSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Oh no... you removed your like! 😢",
  color: "growgreen",
  icon: <IconCannabis size={20} stroke={2.8} />,
  loading: false,
};

export const commentDeletedSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Oh no... you removed your comment! 😢",
  color: "growgreen",
  icon: <IconCannabis size={20} stroke={2.8} />,
  loading: false,
};

export const setUserNameSuccessfulMsg = (userName: string) => ({
  loading: false,
  title: "Success",
  message: `Username "${userName}" has been updated successfully.`,
  color: "growgreen",
  icon: <IconCannabis size={20} stroke={2.8} />,
});

export const setUserimageSuccessfulMsg = {
  title: "Success",
  message: "Your user image has been updated successfully! ✅",
  color: "growgreen",
  icon: <IconPhoto size={20} stroke={2.8} />,
  loading: false,
};

export const saveGrowSuccessfulMsg = {
  title: "Success",
  message: "Your Grow has been saved successfully! ✅",
  color: "growgreen",
  icon: <IconDeviceFloppy size={20} stroke={2.8} />,
  loading: false,
};

export const savePostSuccessfulMsg = {
  title: "Success",
  message: "Your update has been saved successfully! ✅",
  color: "growgreen",
  icon: <IconDeviceFloppy size={20} stroke={2.8} />,
  loading: false,
};

export const deletePostSuccessfulMsg = {
  title: "Success",
  message: "Your update has been deletet successfully! ✅",
  color: "growgreen",
  icon: <IconPhotoCancel size={20} stroke={2.8} />,
  loading: false,
};

export const createLikeErrorMsg = (msg: string) => ({
  loading: false,
  title: "Error",
  message: msg,
  color: "red",
  icon: <IconAlertCircle size={20} stroke={2.8} />,
});

export const onlyOnePostPerDayAllowed = {
  title: "Failure",
  message: "You can only post one Update per Grow and Day! 💁",
  color: "red",
  icon: <IconCalendarOff size={20} stroke={2.8} />,
  loading: false,
};

export const fileUploadMaxFileSizeErrorMsg = (
  filename: string,
  fileSizeInByte: number
) => ({
  title: 'Error with "' + filename + '"',
  message: `File size of ${fileSizeInByte.toFixed(2)} MB exceeds the allowed maximum \
            of ${(getFileUploadCloudinaryMaxFileSizeInByte() / 1024 ** 2).toFixed(2)} MB`,
  color: "red",
  icon: <IconFileAlert size={20} stroke={2.8} />,
  loading: false,
});

export const fileUploadMaxFileCountErrorMsg = (
  filesCount: number,
  maxFilesCount: number
) => ({
  title: `File count error: The count ${filesCount} exceeds the permitted files count of ${maxFilesCount}.`,
  message: `You can only upload ${maxFilesCount} image files at once.`,
  color: "red",
  icon: <IconFileAlert size={20} stroke={2.8} />,
  loading: false,
});
