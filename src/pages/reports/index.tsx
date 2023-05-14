import { Container, Grid, Title } from "@mantine/core";

import Head from "next/head";
import Loading from "~/components/Atom/Loading";
import LoadingError from "~/components/Atom/LoadingError";
import ReportCard from "~/components/Report/Card";
import SortingPanel from "~/components/Atom/SortingPanel";
import type { SortingPanelProps } from "~/types";
import { api } from "~/utils/api";
import { useState } from "react";

export default function AllReports() {
  const pageTitle = "Explore Reports";
  const [desc, setDesc] = useState(true);
  const [sortBy, setSortBy] = useState("updatedAt");

  // FETCH ALL REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: reports,
    isLoading,
    isError,
  } = api.reports.getAllReports.useQuery({
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

  // if (isLoading) return "";
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
      <Loading isLoading={isLoading} />

      {/* // Main Content Container */}
      <Container size="xl" className="flex w-full flex-col space-y-1">
        {/* // Header with Title */}
        <div className="flex items-center justify-between">
          {/* // Title */}
          <Title order={1} className="inline">
            {pageTitle}
          </Title>
          <SortingPanel {...sortingPanelProps} />
        </div>
        {/* // Header End */}

        {!isLoading && (
          <Grid gutter="sm">
            {/* LOOP OVER REPORTS */}
            {reports.length ? (
              reports.map((report) => {
                return (
                  <Grid.Col key={report.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                    <ReportCard
                      procedure="all"
                      {...cardProps}
                      report={report}
                    />
                  </Grid.Col>
                );
              })
            ) : (
              <div className="hero bg-primary text-primary-content max-h-screen rounded-md">
                <div className="hero-content flex-col md:flex-row">
                  {/* <Image alt="no report image" width={640} height={429} src="/A-rAZGIE2pA-unsplash.jpg" className="max-w-sm rounded-lg shadow-2xl" /> */}
                  <div className="text-center">
                    <h1 className="whitespace-nowrap text-3xl font-bold">
                      No Reports found! 😢
                    </h1>
                    <p className="error py-6 text-lg font-bold">
                      You haven&apos;t created any reports yet.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Grid>
        )}
      </Container>
    </>
  );
}
