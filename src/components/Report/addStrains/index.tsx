import {
  Center,
  Container,
  Loader,
  Paper,
  Select,
  Title,
  Transition,
} from "@mantine/core";

import { useEffect, useState } from "react";

import type { GetBreedersFromSeedfinderResponse } from "~/server/api/routers/strains";

import { api } from "~/utils/api";

export default function AddStrains() {
  const [breeders, setBreeders] = useState<
    GetBreedersFromSeedfinderResponse | undefined
  >(undefined);

  // useEffect(() => {
  //   //console.debug("breeders", breeders);
  // }, [breeders]);

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
        <Container py="xl" px={0}>
          <Paper
            m={0}
            p="sm"
            mih={400}
            withBorder
            className="flex flex-col space-y-4"
          >
            <Title order={1}>Edit Strains</Title>
            {/* {breedersOptions && ( */}
            <Transition
              mounted={
                breedersOptions === undefined ||
                breedersOptions.length == 0
                  ? false
                  : true
              }
              transition="fade"
              duration={600} // Duration of the fade animation in milliseconds
              timingFunction="ease"
            >
              {(styles) => (
                <Select
                  style={{
                    ...styles,
                    opacity: styles.opacity, // Apply the opacity style for the fading effect
                  }}
                  searchable
                  clearable
                  data={breedersOptions ? breedersOptions : []}
                  placeholder="Select a breeder"
                  size="md"
                  label="Breeder"
                  onChange={(value) => {
                    // Find the selected breeder in the breeders object
                    const selectedBreederId = value; // This is the ID of the selected breeder
                    if (selectedBreederId) {
                      const selectedBreeder =
                        breeders && breeders[selectedBreederId];
                      // Check if selectedBreeder has strains
                      if (
                        selectedBreeder &&
                        selectedBreeder.strains != undefined
                      ) {
                        const strains = selectedBreeder.strains;

                        // Iterate over each strain in the strains object
                        Object.entries(strains).forEach(
                          ([strainId, strainObject]) => {
                            const strainName = strainObject; // Accessing the value associated with the strainId key
                            const label =
                              strainName as unknown as string; // Explicitly cast strainName to a string

                            // Push strainId and strainName into strainOptions array
                            strainOptions.push({
                              value: strainId,
                              label: label,
                            });
                            setStrainsData(strainOptions);
                          }
                        );
                      } else {
                        console.error(
                          "Selected breeder has no strains"
                        );
                      }
                      //console.debug("strainOptions:", strainOptions);
                    } else {
                      // console.debug("reset breeder");
                      setStrainsData([]);
                    }
                  }}
                />
              )}
            </Transition>
            {/* // )} */}

            <Transition
              mounted={strainsData.length > 0}
              transition="fade"
              duration={600} // Duration of the fade animation in milliseconds
              timingFunction="ease"
            >
              {(styles) => (
                <Select
                  style={{
                    ...styles,
                    opacity: styles.opacity, // Apply the opacity style for the fading effect
                  }}
                  searchable
                  clearable
                  placeholder="Select a strain"
                  size="md"
                  label="Strains"
                  data={strainsData}
                  onChange={(value) => {
                    const selectedStrainId = value; // This is the ID of the selected strain
                    if (selectedStrainId) {
                      console.debug(selectedStrainId);
                    } else {
                      // console.debug("reset strains");
                    }
                  }}
                />
              )}
            </Transition>
          </Paper>
        </Container>
      )}
    </>
  );
}

// function SelectStrain({
//   strainDataData,
// }: {
//   strainDataData: { value: string; label: string }[];
// }) {
//   return (
//     <Transition
//       mounted={!!strainDataData}
//       transition="fade"
//       duration={5000} // Duration of the fade animation in milliseconds
//       timingFunction="ease"
//     >
//       {(styles) => (
//         <Select
//           style={{
//             ...styles,
//             opacity: styles.opacity, // Apply the opacity style for the fading effect
//           }}
//           searchable
//           clearable
//           placeholder="Select a strain"
//           size="md"
//           label="Strains"
//           data={strainDataData}
//         />
//       )}
//     </Transition>
//   );
// }
