import {
  ActionIcon,
  Box,
  Card,
  Center,
  Container,
  Divider,
  Flex,
  Loader,
  Paper,
  Popover,
  Select,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconDeviceFloppy,
  IconInfoCircle,
  IconPlantOff,
} from "@tabler/icons-react";
import { env } from "~/env.mjs";

import { useCallback, useEffect, useMemo, useState } from "react";

import SelectedStrain from "~/components/Atom/SelectedStrain";

import type { BreederFromSeedfinder, MantineSelectData } from "~/types";

import { api } from "~/utils/api";

interface AddPlantProps {
  growId: string;
}

const AddPlant = ({ growId }: AddPlantProps) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";
  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );
  const trpc = api.useUtils();

  const [opened, setOpened] = useState(false);
  const [plantsInGrow, setPlantsInGrow] = useState<JSX.Element[]>([]);
  const [plantIdToDelete, setPlantIdToDelete] = useState<string>();
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
    mutate: tRPCdeletePlantById,
    isLoading: tRPCdeletePlantByIdIsLoading,
  } = api.strains.deletePlantById.useMutation({
    async onSuccess(result, _plant) {
      console.debug("SUCCESS strains.savePlantToGrow.useMutation");
      console.debug(result);
      //refresh content of allPlantsInGrow table
      await trpc.strains.getAllPlantsByReportId.refetch();
    },
  });

  // FETCH getAllPlantsByReportId
  const {
    data: allPlantsInGrow,
    isLoading: allPlantsInGrowAreLoading,
    isError: allPlantsInGrowHaveErrors,
    error: _allPlantsInGrowError,
  } = api.strains.getAllPlantsByReportId.useQuery(
    { reportId: growId },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  // Initialize elements array
  const allPlantsInGrowMemo = useMemo(() => {
    const p: {
      id: string;
      strainName: string;
      breeder_name: string;
      flowering_days: number;
      automatic: boolean;
    }[] = [];
    if (!allPlantsInGrowAreLoading && !allPlantsInGrowHaveErrors) {
      allPlantsInGrow.forEach((plant) => {
        p.push({
          id: plant.id,
          strainName: plant.seedfinderStrain.name,
          breeder_name: plant.seedfinderStrain.breeder_name,
          flowering_days: plant.seedfinderStrain.flowering_days,
          automatic: plant.seedfinderStrain.flowering_automatic,
        });
      });
    }
    return p;
  }, [
    allPlantsInGrow,
    allPlantsInGrowAreLoading,
    allPlantsInGrowHaveErrors,
  ]);

  const handleDeletePlant = useCallback(
    (plantId: string) => {
      // Trigger the deletePlantMutation with the provided plantId
      setPlantIdToDelete(plantId);
      tRPCdeletePlantById({ plantId });
    },
    [setPlantIdToDelete, tRPCdeletePlantById]
  );

  // FETCH allBreederFromSeedfinder
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

  // BUILD PlantsInGrow TABLE ROWS
  useEffect(() => {
    const rows = allPlantsInGrowMemo.map((element) => (
      <tr key={element.id}>
        <td>{element.strainName}</td>

        {!smallScreen && <td>{element.breeder_name}</td>}

        <td>
          <TextInput
            // size="sm"
            w="100%"
            withAsterisk
            placeholder="give name"
            rightSection={
              <ActionIcon
                size="sm"
                color="growgreen.4"
                variant="filled"
                title="save plant name"
              >
                <IconDeviceFloppy />
              </ActionIcon>
            }
          />
        </td>
        <td>
          <Flex justify="flex-end">
            {/* DELETE BUTTON */}
            <ActionIcon
              size="sm"
              color="red.7"
              variant="filled"
              title="delete this plant"
              loading={
                plantIdToDelete === element.id &&
                tRPCdeletePlantByIdIsLoading
              }
              disabled={
                plantIdToDelete !== element.id &&
                tRPCdeletePlantByIdIsLoading
              }
              p={2}
              onClick={() => handleDeletePlant(element.id)} // Call handleDeletePlant on click
            >
              <IconPlantOff size={20} />
            </ActionIcon>
          </Flex>
        </td>
      </tr>
    ));
    setPlantsInGrow(rows);
  }, [
    plantIdToDelete,
    allPlantsInGrowMemo,
    tRPCdeletePlantByIdIsLoading,
    smallScreen,
    handleDeletePlant,
  ]);

  // BUILD BreedersSelectData
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

  // BUILD StrainsSelectData
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
    <Container
      mih="130vh"
      py="xl"
      px={0}
      className="flex flex-col space-y-4"
    >
      <Paper mih={160} withBorder p="sm">
        <Title order={3}>Current plants in your grow</Title>

        <Box className="relative">
          <Table
            mt="xs"
            striped
            withBorder
            fontSize="sm"
            horizontalSpacing={4}
            verticalSpacing={4}
          >
            <thead>
              <tr>
                <th>Strain name</th>
                {!smallScreen && <th>Breeder name</th>}
                <th>
                  Plant Name
                  <Popover
                    opened={opened}
                    onChange={setOpened}
                    width={200}
                    position="bottom-start"
                    withArrow
                    shadow="md"
                  >
                    <Popover.Target>
                      <ThemeIcon
                        onMouseOver={() => setOpened(true)}
                        onMouseLeave={() => setOpened(false)}
                        ml={10}
                        mt={-8}
                        variant="default"
                        size="sm"
                        c="growgreen.3"
                      >
                        <IconInfoCircle />
                      </ThemeIcon>
                    </Popover.Target>
                    <Popover.Dropdown p={4} bg="growgreen.4">
                      <Card p="xs">
                        <Text size="sm">
                          You can give each plant its own name so that
                          you can easily identify and recognize it
                          later. <br />
                          This is optional!
                        </Text>
                      </Card>
                    </Popover.Dropdown>
                  </Popover>
                </th>
                <th>&nbsp;</th>
              </tr>
            </thead>

            <Transition
              mounted={!allPlantsInGrowAreLoading}
              transition="scale-y"
              duration={400}
              timingFunction="ease"
            >
              {(styles) => (
                <tbody
                  style={{
                    ...styles,
                  }}
                >
                  {plantsInGrow}
                </tbody>
              )}
            </Transition>
          </Table>
          {allPlantsInGrowAreLoading && (
            <Box className="absolute top-6 left-0 right-0">
              <Center>
                <Loader
                  m="xs"
                  size="md"
                  variant="bars"
                  color="growgreen.4"
                />
              </Center>
            </Box>
          )}
        </Box>
      </Paper>

      <Divider
        py="md"
        size="md"
        labelPosition="center"
        // color={dark ? "groworange.4" : "groworange.6"}
        label="Add new Strains as Plants to your Grow"
        labelProps={{
          color: dark ? "growgreen.4" : "growgreen.8",
          fz: smallScreen ? "sm" : "lg",
          fw: 700,
        }}
      />

      <Paper mih={180} withBorder p="sm" className="z-10">
        <Title order={3}>Add new plants to your grow</Title>
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
          transition="scale-y"
          duration={400}
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
              //fixes z-index issue of lower strainsSelectBox
              onFocus={() => {
                setSelectedBreederId(null);
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

      {selectedStrainId && selectedBreederId && selectedBreeder && (
        <SelectedStrain
          growid={growId}
          strainId={selectedStrainId}
          breederId={selectedBreederId}
          breederName={selectedBreeder.name}
          breederLogoUrl={`${env.NEXT_PUBLIC_SEEDFINDER_BREEDER_LOGO_BASEURL}${selectedBreeder.logo}`}
        />
      )}
    </Container>
  );
};

export default AddPlant;
