import EmailForm from "./EmailForm";
import { GoogleButtonWithText } from "./GoogleButton";
import { TwitterButtonWithText } from "./TwitterButton";
import { Box, Divider, Space } from "@mantine/core";

import { useState } from "react";

import { signIn } from "next-auth/react";

import { InputLogin } from "~/utils/inputValidation";

interface LoginFormContent {
  email: string;
}

interface Errors {
  email?: string;
}

const useLoginForm = () => {
  const [formContent, setFormContent] = useState<LoginFormContent>({
    email: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(value);
    setFormContent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleGoogleSignIn = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const newErrors: Errors = {};
    try {
      void (await signIn("google"));
    } catch (err) {
      console.log(err);
    }

    setErrors(newErrors);
  };

  const handleTwitterSignIn = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const newErrors: Errors = {};
    try {
      void (await signIn("twitter"));
    } catch (err) {
      console.log(err);
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate email field
    const newErrors: Errors = {};
    try {
      InputLogin.parse(formContent.email);
      await signIn("email", { email: formContent.email });
    } catch (err) {
      newErrors.email = (err as Error).message;
    }
    console.log(newErrors.email);
    setErrors(newErrors);
  };

  return {
    form: formContent,
    errors,
    handleChange,
    handleSubmit,
    handleTwitterSignIn,
    handleGoogleSignIn,
  };
};

export default function LoginForm() {
  const { handleGoogleSignIn, handleTwitterSignIn } = useLoginForm();

  return (
    <>
      <Space h={"lg"} />
      <Box className="px-4 md:px-5 lg:px-6 space-y-4">
        {/* Twitter Login */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleTwitterSignIn(e);
          }}
        >
          <Box className="grid">
            <TwitterButtonWithText />
          </Box>
        </form>

        {/* Google Login */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleGoogleSignIn(e);
          }}
        >
          <Box className="grid gap-y-3">
            <GoogleButtonWithText />
          </Box>
        </form>
      </Box>

      <Divider mt="lg" mb="sm" label="OR" labelPosition="center" />

      {/* E-Mail Login */}
      <Box className="px-4 md:px-5 lg:px-6 space-y-4">
        <EmailForm />
      </Box>
    </>
  );
}
