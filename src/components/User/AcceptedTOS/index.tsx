import {
  Box,
  Button,
  Checkbox,
  Modal,
  ScrollArea,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { acceptedcurrentTOSMsg, httpStatusErrorMsg } from "~/messages";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import { api } from "~/utils/api";

function AcceptedTOS() {
  const { data: session, status, update } = useSession();

  const [checked, setChecked] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  // retrieve via TRPC if user has accepted TOS

  // tRPC procedure to check if user has accepted current TOS
  const {
    data: hasAcceptedCurrentTOS,
    isLoading: hasAcceptedCurrentTOSIsLoading,
    // isSuccess: isFollowingUserIsSuccess,
    // isError: isFollowingUserIsError,
    // error: isFollowingUserError,
  } = api.user.hasAcceptedCurrentTOS.useQuery();

  // tRPC procedure to retrieve current TOS
  const {
    data: currentTOS,
    isLoading: currentTOSIsLoading,
    isSuccess: currentTOSIsLoaded,
    // isError: isFollowingUserIsError,
    // error: isFollowingUserError,
  } = api.tos.getCurrentTos.useQuery();

  // tRPC procedure to accept current TOS
  //const userWithAcceptedTOS = api.user.acceptCurrentTOS.useMutation();
  const {
    mutate: acceptCurrentTOS,
    isLoading: acceptCurrentTOSIsLoading,
  } = api.user.acceptCurrentTOS.useMutation({
    onError: (error) => {
      // Handle error, show an error message
      console.error(error);
      notifications.show(
        httpStatusErrorMsg(error.message, error.data?.httpStatus)
      );
    },
    onSuccess: async () => {
      await update(); // Show a success message
      console.debug(session?.user);
      notifications.show(acceptedcurrentTOSMsg);
    },
    onSettled: () => {
      close(); // Close the modal
    },
  });

  function acceptCurrentTOSClick() {
    acceptCurrentTOS();
  }

  useEffect(() => {
    console.debug(hasAcceptedCurrentTOS);
    if (
      status === "authenticated" &&
      !hasAcceptedCurrentTOSIsLoading &&
      hasAcceptedCurrentTOS === false
    ) {
      open();
    } else {
      close();
    }
  }, [
    hasAcceptedCurrentTOS,
    hasAcceptedCurrentTOSIsLoading,
    open,
    close,
    session,
    status,
  ]);

  return (
    <>
      <Modal
        h={"50%"}
        size="xl"
        opened={!currentTOSIsLoading && currentTOSIsLoaded && opened}
        onClose={() => {}}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        scrollAreaComponent={ScrollArea.Autosize}
        transitionProps={{
          transition: "fade",
          duration: 600,
          timingFunction: "linear",
        }}
      >
        <Title order={1}>TOS (Terms of Service)</Title>

        <TypographyStylesProvider>
          <Box
            dangerouslySetInnerHTML={{
              __html: currentTOS?.html || "",
            }}
          />
        </TypographyStylesProvider>
        <Checkbox
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
        <Button
          onClick={() => acceptCurrentTOSClick()}
          loading={acceptCurrentTOSIsLoading}
        >
          Close
        </Button>
      </Modal>
      ;
    </>
  );
}

export default AcceptedTOS;
