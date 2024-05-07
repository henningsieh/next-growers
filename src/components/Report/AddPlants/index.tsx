import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Flex,
  Image,
  Loader,
  Paper,
  ScrollArea,
  Select,
  Text,
  Title,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconCannabis,
  IconDeviceFloppy,
  IconSearch,
} from "@tabler/icons-react";

import { useEffect, useState } from "react";

import Link from "next/link";

import type {
  GetBreedersFromSeedfinderResponse,
  SeedfinderStrain,
} from "~/server/api/routers/strains";

import { api } from "~/utils/api";

export default function AddStrains() {
  // Base URL for the breeder logo images
  const baseUrl = "https://en.seedfinder.eu/pics/00breeder/";

  const [selectedStrainId, setSelectedStrainId] = useState<string>("");
  const [strainsSelectData, setSelectStrainsData] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedBreederId, setSelectedBreederId] =
    useState<string>("");
  const [selectedBreeder, setSelectedBreeder] = useState<
    | {
        name: string;
        logo: string;
        strains: SeedfinderStrain[];
      }
    | undefined
  >(undefined);
  const [breeders, setBreeders] = useState<
    GetBreedersFromSeedfinderResponse | undefined
  >(undefined);

  const strainOptions: { value: string; label: string }[] = [];
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

  const theme = useMantineTheme();
  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );

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
            <Transition
              mounted={
                breedersOptions === undefined ||
                breedersOptions.length == 0
                  ? false
                  : true
              }
              transition="scale-y"
              duration={600} // Duration of the fade animation in milliseconds
              timingFunction="ease"
            >
              {(styles) => (
                <Select
                  rightSection={<IconSearch size="1rem" />}
                  rightSectionWidth={30}
                  styles={{ rightSection: { pointerEvents: "none" } }}
                  className="z-20"
                  style={{
                    ...styles,
                    opacity: styles.opacity, // Apply the opacity style for the fading effect
                  }}
                  searchable
                  clearable
                  data={breedersOptions ? breedersOptions : []}
                  placeholder="Select a breeder"
                  // fz={smallScreen ? "md" : "xl"}
                  size={smallScreen ? "xs" : "md"}
                  label="Breeder"
                  onFocus={() => {
                    setSelectedStrainId("");
                    setSelectStrainsData([]);
                    setSelectedBreederId("");
                    setSelectedBreeder(undefined);
                  }}
                  onChange={(value) => {
                    // Find the selected breeder in the breeders object

                    if (value) {
                      setSelectedBreederId(value);

                      const selectedBreeder =
                        breeders && breeders[value];
                      setSelectedBreeder(selectedBreeder);

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
                            setSelectStrainsData(strainOptions);
                          }
                        );
                      } else {
                        console.error(
                          "Selected breeder has no strains"
                        );
                      }
                      //console.debug("strainOptions:", strainOptions);
                    } else {
                      // Reset breeder and strain data if no breeder is selected
                      setSelectedStrainId("");
                      setSelectStrainsData([]);
                      setSelectedBreederId("");
                      setSelectedBreeder(undefined);
                    }
                  }}
                />
              )}
            </Transition>

            <Transition
              mounted={strainsSelectData.length > 0}
              transition="slide-down"
              duration={600} // Duration of the fade animation in milliseconds
              timingFunction="ease"
            >
              {(styles) => (
                <Select
                  className="z-10"
                  style={{
                    ...styles,
                    opacity: styles.opacity, // Apply the opacity style for the fading effect
                  }}
                  searchable
                  clearable
                  placeholder="Select a strain"
                  size="md"
                  label="Strains"
                  data={strainsSelectData}
                  onChange={(value) => {
                    if (value) {
                      setSelectedStrainId(value);
                    } else {
                      setSelectedStrainId("");
                    }
                  }}
                />
              )}
            </Transition>
            {selectedBreeder &&
              selectedBreederId &&
              selectedStrainId && (
                <SelectedStrain
                  breederId={selectedBreederId}
                  breederName={selectedBreeder.name}
                  breederLogoUrl={`${baseUrl}${selectedBreeder.logo}`}
                  strainId={selectedStrainId}
                />
              )}
          </Paper>
        </Container>
      )}
    </>
  );
}

