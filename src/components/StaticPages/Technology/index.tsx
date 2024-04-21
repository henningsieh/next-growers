// Import the SVG
import {
  Box,
  Button,
  Card,
  Container,
  createStyles,
  Flex,
  Group,
  Paper,
  rem,
  SimpleGrid,
  Space,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandJavascript,
  IconCloudUpload,
  IconCookie,
  IconKey,
  IconLock,
  IconMail,
  IconServer2,
} from "@tabler/icons-react";
import { IconExternalLink } from "@tabler/icons-react";
import { Theme } from "emoji-picker-react";

// import { useTranslation } from "react-i18next";
import Link from "next/link";

// import { useRouter } from "next/router";

export const MOCKDATA = [
  {
    icon: IconMail,
    title: "Login mit E-Mail ohne Passwort",
    description:
      "Beim Login per E-Mail wird dir 1 Hash-Link an die E-Mail gesendet, nach Klick auf den Link bist du eingeloggt. Die Sicherheit besteht also darin, die Identität dadurch zu beweisen, dass du dich in dein E-Mail Konto einloggen kannst.",
    href: "https://next-auth.js.org/providers/email",
  },
  {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: IconKey,
    title: "Login mit OAuth-Service-Provider",
    description:
      "Beim Login via Twitter oder Google funktioniert es exakt genauso - nur dass diese Provider eben nun sicherstellen, dass du auch wirklich die E-Mail Adresse bist, die du vorgibst zu sein.",
    href: "https://www.oauth.com",
  },
  {
    icon: IconLock,
    title: "Authentifizierung",
    description:
      "Die Datenbank bei GrowAGram speichert also NUR GENAU DIESEN Hash, um Dich zu identifizieren und wiederzuerkennen. \
      Das alles wird von der folgenden Open-Source Javascript-Bibliothek NextAuth sichergestellt und verwaltet",
    href: "https://next-auth.js.org",
  },
  {
    icon: IconCookie,
    title: "Kein Werbe-Tracking!",
    description:
      "Wir verfolgen deine Aktivitäten nicht, wir zählen dich nur anonym als Besucher. Genieß ein sorgenfreies Erlebnis auf #GrowAGram🪴, ohne Tracking oder Überwachung deiner Online-Aktivitäten. Zum Zählen verwenden wir die Open-Source Software Plausible.io.",
    href: "https://cdn.growagram.com/growagram.com",
  },
  {
    icon: IconCloudUpload,
    title: "Bilder-Upload",
    description:
      "Bevor deine Bilder hochgeladen und abgespeichert werden, werden alle META-Daten aus deinen Bildern gelöscht. \
      Die Bilder liegen (trotz Entkriminilasierung) bei einem Cloud-Hoster außerhalb der EU in den USA.",
    href: "https://cloudinary.com",
  },
  {
    icon: IconServer2,
    title: "Hosting",
    description:
      "Das Hosting der App erfolgt getrennt von den Bildern, aber ebenfalls außerhalb der EU in den USA - und zwar (beim Erfinder/Entwickler von Next.JS) bei Vercel.",
    href: "https://vercel.com",
  },
  {
    icon: IconBrandGithub,
    title: "Open-Source Code",
    description:
      "Bei unserer eigene Software im Backend gilt das selbe Prinzip für Sicherheit und Privatsphäre. Der gesamte Quellcode ist Open-Source und kann bei GitHub eingesehen werden.",
    href: "https://github.com/henningsieh/next-growers",
  },
  {
    icon: IconBrandJavascript,
    title: "Javascript Framwork",
    description:
      "Unsere eigene Software im Backend basiert auf dem Open-Source Javascript React-Framework Next.JS.",
    href: "https://nextjs.org",
  },
];

