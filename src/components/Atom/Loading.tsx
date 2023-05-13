import { LoadingOverlay } from "@mantine/core";

interface LoadingProps {
  isLoading: boolean;
}

const Loading = ({ isLoading }: LoadingProps) => {
  // return <Container className="text-4xl">Loading... 🔄</Container>;
  return (
    <LoadingOverlay
      mt={114}
      overlayBlur={5}
      transitionDuration={1000}
      visible={isLoading}
    />
  );
};

export default Loading;
