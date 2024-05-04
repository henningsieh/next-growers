import type {
  AccordionStylesParams,
  ActionIconStylesParams,
  ButtonStylesParams,
  ColorScheme,
  MantineTheme,
  NotificationStylesParams,
} from "@mantine/core";
import {
  ColorSchemeProvider,
  MantineProvider,
  rem,
} from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import type { MantineColor } from "@mantine/styles";
import RootLayout from "~/layout/AppLayout";
import "~/styles/globals.css";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import type { AppType } from "next/app";
import { useRouter } from "next/router";

import Loading from "~/components/Atom/Loading";

import { api } from "~/utils/api";
import { useRouteLoader } from "~/utils/routeLoader";

import "dayjs/locale/de";
import "dayjs/locale/en";

const GrowAGram: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

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
          white: "#fefefe",
          black: "#333333",

          // Default theme.breakpoints values:
          // xs	36em	576px
          // sm	48em	768px
          // md	62em	992px
          // lg	75em	1200px
          // xl	88em	1408px

          breakpoints: {
            // 1 Spalte
            xs: "30em", //  480px
            // 2 Spalten
            sm: "38em",
            // 4 Spalten
            md: "58em",
            // 4 Spalten
            lg: "78em",
            // 6 Spalten
            xl: "90em", // 1440px
          },

          focusRingStyles: {
            // reset styles are applied to <button /> and <a /> elements
            // in &:focus:not(:focus-visible) selector to mimic
            // default browser behavior for native <button /> and <a /> elements
            resetStyles: () => ({ outline: "none" }),

            // styles applied to all elements except inputs based on Input component
            // styles are added with &:focus selector
            styles: (theme) => ({
              outline: `${rem(1)} solid ${theme.colors.growgreen[4]}`,
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

          components: {
            Accordion: {
              styles: (
                theme,
                params: AccordionStylesParams & {
                  color: MantineColor;
                },
                { variant }
              ) => ({
                control: {
                  fontWeight: "lighter",
                  color:
                    variant === "contained"
                      ? theme.colorScheme === "dark"
                        ? "white"
                        : theme.black
                      : undefined,
                  "&:hover": {
                    backgroundColor:
                      variant === "contained"
                        ? theme.colorScheme === "dark"
                          ? theme.colors.growgreen[6]
                          : theme.colors.growgreen[2]
                        : undefined,
                  },
                },
                item: {
                  // styles added to all items
                  backgroundColor:
                    variant === "contained"
                      ? theme.colorScheme === "dark"
                        ? theme.colors.dark[7]
                        : theme.colors.gray[2]
                      : // : theme.fn.lighten(
                        //     theme.colors.growgreen[4],
                        //     0.7
                        //   )
                        undefined,

                  // border: `${rem(1)} solid #ededed`,

                  // styles added to expanded item
                  "&[data-active]": {
                    backgroundColor:
                      variant === "contained"
                        ? theme.colorScheme === "dark"
                          ? "transparent"
                          : theme.white
                        : // : theme.fn.lighten(
                          //     theme.colors.growgreen[4],
                          //     0.7
                          //   )
                          undefined,
                  },
                },

                chevron: {
                  // styles added to chevron when it should rotate
                  // "&[data-rotate]": {
                  //   transform: "rotate(-90deg)",
                  // },
                },
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

            ActionIcon: {
              styles: (
                theme,
                params: ActionIconStylesParams,
                { variant }
              ) => ({
                defaultProps: {
                  variant: { variant },
                },
                root: {
                  cursor: "default",
                },
              }),
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
                        ? "white"
                        : "white"
                      : theme.colorScheme === "dark"
                        ? "white"
                        : theme.black,

                  boxShadow:
                    variant === "filled"
                      ? theme.colorScheme === "dark"
                        ? `0 0 0px 1px ${theme.colors[params.color || theme.primaryColor][2]}`
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
                          ? theme.colors[params.color || "dark"][5]
                          : theme.colors[params.color || "growgreen"][5]
                        : undefined,
                  },
                },
              }),
            },

            Card: {},

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
            Blockquote: {
              styles: () => ({
                root: {
                  // padding: 0, // effects grow tile view!!
                },
                inner: {
                  //fontSize: 4,
                },
                body: {
                  // padding: 0,
                },
                icon: {
                  // padding: 0,
                },
                cite: {
                  // padding: 0,
                },
              }),
            },
          },

          globalStyles: (theme) => ({
            blockquote: {
              margin: "0em 0em",
              padding: "0.2em 0em 0.3em 0.5em",
              fontSize: "0.96em",
              borderLeft: `2px solid ${theme.colors.growgreen[4]}`,
            },
            "blockquote p": {
              overflow: "hidden",
              // whiteSpace: "nowrap",
              fontSize: "0.96em",
            },
            ul: {
              fontSize: "0.72em",
              paddingLeft: "1.5em",
            },
            "ul li": {
              fontSize: "1.3em",
              position: "relative",
              paddingLeft: "1em",
            },
            "ul li p": {
              fontSize: "1em",
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
              backgroundColor: theme.colors.growgreen[4], // Change the color to match your theme
            },
            "ol li": {
              position: "relative",
              paddingLeft: "1em",
              marginBottom: "0.5em",
              counterIncrement: "list-counter",
            },
            "ol li p": {
              fontSize: "1em",
              position: "relative",
              paddingLeft: "1em",
            },
            "ol li::before": {
              content: "counter(list-counter)",
              position: "absolute",
              top: "0em",
              left: 0,
              fontWeight: "bold",
              color: theme.colors.growgreen[4], // Change the color to match your theme
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
          <Notifications limit={5} position="top-center" />

          <DatesProvider settings={{ locale: router.locale }}>
            <RootLayout>
              <Loading isLoading={isLoading} />
              <Component {...pageProps} />
            </RootLayout>
          </DatesProvider>
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default api.withTRPC(appWithTranslation(GrowAGram));
