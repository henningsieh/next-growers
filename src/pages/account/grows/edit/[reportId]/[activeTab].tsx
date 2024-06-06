import {
  Box,
  Center,
  Container,
  createStyles,
  Loader,
  LoadingOverlay,
  rem,
  Tabs,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconChevronLeft,
  IconEdit,
  IconFilePlus,
  IconList,
  IconPlant,
} from "@tabler/icons-react";
import { httpStatusErrorMsg } from "~/messages";

// import { useEffect, useState } from "react";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import AccessDenied from "~/components/Atom/AccessDenied";
import PostForm from "~/components/Post/PostForm";
import PostsAccordion from "~/components/Post/PostsAccordion";
import AddPlant from "~/components/Report/AddPlant";
import { EditReportForm } from "~/components/Report/EditForm";

import { authOptions } from "~/server/auth";

import { api } from "~/utils/api";

/** PROTECTED DYNAMIC PAGE with translations
 * getServerSideProps (Server-Side Rendering)
 *
 * @param GetServerSidePropsContext<{ locale: string; translations: string | string[] | undefined; }> context - The context object containing information about the request
 * @returns Promise<{ props: { [key: string]: any }; }> - A promise resolving to an object containing props to be passed to the page component
 */
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => ({
  props: {
    ...(await serverSideTranslations(context.locale as string, [
      "common",
    ])),
    session: await getServerSession(
      context.req,
      context.res,
      authOptions
    ),
  },
});

/**
 * @Page EditReportDetails
 * @param props: { trpcState: DehydratedState, reportId: string }
 * @returns HTML Component
 */
const ProtectedEditReportDetails: NextPage = () => {
  const router = useRouter();
  // const params = useParams();

  // const [defaultTab, setDefaultTab] = useState("");

  // const DEFAULTTAB = "addUpdate";

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const useStyles = createStyles((theme) => ({
    titleLink: {
      display: "inline-flex",
      fontWeight: "bold",
      color: dark
        ? theme.colors.groworange[3]
        : theme.colors.groworange[5],
    },
  }));
  const { theme, classes } = useStyles();

  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.md})`
  );

  const queryReportId = router.query.reportId as string;

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { data: session, status } = useSession();
  const sessionIsLoading = status === "loading";

  const {
    data: grow,
    isLoading: reportIsLoading,
    isError: reportHasErrors,
    error: reportError,
  } = api.reports.getIsoReportWithPostsFromDb.useQuery(queryReportId, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  // const {
  //   data: strains,
  //   isLoading: strainsAreLoading,
  //   isError: strainsHaveErrors,
  // } = api.strains.getAllStrains.useQuery(undefined, {
  //   refetchOnMount: false,
  //   refetchOnReconnect: false,
  //   refetchOnWindowFocus: false,
  // });

  if (reportIsLoading)
    return (
      <Center>
        <Loader size="xl" m="xl" color="growgreen.4" />
      </Center>
    );
  if (reportHasErrors) {
    notifications.show(
      httpStatusErrorMsg(
        reportError.message,
        reportError.data?.httpStatus,
        true
      )
    );
    return (
      <>
        Error {reportError.data?.httpStatus}: {reportError.message}
      </>
    );
  }

  if (
    !sessionIsLoading &&
    !reportIsLoading &&
    (status === "unauthenticated" || grow?.authorId != session?.user.id)
  ) {
    return <AccessDenied />;
  }

  return (
    <>
      <Head>
        <title>{`GrowAGram | ${t("common:report-edit-headline")}`}</title>
        <meta
          name="description"
          content="Create your grow report on growagram.com"
        />
      </Head>

      {/* // Main Content Container */}
      <Container size="xl" className="flex flex-col space-y-2">
        {/* // Header with Title */}
        <Box className="flex items-center justify-start pt-2">
          <Link title="back to Grow" href={`/grow/${grow.id}`}>
            <Box className={classes.titleLink}>
              <IconChevronLeft size={28} />
              {grow?.title}
            </Box>
          </Link>
        </Box>
        {/* // Header End */}

        <>
          <Tabs
            variant="pills"
            color="growgreen.4"
            keepMounted={false}
            value={router.query.activeTab as string}
            onTabChange={(value) =>
              void router.push(
                `/account/grows/edit/${grow.id}/${value}`
              )
            }
          >
            <Tabs.List
            // sx={(theme) => ({
            //   backgroundColor:
            //     theme.colorScheme === "dark"
            //       ? theme.colors.growgreen[4]
            //       : theme.colors.growgreen[6],
            // })}
            >
              <Tabs.Tab
                h={smallScreen ? 28 : 40}
                px={smallScreen ? 4 : "md"}
                value="editGrow"
                icon={<IconEdit size={smallScreen ? 16 : 20} />}
              >
                <Title order={1} fz={smallScreen ? rem(13) : "md"}>
                  {t("common:report-edit-headline")}
                </Title>
              </Tabs.Tab>

              <Tabs.Tab
                h={smallScreen ? 28 : 40}
                p={smallScreen ? 2 : "md"}
                value="addPlant"
                icon={<IconPlant size={smallScreen ? 16 : 20} />}
              >
                <Title order={1} fz={smallScreen ? rem(13) : "md"}>
                  Pflanzen hinzufügen
                  {/* {t("common:addpost-headline")} */}
                </Title>
              </Tabs.Tab>

              <Tabs.Tab
                h={smallScreen ? 28 : 40}
                p={smallScreen ? 2 : "md"}
                value="addUpdate"
                icon={<IconFilePlus size={smallScreen ? 16 : 20} />}
              >
                <Title order={1} fz={smallScreen ? rem(13) : "md"}>
                  {t("common:addpost-headline")}
                </Title>
              </Tabs.Tab>

              <Tabs.Tab
                h={smallScreen ? 28 : 40}
                px={smallScreen ? 4 : "md"}
                value="editAll"
                icon={<IconList size={smallScreen ? 16 : 20} />}
              >
                <Title order={1} fz={smallScreen ? rem(13) : "md"}>
                  {t("common:editallpost-headline")}{" "}
                </Title>
              </Tabs.Tab>
            </Tabs.List>

            <Box pos="relative">
              <LoadingOverlay
                visible={
                  reportIsLoading ||
                  // strainsAreLoading ||
                  sessionIsLoading
                }
                transitionDuration={600}
                overlayBlur={2}
              />

              {status === "authenticated" &&
                // !strainsAreLoading &&
                // !strainsHaveErrors &&
                !reportIsLoading &&
                !reportHasErrors && (
                  <>
                    <Tabs.Panel value="editGrow">
                      <EditReportForm
                        report={grow}
                        // strains={strains}
                        user={session.user}
                      />
                    </Tabs.Panel>

                    <Tabs.Panel value="addPlant">
                      {/* AddPlant Component */}
                      <AddPlant growId={grow.id} />
                    </Tabs.Panel>

                    <Tabs.Panel value="addUpdate">
                      {/* AddPost Component */}
                      <PostForm isoReport={grow} post={null} />
                    </Tabs.Panel>

                    <Tabs.Panel value="editAll">
                      {/* PostsAccordion Component */}
                      {/* Alle Updates bearbeiten*/}
                      <PostsAccordion report={grow && grow} />
                    </Tabs.Panel>
                  </>
                )}
            </Box>
          </Tabs>
        </>
      </Container>
    </>
  );
};

export default ProtectedEditReportDetails;
