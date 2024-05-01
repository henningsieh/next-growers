import { Box, Button, useMantineTheme } from "@mantine/core";

import CookieConsent, {
  getCookieConsentValue,
} from "react-cookie-consent";

function CookieConsentBanner() {
  const theme = useMantineTheme();

  return (
    <CookieConsent
      ButtonComponent={Button}
      cookieName="GrowAGramCookieConsent"
      visible="byCookieValue"
      buttonText="🍪 I like these Cookies!"
      cookieValue={getCookieConsentValue("GrowAGramCookieConsent")}
      contentStyle={{
        background: theme.colors.dark[6],
        borderRadius: theme.radius.sm,
        padding: theme.spacing.sm,
        // margin: theme.spacing.xl,
      }}
      buttonStyle={{
        paddingBottom: 10,
        borderRadius: theme.radius.sm,
        background:
          theme.colorScheme === "dark"
            ? theme.colors.growgreen[5]
            : theme.colors.growgreen[4],
        color: "white",

        fontWeight: "bolder",
        border: `1px solid ${theme.colors.growgreen[2]}`, // Example border style
      }}
      debug
      // overlay
      // expires={30}
    >
      <Box fz="lg">
        This website uses cookies to enhance the user experience.
      </Box>
      <span
        style={{
          fontSize: theme.fontSizes.sm,
        }}
      >
        We do only save your login session data (if it exists), your
        dark/light theme setting and finally a cookie for remembering
        that you have already acknowledged this cookie information. No
        more cookies!
      </span>
      {/* <Flex mt="sm" justify="flex-end" align="center">
      <Button variant="light">Accept!</Button>
    </Flex> */}
    </CookieConsent>
  );
}

export default CookieConsentBanner;
