// LoginModal.tsx
import LoginForm from "./LoginForm";
import { Box, Checkbox, Modal, Space, Text } from "@mantine/core";
import { Alert, Divider } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons-react";
import { z } from "zod";

import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

interface LoginModalProps {
  opened: boolean;
  close: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  opened,
  close: closeLoginModal,
}) => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

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

  return (
    <Modal
      opened={opened}
      onClose={closeLoginModal}
      centered
      title={`${t("common:app-login-loginmodal-title")} 🔐`}
      size="md"
      fz={"md"}
      overlayProps={{
        opacity: 0.66,
        blur: 3,
      }}
    >
      <Box className="px-4 md:px-5 lg:px-6 space-y-4">
        <Space h={10} />

        <LoginForm acceptTOSForm={acceptTOSForm} />

        <Space h={6} />

        <Divider />

        <Space h={6} />

        <Alert
          fz={"xl"}
          icon={<IconAlertCircle size={20} />}
          title={t("common:app-impressum-tos-label")}
          color={
            acceptTOSForm.isValid() ||
            (!acceptTOSForm.isValid() && !acceptTOSForm.isTouched())
              ? "growgreen.4"
              : "red.7"
          }
          variant="outline"
        >
          <Checkbox
            p={4}
            onChange={(event) =>
              acceptTOSForm.setFieldValue(
                "acceptTOS",
                event.currentTarget.checked
              )
            }
            error={acceptTOSForm.errors.acceptTOS}
            checked={acceptTOSForm.values.acceptTOS}
            label={
              <Text fz="sm">
                {t("common:app-impressum-tos-accept-text")}{" "}
                <u>
                  <Link onClick={closeLoginModal} href="/tos">
                    {t("common:app-impressum-tos-label")}
                  </Link>
                </u>
                .
              </Text>
            }
          />
        </Alert>
      </Box>
    </Modal>
  );
};
