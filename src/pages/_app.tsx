import {
  ColorSchemeProvider,
  MantineProvider,
  rem,
} from "@mantine/core";
import type {
  ButtonStylesParams,
  ColorScheme,
  MantineTheme,
  NotificationStylesParams,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import RootLayout from "~/layout/AppLayout";
import "~/styles/emojiPickerStyles.css";
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
          colors: {
            groworange: [
              "#FFC4B3",
              "#FFA48A",
              "#FF8764",
              "#FF6C41",
              "#FF5322",
              "#FF4411",
              "#FF2D00",
              "#E72900",
              "#D02500",
              "#BB2100",
            ],
            growgreen: [
              "#8DDD83",
              "#5BCE4E",
              "#3FB431",
              "#339128",
              "#297520",
              "#1F5918",
              "#184412",
              "#12330E",
              "#0E270B",
              "#0A1E08",
            ],
          },
          primaryColor: "growgreen",
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
          white: "#d7e4d7",
          black: "#333333",
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
            SegmentedControl: {
              styles: () => ({
                label: {
                  paddingTop: rem(2),
                  paddingBottom: rem(2),
                  paddingLeft: rem(4),
                  paddingRight: rem(4),
                },
              }),
            },

            InputWrapper: {
              styles: (theme) => ({
                label: {
                  fontSize: theme.fontSizes.lg,
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.growgreen[4]
                      : theme.colors.growgreen[6],
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? "rgba(0, 0, 0, 0)" // no label background in dark mode
                      : "rgba(255, 255, 255, .66)",
                },
                description: {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.white
                      : theme.colors.gray[9],
                  fontSize: theme.fontSizes.sm,
                  fontFamily: "monospace",
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? "rgba(0, 0, 0, .3)"
                      : "rgba(255, 255, 255, .66)",
                },
              }),
            },

            Input: {
              styles: (theme) => ({
                input: {
                  fontSize: theme.fontSizes.sm,
                  color:
                    theme.colorScheme === "dark"
                      ? theme.white
                      : theme.black,

                  //fontSize: theme.fontSizes.md,
                  borderColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.growgreen[4]
                      : theme.colors.growgreen[4],

                  // backgroundColor:
                  //   theme.colorScheme === "dark"
                  //     ? theme.colors.growgreen[8]
                  //     : theme.colors.growgreen[4],
                },
              }),
            },

            Notification: {
              styles: (
                theme: MantineTheme,
                params: NotificationStylesParams
              ) => ({
                // Use the background color from the theme
                root: {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors[params.color || "dark"][6]
                      : theme.colors[params.color || "gray"][4],
                },
                title: {
                  fontSize: theme.fontSizes.xl,
                  color: theme.white,
                },
                description: { color: theme.white },
                // Other styles...
              }),
            },

            Container: {
              defaultProps: {
                sizes: {
                  xs: 515, //   32em x 16px
                  sm: 720, //   45em x 16px
                  md: 960, //   60em x 16px
                  lg: 1024, //  90em x 16px
                  xl: 1440, // 116em x 16px
                },
              },
            },

            Button: {
              defaultProps: {
                variant: "outline",
              },
              styles: (
                theme,
                params: ButtonStylesParams,
                { variant }
              ) => ({
                root: {
                  cursor: "default",
                  color:
                    variant === "filled"
                      ? theme.colorScheme === "dark"
                        ? theme.white
                        : theme.white
                      : theme.colorScheme === "dark"
                        ? theme.white
                        : theme.black,

                  boxShadow:
                    variant === "filled"
                      ? theme.colorScheme === "dark"
                        ? `0 0 0px 1px ${theme.colors[params.color || theme.primaryColor][4]}`
                        : `0 0 0px 1px ${theme.colors[params.color || "gray"][6]}`
                      : undefined,
                  backgroundColor:
                    variant === "filled"
                      ? theme.colorScheme === "dark"
                        ? theme.colors[params.color || "dark"][6]
                        : theme.colors[params.color || "growgreen"][4]
                      : undefined,

                  "&:hover": {
                    backgroundColor:
                      variant === "filled"
                        ? theme.colorScheme === "dark"
                          ? theme.colors[params.color || "dark"][4]
                          : theme.colors[params.color || "growgreen"][5]
                        : undefined,
                  },
                },
              }),
            },
          },
          focusRingStyles: {
            // reset styles are applied to <button /> and <a /> elements
            // in &:focus:not(:focus-visible) selector to mimic
            // default browser behavior for native <button /> and <a /> elements
            resetStyles: () => ({ outline: "none" }),

            // styles applied to all elements except inputs based on Input component
            // styles are added with &:focus selector
            styles: (theme) => ({
              outline: `${rem(5)} solid ${theme.colors.groworange[4]}`,
            }),

            // focus styles applied to components that are based on Input
            // styles are added with &:focus selector
            inputStyles: (theme) => ({
              // padding: theme.spacing.sm,
              // boxShadow: theme.shadows.lg,
              outline: `${rem(1)} solid ${theme.colors.growgreen[4]}`,
              // outline: "none", // Remove the yellow outline on focus
            }),
          },

          globalStyles: (theme) => ({
            blockquote: {
              margin: "0em 0em",
              padding: "0.2em 0em 0.3em 0.5em",
              fontSize: "0.96em",
              borderLeft: `2px solid ${theme.colors.growgreen[4]}`,
              fontStyle: "italic",
            },
            "blockquote a": {
              textDecoration: "underline",
              color: theme.colors.growgreen?.[3],
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
              backgroundColor: theme.colors.groworange[4], // Change the color to match your theme
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
              color: theme.colors.groworange[4], // Change the color to match your theme
            },
            "*, *::before, *::after": {
              boxSizing: "border-box",
            },
          }),

          // shadows: {
          //   md: "1px 1px 3px rgba(0, 0, 0, .25)",
          //   xl: "5px 5px 3px rgba(0, 0, 0, .25)",
          // },
        }}
      >
        <SessionProvider session={session}>
          <Loading isLoading={isLoading} />
          <Notifications limit={5} position="top-center" />
          <Toaster />

          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default api.withTRPC(appWithTranslation(GrowAGram));
