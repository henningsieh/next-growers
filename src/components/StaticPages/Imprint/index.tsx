import {
  Box,
  Container,
  createStyles,
  rem,
  Title,
} from "@mantine/core";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(48),
    fontWeight: 900,
    lineHeight: 1.1,
    paddingTop: 12,
    paddingBottom: 12,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(36),
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(24),
      lineHeight: 1.3,
    },
  },
}));

interface PrivacyProps {
  htmlContent: string;
}

const Imprint: React.FC<PrivacyProps> = ({ htmlContent }) => {
  const { classes } = useStyles();

  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  // const { colorScheme } = useMantineColorScheme();
  // const dark = colorScheme === "dark";

  return (
    <Container size="md" pt="xl">
      {/* Title */}
      <Title className={classes.title}>
        {t("common:app-impressum-imprint-label")}
      </Title>

      {/* Content */}
      <Box
        className="prose overflow-hidden"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </Container>
  );
};

export default Imprint;
