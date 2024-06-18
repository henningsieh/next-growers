// LoginModal.tsx
import LoginForm from "./LoginForm";
import { Box, Checkbox, Flex, Modal, Text } from "@mantine/core";
import { Alert, Divider } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

import { useRef, useState } from "react";

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

  const checkboxTosRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);

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
        <Alert
          fz={"xl"}
          icon={<IconAlertCircle size={20} />}
          title={t("common:app-impressum-tos-label")}
          color={checked ? "growgreen.4" : "red.4"}
          variant="outline"
        >
          <Flex gap={8}>
            <Checkbox
              ref={checkboxTosRef}
              checked={checked}
              onChange={(event) =>
                setChecked(event.currentTarget.checked)
              }
            />
            <Text fz="sm">
              {t("common:app-impressum-tos-accept-text")}{" "}
              <u>
                <Link onClick={closeLoginModal} href="/tos">
                  {t("common:app-impressum-tos-label")}
                </Link>
              </u>
              .
            </Text>
          </Flex>
        </Alert>

        <Divider my="xl" labelPosition="center" />

        <LoginForm />
      </Box>
    </Modal>
  );
};
