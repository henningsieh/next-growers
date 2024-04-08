import type { ButtonProps } from "@mantine/core";
import { Button } from "@mantine/core";

import { FcGoogle } from "react-icons/fc";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export function GoogleButton(props: ButtonProps) {
  return (
    <Button
      m={6}
      type="submit"
      leftIcon={<FcGoogle />}
      variant="outline"
      color="growgreen"
      {...props}
    />
  );
}

export function GoogleButtonWithText() {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  return (
    <GoogleButton>
      {t("common:app-login-button-loginWithGoogle")}
    </GoogleButton>
  );
}
