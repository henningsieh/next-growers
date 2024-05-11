import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Flex,
  Loader,
  Paper,
  ScrollArea,
  Select,
  Text,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconExternalLink } from "@tabler/icons-react";
import { decode } from "html-entities";
import { env } from "~/env.mjs";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import type { BreederFromSeedfinder } from "~/types";

import { api } from "~/utils/api";

type MantineSelectData = { value: string; label: string }[];

const AddPlant = () => {
  const [breedersSelectData, setBreedersSelectData] =
    useState<MantineSelectData>([]);
  const [selectedBreederId, setSelectedBreederId] = useState<
    string | null
  >(null);
  const [strainsSelectData, setStrainsSelectData] =
    useState<MantineSelectData>([]);
  const [selectedStrainId, setSelectedStrainId] = useState<
    string | null
  >(null);
  const [selectedBreeder, setSelectedBreeder] = useState<
    BreederFromSeedfinder | undefined
  >(undefined);

  const {
    data: allBreederFromSeedfinder,
    isLoading: allBreederFromSeedfinderAreLoading,
    isError: allBreederFromSeedfinderHaveErrors,
    error: allBreederFromSeedfinderError,
  } = api.strains.getAllBreederFromSeedfinder.useQuery(
    { breeder: "all", strains: "1" },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (
      !allBreederFromSeedfinderAreLoading &&
      allBreederFromSeedfinderHaveErrors
    ) {
      console.error({ allBreederFromSeedfinderError });
    } else if (
      !allBreederFromSeedfinderAreLoading &&
      !allBreederFromSeedfinderHaveErrors
    ) {
      const breedersOptions: MantineSelectData =
        allBreederFromSeedfinder !== undefined
          ? Object.keys(allBreederFromSeedfinder).map((key) => ({
              value: key,
              label: allBreederFromSeedfinder[key].name,
            }))
          : [];
      setBreedersSelectData(breedersOptions);
    }
  }, [
    allBreederFromSeedfinder,
    allBreederFromSeedfinderAreLoading,
    allBreederFromSeedfinderError,
    allBreederFromSeedfinderHaveErrors,
  ]);

  useEffect(() => {
    if (
      selectedBreederId &&
      allBreederFromSeedfinder &&
      selectedBreederId in allBreederFromSeedfinder
    ) {
      const selectedBreeder =
        allBreederFromSeedfinder[selectedBreederId];
      const strainsOptions: MantineSelectData = Object.keys(
        selectedBreeder.strains
      ).map((strainId) => ({
        value: strainId,
        label: selectedBreeder.strains[strainId],
      }));
      setSelectedBreeder(selectedBreeder);
      setStrainsSelectData(strainsOptions);
    } else {
      setStrainsSelectData([]);
    }
  }, [selectedBreederId, allBreederFromSeedfinder]);

  return (
    <Container py="xl" px={0} className="flex flex-col space-y-2">
      <Paper mih={180} withBorder p="sm" className="z-10">
        {allBreederFromSeedfinderAreLoading && (
          <Center>
            <Loader
              m="xs"
              size="md"
              variant="bars"
              color="growgreen.4"
            />
          </Center>
        )}
        <Transition
          mounted={!!allBreederFromSeedfinder}
          transition="fade"
          duration={330}
          timingFunction="ease"
        >
          {(transitionStyles) => (
            <Select
              style={{ ...transitionStyles }}
              mb="sm"
              data={breedersSelectData}
              placeholder="Select a breeder"
              size="sm"
              label="Breeder"
              searchable
              clearable
              onChange={(value) => {
                setSelectedStrainId("");
                setSelectedBreederId(value);
              }}
            />
          )}
        </Transition>
        <Transition
          mounted={strainsSelectData.length > 0}
          transition="scale-y"
          duration={330}
          timingFunction="ease"
        >
          {(transitionStyles) => (
            <Select
              style={{ ...transitionStyles }}
              disabled={strainsSelectData.length == 0}
              data={strainsSelectData}
              placeholder="Select a strain"
              size="sm"
              label="Strain"
              searchable
              clearable
              value={selectedStrainId}
              onChange={(value) => {
                setSelectedStrainId(value);
              }}
            />
          )}
        </Transition>
      </Paper>

      {selectedBreeder && selectedBreederId && selectedStrainId && (
        <SelectedStrain
          breederId={selectedBreederId}
          breederName={selectedBreeder.name}
          breederLogoUrl={`${env.NEXT_PUBLIC_SEEDFINDER_BREEDER_LOGO_BASEURL}${selectedBreeder.logo}`}
          strainId={selectedStrainId}
        />
      )}
    </Container>
  );
};

