import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  Space,
  Text,
  Textarea,
  Title,
  Transition,
  TypographyStylesProvider,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconInfoCircle,
  IconTextWrap,
  IconX,
} from "@tabler/icons-react";
import {
  commentSuccessfulMsg,
  defaultErrorMsg,
  httpStatusErrorMsg,
} from "~/messages";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

import UserAvatar from "~/components/Atom/UserAvatar";
import { UserComment } from "~/components/User/Comment";

import { Locale } from "~/types";

import { api } from "~/utils/api";
import { sanatizeDateString } from "~/utils/helperUtils";
import { InputEditCommentForm } from "~/utils/inputValidation";

interface CommentsProps {
  reportId: string;
  postId: string;
}

const PostComments = ({ reportId, postId }: CommentsProps) => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const trpc = api.useUtils();

  // const theme = useMantineTheme();

  const [isSaving, setIsSaving] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  const now = new Date();

  // FETCH COMMENTS
  const {
    data: comments,
    isLoading,
    // isError,
  } = api.comments.getCommentsByPostId.useQuery({
    postId: postId,
  });

  const { data: session, status } = useSession();

  const { mutate: tRPCsaveComment } =
    api.comments.saveComment.useMutation({
      onMutate: () => {
        setIsSaving(true);
      },
      // If the mutation fails, use the context
      // returned from onMutate to roll back
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onError: (error, _comment) => {
        notifications.show(defaultErrorMsg(error.message));
      },
      onSuccess: async (newCommentDB) => {
        notifications.show(commentSuccessfulMsg);
        newCommentForm.reset();
        await trpc.comments.getCommentsByPostId.fetch({
          postId: newCommentDB.postId as string,
        });
      },
      // Always refetch after error or success:
      onSettled: () => {
        setNewOpen(false);
        setIsSaving(false);
      },
    });

  const commentsRef = useRef<HTMLElement[]>([]);

  const newCommentForm = useForm({
    validate: zodResolver(InputEditCommentForm),
    validateInputOnChange: false,
    initialValues: {
      id: undefined,
      isResponseTo: "",
      postId: postId,
      content: "",
    },
  });

  const userComments = comments?.map((postComment) => {
    return (
      <div
        key={postComment.id}
        id={postComment.id}
        ref={(ref) => {
          if (ref) {
            commentsRef.current.push(ref);
          }
        }}
      >
        <UserComment
          reportId={reportId}
          isResponse=""
          comment={postComment}
          setNewOpen={setNewOpen}
          newCommentForm={newCommentForm}
        />
      </div>
    );
  });

  const handleErrors = (errors: typeof newCommentForm.errors) => {
    Object.keys(errors).forEach((key) => {
      notifications.show(
        httpStatusErrorMsg(errors[key] as string, 422)
      );
    });
  };

  useEffect(() => {
    newCommentForm.setFieldValue("postId", postId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  return (
    <Box>
      {status !== "loading" && isLoading && <p>loading comments...</p>}
      {status === "authenticated" && (
        <>
          <Space h={"lg"} />
          <Group pb="xs" position="apart">
            <Title order={2}>{t("common:comments-headline")}</Title>

            <Button
              fz="lg"
              variant="filled"
              color="growgreen"
              leftIcon={<IconTextWrap size={22} />}
              title={!newOpen ? "add new comment" : "close form"}
              onClick={() => {
                setNewOpen((prev) => !prev);
              }}
            >
              {t("common:comments-button-comment")}
            </Button>
          </Group>

          <Transition
            mounted={newOpen}
            transition="scale-y"
            duration={500}
            timingFunction="ease"
          >
            {(transitionStyles) => (
              <Paper
                style={{ ...transitionStyles }}
                p="sm"
                mb="xs"
                withBorder
              >
                <Group position="apart">
                  <Group position="left">
                    <UserAvatar
                      imageUrl={
                        session?.user.image
                          ? session.user.image
                          : `https://ui-avatars.com/api/?name=${
                              session.user.name as string
                            }`
                      }
                      userName={session?.user.name as string}
                      avatarRadius={42}
                      tailwindMarginTop={false}
                    />
                    <Box>
                      <Text fz="sm">
                        {session?.user.name as string}
                      </Text>
                      <Text fz="xs" c="dimmed">
                        {sanatizeDateString(
                          now.toISOString(),
                          router.locale === Locale.DE
                            ? Locale.DE
                            : Locale.EN,
                          false,
                          true
                        )}
                      </Text>
                    </Box>
                  </Group>
                  <Group position="right">
                    <>
                      <ActionIcon
                        color="orange"
                        variant="default"
                        title="reset form and close"
                        onClick={() => {
                          setNewOpen(false);
                          newCommentForm.reset();
                        }}
                        m={0}
                        p={0}
                        className=" cursor-default"
                      >
                        <IconX size="1.2rem" stroke={1.4} />
                      </ActionIcon>
                    </>

                    {/* <LikeHeart itemToLike={comment} itemType={"Comment"} /> */}
                  </Group>
                </Group>
                <Box>
                  <TypographyStylesProvider>
                    <Alert
                      p="xs"
                      mt="sm"
                      ml={42}
                      // w={420}
                      icon={<IconInfoCircle size="1rem" />}
                      title="Markdown support"
                      color="orange"
                      variant="outline"
                    >
                      Use{" "}
                      <Link
                        title="Markdown Cheat Sheet"
                        href={
                          "https://www.markdownguide.org/cheat-sheet/"
                        }
                        target="_blank"
                      >
                        <u>markdown</u>
                      </Link>{" "}
                      to <i>style</i> your <b>comment</b>!
                    </Alert>
                  </TypographyStylesProvider>
                </Box>
                <form
                  onSubmit={newCommentForm.onSubmit((values) => {
                    tRPCsaveComment(values);
                  }, handleErrors)}
                >
                  <Box className="relative">
                    <LoadingOverlay
                      ml={42}
                      mt={12}
                      radius="sm"
                      visible={isSaving}
                      transitionDuration={50}
                      loaderProps={{
                        size: "sm",
                        variant: "dots",
                      }}
                    />
                    <Textarea
                      autosize
                      minRows={3}
                      maxRows={14}
                      ml={42}
                      pt={12}
                      withAsterisk
                      // placeholder={`be nice and friendly :-)`}
                      {...newCommentForm.getInputProps("content")}
                    />
                  </Box>
                  <Flex justify="flex-end" align="center">
                    <Button
                      disabled={isSaving}
                      mt="xs"
                      size="xs"
                      type="submit"
                      variant="outline"
                    >
                      {t("common:comment-save-button")}
                    </Button>
                  </Flex>
                </form>
              </Paper>
            )}
          </Transition>
        </>
      )}

      {userComments}
    </Box>
  );
};

export default PostComments;
