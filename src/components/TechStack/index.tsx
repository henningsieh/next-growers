import OAuth2Icon from "../../../public/svg/Oauth_logo.svg";
// Import the SVG
import {
  Box,
  Button,
  Container,
  createStyles,
  Group,
  Paper,
  rem,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { TablerIconsProps } from "@tabler/icons-react";
import {
  IconBrandGithub,
  IconBrandJavascript,
  IconCircleKey,
  IconCloudUpload,
  IconCode,
  IconCookie,
  IconGauge,
  IconGitBranch,
  IconHelpSquareFilled,
  IconKey,
  IconLock,
  IconLogin,
  IconLogin2,
  IconMail,
  IconMessage2,
  IconPhoto,
  IconServer2,
  IconSourceCode,
  IconUser,
} from "@tabler/icons-react";
import { IconExternalLink } from "@tabler/icons-react";

import { useTranslation } from "react-i18next";

import Link from "next/link";
import { useRouter } from "next/router";

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
      "Beim Login via Twitter oder Google funktioniert es exakt genauso - nur dass diese Provider eben nun sicherstellen, dass du auch wirklich die E-Mail Adresse bist, die du vorgibst zu sein. 🤓",
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
      'Bevor eure Bilder hochgeladen und abgespeichert werden, werden alle META-Daten aus euren Bildern gelöscht! \
      Die Bilder liegen ("trotz Legalisierung") zur Sicherheit extern bei einem amerikanischem Cloud-Hoster.',
    href: "https://cloudinary.com",
  },
  {
    icon: IconServer2,
    title: "Hosting",
    description:
      "Das Hosting der App erfolgt getrennt von den Bildern, aber ebenfalls in den USA - und zwar (beim Erfinder/Entwickler von NEXT.JS) bei VERCEL.",
    href: "https://vercel.com",
  },
  {
    icon: IconBrandGithub,
    title: "Open-Source Code",
    description:
      "Unsere unserer eigene Software im Backend gilt das selbe Prinzip: es gibt keine Geheimnisse, alles ist vollständig Open-Source. Die Software kann bei GitHub eingesehen werden.",
    href: "https://github.com/henningsieh/next-growers",
  },
  {
    icon: IconBrandJavascript,
    title: "Javascript Framwork",
    description:
      "Die Software basiert auf dem Open-Source Javascript React-Framework NEXT.JS.",
    href: "https://nextjs.org",
  },
];

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: 2000,
    backgroundColor: "blue",
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
  },
  title: {
    fontFamily: `'Roboto Slab', sans-serif`,
    fontSize: "2.8rem",
    fontWeight: "bold",
    marginBottom: theme.spacing.md,
    textAlign: "center",
    [theme.fn.smallerThan("md")]: {
      fontSize: rem(32),
      textAlign: "left",
    },
    // color: theme.colors.gray[4],
    // width: "100%",
  },

  description: {
    textAlign: "center",
    [theme.fn.smallerThan("md")]: {
      // fontSize: rem(28),
      textAlign: "left",
    },
  },
}));

interface FeatureProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
  href?: string;
}

export function Feature({
  icon: Icon,
  title,
  description,
  href,
}: FeatureProps) {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const theme = useMantineTheme();

  return (
    <div>
      <Paper withBorder p={20}>
        <Group noWrap>
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
            // color={dark ? "groworange.5" : "growgreen.5"}
            size={44}
            radius={44}
          >
            <Icon
              //   style={{  width: rem(24), height: rem(24),  }}
              stroke={1.8}
              size={32}
            />
          </ThemeIcon>
          <Text
            mt="sm"
            fz="xl"
            fw="bold"
            c={dark ? "groworange.5" : "growgreen.5"}
            mb={8}
          >
            {title}
          </Text>
        </Group>
        <Text size="md" lh={1.6}>
          {description}
        </Text>
        {href && (
          <Link href={href} target="_blank">
            <Button
              title={href}
              //   fullWidth
              compact
              mt="xl"
              size="sm"
              className="cursor-pointer"
              variant="default"
              //   c={dark ? "groworange" : "growgreen"}
              color={dark ? "groworange" : "growgreen"}
              leftIcon={<IconExternalLink />}
            >
              Info-Link
            </Button>
          </Link>
        )}
      </Paper>
    </div>
  );
}
export default function TechStack() {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { classes } = useStyles();
  const largeScreen = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm})`
  );

  const features = MOCKDATA.map((feature, index) => (
    <Feature {...feature} key={index} />
  ));

  return (
    <Container size="xl" className="flex w-full flex-col space-y-2">
      {/* <Container className={classes.wrapper}> */}
      <>
        <Title className={classes.title}>
          Die Themen Sicherheit und Privatsphäre sind bei{" "}
          <Link
            target="_blank"
            href={
              "https://twitter.com/search?q=%23GrowAGram&src=growagram.com"
            }
          >
            #GrowAGram🪴
          </Link>{" "}
          extrem wichtig!
        </Title>

        <Container size={"44em"} pb={theme.spacing.xl}>
          <Text size="lg" className={classes.description}>
            Das Prinzip: Es gibt keinen Hack, wo es nix zu hacken gibt!
            🤓 Deswegen speichern wir nicht nur keine Passwörter, es
            gibt von vornherein gar keine Passwörter.
          </Text>
        </Container>

        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            //   { maxWidth: "xl", cols: 4, spacing: "xl" },
            { maxWidth: "lg", cols: 2, spacing: "lg" },
            { maxWidth: "md", cols: 1, spacing: "lg" },
            // { maxWidth: "sm", cols: 1, spacing: "md" },
          ]}
        >
          {features}
        </SimpleGrid>

        <Title order={2} fz={28} pt="xl" className={classes.title}>
          Ich hoffe, ich konnte mit diesen detaillierten Informationen
          zum Hintergrund vorab ein paar Fragen beantworten, Zweifel
          nehmen und Vertrauen gewinnen. 📝💚🙋‍♂️
        </Title>
      </>
    </Container>
  );
}
