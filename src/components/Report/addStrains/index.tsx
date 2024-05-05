import { Container, Group, Paper, Select, Title } from "@mantine/core";

import { useEffect, useState } from "react";

import type { BreedersResponse } from "~/server/api/routers/strains";

export default function AddStrains() {
  const [breeders, setBreeders] = useState<
    {
      value: string;
      label: string;
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
        // Map the fetched data to the required format
        const mappedData = Object.entries(data).map(([key, value]) => ({
          value: key,
          label: value.name,
        }));
        setBreeders(mappedData);
      } catch (error) {
        console.error("Error:", error);
        // Handle error
      }
    };

    void fetchData();
  }, []);

  return (
    <Container py="xl" px={0} className="flex flex-col space-y-">
      <Paper withBorder mih={600} p="lg">
        <Group position="apart">
          <>
            <Select
              searchable
              w={500}
              radius="sm"
              data={breeders}
              description="Choose the breeder of a strain in your grow"
              label="Pick a breeder"
              placeholder="Pick a breeder"
            />
          </>
          <Container>
            <Title order={1}>title</Title>
          </Container>
        </Group>
      </Paper>
    </Container>
  );
}
