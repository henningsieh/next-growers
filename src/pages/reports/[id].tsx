import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";

import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "~/server/db";
import superjson from "superjson";
import { api as trpc } from "~/utils/api";

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });
  const reportId = context.params?.id as string;

  /*
   * Prefetching the `reports.getReportById` query here.
   */
  await helpers.reports.getReportById.prefetch(reportId);
  console.log("getStaticProps running... 📠");

  // Make sure to return { props: { trpcState: helpers.dehydrate() } }
  return {
    props: {
      trpcState: helpers.dehydrate(),
      id: reportId,
    },
    revalidate: 1,
  };
}
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
export default function ReportDetails(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { id: reportId } = props;
  // This query will be immediately available as it's prefetched.
  const result = trpc.reports.getReportById.useQuery(reportId);
  const { data: report } = result;
  return (
    <>
      <h1>{report?.title}</h1>
      <p>Created {report?.createdAt.toLocaleDateString()}</p>
      <p>{report?.description}</p>
      <h2>Raw data:</h2>
      <pre>{JSON.stringify(report, null, 4)}</pre>
    </>
  );
}
