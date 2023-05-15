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
      pt={3}
      miw={300}
      size="sm"
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Full text search"
    />
  );
};

export default SearchInput;
