import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Loader,
  Paper,
  ScrollArea,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconDeviceFloppy,
  IconExternalLink,
} from "@tabler/icons-react";
import { decode } from "html-entities";
import { httpStatusErrorMsg } from "~/messages";

import { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import { InputSavePlantToGrow } from "~/utils/inputValidation";

export default function SelectedStrain({
  growid,
  strainId,
  breederId,
  breederName,
  breederLogoUrl,
}: {
  growid: string;
  strainId: string;
  breederId: string;
  breederName: string;
  breederLogoUrl: string;
}) {
  const router = useRouter();
  const { locale: activeLocale } = router;

  const trpc = api.useUtils();
  const {
    mutate: tRPCsavePlantToGrow,
    isLoading: savePlantToGrowIsLoading,
    //isError: savePlantToGrowHasErrors
  } = api.strains.savePlantToGrow.useMutation({
    onMutate: (_plant) => {
      console.debug("START strains.savePlantToGrow.useMutation");
    },
    async onSuccess(_result, _plant) {
      console.debug("SUCCESS strains.savePlantToGrow.useMutation");
      //refresh content of allPlantsInGrow table
      await trpc.strains.getAllPlantsByReportId.refetch();
    },
    onError(error, plant) {
      console.error("ERROR strains.savePlantToGrow.useMutation");
      console.error(plant);
      console.error(error);
    },
  });

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

  // Inside the SelectedStrain component
  useEffect(() => {
    if (strainInfosFromSeedfinder) {
      savePlantToGrowForm.setValues({
        growId: growid,
        strainId: strainInfosFromSeedfinder.id,
        name: strainInfosFromSeedfinder.name,
        picture_url: strainInfosFromSeedfinder.brinfo.pic,
        type: strainInfosFromSeedfinder.brinfo.type,
        cbd: strainInfosFromSeedfinder.brinfo.cbd,
        description: strainInfosFromSeedfinder.brinfo.descr,
        flowering_days: strainInfosFromSeedfinder.brinfo.flowering.days,
        flowering_info: strainInfosFromSeedfinder.brinfo.flowering.info,
        flowering_automatic:
          strainInfosFromSeedfinder.brinfo.flowering.auto,
        seedfinder_ext_url: strainInfosFromSeedfinder.links.info,
        breederId: strainInfosFromSeedfinder.brinfo.id,
        breeder_name: strainInfosFromSeedfinder.brinfo.name,
        breeder_description:
          strainInfosFromSeedfinder.brinfo.description,
        breeder_website_url: strainInfosFromSeedfinder.brinfo.link,
      });
    }
    // MantineForm `savePlantToGrowForm` as a dependency lets useEffect freak out!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strainInfosFromSeedfinder]);

  const savePlantToGrowForm = useForm({
    validate: zodResolver(InputSavePlantToGrow),
    initialValues: {
      growId: growid,
      strainId: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder.id
        : "",
      name: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder.name
        : "",
      picture_url: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder.brinfo.pic
        : "",
      type: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder.brinfo.type
        : "",
      cbd: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder.brinfo.cbd
        : "",
      description: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder.brinfo.descr
        : "",
      flowering_days: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder.brinfo.flowering.days
        : 0,
      flowering_info: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder?.brinfo.flowering.info
        : "",
      flowering_automatic: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder?.brinfo.flowering.auto
        : false,
      seedfinder_ext_url: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder?.links.info
        : "",
      breederId: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder?.brinfo.id
        : "",
      breeder_name: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder?.brinfo.name
        : "",
      breeder_logo_url: breederLogoUrl,
      breeder_description: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder?.brinfo.description
        : "",
      breeder_website_url: strainInfosFromSeedfinder
        ? strainInfosFromSeedfinder?.brinfo.link
        : "",
    },
  });

  const handleErrors = (errors: typeof savePlantToGrowForm.errors) => {
    Object.keys(errors).forEach((key) => {
      notifications.show(
        httpStatusErrorMsg(`${key}: ${errors[key] as string} `, 422)
      );
    });
  };

  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";
  const mediumScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );

  return (
    <Paper withBorder p="sm">
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
          <Box
            style={{
              ...styles,
              opacity: styles.opacity, // Apply the opacity style for the fading effect
            }}
          >
            {strainInfosFromSeedfinder && (
              <form
                onSubmit={savePlantToGrowForm.onSubmit(
                  (strainDataFormValues) => {
                    tRPCsavePlantToGrow(strainDataFormValues);
                  },
                  handleErrors
                )}
              >
                <Flex align="center" justify="flex-end">
                  <Button
                    fz={!mediumScreen ? "md" : "sm"}
                    w={!mediumScreen ? 280 : undefined}
                    compact={mediumScreen}
                    fullWidth={mediumScreen}
                    leftIcon={<IconDeviceFloppy size="1.4rem" />}
                    loading={savePlantToGrowIsLoading}
                    variant="filled"
                    color="growgreen"
                    type="submit"
                  >
                    {activeLocale === "de"
                      ? "Sorte als Pflanze hinzufügen"
                      : "Add Strain as Plant to Grow"}
                  </Button>
                </Flex>
              </form>
            )}
            <Space h="md" />
            <SimpleGrid
              breakpoints={[
                { maxWidth: "sm", cols: 1 },
                { minWidth: "sm", cols: 2 },
              ]}
            >
              <Card w="100%" withBorder>
                {strainInfosFromSeedfinder && (
                  <>
                    <Stack
                      h="100%"
                      align="flex-start"
                      justify="space-between"
                    >
                      <Flex direction="column" gap="sm">
                        <Title mb="sm" order={2} c="groworange.4">
                          {strainInfosFromSeedfinder.name}
                        </Title>
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
                                    strainInfosFromSeedfinder.brinfo
                                      .descr
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
                        href={strainInfosFromSeedfinder.links.info}
                        compact
                        rightIcon={<IconExternalLink size="1rem" />}
                      >
                        Strain Data
                      </Button>
                    </Stack>
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
                        gap="xs"
                        wrap="wrap"
                        justify="space-between"
                        align={mediumScreen ? "center" : "start"} //center if small
                        direction={mediumScreen ? "column" : "row"} // column if small
                      >
                        <Center pos="relative" w={200} h={200}>
                          <Image
                            fill
                            src={breederLogoUrl}
                            style={{ objectFit: "contain" }}
                            alt={breederName}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </Center>

                        <Center pos="relative" w={200} h={200}>
                          {strainInfosFromSeedfinder &&
                            !!strainInfosFromSeedfinder.brinfo.pic && (
                              <Image
                                fill
                                src={
                                  strainInfosFromSeedfinder.brinfo
                                    .pic as string
                                }
                                style={{ objectFit: "contain" }}
                                alt={breederName}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            )}
                        </Center>
                      </Flex>
                    </Box>
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
                  </Stack>
                )}
              </Card>
            </SimpleGrid>
          </Box>
        )}
      </Transition>
    </Paper>
  );
}
