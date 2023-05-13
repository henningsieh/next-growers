import {
  Button,
  Container,
  Grid,
  LoadingOverlay,
  Skeleton,
  Title,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Loading from "~/components/Atom/Loading";
import LoadingError from "~/components/Atom/LoadingError";
import ReportCard from "~/components/Report/Card";
import { api } from "~/utils/api";
import { authOptions } from "~/server/auth";
import { getReportsInput } from "~/types";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useToggle } from "@mantine/hooks";

export default function OwnReports() {
  const [desc, setDesc] = useState(true);
  const [sortBy, toggle] = useToggle(["updatedAt", "createdAt"]);

  // FETCH OWN REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: reports,
    isLoading,
    isError,
  } = api.reports.getOwnReports.useQuery({
    orderBy: sortBy, // Set the desired orderBy field
    desc: desc, // Set the desired order (true for descending, false for ascending)
  });
  // console.log(reports);

  const { data: session } = useSession();
  if (session) {
    if (isError) return <LoadingError />;

    // Fake Data for Fake Card
    const cardProps = {
      image:
        "https://images.unsplash.com/photo-1503262028195-93c528f03218?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
      country: "Zkittlez",
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
    function handleToggleDesc() {
      setDesc((prev) => !prev);
    }
    const pageTitle = "My Reports";
    return (
      <>
        <Head>
          <title>{`GrowAGram | ${pageTitle}`}</title>
          <meta name="description" content="My grow reports on growagram.com" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <LoadingOverlay
          mt={120}
          visible={isLoading}
          overlayBlur={20}
          transitionDuration={600}
        />
        {/* // Main Content Container */}
        <Container size="xl" className="flex w-full flex-col space-y-4">
          {/* // Header with Title and Sorting */}
          <div className="flex items-center justify-between">
            {/* // Title */}
            <Title order={1} className="inline">
              {pageTitle}
            </Title>

            {/* // Sorting Buttons */}
            <div className="inline-flex space-x-4">
              <Button
                variant="outline"
                radius="sm"
                size="xs"
                color={sortBy}
                onClick={() => toggle()}
              >
                {sortBy == "createdAt" ? "created at" : "last updated"}
              </Button>
              <Button
                variant="outline"
                radius="sm"
                size="xs"
                leftIcon={
                  desc ? (
                    <IconChevronDown size="1rem" />
                  ) : (
                    <IconChevronUp size="1rem" />
                  )
                }
                onClick={handleToggleDesc}
              >
                {!desc ? "ascending" : "descending"}
              </Button>
            </div>
          </div>
          {/* // Header End */}
          {/* <Skeleton visible={isLoading}> */}
          {/* // Report Grid */}
          <Grid gutter="sm">
            {/* LOOP OVER REPORTS */}
            {reports && reports.length ? (
              reports.map((report) => {
                return (
                  <Grid.Col key={report.id} xs={12} sm={6} md={4} lg={3} xl={3}>
                    <ReportCard
                      {...cardProps}
                      procedure="own"
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
          {/* </Skeleton> */}
        </Container>
      </>
    );
  }

  return <Container className="text-center text-4xl">Access Denied</Container>;
}

/**
 *
 * PROTECTED PAGE
 */
export async function getServerSideProps(ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) {
  return {
    props: {
      session: await getServerSession(ctx.req, ctx.res, authOptions),
    },
  };
}
