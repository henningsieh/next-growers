import {
  ActionIcon,
  Box,
  Button,
  createStyles,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  rem,
  Text,
  Title,
  Transition,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { RichTextEditor } from "@mantine/tiptap";
import { IconMessagePlus, IconX } from "@tabler/icons-react";
import { BulletList } from "@tiptap/extension-bullet-list";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { ListItem } from "@tiptap/extension-list-item";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import type { Editor } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  commentSuccessfulMsg,
  defaultErrorMsg,
  httpStatusErrorMsg,
} from "~/messages";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import EmojiPicker from "~/components/Atom/EmojiPicker";
import UserAvatar from "~/components/Atom/UserAvatar";
import { UserComment } from "~/components/User/Comment";

import { type Comment, Locale } from "~/types";

import { api } from "~/utils/api";
import { sanatizeDateString } from "~/utils/helperUtils";
import { InputEditCommentForm } from "~/utils/inputValidation";

const useStyles = createStyles((theme) => ({
  responses: {
    scrollPaddingTop: "60px",
    paddingLeft: useMediaQuery(`(min-width: ${theme.breakpoints.md})`)
      ? rem(120)
      : rem(30),
    position: "relative",
    // overflow: "hidden",
  },
  treeBackground: {
    margin: 0,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: useMediaQuery(`(min-width: ${theme.breakpoints.md})`)
      ? rem(72)
      : 0,
    width: useMediaQuery(`(min-width: ${theme.breakpoints.md})`)
      ? rem(40)
      : theme.spacing.xl, // Adjust the width of the tree structure

    background:
      theme.colorScheme === "dark"
        ? theme.fn.linearGradient(
            90,
            theme.colors.dark[8],
            theme.colors.growgreen[5]
          )
        : theme.fn.linearGradient(
            90,
            theme.white,
            theme.colors.growgreen[3]
          ),
  },
}));

interface CommentsProps {
  growId: string;
  updateId: string;
}

