import { Container, Grid, Title } from "@mantine/core";

import Add from "~/components/Report/add";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import ReportCard from "~/components/Report/ReportCard";
import { api } from "~/utils/api";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";

export default function OwnReports() {
  const pageTitle = "Your Reports";

  // FETCH OWN REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: reports,
    isLoading,
    isError,
  } = api.reports.getOwnReports.useQuery();

  const { data: session } = useSession();
  if (!session) {
    return (
      <Container className="text-center text-4xl">Access Denied</Container>
    );
  } else {
    if (isLoading) return <div>Loading reports 🔄</div>;
    if (isError) return <div>Error fetching your reports! ❌</div>;

    // Fake Data for Fake Card
    const cardProps = {
      image:
        "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
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

    return (
      <section>
        <Head>
          <title>GrowAGram | {pageTitle}</title>
          <meta
            name="description"
            content="Upload and create your Report to growagram.com"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Container size={"1440"} className="h-screen">
          <div className="m-auto flex min-h-max flex-col place-content-center">
            <div className="flex w-full flex-col space-y-4">
              <Title order={1}>{pageTitle}</Title>
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
                        xl={3}
                      >
                        <ReportCard {...cardProps} report={report} />
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
            </div>

            <Add />
          </div>
        </Container>
      </section>
    );
  }
}

/** NOT SUPPORTED UNTIL auth-strategy=="session", only "jwt"...
 *
 * PROTECTED PAGE
 */
/* export async function getServerSideProps(ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) {
  return {
    props: {
      session: await getServerSession(ctx.req, ctx.res, authOptions),
    },
  };
}
 */
