import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Loader,
  Paper,
  Select,
  Table,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlantOff, IconTrashFilled } from "@tabler/icons-react";
import { env } from "~/env.mjs";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";

import SelectedStrain from "~/components/Atom/SelectedStrain";

import type { BreederFromSeedfinder, MantineSelectData } from "~/types";

import { api } from "~/utils/api";
import { InputSavePlantName } from "~/utils/inputValidation";

interface AddPlantProps {
  growId: string;
}

const AddPlant = ({ growId }: AddPlantProps) => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";
  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );
  const trpc = api.useUtils();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Initialize deletePlant function
  const {
    mutate: tRPCdeletePlantById,
    isLoading: tRPCdeletePlantByIdIsLoading,
  } = api.strains.deletePlantById.useMutation({
    onMutate: (_plantId) => {
      console.debug("START strains.deletePlantById.useMutation");
    },
    async onSuccess(_result, _plant) {
      console.debug("SUCCESS strains.deletePlantById.useMutation");
      //refresh content of allPlantsInGrow table
      await trpc.strains.getAllPlantsByReportId.refetch();
    },
  });

  const handleDeletePlant = useCallback(
    (plantId: string) => {
      setPlantIdToDelete(plantId); // needed for button disabled and loading states
      tRPCdeletePlantById({ plantId });
    },
    [setPlantIdToDelete, tRPCdeletePlantById]
  );

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

  // Initialize plants array
  const allPlantsInGrowMemo = useMemo(() => {
    const plants: {
      id: string;
      plantName: string;
      strainName: string;
      breeder_name: string;
      flowering_days: number;
      automatic: boolean;
    }[] = [];
    if (!allPlantsInGrowAreLoading && !allPlantsInGrowHaveErrors) {
      allPlantsInGrow.forEach((plant) => {
        plants.push({
          id: plant.id,
          plantName: plant.plantName,
          strainName: plant.seedfinderStrain.name,
          breeder_name: plant.seedfinderStrain.breeder_name,
          flowering_days: plant.seedfinderStrain.flowering_days,
          automatic: plant.seedfinderStrain.flowering_automatic,
        });
      });
    }
    return plants;
  }, [
    allPlantsInGrow,
    allPlantsInGrowAreLoading,
    allPlantsInGrowHaveErrors,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const savePlantNameForm = useForm({
    validate: zodResolver(InputSavePlantName),
    validateInputOnChange: true,
    initialValues: {
      plantName: null,
      plantId: "",
    },
  });

  // BUILD PlantsInGrow TABLE ROWS
  useEffect(() => {
    const rows = allPlantsInGrowMemo.map((plant) => (
      <tr key={plant.id}>
        <td>{plant.strainName}</td>

        {!smallScreen && <td>{plant.breeder_name}</td>}

        {/* <td>
          <TextInput
            type="text"
            {...savePlantNameForm.getInputProps("plantId")}
            value={plant.id}
          />
          <TextInput
            // size="sm"
            w="100%"
            withAsterisk
            placeholder="each plant has its own name"
            rightSection={
              <Tooltip label="comming soon!">
                <ActionIcon
                  size="sm"
                  color="growgreen.4"
                  variant="filled"
                  title="save plant name"
                  onClick={(event) => {
                    console.debug(event.target);
                    // I need to console.debug the value of
                    // value={plant.id} and value={plant.plantName} here!!??
                  }}
                >
                  <IconDeviceFloppy />
                </ActionIcon>
              </Tooltip>
            }
            {...savePlantNameForm.getInputProps("plantName")}
            value={plant.plantName}
          />
        </td> */}
        <td className="w-24">
          <Flex justify="flex-end">
            {/* DELETE BUTTON */}
            <Button
              w={90}
              px={0}
              size="sm"
              compact
              //c={theme.colors.red[7]}
              color="red"
              variant="filled"
              title="delete this plant"
              loading={
                plantIdToDelete === plant.id &&
                tRPCdeletePlantByIdIsLoading
              }
              // disabled={
              //   plantIdToDelete !== element.id &&
              //   tRPCdeletePlantByIdIsLoading
              // }
              leftIcon={<IconTrashFilled size={18} />}
              onClick={() => handleDeletePlant(plant.id)} // Call handleDeletePlant on click
            >
              {" "}
              Delete
            </Button>
          </Flex>
        </td>
      </tr>
    ));
    setPlantsInGrow(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    plantIdToDelete,
    allPlantsInGrowMemo,
    tRPCdeletePlantByIdIsLoading,
    smallScreen,
    handleDeletePlant,
    theme.white,
    // savePlantNameForm,
  ]);

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
        <Title order={3}>
          {activeLocale === "de"
            ? "Aktuelle Pflanzen in deinem Grow"
            : "Current plants in your grow"}
        </Title>

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
                <th>{activeLocale === "de" ? "Sorte" : "Strain"}</th>

                {!smallScreen && (
                  <th>
                    {activeLocale === "de" ? "Züchter" : "Breeder"}
                  </th>
                )}
                {/* <th>
                  Plant Name
                  <Popover
                    opened={opened}
                    onChange={setOpened}
                    width={200}
                    position="top"
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
                        <Text c="dimmed" size="sm">
                          You can give each plant its own name so that
                          you can easily identify it later. <br />
                        </Text>
                      </Card>
                    </Popover.Dropdown>
                  </Popover>
                </th> */}
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
          {!allPlantsInGrowAreLoading && plantsInGrow.length === 0 && (
            <Alert
              icon={<IconPlantOff size="1rem" />}
              title={activeLocale === "de" ? "Schade!" : "Bummer!"}
              color="red"
              variant="outline"
            >
              {activeLocale === "de"
                ? "Dein Grow hat noch keine Pflanzen!"
                : "Your Grow has no plants yet!"}
            </Alert>
          )}

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
        label={
          activeLocale === "de"
            ? "Sorte als neue Pflanze zum Grow hinzufügen"
            : "Add Strain as a new Plant to your Grow"
        }
        labelProps={{
          color: dark ? "growgreen.4" : "growgreen.8",
          fz: smallScreen ? "sm" : "lg",
          fw: 700,
        }}
      />

      <Paper mih={180} withBorder p="sm" className="z-10">
        <Title order={3}>
          {activeLocale === "de"
            ? "Neue Pflanze hinzufügen"
            : "Add new plant to your grow"}
        </Title>

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
              label={activeLocale === "de" ? "Züchter" : "Breeder"}
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
              label={activeLocale === "de" ? "Sorte" : "Strain"}
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
