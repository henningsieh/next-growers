import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import type { ColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import AppLayout from "~/layout/AppLayout";
import "~/styles/globals.css";

import { Toaster } from "react-hot-toast";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import type { AppType } from "next/app";

import Loading from "~/components/Atom/Loading";

import { api } from "~/utils/api";
import { useRouteLoader } from "~/utils/routeLoader";

const GrowAGram: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const isLoading = useRouteLoader();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "dark",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(
      value || (colorScheme === "dark" ? "light" : "dark")
    );

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
          loader: "oval",
          colorScheme,
          fontFamily: `'Lato', sans-serif`,
          headings: {
            fontFamily: `'Open Sans', sans-serif`,
            sizes: {
              h1: { fontSize: "1.48rem" },
              h2: { fontSize: "1.36rem" },
              h3: { fontSize: "1.24rem" },
              h4: { fontSize: "1.12rem" },
              h5: { fontSize: "0.94rem" },
            },
          },
          white: "#F6F6F6",
          black: "#333333",
          primaryColor: "orange",
          breakpoints: {
            xs: "30em",
            // 1 Spalte
            sm: "38em",
            // 2 Spalten
            md: "58em",
            // 4 Spalten
            lg: "78em",
            // 4 Spalten
            xl: "90em",
            // 6 Spalten
          },
          components: {
            Container: {
              defaultProps: {
                sizes: {
                  xs: 515, //  32em x 16px
                  sm: 720, //  45em x 16px
                  md: 960, //  60em x 16px
                  lg: 1024, //  90em x 16px
                  xl: 1440, // 116em x 16px
                },
              },
            },

            Button: {
              defaultProps: {
                variant: "default",
              },
              styles: (theme) => ({
                root: {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[5]
                      : theme.colors.dark[5],
                  "&:hover": {
                    // cursor: "default",
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.orange[8]
                        : theme.colors.orange[5],
                  },
                },
              }),
            },
          },
          globalStyles: (theme) => ({
            blockquote: {
              margin: "0em 0em",
              padding: "0.2em 0em 0.3em 0.5em",
              fontSize: "0.96em",
              borderLeft: `2px solid ${theme.colors.orange[7]}`,
              fontStyle: "italic",
            },
            "blockquote a": {
              textDecoration: "underline",
              color: theme.colors.orange[6],
            },
            ul: {
              paddingLeft: "1.5em",
            },
            "ul li": {
              position: "relative",
              paddingLeft: "1em",
            },
            "ul li::before": {
              content: '""',
              position: "absolute",
              top: "0.66em",
              left: 0,
              width: "0.5em",
              height: "0.5em",
              borderRadius: "50%",
              backgroundColor: theme.colors.orange[7], // Change the color to match your theme
            },
            ol: {
              paddingLeft: "1.5em",
              counterReset: "list-counter",
            },
            "ol li": {
              position: "relative",
              paddingLeft: "1em",
              marginBottom: "0.5em",
              counterIncrement: "list-counter",
            },
            "ol li::before": {
              content: "counter(list-counter)",
              position: "absolute",
              top: "0em",
              left: 0,
              fontWeight: "bold",
              color: theme.colors.orange[7], // Change the color to match your theme
            },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            body: {
              ...theme.fn.fontStyles(),
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

            "*, *::before, *::after": {
              boxSizing: "border-box",
            },
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
          <Notifications limit={5} position="bottom-right" />
          <Toaster />
          <Loading isLoading={isLoading} />
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default api.withTRPC(appWithTranslation(GrowAGram));
