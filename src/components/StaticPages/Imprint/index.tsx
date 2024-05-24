import { Box, Container, Space, Title } from "@mantine/core";

import Link from "next/link";

function Imprint() {
  return (
    <Container size="md" pt="xl">
      <Title order={1}>Impressum</Title>
      <Box>
        {"Benjamin Klein - "}
        <Link target="_blank" href={"https://webkult.de/"}>
          webkult.de
        </Link>
        <br />
        Kleine Dorfstraße 5
        <br />
        38312 Börßum
      </Box>

      <Space h="xl" />
      <Title order={2}>Kontakt</Title>
      <Box>
        {/* Telefon: +4961814985597
        <br /> */}
        E-Mail: support@growagram.com
      </Box>

      {/* <Space h="xl" />
      <Title order={2}>Umsatzsteuer-ID</Title>
      <Box>
        Umsatzsteuer-Identifikationsnummer gemäß § 27 a
        Umsatzsteuergesetz:
        <br />
        DE279588258
      </Box> */}

      <Space h="xl" />
      <Title order={2}>Redaktionell verantwortlich</Title>
      <Box>
        {"Benjamin Klein - "}
        <Link target="_blank" href={"https://webkult.de/"}>
          webkult.de
        </Link>
        <br />
        Kleine Dorfstraße 5
        <br />
        38312 Börßum
      </Box>

      <Space h="xl" />
      <Title order={2}>
        Verbraucherstreitbeilegung / Universalschlichtungsstelle
      </Title>
      <Box>
        Wir sind nicht bereit oder verpflichtet, an
        Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </Box>

      <Space h="xl" />
      <Title order={2}>
        Zentrale Kontaktstelle nach dem Digital Services Act - DSA
        (Verordnung (EU) 2022/265)
      </Title>
      <Box>
        Die für den Kontakt zur Verfügung stehenden Sprachen sind:
        Deutsch, Englisch (german, english). Unsere zentrale
        Kontaktstelle für Nutzer und Behörden nach Art. 11, 12 DSA
        erreichen Sie wie folgt:
      </Box>
      <Box>E-Mail: support@growagram.com</Box>

      <Space h="xl" />
      <Box fz={10}>
        Quelle:{" "}
        <a href="https://www.e-recht24.de/impressum-generator.html">
          https://www.e-recht24.de/impressum-generator.html
        </a>
      </Box>
    </Container>
  );
}

export default Imprint;
