import type { ButtonProps } from "@mantine/core";
import { Button } from "@mantine/core";

import { FcGoogle } from "react-icons/fc";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export function GoogleButton(props: ButtonProps) {
  return (
    <Button
      fz="md"
      variant="filled"
      className="cursor-pointer"
      leftIcon={<FcGoogle size={22} />}
      type="submit"
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
