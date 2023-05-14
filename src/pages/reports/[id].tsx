import { Container, Title } from "@mantine/core";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";

import Head from "next/head";
import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "~/server/db";
import { stringifyReportData } from "~/helpers";
import superjson from "superjson";

/**
 * getStaticProps
 * @param context : GetStaticPropsContext<{ id: string }>
 * @returns : Promise<{props{
 *              trpcState: DehydratedState;
 *              id: string;
 *              report: Report
 *            }}>
 */
export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id as string;

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });

  // Prefetching the report from prisma
  const result = await prisma.report.findUnique({
    include: {
      author: { select: { id: true, name: true, image: true } },
      image: { select: { id: true, publicId: true, cloudUrl: true } },
    },
    where: {
      id: id,
    },
  });
  console.debug(
    "getStaticProps 🤖",
    "...prefetching the report's dataset from db"
  );
  const report = stringifyReportData(result);

  // Prefetching the `reports.getReportById` query here.
  await helpers.reports.getReportById.prefetch(id);
  console.debug(
    "getStaticProps 🤖",
    "...prefetching tRPC `reports.getReportById` query"
  );

  // Make sure to return { props: { trpcState: helpers.dehydrate() } }
  return {
    props: {
      trpcState: helpers.dehydrate(),
      id: id,
      report: report,
    },
    revalidate: 5,
  };
}
/**
 * getStaticPaths
 * @param reports: { id: string }[]
 * @returns { paths[] }
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const reports = await prisma.report.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: reports.map((report) => ({
      params: {
        id: report.id,
      },
    })),
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};

/**
 * @Page ReportDetails
 * @param props: { trpcState: DehydratedState, id: string, report: Report }
 * @returns HTML Component
 */
export default function ReportDetails(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const pageTitle = "Report Details";

  // This report will HOPEFULLY 🙏 be immediately available as it's prefetched from db.
  // const { report: reportFromDB } = props;
  const { report: reportFromDB, id: reportId } = props;

  // This report query will HOPEFULLY 🙏 be immediately available as it's prefetched.
  const queryResult = api.reports.getReportById.useQuery(reportId);
  const { data: report } = queryResult;

  return (
    <>
      <Head>
        <title>{`GrowAGram | ${pageTitle}`}</title>
        <meta
          name="description"
          content="Create your grow report on growagram.com"
        />
      </Head>

      {/* // Main Content Container */}
      <Container size="xl" className="flex w-full flex-col space-y-1">
        {/* // Header with Title */}
        <div className="flex items-center justify-between pt-2">
          {/* // Title */}
          <Title order={1} className="inline">
            {pageTitle}
          </Title>
        </div>{" "}
        {/* // Header End */}
        {/* // Add Component */}
        <h1>from DB</h1>
        <h2>Title: {reportFromDB.title}</h2>
        <p>Created {reportFromDB.createdAt}</p>
        <p>{reportFromDB.description}</p>
        <h2>Raw data:</h2>
        <pre>{JSON.stringify(reportFromDB, null, 4)}</pre>
        <hr />
        <h1>from tRPC</h1>
        <h2>Title: {report?.title}</h2>
        <p>Created {report?.createdAt}</p>
        <p>{report?.description}</p>
        <h2>Raw data:</h2>
        <pre>{JSON.stringify(report, null, 4)}</pre>
      </Container>
    </>
  );
}
