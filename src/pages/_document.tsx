import { createGetInitialProps } from "@mantine/next";
import { env } from "~/env.mjs";

import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();
export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>
          <meta
            name="google-site-verification"
            content={env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
          <meta name="seedfinderverification" content="Open Sesame!" />
          <link rel="manifest" href="/site.webmanifest" />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com crossOrigin"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Roboto+Slab:wght@100;200;300;400;500;600;700;800;900&family=Grandstander:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          />
          <script
            rel="canonical"
            defer
            data-domain="growagram.com"
            src="https://cdn.growagram.com/js/script.js"
          ></script>
          <meta property="og:type" content="website" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export const appTitle = "GrowAGram 🪴 Track Your Grow! 📜";
