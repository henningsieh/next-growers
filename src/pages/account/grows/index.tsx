import {
  Alert,
  Box,
  Container,
  createStyles,
  Grid,
  LoadingOverlay,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

import type { ChangeEvent } from "react";
import { useState } from "react";

import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";

import AccessDenied from "~/components/Atom/AccessDenied";
import LoadingError from "~/components/Atom/LoadingError";
import SearchInput from "~/components/Atom/SearchInput";
import SortingPanel from "~/components/Atom/SortingPanel";
import ReportCard from "~/components/Report/Card";

import { authOptions } from "~/server/auth";

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

/** PROTECTED DYNAMIC PAGE with translations
 * getServerSideProps (Server-Side Rendering)
 *
 * @param GetServerSidePropsContext<{ locale: string; translations: string | string[] | undefined; }> context - The context object containing information about the request
 * @returns Promise<{ props: { [key: string]: any }; }> - A promise resolving to an object containing props to be passed to the page component
 */
export const getServerSideProps: GetServerSideProps = async (
  context
) => ({
  props: {
    ...(await serverSideTranslations(context.locale as string, [
      "common",
    ])),
    session: await getServerSession(
      context.req,
      context.res,
      authOptions
    ),
  },
});

const ProtectedOwnGrows: NextPage = () => {
  const { t } = useTranslation();
  const pageTitle = t("common:myreports-headline");

  const [desc, setDesc] = useState(true);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [searchString, setSearchString] = useState("");

  const { classes } = useStyles();
  const { status } = useSession();

  // FETCH OWN REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: ownIsoReports,
    isLoading,
    isError,
  } = api.reports.getOwnIsoReportsWithPostsFromDb.useQuery({
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
  // const cardProps = {
  //   image:
  //     "https://images.unsplash.com/photo-1503262028195-93c528f03218?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
  //   country: "Zkittlez",
  //   badges: [
  //     {
  //       emoji: "💡",
  //       label: "LED",
  //     },
  //     {
  //       emoji: "🥥",
  //       label: "Coco",
  //     },
  //     {
  //       emoji: "💎",
  //       label: "mineral",
  //     },
  //   ],
  // };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  if (status === "unauthenticated") return <AccessDenied />;

  if (isError) return <LoadingError />;

  return (
    <>
      <Head>
        <title>{`${pageTitle} | GrowAGram`}</title>
        <meta
          name="description"
          content="My own grow reports on growagram.com"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* // Main Content Container */}
      <Container size="xl" className="flex w-full flex-col space-y-2">
        {/* // Header with Title and Sorting */}
        <Box className="flex items-center justify-between pt-2">
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
        </Box>
        <Box className={classes.hiddenDesktop}>
          <SearchInput
            value={searchString}
            setSearchString={setSearchString}
            onChange={handleSearchChange}
          />
        </Box>
        {/* // Header End */}

        {/* // Report Grid */}
        <Box pos="relative">
          <LoadingOverlay
            visible={isLoading}
            transitionDuration={600}
            overlayBlur={2}
          />
          <Grid gutter="sm">
            {/* LOOP OVER REPORTS */}
            {ownIsoReports && ownIsoReports.length
              ? ownIsoReports.map((ownIsoReport) => {
                  return (
                    <Grid.Col
                      key={ownIsoReport.id}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={3}
                    >
                      <ReportCard
                        // {...cardProps}
                        procedure="own"
                        report={ownIsoReport}
                        setSearchString={setSearchString}
                      />
                    </Grid.Col>
                  );
                })
              : // rendering "not found" only if isLoading is false
                !isLoading && (
                  <Container>
                    <Alert
                      mt="xl"
                      p="xl"
                      icon={<IconAlertCircle size="1rem" />}
                      title="You don't have any Grow Reports yet!"
                      color="red"
                      variant="outline"
                    >
                      You have to{" "}
                      <Link href="/account/grows/create">
                        <u>create your first Grow Report here</u>
                      </Link>
                      .
                    </Alert>
                  </Container>
                )}
          </Grid>
        </Box>
      </Container>
    </>
  );
};
export default ProtectedOwnGrows;
