import PostDeleteButton from "../DeleteButton";
import {
  Accordion,
  Box,
  Card,
  Center,
  Container,
  Flex,
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
    <Container
      pl={0}
      pr={0}
      pt="xl"
      className="flex w-full flex-col space-y-2"
    >
      <Accordion
        radius="sm"
        variant="contained"
        chevronSize={11}
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
              </Accordion.Control>{" "}
              <Accordion.Panel mx={-8}>
                {/* <Flex
                  gap="md"
                  justify="space-between"
                  align="center"
                  direction="row"
                  wrap="wrap"
                  sx={() => ({
                    display: "inline-flex", // or "inline-flex"
                  })}
                > */}
                <Title pl="xs" order={1}>
                  {t("common:post-edit-headline")}{" "}
                </Title>
                {/* 
                  <PostDeleteButton
                    postId={post.id}
                    alertTitle={t("common:post-delete-warning")}
                    alertText={t("common:user-msg-question-continue")}
                    labelDeletePostButton={t(
                      "common:post-delete-button"
                    )}
                    labelCloseButton={t(
                      "common:app-notifications-close-button"
                    )}
                  />
                </Flex> */}

                <AddPost isoReport={isoReport} post={post} />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
      </Accordion>
    </Container>
  );
};

export default PostsAccordion;
