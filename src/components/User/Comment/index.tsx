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
  TextInput,
  TypographyStylesProvider,
  useMantineTheme,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useForm, zodResolver } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { RichTextEditor } from "@mantine/tiptap";
import {
  IconEdit,
  IconMessageForward,
  IconTrashX,
} from "@tabler/icons-react";
import { IconEditOff } from "@tabler/icons-react";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { type Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  commentDeletedSuccessfulMsg,
  defaultErrorMsg,
  httpStatusErrorMsg,
} from "~/messages";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import EmojiPicker from "~/components/Atom/EmojiPicker";
import LikeHeart from "~/components/Atom/LikeHeart";
import UserAvatar from "~/components/Atom/UserAvatar";

import { type Comment, Locale } from "~/types";

import { api } from "~/utils/api";
import { sanatizeDateString } from "~/utils/helperUtils";
import { InputEditCommentForm } from "~/utils/inputValidation";

const useStyles = createStyles((theme) => ({
  comment: {
    marginBottom: theme.spacing.xs,
  },

  contentHtml: {
    paddingLeft: useMediaQuery(`(min-width: ${theme.breakpoints.md})`)
      ? rem(58)
      : rem(4),
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  responses: {
    paddingLeft: useMediaQuery(`(min-width: ${theme.breakpoints.md})`)
      ? rem(120)
      : rem(30),
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));

interface UserCommentProps {
  editor: Editor | null;
  reportId: string;
  comment: Comment;
  isResponse: string;
  setNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newCommentForm: UseFormReturnType<
    {
      id: undefined;
      isResponseTo: string;
      postId: string;
      content: string;
    },
    (values: {
      id: undefined;
      isResponseTo: string;
      postId: string;
      content: string;
    }) => {
      id: undefined;
      isResponseTo: string;
      postId: string;
      content: string;
    }
  >;
}

export function UserComment({
  editor: newCommentEditor,
  reportId,
  isResponse,
  comment,
  setNewOpen,
  newCommentForm,
}: UserCommentProps) {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const theme = useMantineTheme();
  const largeScreen = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm})`
  );

  const { classes } = useStyles();
  const { data: session, status } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [commentHtml, setCommentHtml] = useState<string | null>(null);

  const trpc = api.useUtils();

  const { mutate: tRPCdeleteComment } =
    api.comments.deleteCommentById.useMutation({
      onMutate: (newCommentDB) => {
        console.debug(
          "START api.comments.deleteCommentById.useMutation"
        );
        setIsSaving(true);
        console.log("newCommentDB", newCommentDB);
      },
      // If the mutation fails, use the context
      // returned from onMutate to roll back
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onError: (error, _comment) => {
        notifications.show(defaultErrorMsg(error.message));
        console.error({ error });
      },
      onSuccess: async () => {
        await trpc.comments.invalidate();
        notifications.show(commentDeletedSuccessfulMsg);
        // Navigate to the new report page
        // void router.push(`/account/reports/${newReportDB.id}`);
      },
      // Always refetch after error or success:
      onSettled: () => {
        setIsSaving(false);
        console.log("END api.comments.deleteCommentById.useMutation");
      },
    });

  const { mutate: tRPCsaveComment } =
    api.comments.saveComment.useMutation({
      onMutate: () => {
        console.debug("START api.comments.saveComment.useMutation");
        setIsSaving(true);
      },
      // If the mutation fails, use the context
      // returned from onMutate to roll back
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onError: (error, _comment) => {
        notifications.show(defaultErrorMsg(error.message));
        console.error({ error });
      },
      onSuccess: async (newReportDB) => {
        await trpc.comments.getCommentsByPostId.fetch({
          postId: newReportDB.postId as string,
        });
        setIsEditing(false);
        // Navigate to the new report page
        // void router.push(`/account/reports/${newReportDB.id}`);
      },
      // Always refetch after error or success:
      onSettled: () => {
        setIsSaving(false);
        console.log("END api.reports.create.useMutation");
      },
    });

  const editCommentForm = useForm({
    validate: zodResolver(InputEditCommentForm),
    validateInputOnChange: true,
    initialValues: {
      id: comment.id,
      isResponseTo: comment.isResponseToId || undefined,
      postId: comment.postId as string,
      content: comment.content,
    },
  });

  const handleErrors = (errors: typeof editCommentForm.errors) => {
    Object.keys(errors).forEach((key) => {
      notifications.show(
        httpStatusErrorMsg(errors[key] as string, 422)
      );
    });
  };

  // Prepare TipTap Editor for comment content
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        linkOnPaste: true,
      }),
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "justify"],
      }),
    ],
    content: editCommentForm.values.content,
    onUpdate: ({ editor }) => {
      editCommentForm.setFieldValue("content", editor.getHTML());
    },
  });

  useEffect(() => {
    editCommentForm.setFieldValue(
      "isResponseToId",
      comment.isResponseToId
    );

    const fetchHtml = () => {
      try {
        setCommentHtml(comment.content);
      } catch (error) {
        console.error(error);
        // Handle the error if necessary
      }
    };
    void fetchHtml();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment.content]);

  return (
    <>
      <Paper
        withBorder
        p="sm"
        pt="xs"
        radius="md"
        className={classes.comment}
      >
        <Group position="apart">
          <Group position="left">
            <UserAvatar
              imageUrl={
                comment.author.image
                  ? comment.author.image
                  : `https://ui-avatars.com/api/?name=${
                      comment.author.name as string
                    }`
              }
              userName={comment.author.name as string}
              avatarRadius={largeScreen ? 42 : 32}
              tailwindMarginTop={false}
            />
            <Box>
              <Text fz={largeScreen ? "sm" : "xs"}>
                {comment.author.name}
              </Text>
              <Text fz={largeScreen ? "xs" : rem(10)} c="dimmed">
                {sanatizeDateString(
                  comment.createdAt.toISOString(),
                  router.locale === Locale.DE ? Locale.DE : Locale.EN,
                  largeScreen,
                  true
                )}
              </Text>
            </Box>
          </Group>
          <Flex
            mt="xs"
            justify="flex-end"
            align="flex-start"
            gap={4}
            style={{ flexGrow: 1 }}
          >
            {status === "authenticated" &&
              session.user.id === comment.author.id && (
                <>
                  <ActionIcon
                    onClick={() => tRPCdeleteComment(comment.id)}
                    className=" cursor-default"
                    variant="default"
                  >
                    <IconTrashX size="1.4rem" stroke={1.2} />
                  </ActionIcon>
                  {!isEditing ? (
                    <ActionIcon
                      title="edit comment"
                      onClick={() => setIsEditing((prev) => !prev)}
                      className="cursor-default"
                      variant="default"
                    >
                      <IconEdit size="1.4rem" stroke={1.2} />
                    </ActionIcon>
                  ) : (
                    <ActionIcon
                      title="end editing"
                      onClick={() => setIsEditing((prev) => !prev)}
                      className="cursor-default"
                      variant="default"
                    >
                      <IconEditOff size="1.4rem" stroke={1.2} />
                    </ActionIcon>
                  )}
                </>
              )}

            {/* Response Button */}
            <ActionIcon
              className=" cursor-default"
              variant="default"
              onClick={() => {
                setNewOpen(true);

                const lines = comment.content.split("\n");
                const formattedContent = lines
                  .map((line) => `> ${line}`)
                  .join("\n");

                // Update the value of isResponseTo separately
                newCommentForm.setFieldValue(
                  "isResponseTo",
                  isResponse ? isResponse : comment.id
                );

                // Construct the sender link
                const senderLink = `${activeLocale === "en" ? "" : `/${activeLocale as string}`}/grow/${reportId}/update/${comment.postId as string}#${comment.id}`;

                // Update the content field
                // OLD SENDER LINK
                const updatedContent = `${newCommentForm.values.content}> from: [${
                  comment.author.name as string
                } <comment#${comment.id}](${activeLocale === "en" ? "" : `/${activeLocale as string}`}/grow/${reportId}/update/${
                  comment.postId as string
                }#${comment.id})>\n${formattedContent}\n<p></p>`;

                // Update the content field value directly
                newCommentForm.setFieldValue("content", updatedContent);

                newCommentEditor?.commands.setContent(`

                ${activeLocale === "en" ? "fron:" : "von"}: <a href=${senderLink}>${comment.author.name as string} #${comment.id}</a>
                  <blockquote>${comment.content}</blockquote>
                  <p></p>`);
              }}
            >
              <IconMessageForward
                color="orange"
                size="1.4rem"
                stroke={1.2}
              />
            </ActionIcon>

            {/* Like Button */}
            <Box mt={-2}>
              <LikeHeart itemToLike={comment} itemType={"Comment"} />
            </Box>
          </Flex>
        </Group>
        {!isEditing ? (
          <TypographyStylesProvider>
            <Paper className={classes.contentHtml}>
              {commentHtml ? (
                <Box
                  fz="lg"
                  className={classes.content}
                  dangerouslySetInnerHTML={{ __html: commentHtml }}
                />
              ) : null}
            </Paper>
          </TypographyStylesProvider>
        ) : (
          // EDITING
          <form
            onSubmit={editCommentForm.onSubmit((values) => {
              tRPCsaveComment(values);
            }, handleErrors)}
          >
            <TextInput
              type="text"
              hidden
              {...editCommentForm.getInputProps("isResponseTo")}
              value={comment.isResponseToId || undefined}
            />
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
              {/* Replace Textarea with RichTextEditor */}
              <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                  </RichTextEditor.ControlsGroup>

                  <EmojiPicker editor={editor as Editor} />

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.Subscript />
                    <RichTextEditor.Superscript />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    {/* 
                <RichTextEditor.AlignJustify/>
                <RichTextEditor.AlignRight/> */}
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content
                  sx={(theme) => ({
                    boxShadow: `0 0 0px 1px ${theme.colors.growgreen[4]}`,
                  })}
                />
              </RichTextEditor>
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
        )}
      </Paper>

      {/* Display responses */}
      <Box className={classes.responses}>
        {comment.responses.map((response) => (
          <Box id={response.id} key={response.id}>
            <UserComment
              editor={newCommentEditor}
              reportId={reportId}
              isResponse={comment.id}
              comment={response as Comment}
              setNewOpen={setNewOpen}
              newCommentForm={newCommentForm}
            />
          </Box>
        ))}
      </Box>
    </>
  );
}
