/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "~/styles/globals.css";

import { ColorSchemeProvider, Container, MantineProvider } from "@mantine/core";

import AppLayout from "~/layout/AppLayout";
import type { AppType } from "next/app";
import type { ColorScheme } from "@mantine/core";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { api } from "~/utils/api";
import { appWithTranslation } from "next-i18next";
import { useState } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const preferredColorScheme = "dark"; //useColorScheme(); // set initial theme

  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(preferredColorScheme);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      {/* https://stackoverflow.com/questions/74555403/how-to-change-hover-color-in-mantine-ui-menu */}
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme, // get light/dark from local storage state
          primaryColor: "orange",
          breakpoints: {
            xs: "28em",
            sm: "36em",
            md: "56em",
            lg: "70em",
            xl: "102em",
          },
          components: {
            Container: {
              defaultProps: {
                sizes: {
                  xs: 540,
                  sm: 720,
                  md: 960,
                  lg: 1140,
                  xl: 1320,
                },
              },
            },

            Button: {
              // Subscribe to theme and component params
              styles: (theme) => ({
                root: {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[7]
                      : theme.white,
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[0]
                      : theme.black,
                  lineHeight: theme.lineHeight,
                },
              }),
            },
          },
          globalStyles: (theme) => ({
            body: {
              ...theme.fn.fontStyles(),
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[1],
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[1]
                  : theme.colors.gray[8],
              lineHeight: theme.lineHeight,
            },

            "*, *::before, *::after": {
              boxSizing: "border-box",
            },

            /* ".your-class": {
              backgroundColor: "red",
            },

            "#your-id > [data-active]": {
              backgroundColor: "pink",
            }, */
          }),
          // colors: {
          //   white: ["#C1CCF6"],
          //   // Add your color
          //   deepBlue: ["#E9EDFC", "#C1CCF6", "#99ABF0" /* ... */],
          //   // or replace default theme color
          //   blue: ["#E9EDFC", "#C1CCF6", "#99ABF0" /* ... */],
          // },
          // shadows: {
          //   md: "1px 1px 3px rgba(0, 0, 0, .25)",
          //   xl: "5px 5px 3px rgba(0, 0, 0, .25)",
          // },
        }}
      >
        <SessionProvider session={session}>
          {/* // FUTURE BANNERS GO HERE!! */}
          <Toaster />
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp));
