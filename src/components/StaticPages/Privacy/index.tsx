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
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "top",
    alignItems: "center",
    paddingTop: theme.spacing.lg,
  },

  title: {
    fontSize: rem(48),
    fontWeight: 900,
    lineHeight: 1.1,
    paddingTop: 12,
    paddingBottom: 12,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(42),
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(36),
      lineHeight: 1.3,
    },
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.md,
    },
  },
}));

interface PrivacyProps {
  htmlContent: string;
}

const Privacy: React.FC<PrivacyProps> = ({ htmlContent }) => {
  const { classes } = useStyles();

  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  return (
    <Container size="lg" className={classes.container}>
      <Title className={classes.title}>
        {t("common:app-impressum-privacy-label")}
      </Title>

      <Box
        className="prose"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <style jsx global>{`
        .prose,
        .prose a,
        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4,
        .prose h5,
        .prose h6 {
          max-width: none; /* or max-width: unset; */
          color: inherit;
        }
        .prose a {
          text-decoration: underline;
        }
      `}</style>
    </Container>
  );
};

export default Privacy;
