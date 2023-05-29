import AddPost from "../AddForm/index";
import {
  Accordion,
  Box,
  Card,
  Center,
  Container,
  Flex,
  Group,
  Paper,
  Title,
} from "@mantine/core";
import { sanatizeDateString } from "~/helpers";

import { useState } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import type { IsoReportWithPostsFromDb } from "~/types";
import { Locale, Posts } from "~/types";

interface PostsAccordionProps {
  report: IsoReportWithPostsFromDb | undefined;
}

const PostsAccordion = ({ report: isoReport }: PostsAccordionProps) => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const [postIsOpen, setPostIsOpen] = useState<string | null>(null);

  return (
    <div>
      <Container p={0} className="flex flex-col space-y-2">
        <Title order={2}> {t("common:editallpost-headline")} </Title>
        <Paper withBorder>
          <Accordion
            transitionDuration={420}
            value={postIsOpen}
            onChange={setPostIsOpen}
          >
            {!!isoReport &&
              isoReport.posts.map((post) => (
                <Accordion.Item key={post.id} value={post.id}>
                  <Accordion.Control px={"xs"}>
                    <Group position="apart">
                      <Card withBorder w={80} m={0} p={4}>
                        <Center>
                          <Box fz={"sm"} m={4}>
                            {"Day "}
                            {post.growDay}
                          </Box>
                        </Center>
                        {/* 
                        <Box p={4} fz={"xs"}>
                          {sanatizeDateString(
                            post.date,
                            router.locale === Locale.DE
                              ? Locale.DE
                              : Locale.EN
                          )}
                        </Box> */}
                      </Card>
                      <Box fz={"md"} mb={0} pt={0}>
                        {sanatizeDateString(
                          post.date,
                          router.locale === Locale.DE
                            ? Locale.DE
                            : Locale.EN
                        )}
                      </Box>
                      {/* 
                      <Box fz={"xs"} mb={0} pt={0}>
                        {sanatizeDateString(
                          post.date,
                          router.locale === Locale.DE
                            ? Locale.DE
                            : Locale.EN
                        )}
                      </Box> */}
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Title order={3}>
                      {t("common:editpost-headline")}{" "}
                    </Title>

                    <AddPost isoReport={isoReport} post={post} />
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
          </Accordion>
        </Paper>
      </Container>
    </div>
  );
};

export default PostsAccordion;
