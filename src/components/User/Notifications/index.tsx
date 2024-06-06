import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  createStyles,
  Flex,
  Group,
  Indicator,
  Paper,
  ScrollArea,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconBell,
  IconBellOff,
  IconEyeHeart,
  IconHeartFilled,
} from "@tabler/icons-react";
import { defaultErrorMsg, markAllReadMessage } from "~/messages";

import { useState } from "react";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

import type { NotificationEventMap, Notifications } from "~/types";

import { api } from "~/utils/api";
import { hasUnreadNotifications } from "~/utils/helperUtils";

const useStyles = createStyles((theme) => ({
  like: {
    color: theme.colors.red[8],
    marginTop: "2px",
  },
}));

const ProtectedNotifications = () => {
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles();
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);

  const trpc = api.useUtils();
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const theme = useMantineTheme();
  const dark = colorScheme === "dark";
  const clickOutsidePaper = useClickOutside(() => setOpen(false));

  const closeLabel = t("common:app-notifications-close-button");
  const haveReadLabel = t(
    "common:app-notifications-mark-all-read-button"
  );

  // FETCH ALL REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: notificationsFromDb,
    isLoading,
    isError,
  } = api.notifications.getNotificationsByUserId.useQuery();

  // console.debug("notificationsFromDb", notificationsFromDb);

  const { mutate: markAllNotificationsAsReadMutation } =
    api.notifications.markAllNotificationsAsRead.useMutation({
      onError: (error) => {
        console.error(error);
        // Handle error, e.g., show an error message
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onSuccess: (_res) => {
        notifications.show(markAllReadMessage);
      },
      onSettled: async () => {
        // Trigger any necessary refetch or invalidation, e.g., refetch the report data
        await trpc.notifications.getNotificationsByUserId.invalidate();
      },
    });

  const { mutate: markNotificationAsReadMutation } =
    api.notifications.markNotificationAsRead.useMutation({
      onError: (error) => {
        notifications.show(defaultErrorMsg(error.message));
      },
      onSuccess: () => {
        // no user message when clicking on a notification
      },
      onSettled: async () => {
        // Trigger any necessary refetch or invalidation, e.g., refetch the report data
        await trpc.notifications.getNotificationsByUserId.invalidate();
      },
    });

  const handleMarkAllNotificationsAsRead = () => {
    // Ensure that the user is authenticated
    // Call the likeReport mutation
    if (!!session && status === "authenticated")
      markAllNotificationsAsReadMutation();
  };
  const handleMarkNotificationAsRead = (notidicationId: string) => {
    // Ensure that the user is authenticated
    // Call the likeReport mutationnotification.id
    if (!!session && status === "authenticated")
      markNotificationAsReadMutation(notidicationId);
  };

  const notificationEvents: Record<NotificationEventMap, string> = {
    REPORT_CREATED: "Report Created",
    POST_CREATED: "Post Created",
    LIKE_CREATED: "likes",
    COMMENT_CREATED: "has commented on",
    COMMENT_ANSWERED: "has responded to",
  };

  return (
    <Box style={{ position: "relative" }}>
      {/* Notification Bell */}
      <ActionIcon
        className="cursor-default"
        onClick={() => setOpen(!open)}
        title="Notifications"
        style={{ position: "relative" }}
        size={32}
        variant="subtle"
        color={dark ? "orange.6" : "growgreen.5 "}
      >
        {hasUnreadNotifications(
          notificationsFromDb as Notifications
        ) ? (
          <Indicator
            color={
              theme.colorScheme === "dark"
                ? theme.colors.growgreen[4]
                : theme.colors.groworange[3]
            }
            position="bottom-end"
            size={18}
            withBorder
            processing
          >
            <IconBell size={28} stroke={1.8} />
          </Indicator>
        ) : (
          <IconBell size={28} stroke={1.8} />
        )}
      </ActionIcon>

      {/* Dropdown */}
      <Transition
        transition="pop-top-right"
        duration={150}
        mounted={open}
        onExit={() => setOpen(false)}
      >
        {(transitionStyles) => (
          <Paper
            ref={clickOutsidePaper}
            withBorder
            shadow="md"
            mt="sm"
            className={"absolute rounded top-9 -right-2 text-right"}
            style={{
              // position: "absolute",
              // right: -8,
              // // top: "calc(100%  + 6px)",
              ...transitionStyles,
            }}
          >
            {/* Alle Gelesen Button */}
            {!isLoading &&
              !isError &&
              notificationsFromDb?.length > 0 && (
                <Box p={3}>
                  <Group grow spacing="xs">
                    <Button
                      compact
                      fz={"xs"}
                      variant="filled"
                      title="Mark all notifications as read"
                      onClick={() => {
                        handleMarkAllNotificationsAsRead();
                      }}
                      leftIcon={<IconEyeHeart size={18} stroke={1.8} />}
                    >
                      {haveReadLabel}
                    </Button>
                    <Button
                      compact
                      fz={"xs"}
                      variant="filled"
                      color="dark"
                      onClick={() => void setOpen(false)}
                      leftIcon={<IconBellOff size={16} stroke={1.8} />}
                    >
                      {closeLabel}
                    </Button>
                  </Group>
                </Box>
              )}
            <ScrollArea h={460} miw={300}>
              <Box p={3} className="space-y-1">
                {!isLoading &&
                !isError &&
                notificationsFromDb?.length ? (
                  notificationsFromDb.map((notification) => (
                    <Box
                      onClick={() => {
                        handleMarkNotificationAsRead(notification.id);
                        setOpen(false);
                      }}
                      p={2}
                      // my={4}
                      key={notification.id}
                      sx={(theme) => ({
                        cursor: "pointer",
                        textAlign: "center",
                        borderRadius: theme.radius.sm,
                        backgroundColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[6]
                            : theme.colors.gray[1],

                        "&:hover": {
                          backgroundColor:
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[5]
                              : theme.colors.gray[2],
                        },
                      })}
                    >
                      <Link
                        scroll={false}
                        href={
                          // handle Comment hrefs
                          (notification.event === "COMMENT_CREATED" ||
                            notification.event ===
                              "COMMENT_ANSWERED") &&
                          notification.commentId != null
                            ? `/grow/${
                                notification.comment?.post
                                  ?.reportId as string
                              }/update/${
                                notification.comment?.postId as string
                              }#${notification.commentId}`
                            : notification.like?.commentId != null
                              ? `/grow/${
                                  notification.like.comment?.post
                                    ?.reportId as string
                                }/update/${
                                  notification.like.comment
                                    ?.postId as string
                                }#${notification.like.commentId}`
                              : notification.like?.postId == null
                                ? `/grow/${
                                    notification.like
                                      ?.reportId as string
                                  }`
                                : `/grow/${
                                    notification.like?.post
                                      ?.reportId as string
                                  }/update/${notification.like?.postId}`
                        }
                      >
                        <Box style={{ display: "flex" }}>
                          <Center>
                            <IconHeartFilled
                              size={20}
                              className={`${classes.like} icon-transition`}
                            />
                          </Center>
                          <Box p={4} fz="0.78rem" className="text-left">
                            {notification.event ===
                              "COMMENT_ANSWERED" && (
                              <>
                                {notification.comment?.author.name}{" "}
                                {notificationEvents[notification.event]}{" "}
                                {"a"} {"Comment"}
                              </>
                            )}
                            {notification.event ===
                              "COMMENT_CREATED" && (
                              <>
                                {notification.comment?.author.name}{" "}
                                {notificationEvents[notification.event]}{" "}
                                {"your"}{" "}
                                {notification.comment?.postId == null
                                  ? "Grow"
                                  : "Update"}
                              </>
                            )}
                            {notification.event === "LIKE_CREATED" && (
                              <>
                                {notification.like?.user.name}{" "}
                                {notificationEvents[notification.event]}{" "}
                                {"your"}{" "}
                                {notification.like?.commentId != null
                                  ? "Comment"
                                  : notification.like?.postId == null
                                    ? "Grow"
                                    : "Update"}
                              </>
                            )}
                          </Box>
                          <Flex
                            pt={2}
                            pl={8}
                            justify="flex-end"
                            align="flex-start"
                          >
                            {!notification.readAt && (
                              <Badge
                                fz={8}
                                size="xs"
                                variant="filled"
                                sx={(theme) => ({
                                  backgroundColor:
                                    theme.colorScheme === "dark"
                                      ? theme.colors.growgreen[5]
                                      : theme.colors.growgreen[3],
                                })}
                              >
                                NEW ⭐
                              </Badge>
                            )}
                          </Flex>
                        </Box>
                      </Link>
                    </Box>
                  ))
                ) : (
                  <p>No notifications</p>
                )}
              </Box>
            </ScrollArea>
          </Paper>
        )}
      </Transition>
    </Box>
  );
};

export default ProtectedNotifications;
