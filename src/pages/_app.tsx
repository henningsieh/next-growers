/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "~/styles/globals.css";

import {
  Box,
  ColorSchemeProvider,
  LoadingOverlay,
  MantineProvider,
} from "@mantine/core";
import { useEffect, useState } from "react";

import AppLayout from "~/layout/AppLayout";
import type { AppType } from "next/app";
import type { ColorScheme } from "@mantine/core";
import Router from "next/router";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { api } from "~/utils/api";
import { appWithTranslation } from "next-i18next";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setIsLoading(true);
      console.log("url", url);
    });

    Router.events.on("routeChangeComplete", (url) => {
      setIsLoading(false);
    });

    Router.events.on("routeChangeError", (url) => {
      setIsLoading(false);
    });
  }, [Router]);

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
      {/*       <Global
        styles={[
          {
            "@font-face": {
              fontFamily: "Greycliff CF",
              src: `url('${bold}') format("woff2")`,
              fontWeight: 700,
              fontStyle: "normal",
            },
          },
          {
            "@font-face": {
              fontFamily: "Greycliff CF",
              src: `url('${heavy}') format("woff2")`,
              fontWeight: 900,
              fontStyle: "normal",
            },
          },
        ]}
      /> */}
      {/* https://stackoverflow.com/questions/74555403/how-to-change-hover-color-in-mantine-ui-menu */}
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: `'Roboto Slab', sans-serif`,
          colorScheme, // get light/dark from local storage state
          primaryColor: "orange",
          breakpoints: {
            xs: "32em",
            sm: "44em",
            md: "60em",
            lg: "86em",
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
                  xl: 1600,
                },
              },
            },

            Button: {
              defaultProps: {
                variant: "outline",
              },
              styles: (theme) => ({
                root: {
                  // overriding the tailwind overrides... 👀
                  /* 
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? "#FF4200 !important"
                      : "#FF6600 !important",
                       */
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[0]
                      : theme.black,
                  /* 
                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? "#FF5500 !important"
                        : "#FF7700 !important",
                  },
                   */
                },
              }),
            },
          },
          globalStyles: (theme) => ({
            body: {
              ...theme.fn.fontStyles() /* 
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[1], */,
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
          <Box>
            <Toaster />
            <AppLayout>
              <LoadingOverlay
                visible={isLoading}
                transitionDuration={300}
                overlayBlur={5}
              />
              <Component {...pageProps} />
            </AppLayout>
          </Box>
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp));
