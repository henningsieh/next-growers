import { Alert, Box, Container } from "@mantine/core";

import { IconAlertCircle } from "@tabler/icons-react";

const AccessDenied = () => {
  return (
    <Container size="sm">
      <Alert
        mt={5}
        icon={<IconAlertCircle size="1rem" />}
        title="ACCESS DENIED"
        color="red"
        variant="outline"
      >
        <Box className="">
          You aren&apos;t authenticated to visit this page.
        </Box>
      </Alert>
    </Container>
  );
};

export default AccessDenied;
