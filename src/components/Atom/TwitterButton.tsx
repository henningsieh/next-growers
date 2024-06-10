import type { ButtonProps } from "@mantine/core";
import { Button } from "@mantine/core";

import { FaXTwitter } from "react-icons/fa6";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export function TwitterButton(props: ButtonProps) {
  return (
    <Button
      m={6}
      fz="md"
      variant="filled"
      className="cursor-pointer"
      leftIcon={<FaXTwitter size={20} />}
      type="submit"
      {...props}
    />
  );
}

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
