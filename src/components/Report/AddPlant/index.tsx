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
  SimpleGrid,
  Stack,
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

  const strainImageUrl = strainInfosFromSeedfinder?.brinfo?.pic;

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const mediumScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );

  return (
    <>
      <Paper withBorder p="sm" shadow="sm" radius="md">
        <Center>
          {strainInfosFromSeedfinderAreLoading &&
            !strainInfosFromSeedfinderHaveErrors &&
            !!!strainInfosFromSeedfinder && (
              <Loader
                m="xs"
                size="md"
                variant="bars"
                color="growgreen.4"
              />
            )}
        </Center>

        <Transition
          mounted={
            !strainInfosFromSeedfinderAreLoading &&
            !strainInfosFromSeedfinderHaveErrors &&
            strainInfosFromSeedfinder != undefined
          }
          transition="fade"
          duration={500} // Duration of the fade animation in milliseconds
          timingFunction="ease"
        >
          {(styles) => (
            <SimpleGrid
              style={{
                ...styles,
                opacity: styles.opacity, // Apply the opacity style for the fading effect
              }}
              breakpoints={[
                { maxWidth: "sm", cols: 1 },
                { minWidth: "sm", cols: 2 },
              ]}
            >
              <Card w="100%" withBorder>
                {strainInfosFromSeedfinder && (
                  <>
                    <Title mb="sm" order={2} c="groworange.4">
                      {strainInfosFromSeedfinder.name}
                    </Title>
                    <Flex direction="column" gap="md">
                      <Box>
                        <Flex justify="space-between" gap="sm">
                          <Box>
                            <Title order={3}>Art:</Title>
                            <Text
                              px="xs"
                              fz="sm"
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
                            <Title order={3}>Flowering:</Title>
                            <Text
                              px="xs"
                              fz="sm"
                              bg={
                                dark
                                  ? theme.colors.dark[7]
                                  : theme.colors.gray[1]
                              }
                            >
                              {
                                strainInfosFromSeedfinder.brinfo
                                  .flowering.days
                              }
                            </Text>
                            <Text
                              px="xs"
                              fz="sm"
                              bg={
                                dark
                                  ? theme.colors.dark[7]
                                  : theme.colors.gray[1]
                              }
                            >
                              {
                                strainInfosFromSeedfinder.brinfo
                                  .flowering.info
                              }
                            </Text>
                            <Text
                              px="xs"
                              fz="sm"
                              bg={
                                dark
                                  ? theme.colors.dark[7]
                                  : theme.colors.gray[1]
                              }
                            >
                              Automatic:{" "}
                              {strainInfosFromSeedfinder.brinfo
                                .flowering.auto
                                ? `yes`
                                : `no`}
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                      <Box>
                        <Title order={4}>CBD:</Title>
                        <Text
                          px="xs"
                          fz="sm"
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
                        <Paper
                          w="100%"
                          bg={
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[6]
                              : theme.white
                          }
                        >
                          <ScrollArea
                            w="100%"
                            h={160}
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

                                '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb':
                                  {
                                    backgroundColor:
                                      theme.colors.blue[6],
                                  },
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
                                  strainInfosFromSeedfinder.brinfo.descr
                                ) as TrustedHTML,
                              }}
                            ></Box>
                            <Box>
                              {
                                strainInfosFromSeedfinder.brinfo
                                  .description
                              }
                            </Box>
                          </ScrollArea>
                        </Paper>
                      </Box>
                    </Flex>
                    <Button
                      title="Seedfinder.eu"
                      component={Link}
                      target="_blank"
                      className="cursor-pointer"
                      href={strainInfosFromSeedfinder.links.info}
                      compact
                      rightIcon={<IconExternalLink size="1rem" />}
                    >
                      Strain Data
                    </Button>
                  </>
                )}
              </Card>
              <Card withBorder>
                {strainInfosFromSeedfinder && (
                  <Stack
                    h="100%"
                    align="flex-start"
                    justify="space-between"
                  >
                    <Box>
                      <Title order={2} c="groworange.4">
                        {breederName}
                      </Title>
                      <Box mb="sm">
                        {strainInfosFromSeedfinder.brinfo.description}
                      </Box>
                      <Flex
                        wrap="wrap"
                        align={mediumScreen ? "center" : "start"} //center if small
                        justify="space-between"
                        gap="xs"
                        direction={mediumScreen ? "column" : "row"} // column if small
                      >
                        <Center pos="relative" w={200} h={200}>
                          <Image
                            fill
                            src={breederLogoUrl}
                            style={{ objectFit: "contain" }}
                            alt={breederName}
                          />
                        </Center>

                        <Center pos="relative" w={200} h={200}>
                          {strainImageUrl && (
                            <Image
                              fill
                              src={strainImageUrl}
                              style={{ objectFit: "contain" }}
                              alt={breederName}
                            />
                          )}
                        </Center>
                      </Flex>
                    </Box>
                    <Box>
                      <Button
                        title={strainInfosFromSeedfinder.brinfo.name}
                        component={Link}
                        target="_blank"
                        className="cursor-pointer"
                        href={strainInfosFromSeedfinder.brinfo.link}
                        compact
                        rightIcon={<IconExternalLink size="1rem" />}
                      >
                        Website
                      </Button>
                    </Box>
                  </Stack>
                )}
              </Card>
            </SimpleGrid>
          )}
        </Transition>
      </Paper>
    </>
  );
}
