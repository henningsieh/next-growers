import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Indicator,
  NavLink,
  Space,
  createStyles,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconActivity,
  IconBell,
  IconCircleOff,
  IconGauge,
  IconHeartFilled,
  IconHome,
  IconHome2,
  IconNews,
} from "@tabler/icons-react";
import React, { useState } from "react";

import { IconChevronRight } from "@tabler/icons-react";
import { IconEyeCheck } from "@tabler/icons-react";
import { IconHeart } from "@tabler/icons-react";
import Link from "next/link";
import { NotificationEventMap } from "~/types";
import { Paper } from "@mantine/core";
import { Transition } from "@mantine/core";
import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  like: {
    color: theme.colors.red[6],
    transition: "transform 0.3s ease-in-out",
  },
}));

const Notifications = () => {
  const { classes } = useStyles();
  // FETCH ALL REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: notifications,
    isLoading,
    isError,
  } = api.notifications.getNotificationsByUserId.useQuery();
  console.debug(notifications);
  const [open, setOpen] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";

  const notificationEvents: Record<NotificationEventMap, string> = {
    LIKE_CREATED: "likes",
    COMMENT_CREATED: "Comment Created",
    POST_CREATED: "Post Created",
    REPORT_CREATED: "Report Created",
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Notification Icon */}
      <Box>
        <ActionIcon
          style={{ position: "relative" }}
          className="cursor-default"
          size={32}
          variant="outline"
          onClick={() => setOpen(!open)}
          color={dark ? theme.colors.pink[5] : "gray"}
        >
          <Indicator
            color="orange"
            position="bottom-end"
            size={16}
            withBorder
            processing
          >
            <IconBell size="1.4rem" />
          </Indicator>
        </ActionIcon>
      </Box>

      {/* Dropdown */}
      <Transition
        transition="pop-top-right"
        duration={150}
        mounted={open}
        onExit={() => setOpen(false)}
      >
        {(transitionStyles) => (
          <Paper
            withBorder
            shadow="md"
            mt="sm"
            className={`rounded p-0 text-right`}
            style={{
              position: "absolute",
              right: -2,
              top: "calc(100% - 4px)",
              ...transitionStyles,
            }}
          >
            <Container miw={280} p={4} className="space-y-1">
              <Box>
                {!isLoading && notifications?.length ? (
                  notifications.map((notification) => (
                    <Box
                      p={2}
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
                      <div style={{ display: "flex" }}>
                        <Box p={4}>
                          <IconHeartFilled
                            size="1.1rem"
                            className={`${classes.like} icon-transition`}
                          />
                        </Box>
                        <Box p={4} fz="0.8rem" className="grow text-left">
                          {notification.like?.user.name}{" "}
                          {notificationEvents[notification.event]}
                          {" your "}
                          <Link
                            href={`/reports/${
                              notification.like?.reportId as string
                            }`}
                          >
                            Report
                          </Link>
                        </Box>{" "}
                        <Badge size="xs" color="orange" variant="filled">
                          new
                        </Badge>
                      </div>
                    </Box>
                  ))
                ) : (
                  <p>No notifications</p>
                )}
                {/* <Divider /> */}
                <Button
                  fullWidth
                  px="sm"
                  my={4}
                  mr={2}
                  size="xs"
                  className="border-orange-600"
                  variant="default"
                  radius="xs"
                  style={{ flex: 1 }}
                >
                  <IconEyeCheck className="mr-1" height={18} stroke={1.5} />
                  mark read
                </Button>
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
    </div>
  );
};

export default Notifications;
