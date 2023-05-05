/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "~/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";

import { api } from "~/utils/api";
import { useState } from "react";
import {
  type ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import AppLayout from "~/components/Layout/AppLayout";

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
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colors: {
            white: ["#C1CCF6"],
            // Add your color
            deepBlue: ["#E9EDFC", "#C1CCF6", "#99ABF0" /* ... */],
            // or replace default theme color
            blue: ["#E9EDFC", "#C1CCF6", "#99ABF0" /* ... */],
          },
          shadows: {
            md: "1px 1px 3px rgba(0, 0, 0, .25)",
            xl: "5px 5px 3px rgba(0, 0, 0, .25)",
          },
          primaryColor: "pink",
          colorScheme, // get light/dark from local storage state
          globalStyles: (theme) => ({
            body: {
              ...theme.fn.fontStyles(),
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.white,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.black,
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
          components: {
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
        }}
      >
        <SessionProvider session={session}>
          <AppLayout>
            {/* // FUTURE BANNERS GO HERE!! */}
            <Component {...pageProps} />
          </AppLayout>
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default api.withTRPC(MyApp);
