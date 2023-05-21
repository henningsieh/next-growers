import {
  Alert,
  Box,
  Center,
  Container,
  Grid,
  LoadingOverlay,
  Title,
  createStyles,
} from "@mantine/core";

import type { ChangeEvent } from "react";
import Head from "next/head";
import { IconAlertCircle } from "@tabler/icons-react";
import LoadingError from "~/components/Atom/LoadingError";
import ReportCard from "~/components/Report/Card";
import SearchInput from "~/components/Atom/SearchInput";
import SortingPanel from "~/components/Atom/SortingPanel";
import type { SortingPanelProps } from "~/types";
import { api } from "~/utils/api";
import { useState } from "react";

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
export default function AllReports() {
  const pageTitle = "All Grows";
  const [desc, setDesc] = useState(true);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [searchString, setSearchString] = useState("");
  const { classes, theme } = useStyles();
  // FETCH ALL REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: reports,
    isLoading,
    isError,
  } = api.reports.getAllReports.useQuery({
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

  // Fake Data for Fake Card
  const cardProps = {
    country: "Sativa",
    badges: [
      {
        emoji: "☀️",
        label: "Outdoor",
      },
      {
        emoji: "🌲",
        label: "Sativa",
      },
      {
        emoji: "🌊",
        label: "pure water",
      },
    ],
  };
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  if (isError) return <LoadingError />;
  return (
    <>
      <Head>
        <title>{`GrowAGram | ${pageTitle}`}</title>
        <meta
          name="description"
          content="GrowAGram is a community for sharing and discovering tips, techniques, and insights on growing plants. Join our community and upload your own reports to share your successes and learn from others."
        />
      </Head>
      {/* <Loading isLoading={isLoading} /> */}

      {/* // Main Content Container */}
      <Container size="xl" className="flex w-full flex-col space-y-2">
        {/* // Header with Title */}
        <div className="flex items-center justify-between pt-2">
          {/* // Title */}
          <Title order={1} className="inline">
            {pageTitle}
          </Title>
          <Box pr={35} className={classes.hiddenMobile}>
            <SearchInput
              value={searchString}
              setSearchString={setSearchString}
              onChange={handleSearchChange}
            />
          </Box>
          <SortingPanel {...sortingPanelProps} />
        </div>
        {/* // Header End */}
        <Box className={classes.hiddenDesktop}>
          <SearchInput
            setSearchString={setSearchString}
            value={searchString}
            onChange={handleSearchChange}
          />
        </Box>

        {/* // Report Grid */}
        <Box pos="relative">
          <LoadingOverlay
            visible={isLoading}
            transitionDuration={1600}
            overlayBlur={20}
          />
          {!isLoading && (
            <Grid gutter="sm">
              {/* LOOP OVER REPORTS */}
              {reports.length ? (
                reports.map((report) => {
                  return (
                    <Grid.Col
                      key={report.id}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                    >
                      <ReportCard
                        procedure="all"
                        {...cardProps}
                        report={report}
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
                      icon={<IconAlertCircle size="1rem" />}
                      title="No report where found!"
                      color="red"
                      variant="outline"
                    >
                      Something went wrong.
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
}
