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
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { Locale } from "~/types";

import { api } from "~/utils/api";

function AcceptedTOS() {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { status } = useSession();

  const trpc = api.useUtils();
  const [opened, { open, close }] = useDisclosure(false);

  const theme = useMantineTheme();
  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );

  // fetch current TOS
  const {
    data: currentTOS,
    isLoading: currentTOSIsLoading,
    isSuccess: currentTOSIsLoaded,
  } = api.tos.getCurrentTos.useQuery();

  // fetch if user has accepted current TOS
  const {
    data: hasAcceptedCurrentTOS,
    isLoading: hasAcceptedCurrentTOSIsLoading,
    isSuccess: hasAcceptedCurrentTOSIsLoaded,
  } = api.user.hasAcceptedCurrentTOS.useQuery();

  // procedure to accept current TOS
  const {
    mutate: acceptCurrentTOS,
    isLoading: acceptCurrentTOSIsLoading,
    isSuccess: acceptCurrentTOSIsLoaded,
  } = api.user.acceptCurrentTOS.useMutation({
    onError: (error) => {
      console.error(error);
      notifications.show(
        httpStatusErrorMsg(error.message, error.data?.httpStatus)
      );
    },
    onSuccess: async () => {
      //await update();
      await trpc.user.hasAcceptedCurrentTOS.refetch();
      notifications.show(acceptedcurrentTOSMsg);
    },
    onSettled: () => {
      acceptTOSForm.reset();
    },
  });

  const acceptTOSForm = useForm({
    initialValues: {
      acceptTOS: false,
    },
    validate: zodResolver(
      z.object({
        acceptTOS: z.boolean().refine((value) => value === true, {
          message: String(
            t("common:app-impressum-tos-accept-continue")
          ),
        }),
      })
    ),
    validateInputOnChange: false,
    validateInputOnBlur: false,
  });

  useEffect(() => {
    if (status === "authenticated") {
      if (
        !hasAcceptedCurrentTOSIsLoading &&
        hasAcceptedCurrentTOSIsLoaded &&
        !hasAcceptedCurrentTOS
      ) {
        open();
      } else if (
        !acceptCurrentTOSIsLoading &&
        acceptCurrentTOSIsLoaded &&
        !hasAcceptedCurrentTOSIsLoading &&
        hasAcceptedCurrentTOSIsLoaded &&
        hasAcceptedCurrentTOS
      ) {
        close();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasAcceptedCurrentTOS,
    acceptCurrentTOSIsLoaded,
    acceptCurrentTOSIsLoading,
    hasAcceptedCurrentTOSIsLoaded,
    hasAcceptedCurrentTOSIsLoading,
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
            {t("common:app-impressum-tos-using-continue")}
          </Text>
        </Box>
        <form
          onSubmit={acceptTOSForm.onSubmit(() => {
            acceptCurrentTOS();
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
              label={t("common:app-impressum-tos-checkbox-text")}
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
