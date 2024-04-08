import {
  Box,
  Container,
  LoadingOverlay,
  Space,
  Title,
} from "@mantine/core";

import type { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import AccessDenied from "~/components/Atom/AccessDenied";
import PostsAccordion from "~/components/Post/Accordion";
import AddPost from "~/components/Post/AddForm";
import { ProtectedEditForm } from "~/components/Report/EditForm";

import { authOptions } from "~/server/auth";

import type { IsoReportWithPostsFromDb, Strains } from "~/types";

import { api } from "~/utils/api";

/**
 * PROTECTED PAGE with session and translations
 * async getServerSideProps()
 *
 * @param context: GetServerSidePropsContext<{translations: string | string[] | undefined;}>
 * @returns : Promise<{props: { session: Session | null } | undefined;};}>
 */
export async function getServerSideProps(
  context: GetServerSidePropsContext<{
    translations: string | string[] | undefined;
  }>
) {
  // Fetch translations using next-i18next
  const translations = await serverSideTranslations(
    context.locale as string,
    ["common"]
  );

  return {
    props: {
      ...translations,
      session: await getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  };
}

/**
 * @Page EditReportDetails
 * @param props: { trpcState: DehydratedState, reportId: string }
 * @returns HTML Component
 */
const EditReportDetails: NextPage = () => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { data: session, status } = useSession();

  const id = router.query.reportId as string;
  const pageTitle = t("common:report-edit-headline");

  const {
    data: report,
    isLoading: reportIsLoading,
    isError: reportHasErrors,
  } = api.reports.getIsoReportWithPostsFromDb.useQuery(id);

  const {
    data: strains,
    isLoading: strainsAreLoading,
    isError: strainsHaveErrors,
  } = api.strains.getAllStrains.useQuery();

  if (
    !reportIsLoading &&
    status !== "loading" &&
    (status === "unauthenticated" ||
      report?.authorId != session?.user.id)
  )
    return <AccessDenied />;

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
        <Box className="flex items-center justify-between pt-2">
          {/* // Title */}
          <Title order={1} className="inline">
            {pageTitle}
          </Title>
        </Box>
        {/* // Header End */}
        <Box pos="relative">
          <LoadingOverlay
            visible={status === "loading" || reportIsLoading}
            transitionDuration={600}
            overlayBlur={2}
          />

          {status === "authenticated" && !reportIsLoading && (
            <>
              <ProtectedEditForm
                report={report as IsoReportWithPostsFromDb}
                strains={strains as Strains}
                user={session.user}
              />

              <Space h="xl" />
              <Space h="xl" />

              {/* // AddPost Component */}
              {/* Ein neues Update hinzufügen */}
              <Container p={0}>
                <Title order={2}>{t("common:addpost-headline")}</Title>
              </Container>
              <Space h="xs" />

              <AddPost
                isoReport={report as IsoReportWithPostsFromDb}
                post={null}
              />

              <Space h="xl" />
              <Space h="xl" />

              {/* // PostsAccordion Component */}
              {/* Alle Updates bearbeiten*/}
              <PostsAccordion report={report && report} />
            </>
          )}
        </Box>
      </Container>
    </>
  );
};

export default EditReportDetails;
