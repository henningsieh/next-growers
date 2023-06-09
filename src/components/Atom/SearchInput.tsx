import { ActionIcon, TextInput } from "@mantine/core";
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
          size={18}
          variant="outline"
          className="cursor-default"
        >
          <IconX
            color="orange"
            onClick={clearValue}
            size={16}
            stroke={2}
          />
        </ActionIcon>
      }
    />
  );
};

export default SearchInput;
