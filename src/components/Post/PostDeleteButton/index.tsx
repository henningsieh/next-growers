import {
  Alert,
  Box,
  Button,
  Container,
  Flex,
  Modal,
  rem,
  Space,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconPhotoCancel,
  IconSquareLetterX,
} from "@tabler/icons-react";
import {
  deletePostSuccessfulMsg,
  httpStatusErrorMsg,
} from "~/messages";

import { useRouter } from "next/router";

import { api } from "~/utils/api";

interface PostDeleteButtonProps {
  postId: string;
  alertTitle: string;
  alertText: string;
  labelDeletePostButton: string;
  labelCloseButton: string;
}

const PostDeleteButton = ({
  postId,
  alertTitle,
  alertText,
  labelDeletePostButton,
  labelCloseButton,
}: PostDeleteButtonProps) => {
  const router = useRouter();
  const trpc = api.useUtils();
  const theme = useMantineTheme();

  const [opened, { open, close }] = useDisclosure(false);

  const { mutate: tRPCdeletePost } = api.posts.deletePost.useMutation({
    onMutate: () => {
      // setIsSaving(true);
    },
    // If the mutation fails, use the context
    // returned from onMutate to roll back
    onError: (error) => {
      notifications.show(
        httpStatusErrorMsg(error.message, error.data?.httpStatus)
      );
    },
    onSuccess: async (result) => {
      notifications.show(deletePostSuccessfulMsg);
      await trpc.reports.getIsoReportWithPostsFromDb.invalidate(
        result.deletedPost.id
      );
      void router.push(
        {
          pathname: `/grow/${result.deletedPost.reportId}`,
        },
        undefined,
        { scroll: true }
      );
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await trpc.reports.getIsoReportWithPostsFromDb.refetch();
      close;
    },
  });

  return (
    <>
      <Modal
        title={labelDeletePostButton}
        size="md"
        opened={opened}
        onClose={close}
        withCloseButton={true}
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <Container size="xs">
          <Alert
            fz="xl"
            color="red.8"
            variant="light"
            title={alertTitle}
            icon={<IconAlertTriangle size={30} />}
          >
            <Text fz="xl">{alertText}</Text>
          </Alert>

          <Space h={rem(20)} />

          <Flex
            gap="md"
            justify="space-between"
            align="center"
            direction="row"
            wrap="wrap"
            sx={() => ({
              display: "inline-flex", // or "inline-flex"
            })}
          >
            <Box
              miw={180}
              sx={() => ({
                width: "45%",
                [theme.fn.smallerThan("sm")]: {
                  width: "100%",
                },
              })}
            >
              <Button
                fullWidth
                h={32}
                compact
                c="red.7"
                variant="default"
                leftIcon={<IconPhotoCancel size={18} stroke={1.8} />}
                onClick={() => tRPCdeletePost({ id: postId })}
                sx={(theme) => ({
                  boxShadow: `0 0 2px 1px ${theme.colors.red[8]}`,
                })}
              >
                {labelDeletePostButton}
              </Button>
            </Box>
            <Box
              miw={180}
              sx={() => ({
                width: "45%",
                [theme.fn.smallerThan("sm")]: {
                  width: "100%",
                },
              })}
            >
              <Button
                fullWidth
                h={32}
                compact
                // c="red.9"
                variant="default"
                leftIcon={<IconSquareLetterX size={18} stroke={1.8} />}
                onClick={close}
              >
                {labelCloseButton}
              </Button>
            </Box>
          </Flex>
          <Space h={rem(40)} />
        </Container>
      </Modal>

      {/* Delete Update Button */}
      <Button
        m={0}
        h={34}
        miw={182}
        compact
        c="red.8"
        variant="default"
        leftIcon={<IconAlertTriangle size={22} stroke={1.8} />}
        onClick={open}
      >
        {labelDeletePostButton}
      </Button>
    </>
  );
};

export default PostDeleteButton;
