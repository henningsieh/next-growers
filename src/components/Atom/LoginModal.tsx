// LoginModal.tsx
import LoginForm from "./LoginForm";
import { Modal } from "@mantine/core";

interface LoginModalProps {
  opened: boolean;
  close: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  opened,
  close: close,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title="Sign in to GrowAGram.com 🔒"
    >
      <LoginForm />
    </Modal>
  );
};
