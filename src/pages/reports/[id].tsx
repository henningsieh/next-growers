import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { api as trpc } from "~/utils/api";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });
  const id = context.params?.id as string;

  /*
   * Prefetching the `reports.getReportById` query here.
   */
  await helpers.reports.getReportById.prefetch(id);
  console.log("SERVER");
  // Make sure to return { props: { trpcState: helpers.dehydrate() } }
  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
}

export default function ReportDetails(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { id } = props;

  // This query will be immediately available as it's prefetched.
  const result = trpc.reports.getReportById.useQuery(id);

  const { data: report } = result;

  return (
    <>
      <h1>{report?.title}</h1>
      <em>Created {report?.createdAt.toLocaleDateString()}</em>

      <p>{report?.description}</p>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(report, null, 4)}</pre>
    </>
  );
}
