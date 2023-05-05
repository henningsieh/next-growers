import {
  Container,
  Overlay,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  hero: {
    position: "relative",
    backgroundImage: "url(diyahna-lewis---JxxyIUHnU-unsplash.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  container: {
    // height: rem(800),
    minheight: "calc(100vh - 90px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: `calc(${theme.spacing.xl} * 6)`,
    zIndex: 1,
    position: "relative",

    [theme.fn.smallerThan("sm")]: {
      height: rem(900),
      flexDirection: "column",
      justifyContent: "center",
      paddingBottom: `calc(${theme.spacing.xl} * 3)`,
    },
  },

  title: {
    color: theme.white,
    fontSize: rem(48),
    fontWeight: 900,
    lineHeight: 1.1,
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
    color: theme.white,
    maxWidth: 660,

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "96%",
      fontSize: theme.fontSizes.md,
    },
  },

  control: {
    marginTop: `calc(${theme.spacing.xl} * 1.5)`,

    [theme.fn.smallerThan("sm")]: {
      width: "80%",
    },
  },
}));

export default function LandingCard() {
  const { classes } = useStyles();

  return (
    <div className={classes.hero}>
      <Overlay
        opacity={1}
        zIndex={0}
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
      />
      <Container className={classes.container}>
        <Title className={classes.title}>GrowAGram.com</Title>
        <Title pb={20} order={2}>
          🪴 Show Your Grow! 🚀
        </Title>
        <Text className={classes.description} size="xl" mt="xl">
          At GrowAGram, we provide a platform for cannabis enthusiasts to
          showcase their growing skills and share their knowledge.
        </Text>
        <Text className={classes.description} size="xl" mt="xl">
          As the legalization of cannabis approaches in Germany, we believe
          it&apos;s important to build a community that celebrates the plant and
          its unique growing process.
        </Text>
        <button
          className="my-8 h-12 w-96 rounded-md bg-gradient-to-r
        from-pink-600 via-red-600 to-orange-500 text-white"
        >
          COMING SOON... 🤞
        </button>
        <Text className={classes.description} size="md">
          If you&apos;re passionate about growing cannabis or just starting out,
          we invite you to explore our community and discover what makes us
          unique. With our platform, you can easily create and share your
          growing reports with the world, highlighting your progress, tools, and
          feedings.
        </Text>
      </Container>
      Foto von{" "}
      <a href="https://unsplash.com/@diyahna22?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        Diyahna Lewis
      </a>{" "}
      auf{" "}
      <a href="https://unsplash.com/de/fotos/--JxxyIUHnU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        Unsplash
      </a>
    </div>
  );
}
