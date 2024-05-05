import {
  Box,
  Card,
  Center,
  Container,
  Flex,
  Loader,
  Paper,
  Select,
  Title,
} from "@mantine/core";

import { useEffect, useState } from "react";

import type { BreedersResponse } from "~/server/api/routers/strains";

import type { Breeder } from "~/types";

import { api } from "~/utils/api";

export default function AddStrains() {
  const [breeders, setBreeders] = useState<Breeder[]>([]);
  const [breederId, setBreederId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await fetch("/api/seedfinder/getAllBreeders");
        if (!response.ok) {
          throw new Error("Failed to fetch data from the API");
        }
        const data = (await response.json()) as BreedersResponse;

        // Map the fetched data to ItemProps
        const mappedData = Object.entries(data).map(([key, value]) => ({
          value: key,
          label: value.name,
          image: `https://en.seedfinder.eu/pics/00breeder/${value.logo}`,
          // description: `Description of ${value.name}`, // Type assertion here
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

  return (
    <Container py="xl" px={0} className="flex flex-col space-y-">
      <Paper withBorder mih={600} p="lg">
        <Flex
          justify="flex-start"
          align="flex-start"
          direction="column"
          gap="sm"
        >
          <Box w={"100%"}>
            <Select
              searchable
              clearable
              data={breeders}
              label="Pick a breeder"
              placeholder="Pick a breeder"
              description="Choose the breeder of a strain in your grow"
              onSearchChange={(item) => {
                item === "" && breederId !== "" && setBreederId("");
              }}
              onSelect={(event) => {
                const selectedValue = event.currentTarget.value;
                const selectedBreeder = breeders.find(
                  (breeder) => breeder.label === selectedValue
                );

                selectedBreeder && console.debug(selectedBreeder.value);

                selectedBreeder && setBreederId(selectedBreeder.value);
              }}
            />
          </Box>
          <Card withBorder w={"100%"} mt="sm">
            <Flex direction="column" className="space-y-2">
              {/* <Card.Section> */}
              <Title order={3}>Selected Breeder:</Title>

              {/* </Card.Section> */}
              {breederId && (
                <>
                  <Title c="growgreen.3" order={3}>
                    {breederId}
                  </Title>
                  <SelectStrain breederId={breederId} />
                </>
              )}
            </Flex>
          </Card>
        </Flex>
      </Paper>
    </Container>
  );
}

function SelectStrain({ breederId }: { breederId: string }) {
  const {
    data: reederStrains,
    isLoading: breederStrainsAreLoading,
    isError: breederStrainshaveErrors,
  } = api.strains.getBreederStrains.useQuery(breederId, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  if (breederStrainshaveErrors) {
    return <>Server Error</>;
  } else if (!breederStrainshaveErrors && breederStrainsAreLoading) {
    return (
      <Center>
        <Loader size="sm" m="xs" color="growgreen.4" />
      </Center>
    );
  } else {
    console.debug("breederStrains", reederStrains);

    return <div>{breederId}</div>;
  }
}
