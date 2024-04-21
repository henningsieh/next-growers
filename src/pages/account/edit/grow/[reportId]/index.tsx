import {
  Box,
  Container,
  createStyles,
  Loader,
  LoadingOverlay,
  Tabs,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconEdit,
  IconList,
  IconPlant,
} from "@tabler/icons-react";

import { useEffect, useState } from "react";

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
import { useParams } from "next/navigation";
import { useRouter } from "next/router";

import AccessDenied from "~/components/Atom/AccessDenied";
import AddPost from "~/components/Post/AddForm";
import PostsAccordion from "~/components/Post/PostsAccordion";
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
  const params = useParams();

  const [defaultTab, setDefaultTab] = useState("");

  const DEFAULTTAB = "addUpdate";

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const useStyles = createStyles((theme) => ({
    titleLink: {
      display: "inline-flex",
      fontWeight: "bold",
      color: dark
        ? theme.colors.groworange[4]
        : theme.colors.growgreen[5],
    },
  }));
  const { theme, classes } = useStyles();

  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.lg})`
  );

  const queryReportId = router.query.reportId as string;

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { data: session, status } = useSession();
  const sessionIsLoading = status === "loading";

  useEffect(() => {
    const hash = window.location.hash.slice(1);

    if (hash !== "") {
      setDefaultTab(hash);
    } else {
      setDefaultTab(DEFAULTTAB);

      void router.replace(
        `${window.location.pathname}${DEFAULTTAB}`,
        undefined,
        {
          shallow: true,
          scroll: true,
          locale: activeLocale,
        }
      );
    }
  }, [activeLocale, params, router]);

  const {
    data: report,
    isLoading: reportIsLoading,
    isError: reportHasErrors,
  } = api.reports.getIsoReportWithPostsFromDb.useQuery(queryReportId);

  const {
    data: strains,
    isLoading: strainsAreLoading,
    isError: strainsHaveErrors,
  } = api.strains.getAllStrains.useQuery();

  if (
    !reportIsLoading &&
    !strainsAreLoading &&
    (reportHasErrors || strainsHaveErrors)
  ) {
    return <>Server Error</>;
  }

  if (
    !sessionIsLoading &&
    !reportIsLoading &&
    (status === "unauthenticated" ||
      report?.authorId != session?.user.id)
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
        {reportIsLoading ? (
          <Loader color="groworange.4" /> // Render Loader component if reportIsLoading is true
        ) : (
          <Box className="flex items-center justify-start pt-2">
            <Link
              title="back to Grow"
              href={`/grow/${report?.id as string}`}
            >
              <Box className={classes.titleLink}>
                <IconChevronLeft size={28} />
                {report?.title}
              </Box>
            </Link>
          </Box>
        )}
        {/* // Header End */}
        {defaultTab && (
          <>
            <Tabs
              variant="outline"
              defaultValue={defaultTab || "editGrow"}
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
                  onClick={() => {
                    void router.replace(
                      `${window.location.pathname}#addUpdate`,
                      undefined,
                      {
                        shallow: true,
                        scroll: true,
                        locale: activeLocale,
                      }
                    );
                  }}
                  value="addUpdate"
                  icon={
                    <IconPlant size={smallScreen ? "1rem" : "1.4rem"} />
                  }
                >
                  <Title order={2} fz={smallScreen ? "sm" : "lg"}>
                    {t("common:addpost-headline")}
                  </Title>
                </Tabs.Tab>

                <Tabs.Tab
                  onClick={() => {
                    void router.replace(
                      `${window.location.pathname}#editGrow`,
                      undefined,
                      {
                        shallow: true,
                        scroll: true,
                        locale: activeLocale,
                      }
                    );
                  }}
                  value="editGrow"
                  icon={
                    <IconEdit size={smallScreen ? "1rem" : "1.4rem"} />
                  }
                >
                  {/* // Title */}
                  <Title order={2} fz={smallScreen ? "sm" : "lg"}>
                    {t("common:report-edit-headline")}
                  </Title>
                </Tabs.Tab>

                <Tabs.Tab
                  onClick={() => {
                    void router.replace(
                      `${window.location.pathname}#editAll`,
                      undefined,
                      {
                        shallow: true,
                        scroll: true,
                        locale: activeLocale,
                      }
                    );
                  }}
                  value="editAll"
                  icon={
                    <IconList size={smallScreen ? "1rem" : "1.4rem"} />
                  }
                >
                  <Title order={2} fz={smallScreen ? "sm" : "lg"}>
                    {" "}
                    {t("common:editallpost-headline")}{" "}
                  </Title>
                </Tabs.Tab>
              </Tabs.List>

              <Box pos="relative">
                <LoadingOverlay
                  visible={
                    reportIsLoading ||
                    strainsAreLoading ||
                    sessionIsLoading
                  }
                  transitionDuration={600}
                  overlayBlur={2}
                />

                {status === "authenticated" &&
                  !reportIsLoading &&
                  !reportHasErrors &&
                  !strainsAreLoading &&
                  !strainsHaveErrors && (
                    <>
                      <Tabs.Panel value="addUpdate" pl="xs">
                        {/* AddPost Component */}
                        <AddPost isoReport={report} post={null} />
                      </Tabs.Panel>

                      <Tabs.Panel value="editGrow" pl="xs">
                        <EditReportForm
                          report={report}
                          strains={strains}
                          user={session.user}
                        />
                      </Tabs.Panel>

                      <Tabs.Panel value="editAll" pl="xs">
                        {/* PostsAccordion Component */}
                        {/* Alle Updates bearbeiten*/}
                        <PostsAccordion report={report && report} />
                      </Tabs.Panel>
                    </>
                  )}
              </Box>
            </Tabs>
          </>
        )}
      </Container>
    </>
  );
};

export default ProtectedEditReportDetails;
