import { Button } from "@mantine/core";

import { FcGoogle } from "react-icons/fc";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export function GoogleButton() {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  return (
    <Button
      fz="md"
      fullWidth
      variant="filled"
      className="cursor-pointer"
      leftIcon={<FcGoogle size={22} />}
      type="submit"
    >
      {t("common:app-login-button-loginWithGoogle")}
    </Button>
  );
}
