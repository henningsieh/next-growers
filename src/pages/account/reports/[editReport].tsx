import { Box, Container, LoadingOverlay, Space, Title } from "@mantine/core";
import type {
  GetServerSidePropsContext,
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { Link, RichTextEditor } from "@mantine/tiptap";

import AccessDenied from "~/components/Atom/AccessDenied";
import AddPost from "~/components/Post/AddForm";
import { EditForm } from "~/components/Report/EditForm";
import Head from "next/head";
import Loading from "~/components/Atom/Loading";
import { prisma } from "~/server/db";
import { stringifyReportData } from "~/helpers";
import { useSession } from "next-auth/react";

/**
 * getStaticProps
 * @param context : GetStaticPropsContext<{ id: string }>
 * @returns : (property) props: {
                trpcState: DehydratedState;
                id: string;
                report: {
                    id: string;
                    imagePublicId: string | undefined;
                    imageCloudUrl: string | undefined;
                    title: string;
                    description: string;
                    ... 5 more ...;
                    likes: {
                        ...;
                    }[];
                  };
                }
              }
 */
export async function getStaticProps(
  context: GetStaticPropsContext<{ editReport: string }>
) {
  const reportIdfromUrl = context.params?.editReport as string;
  /*
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  }); */

  // Prefetching the report from prisma
  const reportResult = await prisma.report.findUnique({
    include: {
      author: { select: { id: true, name: true, image: true } },
      image: { select: { id: true, publicId: true, cloudUrl: true } },
      strains: {
        select: {
          id: true,
          name: true,
          description: true,
          effects: true,
          flavors: true,
        },
      },
    },
    where: {
      id: reportIdfromUrl,
    },
  });
  console.debug(
    "getStaticProps 🤖",
    "...prefetching the report's dataset from db"
  );

  const report = stringifyReportData(reportResult);

  const strains = await prisma.cannabisStrain.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      effects: true,
      flavors: true,
      type: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const allCannabisStrains = strains.map((strain) => ({
    ...strain,
    createdAt: strain.createdAt.toISOString(),
    updatedAt: strain.updatedAt.toISOString(),
  }));

  // Prefetching the `reports.getReportById` query here.
  /*
  await helpers.reports.getReportById.prefetch(id);
  console.debug(
    "getStaticProps 🤖",
    "...prefetching tRPC `reports.getReportById` query"
  ); */

  // Make sure to return { props: { trpcState: helpers.dehydrate() } }
  if (!!report) {
    return {
      props: {
        // trpcState: helpers.dehydrate(),
        // id: reportIdfromUrl,
        report: report.id ? report : null,
        allStrains: allCannabisStrains,
      },
      revalidate: 5,
    };
  } else {
    return null;
  }
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
        editReport: report.id,
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
export default function EditReportDetails(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const pageTitle = "Edit Grow Details";

  // This report will HOPEFULLY 🙏 be immediately available as it's prefetched from db.
  // const { report: reportFromDB } = props;
  const { report: reportFromDB, allStrains: allStrains } = props;

  const { data: session, status } = useSession();

  if (status === "unauthenticated") return <AccessDenied />;

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
      <Container size="xl" className="flex flex-col space-y-2">
        {/* // Header with Title */}
        <div className="flex items-center justify-between pt-2">
          {/* // Title */}
          <Title order={1} className="inline">
            {pageTitle}
          </Title>
        </div>
        {/* // Header End */}
        <Box pos="relative">
          <LoadingOverlay
            visible={status === "loading"}
            transitionDuration={1600}
            overlayBlur={2}
          />

          <>
            {/* {status === "authenticated" && reportFromDB && ( */}
            {status === "authenticated" && reportFromDB && (
              <>
                <EditForm
                  report={reportFromDB}
                  strains={allStrains}
                  user={session.user}
                />

                <Space h="xl" />

                {/* // Add Component */}
                <AddPost report={reportFromDB} />

                {/* ================================= */}
                {/* // Props report output */}
                <Container
                  size="md"
                  pt="xl"
                  className="flex w-full flex-col space-y-1"
                >
                  <Title order={2}>raw dataset from db*</Title>
                  <Title order={3}>*still in beta 🤓</Title>

                  <div>{JSON.stringify(reportFromDB, null, 4)}</div>
                </Container>
              </>
            )}
          </>
        </Box>
      </Container>
    </>
  );
}

/**
 * PROTECTED PAGE
 */
/*
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
 */
