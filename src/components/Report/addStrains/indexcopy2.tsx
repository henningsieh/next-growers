import {
  Avatar,
  Container,
  Group,
  Paper,
  Select,
  Text,
  Title,
} from "@mantine/core";
import type { BreedersResponse } from "~/pages/api/seedfinder/getAllBreeders";

import { forwardRef, useEffect, useState } from "react";

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
      value: string;
      label: string;
      image: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await fetch("/api/seedfinder/getAllBreeders");
        if (!response.ok) {
          throw new Error("Failed to fetch data from the API");
        }
        const data = (await response.json()) as BreedersResponse;

        // Map the fetched data to the required format
        const mappedData = Object.entries(data).map(([key, value]) => ({
          value: key,
          label: value.name,
          image: `https://en.seedfinder.eu/pics/00breeder/${value.logo}`,
        }));

        console.debug("mappedData", mappedData);

        setBreeders(mappedData);
      } catch (error) {
        console.error("Error:", error);
        // Handle error
      }
    };

    void fetchData();
  }, []);

  const [searchValue, onSearchChange] = useState("");

  return (
    <Container py="xl" px={0} className="flex flex-col space-y-">
      <Paper withBorder mih={600} p="lg">
        <Group position="apart">
          <>
            <Select
              searchable
              clearable
              onSearchChange={(item) => {
                onSearchChange(item);
              }}
              w={500}
              radius="sm"
              data={breeders}
              description="Choose the breeder of a strain in your grow"
              label="Pick a breeder"
              placeholder="Pick a breeder"
              itemComponent={SelectItem}
            />
          </>
          <Container>
            <Title order={1}>{searchValue}</Title>
          </Container>
        </Group>
      </Paper>
    </Container>
  );
}
