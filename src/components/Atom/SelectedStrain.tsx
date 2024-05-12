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
import { IconExternalLink } from "@tabler/icons-react";
import { decode } from "html-entities";
import { defaultErrorMsg } from "~/messages";

import { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import { api } from "~/utils/api";
import { InputSetReportPlantForm } from "~/utils/inputValidation";

export default function SelectedStrain({
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

  // Inside the SelectedStrain component
  useEffect(() => {
    if (strainInfosFromSeedfinder) {
      setReportPlantForm.setValues({
        strainId: strainInfosFromSeedfinder.id,
        name: strainInfosFromSeedfinder.name,
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
    // MantineForm `setReportPlantForm` as a dependency lets useEffect freak out!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strainInfosFromSeedfinder]);

  const setReportPlantForm = useForm({
    validate: zodResolver(InputSetReportPlantForm),
    initialValues: {
      strainId: strainInfosFromSeedfinder?.id,
      name: strainInfosFromSeedfinder?.name,
      type: strainInfosFromSeedfinder?.brinfo.type,
      cbd: strainInfosFromSeedfinder?.brinfo.cbd,
      description: strainInfosFromSeedfinder?.brinfo.descr,
      flowering_days:
        strainInfosFromSeedfinder?.brinfo.flowering.days || 0,
      flowering_info: strainInfosFromSeedfinder?.brinfo.flowering.info,
      flowering_automatic:
        strainInfosFromSeedfinder?.brinfo.flowering.auto || false,
      seedfinder_ext_url: strainInfosFromSeedfinder?.links.info,
      breederId: strainInfosFromSeedfinder?.brinfo.id,
      breeder_name: strainInfosFromSeedfinder?.brinfo.name,
      breeder_description:
        strainInfosFromSeedfinder?.brinfo.description,
      breeder_website_url: strainInfosFromSeedfinder?.brinfo.link,
    },
  });

  const handleErrors = (errors: typeof setReportPlantForm.errors) => {
    Object.keys(errors).forEach((key) => {
      notifications.show(defaultErrorMsg(errors[key] as string));
    });
  };

  const strainImageUrl = strainInfosFromSeedfinder?.brinfo?.pic;

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
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
              <Flex align="center" justify="flex-end">
                <form
                  onSubmit={setReportPlantForm.onSubmit(
                    (strainDataFormValues) => {
                      setReportPlantForm.setFieldValue(
                        "strainId",
                        strainInfosFromSeedfinder.id
                      );
                      console.debug({ strainDataFormValues });
                      //   handleSubmit(values);
                    },
                    handleErrors
                  )}
                >
                  <Button
                    variant="filled"
                    color="growgreen"
                    type="submit"
                  >
                    Add this Plant to your Grow
                  </Button>
                </form>
              </Flex>
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
          </Box>
        )}
      </Transition>
    </Paper>
  );
}
