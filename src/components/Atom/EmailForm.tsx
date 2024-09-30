import { Button, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useForm } from "@mantine/form";
import { IconMailForward } from "@tabler/icons-react";
import { IconAt } from "@tabler/icons-react";

import { useState } from "react";

import { signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { getEmailaddress } from "~/utils/helperUtils";

interface EmailFormProps {
  acceptTOSForm: UseFormReturnType<
    {
      acceptTOS: boolean;
    },
    (values: { acceptTOS: boolean }) => {
      acceptTOS: boolean;
    }
  >;
}

export default function EmailForm(EmailFormProps: EmailFormProps) {
  const acceptTOSForm = EmailFormProps.acceptTOSForm;
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm({
    clearInputErrorOnChange: true,
    validateInputOnBlur: true,
    initialValues: { email: "" },

    // regex to validate email
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S{2,}$/.test(value)
          ? null
          : t("common:app-login-invalid-email"),
    },
  });

  const handleSubmit = (values: { email: string }): void => {
    console.debug(acceptTOSForm.validate().hasErrors);
    console.debug(values.email);
    if (!acceptTOSForm.validate().hasErrors) {
      setIsLoading(true);
      signIn("email", { email: values.email })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <form
      className="space-y-2" //  acceptTOSForm.validate();
      onSubmit={emailForm.onSubmit(() => {
        handleSubmit(emailForm.values);
      })}
    >
      <TextInput
        type="email"
        {...emailForm.getInputProps("email")}
        placeholder={getEmailaddress()}
        fz={"xs"}
        label={t("common:app-login-label-loginWithEmail")}
        icon={<IconAt size={20} />}
      />
      <Button
        fz="md"
        fullWidth
        variant="filled"
        color="growgreen"
        className="cursor-pointer"
        loading={isLoading}
        leftIcon={<IconMailForward size={20} />}
        type="submit"
      >
        {`${t("common:app-login-button-loginWithEmail")}`}
      </Button>
    </form>
  );
}
