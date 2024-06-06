import { Alert, Box, Container } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

const AccessDenied = () => {
  return (
    <Container pt={60} size="sm">
      <Alert
        mt={5}
        icon={<IconAlertCircle size={20} />}
        title="ACCESS DENIED"
        color="red"
        variant="outline"
      >
        <Box className="">
          You aren&apos;t authenticated to visit this page.
          <br />
          <br />
          {/* <b>You have to be logged in!</b> */}
        </Box>
      </Alert>
    </Container>
  );
};

export default AccessDenied;
