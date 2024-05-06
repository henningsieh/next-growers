import { Center, Loader, Select } from "@mantine/core";

import { useEffect, useState } from "react";

import type { GetBreedersFromSeedfinderResponse } from "~/server/api/routers/strains";

import { api } from "~/utils/api";

export default function AddStrains() {
  const [breeders, setBreeders] = useState<
    GetBreedersFromSeedfinderResponse | undefined
  >(undefined);

  useEffect(() => {
    console.debug("breeders", breeders);
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

  const strainOptions: { value: string; label: string }[] = [];
  const [strainsData, setStrainsData] = useState<
    { value: string; label: string }[]
  >([]);

  return (
    <>
      {breedersFromSeedfinderAreLoading ? (
        <Center>
          <Loader size="md" m="xs" color="growgreen.4" />
        </Center>
      ) : (
        breedersOptions && (
          <>
            <Select
              searchable
              clearable
              data={breedersOptions}
              placeholder="Select a breeder"
              size="md"
              label="Breeder"
              onChange={(value) => {
                // Find the selected breeder in the breeders object
                const selectedBreederId = value; // This is the ID of the selected breeder
                if (selectedBreederId) {
                  const selectedBreeder =
                    breeders && breeders[selectedBreederId];
                  console.debug("Selected breeder:", selectedBreeder);
                  // Check if selectedBreeder has strains
                  if (
                    selectedBreeder &&
                    selectedBreeder.strains != undefined
                  ) {
                    const strains = selectedBreeder.strains;

                    console.debug("strains:", strains);

                    // Iterate over each strain in the strains object
                    Object.entries(strains).forEach(
                      ([strainId, strainObject]) => {
                        const strainName = strainObject; // Accessing the value associated with the strainId key
                        const label = strainName as unknown as string; // Explicitly cast strainName to a string

                        // Push strainId and strainName into strainOptions array
                        strainOptions.push({
                          value: strainId,
                          label: label,
                        });
                        setStrainsData(strainOptions);
                      }
                    );
                  } else {
                    console.debug("Selected breeder has no strains");
                  }
                  console.debug("strainOptions:", strainOptions);
                }
              }}
            />
            {strainsData && <Select data={strainsData} />}
          </>
        )
      )}
    </>
  );
}
