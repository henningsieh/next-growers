import type { NotificationProps } from "@mantine/core";
import {
  IconCannabis,
  IconError404,
  IconLogin,
} from "@tabler/icons-react";

export const createLikeErrorMsg = (msg: string) => ({
  loading: false,
  title: "Error",
  message: msg,
  color: "red",
  icon: <IconError404 />,
});
export const likeSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Woohoo... you ❤️ this Grow!",
  color: "green",
  icon: <IconCannabis />,
  loading: false,
};
export const dislikeSuccessfulMsg: NotificationProps & {
  message: string;
} = {
  title: "Success",
  message: "Oh no... you removed your Like! 😢",
  color: "green",
  icon: <IconCannabis />,
  loading: false,
};
export const likeErrorMsg = (msg: string) => ({
  loading: false,
  title: "Error",
  message: msg,
  color: "red",
  icon: <IconLogin />,
});