export default AddPlant;

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
  } = api.strains.getStrainInfoFromSeedfinder.useQuery(
    { breederId, strainId },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  // Ensure strainInfosFromSeedfinder and strainInfosFromSeedfinder.brinfo are defined before accessing pic
  const picUrl = strainInfosFromSeedfinder?.brinfo?.pic;

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const mediumScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.md})`
  );

  return (
    <Transition
      mounted={
        !strainInfosFromSeedfinderAreLoading &&
        !strainInfosFromSeedfinderHaveErrors &&
        !!strainInfosFromSeedfinder
      }
      transition="fade"
      duration={500} // Duration of the fade animation in milliseconds
      timingFunction="ease"
    >
      {(styles) => (
        <Box
          style={{
            ...styles,
            opacity: styles.opacity, // Apply the opacity style for the fading effect
          }}
        >
          {strainInfosFromSeedfinder &&
            strainInfosFromSeedfinder.brinfo && (
              <Paper withBorder p="lg" shadow="sm" radius="md">
                <Flex
                  gap="md"
                  justify="space-between"
                  align="flex-start"
                  direction="row"
                  wrap="wrap"
                >
                  <Card
                    w="100%"
                    withBorder
                    p="xs"
                    // mih={260}
                    // className="flex flex-col space-y-4"
                  >
                    <Flex
                      align="flex-start"
                      justify="space-between"
                      gap="xs"
                      direction={mediumScreen ? "column" : "row"}
                    >
                      <Box>
                        <Title order={2} c="groworange.4">
                          {strainInfosFromSeedfinder.name}
                        </Title>
                        <Box mt="xs">
                          <Flex direction="column" gap="md">
                            <Box>
                              <Title order={4}>Type:</Title>
                              <Text
                                pl="xs"
                                fz="sm"
                                w={360}
                                bg={
                                  dark
                                    ? theme.colors.dark[7]
                                    : theme.colors.gray[1]
                                }
                              >
                                {strainInfosFromSeedfinder.brinfo.type}
                              </Text>
                            </Box>

                            <Box>
                              <Title order={4}>CBD:</Title>
                              <Text
                                px="xs"
                                fz="sm"
                                w={360}
                                bg={
                                  dark
                                    ? theme.colors.dark[7]
                                    : theme.colors.gray[1]
                                }
                              >
                                {strainInfosFromSeedfinder.brinfo.cbd}
                              </Text>
                            </Box>

                            <Box>
                              <Title order={4}>Description:</Title>
                              <ScrollArea
                                ml={2}
                                mr={2}
                                miw={370}
                                mah={160}
                                type="always"
                                offsetScrollbars
                                styles={(theme) => ({
                                  corner: {
                                    opacity: 1,
                                    background:
                                      theme.colorScheme === "dark"
                                        ? theme.colors.dark[6]
                                        : theme.white,
                                  },

                                  scrollbar: {
                                    "&, &:hover": {
                                      background:
                                        theme.colorScheme === "dark"
                                          ? theme.colors.dark[6]
                                          : theme.white,
                                    },

                                    '&[data-orientation="vertical"] .mantine-ScrollArea-thumb':
                                      {
                                        backgroundColor:
                                          theme.colors.groworange[5],
                                      },

                                    // '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb':
                                    //   {
                                    //     backgroundColor:
                                    //       theme.colors.blue[6],
                                    //   },
                                  },
                                })}
                              >
                                <Box
                                  fz="sm"
                                  px="xs"
                                  bg={
                                    dark
                                      ? theme.colors.dark[7]
                                      : theme.colors.gray[1]
                                  }
                                  dangerouslySetInnerHTML={{
                                    __html: decode(
                                      strainInfosFromSeedfinder.brinfo
                                        .descr
                                    ) as TrustedHTML,
                                  }}
                                ></Box>
                              </ScrollArea>
                            </Box>
                          </Flex>
                        </Box>
                      </Box>
                      <Paper p="xs" withBorder>
                        {picUrl && (
                          // Render the image only if picUrl is defined
                          <Flex
                            gap="xs"
                            direction={mediumScreen ? "row" : "column"}
                            align="flex-end"
                            // justify="flex-end"
                            wrap="wrap"
                          >
                            <Box>
                              <Title
                                className=" z-10"
                                fz="sm"
                                order={5}
                                c="groworange.4"
                              >
                                {breederName}
                              </Title>
                              <Center pos="relative" w={220} h={220}>
                                <Image
                                  fill
                                  src={breederLogoUrl}
                                  alt={breederName}
                                />
                              </Center>
                            </Box>
                            <Box mt="xs" pos="relative" w={220} h={220}>
                              <Image
                                fill
                                src={picUrl}
                                alt={breederName}
                              />
                            </Box>
                          </Flex>
                        )}
                      </Paper>
                      {/* <Card mih={200} p={4} withBorder>
                          {picUrl && (
                            // Render the image only if picUrl is defined
                            <>
                              <Title order={5}>
                                Breeder: {breederName}
                              </Title>
                              <Image
                                width={140}
                                // p="xs"
                                src={breederLogoUrl}
                                alt={breederName}
                              />
                            </>
                          )}
                        </Card> */}
                    </Flex>

                    {/* Render other strain information as needed */}
                    <Flex align="flex-start" justify="flex-start">
                      <Link
                        href={
                          strainInfosFromSeedfinder.links &&
                          strainInfosFromSeedfinder.links.info
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          rightIcon={<IconExternalLink size="1rem" />}
                          className="cursor-pointer"
                          w={110}
                          my="xs"
                          compact
                        >
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
                        <Button
                          rightIcon={<IconExternalLink size="1rem" />}
                          className="cursor-pointer"
                          w={110}
                          my="xs"
                          ml="xs"
                          compact
                        >
                          Reviews
                        </Button>
                      </Link>
                    </Flex>
                    {/* Add other links as needed */}
                  </Card>
                  {/* <Paper withBorder p="xs" w={200} mih={480}>
                    <Flex direction="column" gap="md">
                      <Title order={3}>Breeder: {breederName}</Title>
                      <Image
                        p="xs"
                        src={breederLogoUrl}
                        alt={breederName}
                      />
                    </Flex>
                    <p>
                      <strong>Description:</strong>{" "}
                      {strainInfosFromSeedfinder.brinfo.description}
                    </p>
                  </Paper> */}
                </Flex>
              </Paper>
            )}
        </Box>
      )}
    </Transition>
  );
}
