import {
  ActionIcon,
  TextInput,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import type { ChangeEvent, Dispatch, SetStateAction } from "react";

type SearchInputProps = {
  value: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const SearchInput = ({
  value,
  setSearchString,
  onChange,
}: SearchInputProps) => {
  const clearValue = () => {
    setSearchString("");
  };

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <TextInput
      // pr={4}
      pt={3}
      miw={300}
      size="xs"
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Full text search"
      rightSection={
        <ActionIcon
          size={22}
          variant="outline"
          className="cursor-default"
        >
          <IconX size={22} stroke={2.2} onClick={clearValue} />
        </ActionIcon>
      }
    />
  );
};

export default SearchInput;
