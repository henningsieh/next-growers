import type { ChangeEvent } from "react";
import { TextInput } from "@mantine/core";

type SearchInputProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <TextInput
      // pr={4}
      miw={380}
      pt={3}
      size="sm"
      placeholder="Full text search"
      type="text"
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchInput;
