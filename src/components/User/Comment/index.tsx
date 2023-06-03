import UserAvatar from "../../Atom/UserAvatar";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Group,
  List,
  LoadingOverlay,
  Paper,
  Text,
  Textarea,
  TypographyStylesProvider,
  createStyles,
  rem,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash, IconTrashX } from "@tabler/icons-react";
import { IconEditOff } from "@tabler/icons-react";
import { remark } from "remark";
import remarkBreaks from "remark-breaks";
import remarkHtml from "remark-html";
import { z } from "zod";
import { sanatizeDateString } from "~/helpers";
import { InputSaveComment } from "~/helpers/inputValidation";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import LikeHeart from "~/components/Atom/LikeHeart";
import {
  commentDeletedSuccessfulMsg,
  likeSuccessfulMsg,
} from "~/components/Notifications/messages";

import { type Comment, Locale } from "~/types";

import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  comment: {
    marginBottom: theme.spacing.xs,
  },

  body: {
    paddingLeft: rem(58),
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));

interface CommentHtmlProps {
  comment: Comment;
  setNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newForm: UseFormReturnType<
    {
      id: undefined;
      postId: string;
      content: string;
    },
    (values: { id: undefined; postId: string; content: string }) => {
      id: undefined;
      postId: string;
      content: string;
    }
  >;
}

// Use remark to convert markdown into HTML string
function renderMarkDownToHtml(markdown: string): Promise<string> {
  return new Promise((resolve, reject) => {
    remark()
      .use(remarkHtml)
      .use(remarkBreaks)
      .process(markdown, (err, file) => {
        if (err) {
          reject(err);
        } else {
          resolve(String(file));
        }
      });
  });
}

export function UserComment({
  comment,
  setNewOpen,
  newForm,
}: CommentHtmlProps) {
  const { classes } = useStyles();
  const { data: session, status } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [transformedHtml, setTransformedHtml] = useState<string | null>(
    null
  );

  const router = useRouter();
  const trpc = api.useContext();

  const { mutate: tRPCdeleteComment } =
    api.comments.deleteCommentById.useMutation({
      onMutate: (newCommentDB) => {
        console.log("START api.comments.deleteCommentById.useMutation");
        setIsSaving(true);
        console.log("newReportDB", newCommentDB);
      },
      // If the mutation fails,
      // use the context returned from onMutate to roll back
      onError: (err, newReport, context) => {
        toast.error("An error occured when deleting the comment");
        console.log("err", err);
        if (!context) return;
        console.log(context);
      },
      onSuccess: async (deletedComment) => {
        notifications.show(commentDeletedSuccessfulMsg);

        await trpc.comments.getCommentsByPostId.fetch({
          postId: deletedComment.postId as string,
        });
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
      onMutate: (newCommentDB) => {
        console.log("START api.reports.create.useMutation");
        setIsSaving(true);
        console.log("newReportDB", newCommentDB);
      },
      // If the mutation fails,
      // use the context returned from onMutate to roll back
      onError: (err, newReport, context) => {
        toast.error("An error occured when saving your report");
        if (!context) return;
        console.log(context);
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

  const editForm = useForm({
    validate: zodResolver(InputSaveComment),
    validateInputOnChange: true,
    initialValues: {
      id: comment.id,
      postId: comment.postId as string,
      content: comment.content,
    },
  });

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const html = await renderMarkDownToHtml(comment.content);
        setTransformedHtml(html);
      } catch (error) {
        console.error(error);
        // Handle the error if necessary
      }
    };
    void fetchHtml();
  }, [comment.content]);

  const handleErrors = (errors: typeof editForm.errors) => {
    if (errors.id) {
      toast.error(errors.id as string);
    }
    if (errors.postId) {
      toast.error(errors.postId as string);
    }
    if (errors.content) {
      toast.error(errors.content as string);
    }
  };

  const [selectedCommentText, setSelectedCommentText] = useState("");

  useEffect(() => {
    const handleSelectionChange = () => {
      const selectedText = window.getSelection()?.toString() || "";
      setSelectedCommentText(selectedText);
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener(
        "selectionchange",
        handleSelectionChange
      );
    };
  }, []);

  const handleQuote = () => {
    const quotedText = selectedCommentText
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n");

    newForm.setValues({
      ...newForm.values,
      content: `${newForm.values.content}\n\n${quotedText}\n\n`,
    });

    setNewOpen(true);
  };

  return (
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
            imageUrl={comment.author.image as string}
            userName={comment.author.name as string}
            avatarRadius={42}
            tailwindMarginTop={false}
          />
          <Box>
            <Text fz="sm">{comment.author.name}</Text>
            <Text fz="xs" c="dimmed">
              {sanatizeDateString(
                comment.createdAt.toISOString(),
                router.locale === Locale.DE ? Locale.DE : Locale.EN,
                true
              )}
            </Text>
          </Box>
        </Group>
        <Group position="right">
          {status === "authenticated" &&
            session.user.id === comment.author.id && (
              <>
                {!isEditing ? (
                  <ActionIcon
                    title="edit comment"
                    onClick={() => setIsEditing((prev) => !prev)}
                    m={0}
                    p={0}
                    className="cursor-default"
                  >
                    <Paper p={2} withBorder>
                      <IconEdit size="1.2rem" stroke={1.4} />
                    </Paper>
                  </ActionIcon>
                ) : (
                  <ActionIcon
                    title="end editing"
                    // onClick={() => setIsEditing((prev) => !prev)}
                    onClick={() => setIsEditing((prev) => !prev)}
                    m={0}
                    p={0}
                    className="cursor-default"
                  >
                    <Paper p={2} withBorder>
                      <IconEditOff size="1.2rem" stroke={1.4} />
                    </Paper>
                  </ActionIcon>
                )}
                <ActionIcon
                  onClick={() => tRPCdeleteComment(comment.id)}
                  m={0}
                  p={0}
                  className=" cursor-default"
                >
                  <Paper p={2} withBorder>
                    <IconTrashX size="1.2rem" stroke={1.4} />
                  </Paper>
                </ActionIcon>
              </>
            )}

          <LikeHeart itemToLike={comment} itemType={"Comment"} />
        </Group>
      </Group>
      {!isEditing ? (
        <TypographyStylesProvider className={classes.body}>
          {selectedCommentText && (
            <button onClick={handleQuote}>Quote</button>
          )}
          {transformedHtml ? (
            <Box
              className={classes.content}
              dangerouslySetInnerHTML={{ __html: transformedHtml }}
            />
          ) : null}
        </TypographyStylesProvider>
      ) : (
        <form
          onSubmit={editForm.onSubmit((values) => {
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
              placeholder={comment.content}
              {...editForm.getInputProps("content")}
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
              save
            </Button>
          </Flex>
        </form>
      )}
    </Paper>
  );
}
