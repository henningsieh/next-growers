import "~/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";

import { api } from "~/utils/api";
import AppLayout from "./components/Layout/AppLayout";
import { useState } from "react";
import { appWithTranslation } from 'next-i18next'
import { useColorScheme } from "@mantine/hooks";
import {
  type ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {


  const preferredColorScheme = 'dark'; // useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme);

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}
    >
      {/* <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS > */}

      <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme,
        colors: {
          // Add your color
          deepBlue: ['#E9EDFC', '#C1CCF6', '#99ABF0' /* ... */],
          // or replace default theme color
          blue: ['#E9EDFC', '#C1CCF6', '#99ABF0' /* ... */],
        },

        shadows: {
          md: '1px 1px 3px rgba(0, 0, 0, .25)',
          xl: '5px 5px 3px rgba(0, 0, 0, .25)',
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
