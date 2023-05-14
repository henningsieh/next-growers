import { LoadingOverlay, createStyles } from "@mantine/core";

interface LoadingProps {
  isLoading: boolean;
}

const useStyles = createStyles((theme) => ({
  paddingTop: {
    [theme.fn.largerThan("md")]: {
      marginTop: "116",
    },
    [theme.fn.smallerThan("md")]: {
      marginTop: "126",
    },
  },
}));

const Loading = ({ isLoading }: LoadingProps) => {
  const { classes, theme } = useStyles();
  // return <Container className="text-4xl">Loading... 🔄</Container>;
  return (
    <LoadingOverlay
      className={classes.paddingTop}
      mt={60}
      overlayBlur={5}
      transitionDuration={700}
      visible={isLoading}
    />
  );
};

export default Loading;