const useStyles = createStyles((theme) => ({
  title: {
    fontFamily: `'Roboto Slab', sans-serif`,
    fontWeight: "bold",
    marginBottom: theme.spacing.md,
    textAlign: "center",
    fontSize: rem(34),
    [theme.fn.smallerThan("lg")]: {
      fontSize: rem(28),
      // textAlign: "left",
    },
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(19),
      textAlign: "left",
    },
  },

  description: {
    textAlign: "center",
    fontWeight: "normal",
    fontFamily: "monospace",
    [theme.fn.smallerThan("md")]: {
      fontSize: rem(16),
    },
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(14),
      textAlign: "left",
    },
  },

  footer: {
    fontFamily: `'Roboto Slab', sans-serif`,
    fontWeight: "bold",
    marginBottom: theme.spacing.md,
    textAlign: "center",
    fontSize: rem(32),
    [theme.fn.smallerThan("lg")]: {
      fontSize: rem(22),
      // textAlign: "left",
    },
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(14),
      textAlign: "left",
    },
  },
}));

interface FeatureProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
  href?: string;
}

function Feature({
  icon: Icon,
  title,
  description,
  href,
}: FeatureProps) {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <div>
      <Paper p="sm" withBorder>
        <Group pb="xs" h={80} mx="sm" noWrap>
          <ThemeIcon
            variant="gradient"
            gradient={
              dark
                ? {
                    from: "groworange.9",
                    to: "groworange.3",
                    deg: 60,
                  }
                : {
                    from: "growgreen.8",
                    to: "growgreen.2",
                    deg: 60,
                  }
            }
            size={44}
            radius={44}
          >
            <Icon stroke={1.8} size={32} />
          </ThemeIcon>
          <Title
            order={2}
            m="sm"
            fz="xl"
            fw="bold"
            c={dark ? "groworange.5" : "growgreen.5"}
            mb={8}
          >
            {title}
          </Title>
        </Group>
        <Card bg={dark ? undefined : "white"} p="md">
          <Text size="lg" lh={1.6}>
            {description}
          </Text>
        </Card>
        {href && (
          <Box mt="sm">
            <Flex justify="flex-end" align="center">
              <Link href={href} target="_blank">
                <Button
                  title={href}
                  //   fullWidth
                  compact
                  size="sm"
                  className="cursor-pointer"
                  variant="default"
                  c={dark ? "groworange.3" : "growgreen"}
                  rightIcon={<IconExternalLink />}
                >
                  Info-Link
                </Button>
              </Link>
            </Flex>
          </Box>
        )}
      </Paper>
    </div>
  );
}
export default function TechStack() {
  // const router = useRouter();
  // const { locale: activeLocale } = router;
  // const { t } = useTranslation(activeLocale);

  const theme = useMantineTheme();
  const { classes } = useStyles();
  // const { colorScheme } = useMantineColorScheme();
  // const dark = colorScheme === "dark";
  // const largeScreen = useMediaQuery(
  //   `(min-width: ${theme.breakpoints.sm})`
  // );

  const features = MOCKDATA.map((feature, index) => (
    <Feature {...feature} key={index} />
  ));

  return (
    <Container size="xl">
      <>
        <Title order={1} className={classes.title}>
          Die Themen Sicherheit und Privatsphäre sind bei{" "}
          <Link
            target="_blank"
            href={
              "https://twitter.com/search?q=%23GrowAGram&src=growagram.com"
            }
          >
            #GrowAGram🪴
          </Link>{" "}
          sehr wichtig!
        </Title>

        <Container size="md" pb={theme.spacing.xl}>
          <Text size="lg" className={classes.description}>
            Das Prinzip: Es gibt keinen Hack, wo es nix zu hacken gibt!
            Deswegen speichern wir nicht nur keine Passwörter, es gibt
            von vornherein gar keine Passwörter.
          </Text>
        </Container>

        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            //   { maxWidth: "xl", cols: 4, spacing: "xl" },
            { maxWidth: "md", cols: 2, spacing: "md" },
            { maxWidth: "sm", cols: 1, spacing: "sm" },
            // { maxWidth: "sm", cols: 1, spacing: "md" },
          ]}
        >
          {features}
        </SimpleGrid>

        <Container size="md">
          <Title pt="xl" order={4} className={classes.footer}>
            Ich hoffe, ich konnte mit diesen detaillierten Informationen
            zum Hintergrund vorab ein paar Fragen beantworten, Zweifel
            nehmen und Vertrauen gewinnen. 📝💚🙋‍♂️
          </Title>
        </Container>
      </>
    </Container>
  );
}
