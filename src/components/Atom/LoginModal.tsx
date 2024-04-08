// LoginModal.tsx
import LoginForm from "./LoginForm";
import { Modal } from "@mantine/core";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

interface LoginModalProps {
  opened: boolean;
  close: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  opened,
  close: close,
}) => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  return (
    <Modal
      opened={opened}
      onClose={close}
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
    </Modal>
  );
};
