import PostDeleteButton from "../PostDeleteButton";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  NumberInput,
  Paper,
  Select,
  Space,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { RichTextEditor } from "@mantine/tiptap";
import {
  IconBolt,
  IconCalendarEvent,
  IconClock,
  IconDeviceFloppy,
  IconNumber,
  IconPlant,
} from "@tabler/icons-react";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import type { Editor } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  defaultErrorMsg,
  httpStatusErrorMsg,
  onlyOnePostPerDayAllowed,
  savePostSuccessfulMsg,
} from "~/messages";

import { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import EmojiPicker from "~/components/Atom/EmojiPicker";
import ImageUploader from "~/components/ImageUploader";

import type {
  IsoReportWithPostsFromDb,
  MantineSelectData,
  Post,
} from "~/types";
import { GrowStage } from "~/types";

import { api } from "~/utils/api";
import { InputCreatePostForm } from "~/utils/inputValidation";

interface AddPostProps {
  isoReport: IsoReportWithPostsFromDb | null;
  post: Post | null;
}

const prefillHTMLContent = "<h1></h1><hr/><p>...</p>";

const PostForm = (props: AddPostProps) => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { isoReport: report, post } = props;

  const [isUploading, setIsUploading] = useState(false);

  const [imageIds, setImageIds] = useState<string[]>([]);
  const [images, setImages] = useState(
    [...(post?.images || [])].sort((a, b) => {
      const orderA = a.postOrder ?? 0;
      const orderB = b.postOrder ?? 0;
      return orderA - orderB;
    })
  );

  // Update "images" form field value, if "imageIds" state changes
  useEffect(() => {
    createPostForm.setFieldValue("images", images);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // Prepare WISIWIG Editior
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "justify"],
      }),
    ],
    // editorProps: {
    //   attributes: {
    //     class: dark
    //       ? "bg-input-dark-background"
    //       : "bg-input-light-background",
    //   },
    // },

    content: post ? post.content : prefillHTMLContent,
  });

  const trpc = api.useUtils();

  const { mutate: tRPCaddPostToReport } =
    api.posts.createPost.useMutation({
      onMutate: () => {
        console.debug("START posts.createPost.useMutation");
      },
      // If the mutation fails,
      // use the context returned from onMutate to roll back
      onError: (error, badNewPost) => {
        if (error.data) {
          if (error.data.code === "CONFLICT") {
            notifications.show(onlyOnePostPerDayAllowed);
          } else {
            notifications.show(
              httpStatusErrorMsg(error.message, error.data?.httpStatus)
            );
          }
        } else {
          notifications.show(defaultErrorMsg(error.message));
        }
        console.debug("error", error);
        console.debug("badNewPost", badNewPost);
      },
      onSuccess: async (newPost) => {
        notifications.show(savePostSuccessfulMsg);
        setImageIds([]);
        // createPostForm.setFieldValue("images", imageIds);
        await trpc.reports.getIsoReportWithPostsFromDb.refetch(); // When navigating to the new page
        void router.push(
          {
            pathname: `/${activeLocale as string}/grow/${newPost?.reportId}/update/${newPost?.id}`,
          },
          undefined,
          { scroll: true }
        );
      },
      // Always refetch after error or success:
      onSettled: () => {
        setImageIds([]);
        // createPostForm.setFieldValue("images", imageIds);
        console.log("END posts.createPost.useMutation");
      },
    });

  if (report == null) return null;
  const currentDate = new Date();
  const reportCreatedAt = new Date(report.createdAt);

  reportCreatedAt.setHours(0, 0, 0, 0); // Set time to midnight for calculation
  currentDate.setHours(0, 0, 0, 0); // Set time to midnight for calculation

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set today's time to 00:00:00

  const growDay = post
    ? post.growDay
    : Math.floor(
        (currentDate.getTime() - reportCreatedAt.getTime()) /
          (1000 * 60 * 60 * 24)
      );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const createPostForm = useForm({
    validate: zodResolver(InputCreatePostForm(reportCreatedAt)),
    validateInputOnChange: true,
    initialValues: {
      id: post ? post.id : "",
      date: post ? new Date(post.date) : today,
      day: growDay,
      title: post ? post.title : "",
      content: post ? post.content : prefillHTMLContent,
      growStage: post ? post.growStage : undefined,
      lightHoursPerDay: post ? (post.lightHoursPerDay as number) : 0,
      watt: post && post.LightWatts ? post.LightWatts.watt : undefined,
      images: images.map(({ id, postOrder }) => ({ id, postOrder })),
    },
  });

  const growStageSelectData: MantineSelectData = Object.keys(
    GrowStage
  ).map((key) => ({
    value: key,
    label: GrowStage[key as keyof typeof GrowStage],
  }));

  function handleSubmit(values: {
    date: Date;
    day: number;
    title: string;
    content: string;
    growStage: keyof typeof GrowStage | undefined;
    lightHoursPerDay: number;
    images: {
      id: string;
      postOrder: number;
    }[];
  }) {
    // Omitting the 'day' field, will not be saved
    type PostFormValuesWithoutDay = Omit<typeof values, "day">;
    const postFormValues: PostFormValuesWithoutDay = values;
    const editorHtml = editor?.getHTML() as string;
    postFormValues.content = editorHtml;

    const savePost = {
      ...postFormValues,
      images: images,
      growStage: postFormValues.growStage as keyof typeof GrowStage,
      reportId: report?.id || (post?.reportId as string),
      authorId: report?.authorId || (post?.authorId as string),
    };

    tRPCaddPostToReport(savePost);
  }

  const handleErrors = (errors: typeof createPostForm.errors) => {
    Object.keys(errors).forEach((key) => {
      notifications.show(
        httpStatusErrorMsg(errors[key] as string, 422)
      );
    });
  };

  return (
    <>
      <Container py="xl" px={0} className="flex flex-col space-y-2">
        <Paper m={0} p="sm" withBorder>
          <form
            onSubmit={createPostForm.onSubmit((values) => {
              handleSubmit(values);
            }, handleErrors)}
          >
            <Box>
              <TextInput
                {...createPostForm.getInputProps("id")}
                hidden
              />
              {imageIds.map((imageId, index) => (
                <input
                  key={index}
                  type="hidden"
                  name={`images[${index}]`}
                  value={imageId}
                />
              ))}
              <Box>
                <Grid gutter="sm">
                  <Grid.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Flex
                      justify="flex-start"
                      className="space-x-2"
                      align="baseline"
                    >
                      <DateInput
                        className="w-full"
                        label={t("common:post-updatedate")}
                        description={t(
                          "common:addpost-updatedatedescription"
                        )}
                        valueFormat="MMMM DD, YYYY HH:mm"
                        icon={
                          <IconCalendarEvent stroke={1.8} size={20} />
                        }
                        withAsterisk
                        {...createPostForm.getInputProps("date")}
                        onChange={(selectedDate: Date) => {
                          const newDate = new Date(selectedDate);
                          createPostForm.setFieldValue("date", newDate);
                          const timeDifferenceDays = Math.floor(
                            (selectedDate.getTime() -
                              reportCreatedAt.getTime()) /
                              (1000 * 60 * 60 * 24)
                          );
                          createPostForm.setFieldValue(
                            "day",
                            timeDifferenceDays
                          );
                        }}
                      />
                      <NumberInput
                        w={232}
                        label={t("common:post-addform-growday")}
                        description={t(
                          "common:post-addform-growdaydescription"
                        )}
                        placeholder="1"
                        icon={<IconNumber stroke={1.8} size={20} />}
                        withAsterisk
                        min={0}
                        {...createPostForm.getInputProps("day")}
                        onChange={(value: number) => {
                          const growDayOffSet = parseInt(
                            value.toString()
                          );
                          if (!growDayOffSet && growDayOffSet != 0)
                            return; // prevent error if changed to empty string

                          const newPostDate = new Date(reportCreatedAt);
                          newPostDate.setUTCDate(
                            newPostDate.getUTCDate() + growDayOffSet
                          );
                          newPostDate.setHours(0); //  setUTCHours(22, 0, 0, 0);
                          createPostForm.setFieldValue(
                            "date",
                            newPostDate
                          );
                          createPostForm.setFieldValue(
                            "day",
                            growDayOffSet
                          );
                        }}
                      />
                    </Flex>
                  </Grid.Col>
                  <Grid.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Flex
                      justify="flex-start"
                      className="space-x-2"
                      align="baseline"
                    >
                      <Select
                        className="w-full"
                        label="Grow stage"
                        description="Actual grow stage"
                        data={growStageSelectData}
                        withAsterisk
                        {...createPostForm.getInputProps("growStage")}
                        icon={<IconPlant stroke={1.8} size={20} />}
                      />
                    </Flex>
                  </Grid.Col>
                  <Grid.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Flex
                      justify="flex-start"
                      className="space-x-2"
                      align="baseline"
                    >
                      <NumberInput
                        className="w-full"
                        label={t("common:post-addform-lighthours")}
                        description={t(
                          "common:post-addform-lighthoursdescription"
                        )}
                        withAsterisk
                        min={0}
                        max={24}
                        {...createPostForm.getInputProps(
                          "lightHoursPerDay"
                        )}
                        icon={<IconClock stroke={1.8} size={20} />}
                      />
                      <NumberInput
                        w={232}
                        label="Watt"
                        description="LED"
                        // withAsterisk
                        min={0}
                        max={2000}
                        {...createPostForm.getInputProps("watt")}
                        onChange={(value) => {
                          // If value is an empty string, set it to undefined
                          if (value === "") {
                            createPostForm.setFieldValue(
                              "watt",
                              undefined
                            );
                          } else {
                            // Otherwise, let useForm handle the value
                            createPostForm.setFieldValue("watt", value);
                          }
                        }}
                        icon={<IconBolt stroke={1.8} size={20} />}
                      />
                    </Flex>
                  </Grid.Col>
                  <Grid.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Flex
                      justify="flex-start"
                      className="space-x-2"
                      align="baseline"
                    >
                      <TextInput
                        className="w-full"
                        label="Title for this update"
                        description="Every must have a text title, which is also used as HTML page title."
                        withAsterisk
                        placeholder="Title of this Update"
                        {...createPostForm.getInputProps("title")}
                      />
                    </Flex>
                  </Grid.Col>
                </Grid>
              </Box>
              <TextInput
                hidden
                {...createPostForm.getInputProps("content")}
              />

              <Space h="lg" />

              <Box
                fz={"lg"}
                fw={"normal"}
                color="#00ff00"
                sx={(theme) => ({
                  // backgroundColor:
                  //   theme.colorScheme === "dark"
                  //     ? "rgba(0, 0, 0, 0)"
                  //     : "rgba(255, 255, 255, .66)",
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.growgreen[4]
                      : theme.colors.growgreen[6],
                })}
              >
                Description<sup className="ml-1 text-red-600">*</sup>
              </Box>

              <Box
                className="mantine-Input-wrapper"
                fz={"sm"}
                fw={"normal"}
                ff={"monospace"}
                sx={(theme) => ({
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? "rgba(0, 0, 0, .3)"
                      : "rgba(255, 255, 255, .66)",
                  color:
                    theme.colorScheme === "dark"
                      ? theme.white
                      : theme.colors.gray[9],
                })}
              >
                Your main text description for this Update comes here!
              </Box>
              <RichTextEditor
                editor={editor}
                sx={(theme) => ({
                  boxShadow: `0 0 0px 1px ${theme.colors.growgreen[4]}`,
                })}
              >
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
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[6]
                        : theme.white,
                    color:
                      theme.colorScheme === "dark"
                        ? theme.white
                        : theme.black,
                    fontSize: theme.fontSizes.sm,
                    fontWeight: 500,
                  })}
                />
              </RichTextEditor>

              <ImageUploader
                images={images || []}
                setImages={setImages}
                setImageIds={setImageIds}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
              />

              <Group position="apart" mt="xl">
                <PostDeleteButton
                  postId={post?.id as string}
                  alertTitle={t("common:post-delete-warning")}
                  alertText={t("common:user-msg-question-continue")}
                  labelDeletePostButton={t("common:post-delete-button")}
                  labelCloseButton={t(
                    "common:app-notifications-close-button"
                  )}
                />
                <Button
                  miw={180}
                  fz="lg"
                  variant="filled"
                  color="growgreen"
                  type="submit"
                  leftIcon={<IconDeviceFloppy stroke={2.2} size={20} />}
                >
                  {t("common:post-addformn-save-button")}
                </Button>
              </Group>
            </Box>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default PostForm;
