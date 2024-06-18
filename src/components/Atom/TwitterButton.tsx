import { Button } from "@mantine/core";

import { FaXTwitter } from "react-icons/fa6";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export function TwitterButton() {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  return (
    <Button
      fullWidth
      fz="md"
      variant="filled"
      className="cursor-pointer"
      leftIcon={<FaXTwitter size={20} />}
      type="submit"
    >
      {t("common:app-login-button-loginWithTwitter")}
    </Button>
  );
}
