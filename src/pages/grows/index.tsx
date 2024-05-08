import {
  Alert,
  Box,
  Center,
  Container,
  createStyles,
  Grid,
  LoadingOverlay,
  Title,
} from "@mantine/core";
import { IconDatabaseSearch } from "@tabler/icons-react";
import { appTitle } from "~/pages/_document";

import type { ChangeEvent } from "react";
import { useState } from "react";

import { type GetServerSideProps, type NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import LoadingError from "~/components/Atom/LoadingError";
import SearchInput from "~/components/Atom/SearchInput";
import ReportCard from "~/components/Report/Card";
import SortingPanel from "~/components/SortingPanel";

import type { SortingPanelProps } from "~/types";

import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  hiddenMobile: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },
}));

/** PUBLIC DYNAMIC PAGE with translations
 * getServerSideProps (Server-Side Rendering)
 *
 * @param {string} locale - The locale of the request
 * @returns Promise<GetServerSidePropsResult<Props>>
 */
export const getServerSideProps: GetServerSideProps = async (
  context
) => ({
  props: {
    ...(await serverSideTranslations(context.locale as string, [
      "common",
    ])),
  },
});

/**
 * @Page PublicAllGrows
 * @param props: { trpcState: DehydratedState, reportId: string }
 * @returns NextPage
 */
const PublicAllGrows: NextPage = () => {
  const { t } = useTranslation();
  const pageTitle = t("common:reports-headline");

  const [desc, setDesc] = useState(true);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [searchString, setSearchString] = useState("");

  const { classes } = useStyles();

  // FETCH ALL REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: isoReports,
    isLoading: isoIsLoading,
    isError: isoIsError,
  } = api.reports.getIsoReportsWithPostsFromDb.useQuery({
    search: searchString,
    orderBy: sortBy, // Set the desired orderBy field
    desc: desc, // Set the desired order (true for descending, false for ascending)
  });

  /* // Props for Sorting Panel */
  const sortingPanelProps: SortingPanelProps = {
    sortBy,
    setSortBy,
    desc,
    handleToggleDesc: () => setDesc((prev) => !prev),
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  if (isoIsError) return <LoadingError />;

  return (
    <>
      <Head>
        <title>{`${pageTitle} | ${appTitle}`}</title>
        <meta name="description" content="" />
      </Head>

      {/* // Main Content Container */}
      <Container size="xl" className="flex w-full flex-col space-y-2">
        {/* // Header with Title and Sorting*/}
        <Box className="flex items-center justify-between pt-2">
          {/* // Title */}
          <Title order={1} className="inline">
            {t("common:reports-headline")}
          </Title>
          <Box pr={35} className={classes.hiddenMobile}>
            <SearchInput
              value={searchString}
              setSearchString={setSearchString}
              onChange={handleSearchChange}
            />
          </Box>
          <SortingPanel {...sortingPanelProps} />
        </Box>
        <Box className={classes.hiddenDesktop}>
          <SearchInput
            setSearchString={setSearchString}
            value={searchString}
            onChange={handleSearchChange}
          />
        </Box>
        {/* // Header End */}

        {/* // Iso Reports Grid */}
        <Box pos="relative">
          <LoadingOverlay
            visible={isoIsLoading}
            transitionDuration={600}
            overlayBlur={2}
          />
          {isoReports && !isoIsLoading && (
            <Grid gutter="sm">
              {/* LOOP OVER REPORTS */}
              {isoReports.length ? (
                isoReports.map((isoReport) => {
                  return (
                    <Grid.Col
                      key={isoReport.id}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={3}
                    >
                      <ReportCard
                        report={isoReport}
                        setSearchString={setSearchString}
                      />
                    </Grid.Col>
                  );
                })
              ) : (
                <Container>
                  <Center>
                    <Alert
                      p="xl"
                      m="xl"
                      icon={<IconDatabaseSearch size="1.4rem" />}
                      title="Empty search result"
                      color="red"
                      variant="outline"
                    >
                      No Grows where found!
                    </Alert>
                  </Center>
                </Container>
              )}
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
};
export default PublicAllGrows;
