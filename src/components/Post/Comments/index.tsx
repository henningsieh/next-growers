import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  Text,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconEditOff, IconTrashX } from "@tabler/icons-react";
import { sanatizeDateString } from "~/helpers";
import { InputSaveComment } from "~/helpers/inputValidation";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import UserAvatar from "~/components/Atom/UserAvatar";
import { UserComment } from "~/components/User/Comment";

import { Locale } from "~/types";

import { api } from "~/utils/api";

interface PostCommentsProps {
  postId: string;
}

const PostComments = ({ postId }: PostCommentsProps) => {
  const router = useRouter();

  const { data: session, status } = useSession();

  const [isSaving, setIsSaving] = useState(false);
  const [newOpen, setNewOpen] = useState(true);
  const trpc = api.useContext();

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
        // Navigate to the new report page
        // void router.push(`/account/reports/${newReportDB.id}`);
      },
      // Always refetch after error or success:
      onSettled: () => {
        setIsSaving(false);
        console.log("END api.reports.create.useMutation");
      },
    });

  const commentsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const commentId = window.location.hash.substring(1); // Get the comment ID from the URL hash

    if (commentId && commentsRef.current.length > 0) {
      const commentElement = commentsRef.current.find(
        (element) => element.id === commentId
      );

      if (commentElement) {
        commentElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const comments = postComments?.map((postComment) => {
    return (
      <div
        key={postComment.id}
        id={postComment.id}
        ref={(ref) => commentsRef.current.push(ref as HTMLDivElement)}
      >
        <UserComment comment={postComment} />
      </div>
    );
  });

  const newForm = useForm({
    validate: zodResolver(InputSaveComment),
    validateInputOnChange: true,
    initialValues: {
      id: undefined,
      postId: postId,
      content: "",
    },
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

  return (
    <Box>
      <Group pb="xs" position="apart">
        <Text pb="xs">Comments</Text>
        {status === "authenticated" && (
          <Button
            size="xs"
            variant="outline"
            onClick={() => setNewOpen(true)}
          >
            new comment
          </Button>
        )}
      </Group>
      {status === "authenticated" && newOpen && (
        <Paper p="sm" mb="xs" withBorder>
          <Group position="apart">
            <Group position="left">
              <UserAvatar
                imageUrl={session?.user.image as string}
                userName={session?.user.name as string}
                avatarRadius={42}
                tailwindMarginTop={0}
              />
              <Box>
                <Text fz="sm">{session?.user.name as string}</Text>
                <Text fz="xs" c="dimmed">
                  {sanatizeDateString(
                    now.toISOString(),
                    router.locale === Locale.DE ? Locale.DE : Locale.EN,
                    true
                  )}
                </Text>
              </Box>
            </Group>
            <Group position="right">
              <>
                <ActionIcon
                  title="end editing"
                  // onClick={() => setIsEditing((prev) => !prev)}
                  onClick={() => setIsSaving((prev) => !prev)}
                  m={0}
                  p={0}
                  className="cursor-default"
                >
                  <Paper p={2} withBorder>
                    <IconEditOff size="1.2rem" stroke={1.4} />
                  </Paper>
                </ActionIcon>

                <ActionIcon
                  title="close"
                  onClick={() => setNewOpen(false)}
                  m={0}
                  p={0}
                  className=" cursor-default"
                >
                  <Paper p={2} withBorder>
                    <IconTrashX size="1.2rem" stroke={1.4} />
                  </Paper>
                </ActionIcon>
              </>

              {/* <LikeHeart itemToLike={comment} itemType={"Comment"} /> */}
            </Group>
          </Group>

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
                ml={42}
                pt={12}
                withAsterisk
                placeholder=""
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
                save
              </Button>
            </Flex>
          </form>
        </Paper>
      )}

      {comments}
    </Box>
  );
};

export default PostComments;
