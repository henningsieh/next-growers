import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Indicator,
  createStyles,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { Paper } from "@mantine/core";
import { Transition } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconBell,
  IconCheck,
  IconHeartFilled,
} from "@tabler/icons-react";
import { IconEyeCheck } from "@tabler/icons-react";
import { hasUnreadNotifications } from "~/helpers";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

import { useSession } from "next-auth/react";
import Link from "next/link";

import type { NotificationEventMap } from "~/types";
import type { Notifications } from "~/types";

import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  like: {
    color: theme.colors.red[8],
    marginTop: "2px",
  },
}));

const ProtectedNotifications = () => {
  const [open, setOpen] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";
  const clickOutsidePaper = useClickOutside(() => setOpen(false));
  const { data: session, status } = useSession();
  const trpc = api.useUtils();

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
        console.error(error);
        // Handle error, e.g., show an error message
      },
      onSuccess: () => {
        toast.success("markNotificationAsRead!");
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

  const markAllReadMessage = {
    title: "Success",
    message: "All notifications have been marked as read",
    color: "green",
    icon: <IconCheck />,
    loading: false,
  };

  const notificationEvents: Record<NotificationEventMap, string> = {
    LIKE_CREATED: "likes",
    COMMENT_CREATED: "has commented on",
    POST_CREATED: "Post Created",
    REPORT_CREATED: "Report Created",
  };

  return (
    <Box style={{ position: "relative" }}>
      {/* Notification Icon */}
      <ActionIcon
        className="cursor-default"
        onClick={() => setOpen(!open)}
        title="Notifications"
        style={{ position: "relative" }}
        size={32}
        variant="outline"
        color={dark ? "orange" : "growgreen"}
      >
        {hasUnreadNotifications(
          notificationsFromDb as Notifications
        ) ? (
          <Indicator
            color={theme.colors.pink[7]}
            position="bottom-end"
            size={16}
            withBorder
            processing
          >
            <IconBell size="1.5rem" stroke={2.2} />
          </Indicator>
        ) : (
          <IconBell size="1.5rem" stroke={2.2} />
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
            className={`rounded p-0 text-right`}
            style={{
              position: "absolute",
              right: -2,
              top: "calc(100%  + 6px)",
              ...transitionStyles,
            }}
          >
            <Container miw={300} p={4}>
              <Box className="space-y-1">
                {!isLoading &&
                !isError &&
                notificationsFromDb?.length ? (
                  notificationsFromDb.map((notification) => (
                    <Box
                      onClick={() => {
                        handleMarkNotificationAsRead(notification.id);
                      }}
                      p={2}
                      // my={4}
                      key={notification.id}
                      sx={(theme) => ({
                        backgroundColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[6]
                            : theme.colors.gray[1],
                        textAlign: "center",
                        // padding: theme.spacing.xl,
                        borderRadius: theme.radius.xs,
                        cursor: "pointer",

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
                          notification.event === "COMMENT_CREATED" &&
                          notification.commentId != null
                            ? `/grow/${
                                notification.comment?.post
                                  ?.reportId as string
                              }/update/${
                                notification.comment?.postId as string
                              }#${notification.commentId}`
                            : // handle Like hrefs
                            notification.like?.commentId != null
                            ? `/grow/${
                                notification.like.comment?.post
                                  ?.reportId as string
                              }/update/${
                                notification.like.comment
                                  ?.postId as string
                              }#${notification.like.commentId}`
                            : notification.like?.postId == null
                            ? `/grow/${
                                notification.like?.reportId as string
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
                              size="1.2rem"
                              className={`${classes.like} icon-transition`}
                            />
                          </Center>
                          <Box p={4} fz="0.78rem" className="text-left">
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
                                mt={0}
                                pt={0}
                                fz={8}
                                size="xs"
                                variant="filled"
                                color="pink"
                              >
                                new
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
                {/* <Boxider /> */}
                {!isLoading &&
                  !isError &&
                  notificationsFromDb?.length > 0 && (
                    <Button
                      onClick={() => {
                        handleMarkAllNotificationsAsRead();
                      }}
                      // fullWidth
                      px="sm"
                      my={4}
                      mr={0}
                      size="xs"
                      variant="outline"
                      radius="xs"
                      style={{ flex: 1 }}
                    >
                      <IconEyeCheck
                        className="ml-0 mr-0"
                        height={18}
                        stroke={1.5}
                      />
                      mark all as read
                    </Button>
                  )}
                {/* 
                <NavLink
                  label="Active filled"
                  icon={<IconActivity size="1rem" stroke={1.5} />}
                  rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
                  variant="filled"
                  active
                /> */}
              </Box>
            </Container>
          </Paper>
        )}
      </Transition>
    </Box>
  );
};

export default ProtectedNotifications;
