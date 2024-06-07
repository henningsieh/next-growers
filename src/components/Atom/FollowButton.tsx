import { Box, Button, Text, Tooltip } from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";

function FollowButton() {
  return (
    <Tooltip
      fw={900}
      position="top-end"
      c={"orange"}
      label="Feature coming soon"
    >
      <Box>
        <Button
          className="cursor-not-allowed"
          disabled
          h={32}
          color="growgreen"
          variant="outline"
          leftIcon={<IconUserPlus size={20} stroke={1.8} />}
        >
          <Text>Follow</Text>
        </Button>
      </Box>
    </Tooltip>

    // <Button
    //   className="cursor-not-allowed"
    //   title="Feature coming soon"
    //   h={32}
    //   color="growgreen"
    //   variant="outline"
    //   leftIcon={<IconUserPlus size={20} stroke={1.8} />}
    // >
    //   <Text>Follow</Text>
    // </Button>
  );
}

export default FollowButton;
