import {
  Alert,
  Box,
  Center,
  Container,
  createStyles,
  Grid,
  Loader,
  Title,
} from "@mantine/core";
import { IconDatabaseSearch } from "@tabler/icons-react";
import { appTitle } from "~/pages/_document";

import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

import { type GetServerSideProps, type NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import LoadingError from "~/components/Atom/LoadingError";
import GrowsPagination from "~/components/Atom/Pagination";
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
  const router = useRouter();
  const { t } = useTranslation();
  const pageTitle = t("common:reports-headline");

  const [desc, setDesc] = useState(true);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [searchString, setSearchString] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // respect query parameter for activePage
  useEffect(() => {
    if (typeof router.query === "string") {
      const parsedPage = parseInt(router.query, 10);
      if (!isNaN(parsedPage) && parsedPage > 0) {
        setActivePage(parsedPage);
      }
    }
  }, [router.query]);

  // update query parameter when activePage changess
  useEffect(() => {
    void router.replace({
      query: { page: activePage },
    });
    // router must not be a dependency, because we don't
    // want to trigger a rerender on every router change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  const { classes } = useStyles();

  // FETCH ALL REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: result,
    isLoading: isoIsLoading,
    isError: isoIsError,
  } = api.reports.getIsoReportsWithPostsCountFromDb.useQuery({
    search: searchString,
    orderBy: sortBy,
    desc: desc,
    page: activePage,
    pageSize: pageSize,
  });

  const isoReports = result?.isoReportsFromDb;
  const totalCount = result?.totalCount;

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

        {/* // Loading Spinner */}
        {isoIsLoading && (
          <Center>
            <Loader size="xl" m="xl" color="growgreen.4" />
          </Center>
        )}

        {/* Pagination */}
        {isoReports && totalCount && (
          <GrowsPagination
            isoReports={isoReports}
            totalCount={totalCount}
            pageSize={pageSize}
            setPageSize={setPageSize}
            activePage={activePage}
            setActivePage={setActivePage}
            showPerPageSelect={false}
          />
        )}
        {/* Grows Grid */}
        {isoReports && (
          <Grid gutter="xs">
            {/* LOOP OVER REPORTS */}
            {isoReports.length
              ? isoReports.map((isoReport) => {
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
              : !isoIsLoading && (
                  <Container>
                    <Center>
                      <Alert
                        p="xl"
                        m="xl"
                        icon={<IconDatabaseSearch size={20} />}
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

        {/* Pagination */}
        {isoReports && totalCount && (
          <GrowsPagination
            isoReports={isoReports}
            totalCount={totalCount}
            pageSize={pageSize}
            setPageSize={setPageSize}
            activePage={activePage}
            setActivePage={setActivePage}
            showPerPageSelect={true}
          />
        )}
      </Container>
    </>
  );
};
export default PublicAllGrows;
