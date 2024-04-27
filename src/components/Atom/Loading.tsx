import { LoadingOverlay } from "@mantine/core";

interface LoadingProps {
  isLoading: boolean;
}

const Loading = ({ isLoading }: LoadingProps) => {
  return (
    <LoadingOverlay
      overlayBlur={2}
      overlayOpacity={0.2}
      transitionDuration={600}
      visible={isLoading}
    />
  );
};

export default Loading;
