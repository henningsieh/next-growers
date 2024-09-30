import { appTitle } from "../_document";
import {
  Box,
  Container,
  createStyles,
  rem,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { TRPCError } from "@trpc/server";

import React from "react";

import type {
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import { prisma } from "~/server/db";

import { Locale } from "~/types";

export async function getStaticProps(context: GetStaticPropsContext) {
  // Fetch current TOS from Prismatry {
  const fetchCurrentTOS = async () => {
    try {
      const tos = await prisma.tOS.findFirst({
        select: {
          id: true,
          html_en: true,
          html_de: true,
          version: true,
          isCurrent: true,
          effectiveAt: true,
        },
        where: {
          isCurrent: true,
        },
      });
      if (!tos) {
        throw new Error("No current TOS found");
      }

      const isoTos = {
        ...tos,
        effectiveAt: tos.effectiveAt.toISOString(),
      };

      return isoTos;
    } catch (error: unknown) {
      if (error instanceof TRPCError) {
        throw new TRPCError({
          code: error.code,
          message: error.message,
          cause: error.cause,
        });
      } else if (error instanceof Error) {
        throw new Error(error.message, {
          cause: error.cause,
        } as ErrorOptions);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  };

  const currentTOSData = await fetchCurrentTOS();

  // Fetch translations using next-i18next
  const translations = await serverSideTranslations(
    context.locale as string,
    ["common"]
  );

  return {
    props: {
      currentTOS: currentTOSData,
      ...translations,
    },
  };
}

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(48),
    fontWeight: 900,
    lineHeight: 1.1,
    paddingTop: 12,
    paddingBottom: 12,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(36),
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(24),
      lineHeight: 1.3,
    },
  },
}));

function TOS(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { classes } = useStyles();
  const { currentTOS } = props;
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const pageTitle = t("common:app-impressum-tos-label");

  return (
    <>
      <Head>
        <title>{`${pageTitle} | ${appTitle}`}</title>
        <meta name="description" content={pageTitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container size="md" pt="xl">
        {/* Title */}
        <Title className={classes.title}>
          {t("common:app-impressum-tos-label")}
        </Title>

        <TypographyStylesProvider>
          <Box
            dangerouslySetInnerHTML={{
              __html:
                activeLocale === Locale.DE
                  ? currentTOS?.html_de
                  : currentTOS?.html_en,
            }}
          />
        </TypographyStylesProvider>
      </Container>
    </>
  );
}

export default TOS;
