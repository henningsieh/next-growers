import EmailForm from "./EmailForm";
import { GoogleButton } from "./GoogleButton";
import { TwitterButton } from "./TwitterButton";
import { Divider } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

import { signIn } from "next-auth/react";

const useLoginForm = () => {
  const handleGoogleSignIn = async () => {
    try {
      void (await signIn("google"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTwitterSignIn = async () => {
    try {
      void (await signIn("twitter"));
    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleTwitterSignIn,
    handleGoogleSignIn,
  };
};

interface LoginFormProps {
  acceptTOSForm: UseFormReturnType<
    {
      acceptTOS: boolean;
    },
    (values: { acceptTOS: boolean }) => {
      acceptTOS: boolean;
    }
  >;
}

export default function LoginForm(LoginFormProps: LoginFormProps) {
  const acceptTOSForm = LoginFormProps.acceptTOSForm;

  const { handleGoogleSignIn, handleTwitterSignIn } = useLoginForm();

  return (
    <>
      {/* Twitter Login */}
      <form
        onSubmit={acceptTOSForm.onSubmit((values) => {
          console.debug("values", values);
          void handleTwitterSignIn();
        })}
      >
        <TwitterButton />
      </form>

      {/* Google Login */}
      <form
        onSubmit={acceptTOSForm.onSubmit((values) => {
          console.debug("values", values);
          void handleGoogleSignIn();
        })}
      >
        <GoogleButton />
      </form>

      <Divider mt="lg" mb="sm" label="OR" labelPosition="center" />

      {/* E-Mail Login */}
      <EmailForm acceptTOSForm={acceptTOSForm} />
    </>
  );
}