function SelectedStrain({
  breederId,
  breederName,
  breederLogoUrl,
  strainId,
}: {
  breederId: string;
  breederName: string;
  breederLogoUrl: string;
  strainId: string;
}) {
  const {
    data: strainInfosFromSeedfinder,
    isLoading: strainInfosFromSeedfinderAreLoading,
    isError: strainInfosFromSeedfinderHaveErrors,
  } = api.strains.getStrainInfo.useQuery(
    { breederId, strainId },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const theme = useMantineTheme();
  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );

  return (
    <>
      {strainId && strainInfosFromSeedfinderAreLoading && (
        <Center>
          <Loader size="md" m="xs" color="growgreen.4" />
        </Center>
      )}

      <Flex
        mih={50}
        gap="md"
        justify="flex-end"
        align="center"
        direction="row"
        wrap="wrap"
      >
        {!!strainInfosFromSeedfinder && (
          <Button
            miw={180}
            fz="lg"
            fullWidth={smallScreen}
            variant="filled"
            color="growgreen"
            type="submit"
            title="This will add 1 plant of this strain to your Grow."
            leftIcon={<IconDeviceFloppy stroke={2.2} size="1.4rem" />}
          >
            Save this Strain as Plant
          </Button>
        )}
      </Flex>

      <Transition
        mounted={
          !strainInfosFromSeedfinderAreLoading &&
          !strainInfosFromSeedfinderHaveErrors &&
          !!strainInfosFromSeedfinder
        }
        transition="scale-y"
        duration={1000} // Duration of the fade animation in milliseconds
        timingFunction="ease"
      >
        {(styles) => (
          <Box
            style={{
              ...styles,
              marginTop: 0,
              opacity: styles.opacity, // Apply the opacity style for the fading effect
            }}
          >
            {strainInfosFromSeedfinder &&
              strainInfosFromSeedfinder.brinfo && (
                <>
                  <Divider
                    // color="groworange.4"
                    fz="lg"
                    my="sm"
                    size="sm"
                    label={
                      <>
                        <IconCannabis stroke={1.8} size={22} />
                        <Title order={2} mx="sm" fz="xl">
                          Strain Infos
                        </Title>
                        <IconCannabis stroke={1.8} size={22} />
                      </>
                    }
                    labelPosition="center"
                  />

                  <Card withBorder p="lg" shadow="sm" radius="md">
                    <Flex
                      gap="md"
                      justify="space-between"
                      align="flex-start"
                      direction="row"
                      wrap="wrap"
                    >
                      <Paper withBorder p="xs" w={400} mih={480}>
                        <Flex direction="column" gap="md">
                          <Title order={3}>
                            Breeder:
                            <Center c="groworange.4">
                              {breederName}
                            </Center>
                          </Title>
                          <Image
                            p="xs"
                            src={breederLogoUrl}
                            alt={breederName}
                          />
                          <Box>
                            <Title order={4}>Description:</Title>
                            {strainInfosFromSeedfinder.brinfo &&
                              strainInfosFromSeedfinder.brinfo
                                .description}
                          </Box>
                        </Flex>
                      </Paper>
                      <Paper
                        withBorder
                        p="xs"
                        w={400}
                        mih={260}
                        // className="flex flex-col space-y-4"
                      >
                        <Flex direction="column" gap="md">
                          <Title order={3}>
                            Strain:
                            <Center c="groworange.4">
                              {strainInfosFromSeedfinder.name}
                            </Center>
                          </Title>
                          {strainInfosFromSeedfinder.brinfo.pic ? (
                            <Image
                              height={320}
                              p="xs"
                              src={strainInfosFromSeedfinder.brinfo.pic}
                              alt={strainInfosFromSeedfinder.name}
                            />
                          ) : (
                            <Text c="dimmed">[no image]</Text>
                          )}
                          <Box>
                            <Title order={4}>Type:</Title>{" "}
                            {strainInfosFromSeedfinder.brinfo &&
                              strainInfosFromSeedfinder.brinfo.type}
                          </Box>
                          <Box>
                            <Title order={4}>CBD:</Title>{" "}
                            {strainInfosFromSeedfinder.brinfo &&
                              strainInfosFromSeedfinder.brinfo.cbd}
                          </Box>{" "}
                          <Title order={4}>Description:</Title>{" "}
                          <ScrollArea h={160} type="always">
                            {strainInfosFromSeedfinder.brinfo &&
                              strainInfosFromSeedfinder.brinfo.descr}
                          </ScrollArea>
                        </Flex>

                        {/* Render other strain information as needed */}
                        <Link
                          href={
                            strainInfosFromSeedfinder.links &&
                            strainInfosFromSeedfinder.links.info
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button w={100} my="xs" compact>
                            More Info
                          </Button>
                        </Link>
                        <Link
                          href={
                            strainInfosFromSeedfinder.links &&
                            strainInfosFromSeedfinder.links.review
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button w={100} my="xs" ml="xs" compact>
                            Reviews
                          </Button>
                        </Link>
                        {/* Add other links as needed */}
                      </Paper>
                    </Flex>
                  </Card>
                </>
              )}
          </Box>
        )}
      </Transition>
    </>
  );
}
