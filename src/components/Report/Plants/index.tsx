import {
  Accordion,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCannabis, IconExternalLink } from "@tabler/icons-react";
import { decode } from "html-entities";

import Image from "next/image";
//import Image from "next/image";
import Link from "next/link";

import type { Plant } from "~/types";

interface Props {
  plants: Plant[];
}

export default function Plants({ plants }: Props) {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";
  const mediumScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );

  return (
    <>
      <Title p="xs" order={3}>
        My Plants
      </Title>
      <Accordion
        radius="sm"
        variant="separated"
        bottom={100}
        transitionDuration={420}
        chevronSize={36}
        chevron={<IconCannabis />}
      >
        {plants.map((plant, key) => (
          <Accordion.Item value={plant.id} key={key}>
            <Accordion.Control icon={<Box fz={28}>🪴</Box>} py={0}>
              <Title mt={8} order={2} c={theme.colors.groworange[5]}>
                {plant.plantName && `${plant.plantName} | `}
                {plant.seedfinderStrain.name}
                {plant.seedfinderStrain.breeder_name &&
                  ` | ${plant.seedfinderStrain.breeder_name}`}
              </Title>
            </Accordion.Control>
            <Accordion.Panel>
              <SimpleGrid
                mb="md"
                breakpoints={[
                  { maxWidth: "sm", cols: 1 },
                  { minWidth: "sm", cols: 2 },
                ]}
              >
                <Card p="sm" w="100%" withBorder>
                  <Title order={4}>Strain:</Title>
                  <Center>
                    <Title mb="sm" order={2} c="groworange.4">
                      {plant.seedfinderStrain.name}
                    </Title>
                  </Center>
                  <Flex direction="column" gap="md">
                    <Box>
                      <Flex justify="space-between" gap="sm">
                        <Box>
                          <Title order={4}>Art:</Title>
                          <Text
                            px="xs"
                            fz="sm"
                            bg={
                              dark
                                ? theme.colors.dark[7]
                                : theme.colors.gray[1]
                            }
                          >
                            {plant.seedfinderStrain.type}
                          </Text>
                        </Box>
                        <Box>
                          <Title order={4}>Flowering:</Title>
                          <Text
                            px="xs"
                            fz="sm"
                            bg={
                              dark
                                ? theme.colors.dark[7]
                                : theme.colors.gray[1]
                            }
                          >
                            {plant.seedfinderStrain.flowering_days}
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
                            {plant.seedfinderStrain.flowering_info}
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
                            {plant.seedfinderStrain.flowering_automatic
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
                        {plant.seedfinderStrain.cbd}
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
                                  backgroundColor: theme.colors.blue[6],
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
                                plant.seedfinderStrain.description
                              ) as TrustedHTML,
                            }}
                          ></Box>
                        </ScrollArea>
                      </Paper>
                    </Box>
                  </Flex>
                  <Button
                    title="Seedfinder.eu"
                    component={Link}
                    target="_blank"
                    className="cursor-pointer"
                    href={plant.seedfinderStrain.seedfinder_ext_url}
                    compact
                    leftIcon={<IconExternalLink size="1rem" />}
                  >
                    Infos on Seedfinder.eu
                  </Button>
                </Card>

                <Card p="sm" withBorder>
                  <Stack
                    h="100%"
                    align="flex-start"
                    justify="space-between"
                  >
                    <Box>
                      <Title order={4}>Breeder:</Title>
                      <Center>
                        <Title order={2} c="groworange.4">
                          {plant.seedfinderStrain.breeder_name}
                        </Title>
                      </Center>
                      <Box mb="sm">
                        {plant.seedfinderStrain.breeder_description}
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
                            src={
                              plant.seedfinderStrain.breeder_logo_url
                            }
                            style={{ objectFit: "contain" }}
                            alt={plant.seedfinderStrain.breeder_name}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </Center>

                        <Center pos="relative" w={200} h={200}>
                          {plant.seedfinderStrain.picture_url && (
                            <Image
                              fill
                              src={plant.seedfinderStrain.picture_url}
                              style={{ objectFit: "contain" }}
                              alt={plant.seedfinderStrain.name}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          )}
                        </Center>
                      </Flex>
                    </Box>
                    <Box>
                      <Button
                        title={plant.seedfinderStrain.breeder_name}
                        component={Link}
                        target="_blank"
                        className="cursor-pointer"
                        href={
                          plant.seedfinderStrain.breeder_website_url
                        }
                        compact
                        rightIcon={<IconExternalLink size="1rem" />}
                      >
                        Website
                      </Button>
                    </Box>
                  </Stack>
                </Card>
              </SimpleGrid>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
}
