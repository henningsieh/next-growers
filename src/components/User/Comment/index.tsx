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
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useForm, zodResolver } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconEdit,
  IconMessageForward,
  IconTrashX,
} from "@tabler/icons-react";
import { IconEditOff } from "@tabler/icons-react";
import { remark } from "remark";
import remarkBreaks from "remark-breaks";
import remarkHtml from "remark-html";
import { commentDeletedSuccessfulMsg } from "~/messages";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

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

  body: {
    paddingLeft: useMediaQuery(`(min-width: ${theme.breakpoints.sm})`)
      ? rem(58)
      : rem(4),
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
  reportId: string;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .process(markdown, (err: any, file: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(String(file));
        }
      });
  });
}

export function UserComment({
  reportId,
  comment,
  setNewOpen,
  newForm,
}: CommentHtmlProps) {
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
  const [transformedHtml, setTransformedHtml] = useState<string | null>(
    null
  );

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
      // If the mutation fails,
      // use the context returned from onMutate to roll back
      onError: (err, newReport, context) => {
        toast.error("An error occured when deleting the comment");
        console.log("err", err);
        if (!context) return;
        console.debug(context);
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
        console.debug("START api.comments.saveComment.useMutation");
        setIsSaving(true);
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

  const editCommentForm = useForm({
    validate: zodResolver(InputEditCommentForm),
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

  const handleErrors = (errors: typeof editCommentForm.errors) => {
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

  const [, setSelectedCommentText] = useState("");

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

              newForm.setValues({
                ...newForm.values,
                content: `${newForm.values.content}> from: [${
                  comment.author.name as string
                } <comment#${comment.id}](/grow/${reportId}/update/${
                  comment.postId as string
                }#${comment.id})>\n${formattedContent}\n\n`,
              });
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
        <Paper className={classes.body}>
          {transformedHtml ? (
            <Box
              className={classes.content}
              dangerouslySetInnerHTML={{ __html: transformedHtml }}
            />
          ) : null}
        </Paper>
      ) : (
        <form
          onSubmit={editCommentForm.onSubmit((values) => {
            tRPCsaveComment(values);
          }, handleErrors)}
        >
          <Box className="relative">
            <LoadingOverlay
              ml={42}
              mt={12}
              radius="sm"
              visible={isSaving}
              transitionDuration={150}
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
              {...editCommentForm.getInputProps("content")}
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
      )}
    </Paper>
  );
}
