import {
  Avatar,
  Container,
  Group,
  MultiSelect,
  Paper,
  Select,
  Text,
  Title,
} from "@mantine/core";
import type { BreedersResponse } from "~/pages/api/seedfinder/getAllBreeders";

import {
  forwardRef, // forwardRef,
  useEffect,
  useState,
} from "react";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text>{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);
SelectItem.displayName = "SelectItem";

export default function AddStrains() {
  const [breeders, setBreeders] = useState<
    {
      image: string;
      label: string;
      value: string;
      // description: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/seedfinder/getAllBreeders");
        if (!response.ok) {
          throw new Error("Failed to fetch data from the API");
        }
        const data = (await response.json()) as BreedersResponse;
        // Map the fetched data to ItemProps
        const mappedData = Object.entries(data).map(([key, value]) => ({
          image: `https://en.seedfinder.eu/pics/00breeder/${value.logo}`,
          label: value.name,
          value: key,
          // description: `Description of ${value.name}`, // Type assertion here
        }));
        setBreeders(mappedData);
      } catch (error) {
        console.error("Error:", error);
        // Handle error
      }
    };

    void fetchData();
  }, []);

  console.debug(breeders);
  const [searchValue, onSearchChange] = useState("");

  return (
    <Container py="xl" px={0} className="flex flex-col space-y-">
      <Paper withBorder mih={600} p="lg">
        <Group position="apart">
          <>
            <Select
              searchable
              onSearchChange={(item) => {
                console.debug(item);
                onSearchChange(item);
              }}
              w={500}
              radius="sm"
              data={breeders}
              description="Choose the breeder of a strain in your grow"
              label="Pick a breeder"
              placeholder="Pick a breeder"
            />
          </>
          <Container>
            <Title order={1}>{searchValue}</Title>
          </Container>

          <MultiSelect
            label="Choose the breeder of a strain in your grow"
            placeholder="Pick a breeder"
            itemComponent={SelectItem}
            maxSelectedValues={1}
            data={breeders}
            searchable
            nothingFound="No Breeder was found with this search"
            maxDropdownHeight={400}
            filter={(value, selected, item) =>
              !selected &&
              (item.label
                ?.toLowerCase()
                .includes(value.toLowerCase().trim()) as boolean)
            }
          />
        </Group>
      </Paper>
    </Container>
  );
}
