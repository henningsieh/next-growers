import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Modal,
  Text,
  Title,
  TypographyStylesProvider,
  useMantineTheme,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { z } from "zod";
import { acceptedcurrentTOSMsg, httpStatusErrorMsg } from "~/messages";

import { useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Locale } from "~/types";

import { api } from "~/utils/api";

function AcceptedTOS() {
  const router = useRouter();
  const { locale: activeLocale } = router;

  const { status, update } = useSession();

  const trpc = api.useUtils();
  const [opened, { open, close }] = useDisclosure(false);

  const theme = useMantineTheme();
  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );

  const {
    data: hasAcceptedCurrentTOS,
    isLoading: hasAcceptedCurrentTOSIsLoading,
    isSuccess: hasAcceptedCurrentTOSIsLoaded,
  } = api.user.hasAcceptedCurrentTOS.useQuery();

  const {
    data: currentTOS,
    isLoading: currentTOSIsLoading,
    isSuccess: currentTOSIsLoaded,
  } = api.tos.getCurrentTos.useQuery();

  const {
    mutate: acceptCurrentTOS,
    isLoading: acceptCurrentTOSIsLoading,
  } = api.user.acceptCurrentTOS.useMutation({
    onError: (error) => {
      console.error(error);
      notifications.show(
        httpStatusErrorMsg(error.message, error.data?.httpStatus)
      );
    },
    onSuccess: async () => {
      await update();
      await trpc.user.hasAcceptedCurrentTOS.refetch();
      notifications.show(acceptedcurrentTOSMsg);
    },
    onSettled: () => {
      close();
      acceptTOSForm.reset();
    },
  });

  function acceptCurrentTOSClick() {
    acceptCurrentTOS();
  }

  const acceptTOSForm = useForm({
    initialValues: {
      acceptTOS: false,
    },
    validate: zodResolver(
      z.object({
        acceptTOS: z.boolean().refine((value) => value === true, {
          message: "You have to agree with the TOS to continue",
        }),
      })
    ),
    validateInputOnChange: false,
    validateInputOnBlur: false,
  });

  useEffect(() => {
    if (
      status === "authenticated" &&
      !hasAcceptedCurrentTOS &&
      !hasAcceptedCurrentTOSIsLoading &&
      hasAcceptedCurrentTOSIsLoaded
    ) {
      open();
    } else {
      !acceptCurrentTOSIsLoading && close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    close,
    status,
    // acceptTOSForm, //no Mantine Form in dependencies
    hasAcceptedCurrentTOS,
    hasAcceptedCurrentTOSIsLoading,
    hasAcceptedCurrentTOSIsLoaded,
    acceptCurrentTOSIsLoading,
  ]);

  return (
    <>
      <Modal
        size="xl"
        fullScreen={smallScreen}
        opened={!currentTOSIsLoading && currentTOSIsLoaded && opened}
        onClose={() => {}}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        // scrollAreaComponent={(props) => (
        //   <ScrollArea
        //     {...props}
        //     style={
        //       {
        //         // padding: theme.spacing.md,
        //         // overflowY: "auto",
        //         // height: "100%",
        //       }
        //     }
        //   />
        // )}
        transitionProps={{
          transition: "fade",
          duration: 600,
          timingFunction: "linear",
        }}
      >
        <Title order={1}>
          {activeLocale === Locale.DE
            ? "Nutzungsbedingungen (AGB)"
            : "Terms of Service (TOS)"}
        </Title>

        <TypographyStylesProvider>
          <Box
            dangerouslySetInnerHTML={{
              __html:
                activeLocale === Locale.DE
                  ? (currentTOS?.html_de as string)
                  : (currentTOS?.html_en as string),
            }}
          />
        </TypographyStylesProvider>
        <Divider my="sm" variant="dashed" />
        <Box my="xl">
          <Text fz="md" fw="bold">
            {activeLocale === Locale.DE
              ? "Durch die Nutzung der Plattform stimme ich diesen Nutzungsbedingungen zu."
              : "By using the platform, I agree to these Terms of Service.."}
          </Text>
        </Box>
        <form
          onSubmit={acceptTOSForm.onSubmit(() => {
            acceptCurrentTOSClick();
          })}
        >
          <Flex gap="md" align="top" justify="space-between">
            <Checkbox
              sx={{
                input: {
                  "&:focus": {
                    borderColor: theme.colors.growgreen[4],
                  },
                },
              }}
              error={acceptTOSForm.errors.acceptTOS}
              checked={acceptTOSForm.values.acceptTOS}
              onChange={(event) =>
                acceptTOSForm.setFieldValue(
                  "acceptTOS",
                  event.currentTarget.checked
                )
              }
              label={
                activeLocale === Locale.DE
                  ? "Ich habe die Nutzungsbedingungen gelesen und stimme diesen zu."
                  : "I have read and will agree with these Terms of Service."
              }
            />

            <Button
              w={160}
              type="submit"
              variant="filled"
              color="growgreen"
              loading={acceptCurrentTOSIsLoading}
            >
              Accept
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
}

export default AcceptedTOS;
