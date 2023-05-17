import {
  ActionIcon,
  Group,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

export default function LightDarkButton() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";
  return (
    <Group position="center" my={0}>
      <ActionIcon
        className="cursor-default"
        size={32}
        variant="outline"
        color={dark ? "orange" : "gray"}
        onClick={() => toggleColorScheme()}
        title="Toggle color scheme"
      >
        {dark ? <IconSun size="1.4rem" /> : <IconMoonStars size="1.4rem" />}
      </ActionIcon>
    </Group>
  );
}
