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
  IconBulb,
  IconCalendarEvent,
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
import { env } from "~/env.mjs";
import {
  fileUploadErrorMsg,
  httpStatusErrorMsg,
  onlyOnePostPerDayAllowed,
  savePostSuccessfulMsg,
} from "~/messages";

import { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import EmojiPicker from "~/components/Atom/EmojiPicker";
import ImageUploader from "~/components/ImageUploader";

import type { IsoReportWithPostsFromDb, Post } from "~/types";
import { GrowStage } from "~/types";

import { api } from "~/utils/api";
import {
  getFileMaxSizeInBytes,
  getFileMaxUpload,
} from "~/utils/fileUtils";
import { InputCreatePostForm } from "~/utils/inputValidation";

interface AddPostProps {
  isoReport: IsoReportWithPostsFromDb | null;
  post: Post | null;
}

const prefillHTMLContent =
  "<h1>Ich bin eine Überschrift</h1><hr/><p>RichTextEditor is designed to be as simple as possible to bring a familiar editing experience to regular users.</p>";

const PostForm = (props: AddPostProps) => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { isoReport: report, post } = props;
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [images, setImages] = useState(
    [...(post?.images || [])].sort((a, b) => {
      const orderA = a.postOrder ?? 0;
      const orderB = b.postOrder ?? 0;
      return orderA - orderB;
    })
  );

  console.debug("images", images);

  // const { colorScheme } = useMantineColorScheme();
  // const dark = colorScheme === "dark";

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
      //FIXME: decide server side, which error on conflict
      onError: (err, newReport, context) => {
        notifications.show(onlyOnePostPerDayAllowed);
        if (!context) return;
      },
      onSuccess: async (newPost) => {
        notifications.show(savePostSuccessfulMsg);
        setImageIds([]);
        // createPostForm.setFieldValue("images", imageIds);
        await trpc.reports.getIsoReportWithPostsFromDb.refetch();
        // Navigate to the new report page
        void router.push(
          `/${activeLocale as string}/grow/${newPost.reportId}/update/${newPost.id}`
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
  //currentDate.setDate(currentDate.getDate());

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
      images: images.map(({ id, postOrder }) => ({ id, postOrder })),
    },
  });

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
    console.debug(values.images);
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
      <Container
        pl={0}
        pr={0}
        pt="xl"
        className="flex w-full flex-col space-y-2"
      >
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
                        label={t("common:post-updatedate")}
                        description={t(
                          "common:addpost-updatedatedescription"
                        )}
                        valueFormat="MMMM DD, YYYY HH:mm"
                        className="w-full"
                        icon={
                          <IconCalendarEvent
                            stroke={1.6}
                            size="1.4rem"
                          />
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
                        label={t("common:post-addform-growday")}
                        description={t(
                          "common:post-addform-growdaydescription"
                        )}
                        w={232}
                        placeholder="1"
                        icon={<IconNumber stroke={1.6} size="1.8rem" />}
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
                        label="Grow stage"
                        description="Actual grow stage"
                        data={Object.keys(GrowStage).map((key) => ({
                          value: key,
                          label:
                            GrowStage[key as keyof typeof GrowStage],
                        }))}
                        withAsterisk
                        {...createPostForm.getInputProps("growStage")}
                        className="w-full"
                        icon={<IconPlant stroke={1.6} size="1.4rem" />}
                      />
                      <NumberInput
                        label={t("common:post-addform-lighthours")}
                        description={t(
                          "common:post-addform-lighthoursdescription"
                        )}
                        withAsterisk
                        w={232}
                        min={0}
                        max={24}
                        {...createPostForm.getInputProps(
                          "lightHoursPerDay"
                        )}
                        icon={<IconBulb stroke={1.6} size="1.6rem" />}
                      />
                    </Flex>
                  </Grid.Col>
                </Grid>
              </Box>

              <Space h="lg" />

              <TextInput
                label="Title for this update"
                description="Every must have a text title, which is also used as HTML page title."
                withAsterisk
                placeholder="Title of this Update"
                {...createPostForm.getInputProps("title")}
              />
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
                report={report}
                images={images || []}
                setImages={setImages}
                //cloudUrls={post?.images.map((image) => image.cloudUrl)}
                setImageIds={setImageIds}
                maxSize={getFileMaxSizeInBytes()}
                maxFiles={getFileMaxUpload()}
                onReject={(files) => {
                  files.forEach((file) => {
                    const fileSizeInMB = (
                      file.file.size /
                      1024 ** 2
                    ).toFixed(2);
                    notifications.show(
                      fileUploadErrorMsg(
                        file.file.name,
                        fileSizeInMB,
                        env.NEXT_PUBLIC_FILE_UPLOAD_MAX_SIZE
                      )
                    );
                  });
                }}
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
                  leftIcon={
                    <IconDeviceFloppy stroke={2.2} size="1.4rem" />
                  }
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
