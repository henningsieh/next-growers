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

const MyApp: AppType<{ session: Session | null }> = ({
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
          loader: "bars",
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
                variant: "filled",
              },
              styles: (theme) => ({
                root: {
                  // overriding the tailwind overrides... 👀
                  button: {},
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[4]
                      : theme.black,

                  "&:hover": {
                    cursor: "default",
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.orange[7]
                        : theme.colors.orange[3],
                  },
                },
              }),
            },
          },
          globalStyles: (theme) => ({
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

            ".your-class": {
              backgroundColor: "red",
            },

            "#your-id > [data-active]": {
              backgroundColor: "pink",
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
        <Loading isLoading={isLoading} />
        <SessionProvider session={session}>
          {/* // FUTURE BANNERS GO HERE!! */}
          <Notifications limit={5} position="bottom-right" />
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
