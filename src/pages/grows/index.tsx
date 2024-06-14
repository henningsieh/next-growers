import {
  Alert,
  Box,
  Center,
  Container,
  createStyles,
  Grid,
  Group,
  Loader,
  Pagination,
  Select,
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
  const [activePage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

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

        {/* // Iso Reports Grid */}
        <Box pos="relative">
          {isoIsLoading && (
            <Center>
              <Loader size="xl" m="xl" color="growgreen.4" />
            </Center>
          )}

          <Grid gutter="xs">
            {/* LOOP OVER REPORTS */}
            {isoReports && isoReports.length
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
        </Box>

        {/* Pagination Controls */}
        {isoReports && totalCount && (
          <>
            <Pagination.Root
              value={activePage}
              onChange={setPage}
              siblings={1}
              boundaries={0}
              total={Math.ceil(totalCount / pageSize)}
              styles={(theme) => ({
                control: {
                  "&[data-active]": {
                    backgroundImage: theme.fn.gradient({
                      from: "red",
                      to: "yellow",
                    }),
                    border: 0,
                  },
                },
              })}
            >
              <Group spacing={5} position="center">
                <Pagination.First />
                <Pagination.Previous />
                <Pagination.Items />
                <Pagination.Next />
                <Pagination.Last />
                <Select
                  w={160}
                  variant="default"
                  placeholder="Custom active styles"
                  defaultValue={pageSize.toString()}
                  data={[
                    {
                      value: "12",
                      label: "12 Grows per page",
                      name: "Bob Handsome",
                    },
                    {
                      value: "24",
                      label: "24 Grows per page",
                      name: "Bill Rataconda",
                    },
                    {
                      value: "48",
                      label: "48 Grows per page",
                      name: "Amy Wong",
                    },
                  ]}
                  onChange={(value) =>
                    !!value && setPageSize(parseInt(value, 10))
                  }
                  styles={(theme) => ({
                    input: {
                      fontSize: theme.fontSizes.sm,
                      minHeight: 32,
                      height: 32,
                      border:
                        theme.colorScheme === "dark"
                          ? `1px solid ${theme.colors.dark[4]}`
                          : `1px solid ${theme.colors.gray[4]}`,
                    },
                    item: {
                      // height: 20,
                      // applies styles to selected item
                      "&[data-selected]": {
                        "&, &:hover": {
                          backgroundImage: theme.fn.gradient({
                            from: "red",
                            to: "yellow",
                          }),
                          // color:
                          //   theme.colorScheme === "dark"
                          //     ? theme.white
                          //     : theme.colors.teal[9],
                        },
                      },

                      // applies styles to hovered item (with mouse or keyboard)
                      "&[data-hovered]": {},
                    },
                  })}
                />
              </Group>
              {/* // MantineSelect to set pageSize */}
            </Pagination.Root>

            {/* Regular pagination */}
            {/* <Pagination
      position="center"
      withEdges
      value={activePage}
      onChange={setPage}
      siblings={1}
      boundaries={1}
      total={totalCount}
      styles={(theme) => ({
        control: {
          "&[data-active]": {
            backgroundImage: theme.fn.gradient({
              from: "red",
              to: "yellow",
            }),
            border: 0,
          },
        },
      })}
      getItemProps={(page) => ({
        component: "a",
        href: `#page-${page}`,
      })}
      getControlProps={(control) => {
        if (control === "first") {
          return { component: "a", href: "#page-0" };
        }

        if (control === "last") {
          return { component: "a", href: "#page-10" };
        }

        if (control === "next") {
          return { component: "a", href: "#page-2" };
        }

        if (control === "previous") {
          return { component: "a", href: "#page-1" };
        }

        return {};
      }}
    /> */}

            {/* Compound pagination */}
            {/* <Pagination.Root
      value={activePage}
      onChange={setPage}
      siblings={1}
      boundaries={1}
      total={totalCount / pageSize}
      styles={(theme) => ({
        control: {
          "&[data-active]": {
            backgroundImage: theme.fn.gradient({
              from: "red",
              to: "yellow",
            }),
            border: 0,
          },
        },
      })}
      getItemProps={(page) => ({
        component: "a",
        href: `#page-${page}`,
      })}
    >
      <Group spacing={7} position="center" mt="xl">
        <Pagination.First component="a" href="#page-0" />
        <Pagination.Previous
          component="a"
          href={`#page-${String(Math.max(0, activePage - 1))}`}
        />
        <Pagination.Items />
        <Pagination.Next
          component="a"
          href={`#page-${String(Math.max(0, activePage + 1))}`}
        />
        <Pagination.Last
          component="a"
          href={`#page-${String(Math.round(totalCount / pageSize))}`}
        />
      </Group>
    </Pagination.Root> */}
          </>
        )}
      </Container>
    </>
  );
};
export default PublicAllGrows;
