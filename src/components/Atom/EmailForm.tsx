import { Box, Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMail } from "@tabler/icons-react";
import { getEmailaddress } from "~/helpers";

import { useState } from "react";

import { signIn } from "next-auth/react";

export default function EmailForm() {
  const form = useForm({
    clearInputErrorOnChange: true,
    validateInputOnChange: true,
    initialValues: { email: "" },

    // functions will be used to validate value to a valid email address
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S{2,}$/.test(value) ? null : "Invalid email",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (values: { email: string }): void => {
    setIsLoading(true);
    signIn("email", { email: values.email })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Box px="md" mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          mt="sm"
          label="Your email address 📩"
          placeholder={getEmailaddress()}
          {...form.getInputProps("email")}
        />
        <Button
          loading={isLoading}
          fullWidth
          leftIcon={<IconMail size="1.3rem" />}
          variant="outline"
          type="submit"
          mt="sm"
        >
          Sign In with Email
        </Button>
      </form>
    </Box>
  );
}
