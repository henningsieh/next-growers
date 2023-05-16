import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Indicator,
  createStyles,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconBell, IconHeartFilled } from "@tabler/icons-react";
import React, { useState } from "react";

import { IconEyeCheck } from "@tabler/icons-react";
import Link from "next/link";
import type { NotificationEventMap } from "~/types";
import { Paper } from "@mantine/core";
import { Transition } from "@mantine/core";
import { api } from "~/utils/api";
import { useClickOutside } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  like: {
    color: theme.colors.red[8],
    marginTop: "2px",
  },
}));

const Notifications = () => {
  // FETCH ALL REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: notifications,
    isLoading,
    isError,
  } = api.notifications.getNotificationsByUserId.useQuery();
  console.debug(notifications);

  const [open, setOpen] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";
  const clickOutsidePaper = useClickOutside(() => setOpen(false));

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
          onClick={() => setOpen(!open)}
          // onBlur={() => setOpen(false)}
          title="Notifications"
          style={{ position: "relative" }}
          size={32}
          variant="outline"
          color={dark ? theme.colors.pink[5] : "gray"}
        >
          <Indicator
            color={theme.colors.pink[7]}
            position="bottom-end"
            size={16}
            withBorder
            processing
          >
            <IconBell
              color={theme.primaryColor}
              // className="cursor-default"
              size="1.5rem"
              stroke={1.5}
            />
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
                {!isLoading && !isError && notifications?.length ? (
                  notifications.map((notification) => (
                    <Box
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
                        href={`/reports/${
                          notification.like?.reportId as string
                        }`}
                      >
                        <div style={{ display: "flex" }}>
                          <Center>
                            <IconHeartFilled
                              size="1.2rem"
                              className={`${classes.like} icon-transition`}
                            />
                          </Center>
                          <Box p={4} fz="0.8rem" className="grow text-left">
                            {notification.like?.user.name}{" "}
                            {notificationEvents[notification.event]}
                            {" your "}
                            Report
                          </Box>
                          <Center>
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
                          </Center>
                        </div>
                      </Link>
                    </Box>
                  ))
                ) : (
                  <p>No notifications</p>
                )}
                {/* <Divider /> */}
                {!isLoading && !isError && notifications?.length > 0 && (
                  <Button
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
    </div>
  );
};

export default Notifications;
