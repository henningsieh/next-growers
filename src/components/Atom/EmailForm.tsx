import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMailForward } from "@tabler/icons-react";
import { IconAt } from "@tabler/icons-react";

import { useState } from "react";

import { signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { getEmailaddress } from "~/utils/helperUtils";

export default function EmailForm() {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
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
    <form className="space-y-2" onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        type="email"
        {...form.getInputProps("email")}
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
