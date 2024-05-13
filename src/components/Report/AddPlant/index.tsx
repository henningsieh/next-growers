import {
  ActionIcon,
  Card,
  Center,
  Container,
  Flex,
  Loader,
  Paper,
  Popover,
  Select,
  Space,
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

import { useEffect, useState } from "react";

import SelectedStrain from "~/components/Atom/SelectedStrain";

import type { BreederFromSeedfinder } from "~/types";

import { api } from "~/utils/api";

type MantineSelectData = { value: string; label: string }[];

const elements = [
  {
    id: "qwoeufzgqweicuzgqweoicuzv1", //plantId
    strainName: "Auto Chocolate Cream", // strainInfosFromSeedfinder.name
    breeder_name: "Linda Seeds",
    flowering_days: 63,
    automatic: false,
  },
  {
    id: "qwoeufzgqweicuzgqweoicuzv2", //plantId
    strainName: "Auto 00 Kush", // strainInfosFromSeedfinder.name
    breeder_name: "00 Seeds Bank",
    flowering_days: 75,
    automatic: true,
  },
];

interface AddPlantProps {
  growId: string;
}

const AddPlant = ({ growId }: AddPlantProps) => {
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

  const theme = useMantineTheme();
  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );

  const rows = elements.map((element) => (
    <tr key={element.id}>
      <td>
        <Flex justify="flex-start">
          {/* // DELETE BUTTON */}
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

  const [opened, setOpened] = useState(false);

  return (
    <Container py="xl" px={0} className="flex flex-col space-y-2">
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
                      // onMouseLeave={() => setOpened(true)}
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
          <tbody>{rows}</tbody>
        </Table>
        {/* </Card> */}
      </Paper>
      <Space h="xl" />
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
