import {
  Accordion,
  Box,
  Card,
  Center,
  Container,
  Group,
  Title,
} from "@mantine/core";

import { useState } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import AddPost from "~/components/Post/AddForm";

import type { IsoReportWithPostsFromDb } from "~/types";
import { Locale } from "~/types";

import { sanatizeDateString } from "~/utils/helperUtils";

interface PostsAccordionProps {
  report: IsoReportWithPostsFromDb | undefined;
}

const PostsAccordion = ({ report: isoReport }: PostsAccordionProps) => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const [postIsOpen, setPostIsOpen] = useState<string | null>(null);

  return (
    <Container p={0} className="flex flex-col space-y-2">
      <Title order={2}> {t("common:editallpost-headline")} </Title>
      <Accordion
        radius="sm"
        variant="contained"
        bottom={100}
        transitionDuration={420}
        value={postIsOpen}
        onChange={setPostIsOpen}
      >
        {!!isoReport &&
          isoReport.posts.map((post) => (
            <Accordion.Item key={post.id} value={post.id}>
              <Accordion.Control px="sm">
                <Group position="apart">
                  <Card withBorder w={80} m={0} p={4}>
                    <Center>
                      <Box fz={"sm"} m={4}>
                        {"Day "}
                        {post.growDay}
                      </Box>
                    </Center>
                  </Card>
                  <Box fz={"md"} mb={0} pt={0}>
                    {sanatizeDateString(
                      post.date,
                      router.locale === Locale.DE
                        ? Locale.DE
                        : Locale.EN,
                      false,
                      false
                    )}
                  </Box>
                </Group>
              </Accordion.Control>
              <Accordion.Panel mx={-8}>
                <Title pb="xs" order={3}>
                  {t("common:editpost-headline")}{" "}
                </Title>

                <AddPost isoReport={isoReport} post={post} />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
      </Accordion>
    </Container>
  );
};

export default PostsAccordion;
