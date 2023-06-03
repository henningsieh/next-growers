import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Code,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  Text,
  Textarea,
  Transition,
  TypographyStylesProvider,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconEditOff,
  IconInfoCircle,
  IconMinus,
  IconNewSection,
  IconTextPlus,
  IconTrashX,
  IconX,
} from "@tabler/icons-react";
import { IconNews } from "@tabler/icons-react";
import { IconTextIncrease } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { sanatizeDateString } from "~/helpers";
import { InputSaveComment } from "~/helpers/inputValidation";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

import UserAvatar from "~/components/Atom/UserAvatar";
import { commentSuccessfulMsg } from "~/components/Notifications/messages";
import { UserComment } from "~/components/User/Comment";

import { Locale } from "~/types";

import { api } from "~/utils/api";

interface PostCommentsProps {
  reportId: string;
  postId: string;
}

const PostComments = ({ reportId, postId }: PostCommentsProps) => {
  const router = useRouter();
  const trpc = api.useContext();

  const [isSaving, setIsSaving] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  const { data: session, status } = useSession();

  const now = new Date();

  // FETCH OWN REPORTS (may run in kind of hydration error, if executed after session check... so let's run it into an invisible unauthorized error in background. this only happens, if session is closed in another tab...)
  const {
    data: postComments,
    isLoading,
    isError,
  } = api.comments.getCommentsByPostId.useQuery({
    postId: postId, // Set the desired order (true for descending, false for ascending)
  });

  const { mutate: tRPCsaveComment } =
    api.comments.saveComment.useMutation({
      onMutate: (newCommentDB) => {
        console.log("START api.reports.create.useMutation");
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
        notifications.show(commentSuccessfulMsg);
        newForm.reset();
        await trpc.comments.getCommentsByPostId.fetch({
          postId: newReportDB.postId as string,
        });
        // Navigate to the new report page
        // void router.push(`/account/reports/${newReportDB.id}`);
      },
      // Always refetch after error or success:
      onSettled: () => {
        setNewOpen(false);
        setIsSaving(false);
        console.log("END api.reports.create.useMutation");
      },
    });

  const commentsRef = useRef<HTMLElement[]>([]);

  const newForm = useForm({
    validate: zodResolver(InputSaveComment),
    validateInputOnChange: false,
    initialValues: {
      id: undefined,
      postId: postId,
      content: "",
    },
  });

  const comments = postComments?.map((postComment) => {
    return (
      <div
        key={postComment.id}
        id={postComment.id}
        ref={(ref) => commentsRef.current.push(ref as HTMLDivElement)}
      >
        <UserComment
          reportId={reportId}
          comment={postComment}
          setNewOpen={setNewOpen}
          newForm={newForm}
        />
      </div>
    );
  });

  const handleErrors = (errors: typeof newForm.errors) => {
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

  useEffect(() => {
    newForm.setFieldValue("postId", postId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  return (
    <Box>
      {status === "loading" && <p>loading comments...</p>}
      {status === "authenticated" && (
        <>
          <Group pb="xs" position="apart">
            <Text pb="xs">Comments</Text>
            <ActionIcon
              color="orange"
              variant="outline"
              title={!newOpen ? "add new comment" : "close form"}
              // onClick={() => setIsEditing((prev) => !prev)}
              onClick={() => {
                setNewOpen((prev) => !prev);
                // newForm.reset();
              }}
              className="cursor-default"
            >
              {!newOpen ? (
                <IconPlus size="1.3rem" stroke={1.6} />
              ) : (
                <IconMinus size="1.3rem" stroke={1.6} />
              )}
            </ActionIcon>
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
                      imageUrl={session?.user.image as string}
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
                          newForm.reset();
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
                  onSubmit={newForm.onSubmit((values) => {
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
                      {...newForm.getInputProps("content")}
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
                      save new comment
                    </Button>
                  </Flex>
                </form>
              </Paper>
            )}
          </Transition>
        </>
      )}

      {comments}
    </Box>
  );
};

export default PostComments;
