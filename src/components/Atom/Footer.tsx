import {
  ActionIcon,
  Box,
  createStyles,
  Flex,
  rem,
  ThemeIcon,
} from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { env } from "~/env.mjs";

import Image from "next/image";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  footer: {
    paddingTop: rem(24),
    marginBottom: rem(42),
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[3]
    }`,
  },

  links: {
    // marginTop: useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
    //   ? theme.spacing.lg
    //   : undefined,
    // marginBottom: useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
    //   ? theme.spacing.sm
    //   : undefined,
  },
}));
// Define the type for the props
interface FooterProps {
  items: JSX.Element[];
}

// Define the Footer component with the correct props type
export function Footer({ items: footerLinks }: FooterProps) {
  const { classes, theme: theme } = useStyles();

  return (
    <Box className={classes.footer}>
      <Flex
        p={theme.spacing.xs}
        align="center"
        gap={theme.spacing.md}
        justify="space-evenly"
      >
        <Flex align="center" justify="center" gap="xs">
          <ThemeIcon>
            <Image
              src={"/favicon-32x32.png"}
              width={32}
              height={32}
              alt={"GrowAGram Icon"}
            />
          </ThemeIcon>
        </Flex>

        <Flex
          gap="sm"
          justify="center"
          wrap="wrap"
          className={classes.links}
        >
          {footerLinks}
        </Flex>

        <Flex gap="sm" justify="flex-end" wrap="nowrap">
          <Link target="_blank" href={env.NEXT_PUBLIC_TWITTERX_URL}>
            <ActionIcon
              title="Twitter/X [extern]"
              className="cursor-pointer"
              size="lg"
              variant="default"
              radius="xl"
            >
              <IconBrandTwitter
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Link>
          {/* <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon> */}
          <Link target="_blank" href={env.NEXT_PUBLIC_INSTAGRAM_URL}>
            <ActionIcon
              title="Instagram [extern]"
              className="cursor-pointer"
              size="lg"
              variant="default"
              radius="xl"
            >
              <IconBrandInstagram
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}
