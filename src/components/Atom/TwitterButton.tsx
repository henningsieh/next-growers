import type { ButtonProps } from "@mantine/core";
import { Button } from "@mantine/core";

import { FaXTwitter } from "react-icons/fa6";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export function TwitterButtonWithText() {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  return (
    <TwitterButton>
      {t("common:app-login-button-loginWithTwitter")}
    </TwitterButton>
  );
}

export function TwitterButton(props: ButtonProps) {
  return (
    <Button
      m={6}
      type="submit"
      leftIcon={<FaXTwitter />}
      variant="outline"
      color="growgreen"
      {...props}
    />
  );
}