const PostComments = ({ growId, updateId }: CommentsProps) => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const trpc = api.useUtils();

  const { classes, theme } = useStyles();

  const [isSaving, setIsSaving] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  const now = new Date();

  const { data: comments, isLoading } =
    api.comments.getCommentsByPostId.useQuery({
      postId: updateId,
    });

  const { data: session, status } = useSession();

  const commentsRef = useRef<HTMLElement[]>([]);

  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );

  const newCommentForm = useForm({
    validate: zodResolver(InputEditCommentForm),
    validateInputOnChange: false,
    initialValues: {
      id: undefined,
      isResponseTo: "",
      postId: updateId,
      content: "",
    },
  });

  const handleErrors = (errors: typeof newCommentForm.errors) => {
    Object.keys(errors).forEach((key) => {
      notifications.show(
        httpStatusErrorMsg(errors[key] as string, 422)
      );
    });
  };

  useEffect(() => {
    newCommentForm.setFieldValue("postId", updateId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateId]);

  // Prepare TipTap Editor for comment content
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        linkOnPaste: true,
        HTMLAttributes: {
          // Change rel to different value
          // Allow search engines to follow links(remove nofollow)
          // rel: 'noopener noreferrer',
          // Remove target entirely so links open in current tab
          target: null,
        },
      }),
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "justify"],
      }),
      BulletList.configure({
        HTMLAttributes: {
          itemTypeName: "List",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          itemTypeName: "List.Item",
        },
      }),
    ],
    content: newCommentForm.values.content,
    onUpdate: ({ editor }) => {
      newCommentForm.setFieldValue("content", editor.getHTML());
    },
  });

  const [commentHashId, setCommentHashId] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const extractedHashId = hash.slice(1);
    setCommentHashId(extractedHashId);
    // Timeout before finding the corresponding comment's HTML element
    setTimeout(() => {
      const commentElement = document.getElementById(commentHashId);

      // Scroll to the comment if it exists
      // if (commentElement) {
      //   commentElement.scrollIntoView({ behavior: "smooth" });
      // }

      // Scroll to the comment if it exists
      if (commentElement) {
        const topOffset = 60; // Your desired top offset
        const top =
          commentElement.getBoundingClientRect().top +
          window.scrollY -
          topOffset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100); // Adjust the timeout as needed
  }, [commentHashId, comments]);

  const userComments = comments?.map((comment) => {
    return (
      <Box
        sx={() => ({
          scrollPaddingTop: "60px",
        })}
        key={comment.id}
        id={comment.id}
        ref={(ref) => {
          if (ref) {
            commentsRef.current.push(ref);
          }
        }}
      >
        <UserComment
          editor={editor}
          reportId={growId}
          isResponse=""
          comment={comment}
          setNewOpen={setNewOpen}
          newCommentForm={newCommentForm}
        />
        {/* Map over comment.responses and wrap each UserComment */}
        {comment.responses.map((response) => (
          <Box
            id={response.id}
            key={response.id}
            className={classes.responses}
          >
            {/* Conditionally render the tree background only for the current comment */}
            {commentHashId == response.id && (
              <div className={classes.treeBackground}></div>
            )}

            <UserComment
              editor={editor}
              reportId={growId}
              isResponse={comment.id} // Assuming this is the ID of the parent comment
              comment={response as Comment}
              setNewOpen={setNewOpen}
              newCommentForm={newCommentForm}
            />
          </Box>
        ))}
      </Box>
    );
  });

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
        editor?.commands.setContent("");
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

  return (
    <Box>
      {status !== "loading" && isLoading && <p>loading comments...</p>}
      {status === "authenticated" && (
        <Box p="xs">
          <Group m={1} position="apart">
            <Title order={3}>{t("common:comments-headline")}</Title>

            <Button
              sx={(theme) => ({
                [theme.fn.smallerThan("sm")]: {
                  padding: rem(5),
                  height: rem(26),
                  fontWeight: "normal",
                },
              })}
              fz={smallScreen ? "sm" : "lg"}
              variant="filled"
              color={!newOpen ? "growgreen" : "dark"}
              leftIcon={
                <IconMessagePlus size={smallScreen ? 16 : 22} />
              }
              title={!newOpen ? "add new comment" : "close form"}
              onClick={() => {
                setNewOpen((prev) => !prev);
              }}
            >
              {t("common:comments-button-open-comments")}
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
                mt="sm"
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
                    <ActionIcon
                      color="orange"
                      variant="default"
                      title="reset form and close"
                      onClick={() => {
                        setNewOpen(false);
                        editor?.commands.clearContent();
                        newCommentForm.reset();
                      }}
                      m={0}
                      p={0}
                      className=" cursor-default"
                    >
                      <IconX size={22} stroke={1.8} />
                    </ActionIcon>
                  </Group>
                </Group>
                <Box></Box>
                <form
                  onSubmit={newCommentForm.onSubmit((values) => {
                    tRPCsaveComment(values);
                  }, handleErrors)}
                >
                  <Box ml={42} mt={12} className="relative">
                    <LoadingOverlay
                      radius="sm"
                      visible={isSaving}
                      transitionDuration={300}
                      loaderProps={{
                        size: "md",
                        color: "growgreen.3",
                      }}
                    />
                    <RichTextEditor
                      editor={editor}
                      withTypographyStyles={false}
                    >
                      <RichTextEditor.Toolbar p="xs">
                        <RichTextEditor.ControlsGroup>
                          <EmojiPicker editor={editor as Editor} />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.Bold />
                          <RichTextEditor.Italic />
                          <RichTextEditor.Underline />
                          <RichTextEditor.Strikethrough />
                          <RichTextEditor.ClearFormatting />
                          <RichTextEditor.Highlight />
                          <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.AlignLeft />
                          <RichTextEditor.AlignCenter />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.H1 />
                          <RichTextEditor.H2 />
                          <RichTextEditor.H3 />
                          <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.Link />
                          <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.Blockquote />
                          <RichTextEditor.Hr />
                          <RichTextEditor.BulletList />
                          <RichTextEditor.OrderedList />
                          {/* <RichTextEditor.Subscript />
                          <RichTextEditor.Superscript /> */}
                        </RichTextEditor.ControlsGroup>
                      </RichTextEditor.Toolbar>
                      <RichTextEditor.Content
                        sx={(theme) => ({
                          boxShadow: `0 0 0px 1px ${theme.colors.growgreen[4]}`,
                        })}
                      />
                    </RichTextEditor>
                  </Box>
                  <Flex mt="sm" justify="flex-end" align="center">
                    <Button
                      size="sm"
                      sx={(theme) => ({
                        [theme.fn.smallerThan("sm")]: {
                          padding: rem(5),
                          height: rem(26),
                          // width: rem(140),
                          fontSize: 14,
                          fontWeight: "normal",
                        },
                      })}
                      loading={isSaving}
                      type="submit"
                      variant="filled"
                      color="growgreen"
                    >
                      {t("common:comment-save-button")}
                    </Button>
                  </Flex>
                </form>
              </Paper>
            )}
          </Transition>
        </Box>
      )}

      {userComments}
    </Box>
  );
};

export default PostComments;
