import { LoadingOverlay, createStyles } from "@mantine/core";

interface LoadingProps {
  isLoading: boolean;
}

const Loading = ({ isLoading }: LoadingProps) => {
  return (
    <LoadingOverlay
      mt={60}
      overlayBlur={5}
      transitionDuration={700}
      visible={isLoading}
    />
  );
};

export default Loading;
