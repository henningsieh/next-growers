// LoginModal.tsx
import LoginForm from "./LoginForm";
import { Modal } from "@mantine/core";
import { Alert, Divider } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

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
      <LoginForm />

      <Divider my="xl" labelPosition="center" />

      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Terms of Service (TOS)"
        color="growgreen.3"
        variant="outline"
      >
        {t("common:app-impressum-tos-accept-text")}{" "}
        <u>
          <Link onClick={closeLoginModal} href="/tos">
            {t("common:app-impressum-tos-label")}
          </Link>
        </u>
        .
      </Alert>
    </Modal>
  );
};
