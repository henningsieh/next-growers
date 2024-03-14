import { Notification } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

import React from "react";

type PropsType = {
  title: string;
  text: string;
  opened: boolean;
};

export default function AppNotification({
  opened,
  title,
  text,
}: PropsType) {
  return (
    <>
      <Notification
        className={`
        fixed        
        right-1
        min-w-min ${
          opened
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }  transition-all duration-500 ease-in-out`}
        icon={<IconCheck size="1.2rem" />}
        withCloseButton={false}
        withBorder
        color="green"
        title={title}
      >
        {text}
      </Notification>
      <p></p>
    </>
  );
}
