import {
  ActionIcon,
  createStyles,
  Flex,
  Group,
  rem,
  ThemeIcon,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconBrandInstagram,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { env } from "~/env.mjs";

import Image from "next/image";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  footer: {
    marginBottom: rem(40),
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[3]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
  },

  links: {
    marginTop: useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
      ? theme.spacing.lg
      : undefined,

    marginBottom: useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
      ? theme.spacing.sm
      : undefined,
  },
}));
// Define the type for the props
interface FooterProps {
  items: JSX.Element[];
}

// Define the Footer component with the correct props type
export function Footer({ items: footerLinks }: FooterProps) {
  const { classes, theme: _theme } = useStyles();

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Flex align="center" gap="xs">
          <ThemeIcon>
            <Image
              src={"/favicon-32x32.png"}
              width={32}
              height={32}
              alt={"GrowAGram Icon"}
            />
          </ThemeIcon>
        </Flex>

        <Group className={classes.links}>{footerLinks}</Group>
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
      </div>
    </div>
  );
}
