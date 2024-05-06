import { Center, Loader, Select } from "@mantine/core";

import { useEffect, useState } from "react";

import type { GetBreedersFromSeedfinderResponse } from "~/server/api/routers/strains";

import { api } from "~/utils/api";

export default function AddStrains() {
  const [breeders, setBreeders] = useState<
    GetBreedersFromSeedfinderResponse | undefined
  >(undefined);

  useEffect(() => {
    console.debug(breeders);
  }, [breeders]);

  const {
    data: breedersFromSeedfinder,
    isLoading: breedersFromSeedfinderAreLoading,
    isError: breedersFromSeedfinderHaveErrors,
  } = api.strains.getBreedersFromSeedfinder.useQuery(
    { withStrains: true },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (
      !breeders &&
      !breedersFromSeedfinderAreLoading &&
      !breedersFromSeedfinderHaveErrors
    ) {
      setBreeders(breedersFromSeedfinder);
    }
  }, [
    breeders,
    breedersFromSeedfinder,
    breedersFromSeedfinderAreLoading,
    breedersFromSeedfinderHaveErrors,
  ]);

  // Convert breeders object into array of objects suitable for Select component
  const breedersOptions =
    breeders &&
    Object.keys(breeders).map((key) => ({
      value: key,
      label: breeders[key].name,
    }));

  return (
    <>
      {breedersFromSeedfinderAreLoading ? (
        <Center>
          <Loader size="md" m="xs" color="growgreen.4" />
        </Center>
      ) : (
        breedersOptions && (
          <Select
            searchable
            clearable
            data={breedersOptions}
            placeholder="Select a breeder"
            size="md"
            label="Breeder"
            onChange={(value) => {
              // Handle the selected breeder here
              console.log("Selected breeder:", value);
            }}
          />
        )
      )}
    </>
  );
}
