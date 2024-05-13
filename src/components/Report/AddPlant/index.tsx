import {
  ActionIcon,
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
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconDeviceFloppy,
  IconInfoCircle,
  IconPlantOff,
} from "@tabler/icons-react";
import { env } from "~/env.mjs";

import { useEffect, useMemo, useState } from "react";

import SelectedStrain from "~/components/Atom/SelectedStrain";

import type { BreederFromSeedfinder, MantineSelectData } from "~/types";

import { api } from "~/utils/api";

interface AddPlantProps {
  growId: string;
}

const AddPlant = ({ growId }: AddPlantProps) => {
  const theme = useMantineTheme();
  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );

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

  // Inside your component function
  const [plantsInGrow, setPlantsInGrow] = useState<JSX.Element[]>([]);

  // FETCH allBreederFromSeedfinder
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

  useEffect(() => {
    const rows = allPlantsInGrowMemo.map((element) => (
      <tr key={element.id}>
        <td>
          <Flex justify="flex-start">
            {/* DELETE BUTTON */}
            <ActionIcon
              p={2}
              color="red.7"
              variant="outline"
              size={30}
              title="delete this plant"
            >
              <IconPlantOff size={20} />
            </ActionIcon>
          </Flex>
        </td>
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
                variant="filled"
                size="sm"
                title="save plant name"
                color="growgreen.4"
              >
                <IconDeviceFloppy />
              </ActionIcon>
            }
          />
        </td>
        {/* <td>{element.flowering_days}</td>
      <td>{element.automatic ? "yes" : "no"}</td> */}
      </tr>
    ));
    setPlantsInGrow(rows);
  }, [allPlantsInGrowMemo, smallScreen]);

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

  // BUILD BreedersSelectData II DATA AVAILABLE
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

  // BUILD StrainsSelectData IF DATA AVAILABLE
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

  const [opened, setOpened] = useState(false);

  return (
    <Container py="xl" px={0} className="flex flex-col space-y-4">
      <Paper withBorder p="sm">
        <Title order={3}>Current plants in your grow</Title>
        {/* <Card> */}
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
              <th>&nbsp;</th>
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
                        You can give each plant its own name so that you
                        can easily identify and recognize it later.{" "}
                        <br />
                        This is optional!
                      </Text>
                    </Card>
                  </Popover.Dropdown>
                </Popover>
              </th>
              {/* <th>Flowering Days</th>
              <th>Automatic</th> */}
            </tr>
          </thead>
          <tbody>{plantsInGrow}</tbody>
        </Table>
        {/* </Card> */}
      </Paper>

      <Divider
        py="md"
        label="Add new Strain as a Plant"
        labelPosition="center"
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
          growid={growId}
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
