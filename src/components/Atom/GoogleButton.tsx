import { Button } from "@mantine/core";
import type { ButtonProps } from "@mantine/core";

import { FcGoogle } from "react-icons/fc";

export function GoogleButton(props: ButtonProps) {
  return (
    <Button
      m={6}
      type="submit"
      leftIcon={<FcGoogle />}
      variant="default"
      color="gray"
      {...props}
    />
  );
}

export function GoogleButtonWithText() {
  return <GoogleButton>Sign In with Google</GoogleButton>;
}
