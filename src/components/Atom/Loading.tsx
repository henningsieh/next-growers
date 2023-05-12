import { Container, Loader, LoadingOverlay } from "@mantine/core";

interface LoadingProps {
  isLoading: boolean;
}

const Loading = ({ isLoading }: LoadingProps) => {
  // return <Container className="text-4xl">Loading... 🔄</Container>;
  return (
    <LoadingOverlay
      mt={120}
      overlayBlur={20}
      transitionDuration={600}
      visible={isLoading}
    />
  );
};

export default Loading;
