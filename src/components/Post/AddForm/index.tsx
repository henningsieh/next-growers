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
  TextInput,
  Title,
} from "@mantine/core";
import { Editor, useEditor } from "@tiptap/react";
import {
  IconBulb,
  IconCalendarEvent,
  IconNumber,
  IconPlant,
  IconSeeding,
} from "@tabler/icons-react";
import type {
  IsoReportWithPostsFromDb,
  Post,
  PostDbInput,
  Report,
} from "~/types";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useForm, zodResolver } from "@mantine/form";

import { DateInput } from "@mantine/dates";
import { GrowStage } from "~/types";
import Highlight from "@tiptap/extension-highlight";
import ImageUploader from "~/components/ImageUploader";
import { InputCreatePost } from "~/helpers/inputValidation";
import Link from "@tiptap/extension-link";
import { RichTextEditor } from "@mantine/tiptap";
import StarterKit from "@tiptap/starter-kit";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { api } from "~/utils/api";
import { formatLabel } from "~/helpers";
import { toast } from "react-hot-toast";
import { z } from "zod";

interface AddPostProps {
  report: IsoReportWithPostsFromDb;
}
const content =
  '<h1 style="text-align: center">Update your Grow with a nice rich text</h1><p><code>RichTextEditor</code> <mark>component focuses on usability </mark>and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a target="_blank" rel="noopener noreferrer nofollow" href="https://tiptap.dev/">Tiptap.dev</a> and supports  <a target="_blank" rel="noopener noreferrer nofollow" href="https://tiptap.dev/extensions"> extensions.</a></p></li></ul>';

const AddPost = (props: AddPostProps) => {
  const { report } = props;
  const [imageIds, setImageIds] = useState<string[]>([]);

  // Update "images" form field value, if "imageIds" state changes
  useEffect(() => {
    form.setFieldValue("images", imageIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageIds]);

  // Prepare WISIWIG Editior
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
  });

  if (report == null) return null;

  const { mutate: tRPCaddPostToReport } = api.posts.createPost.useMutation({
    onMutate: (addPostToReport) => {
      console.log("START posts.createPost.useMutation");
      console.log("addPostToReport", addPostToReport);
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newReport, context) => {
      toast.error("An error occured when saving your report");
      if (!context) return;
      console.log(context);
    },
    onSuccess: (newReportDB) => {
      toast.success("The update was saved to your report");
      // Navigate to the new report page
      // void router.push(`/account/reports/${newReportDB.id}`);
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log("END posts.createPost.useMutation");
    },
  });

  const reportStartDate = new Date(report.createdAt);
  reportStartDate.setHours(0, 0, 0, 0); // Set time to midnight for calculation
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set time to midnight for calculation
  currentDate.setDate(currentDate.getDate());
  // Calculate the difference in milliseconds
  const timeDifferenceMs = currentDate.getTime() - reportStartDate.getTime();
  // Convert milliseconds to days
  const timeDifferenceDays = Math.floor(
    timeDifferenceMs / (1000 * 60 * 60 * 24)
  );
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set today's time to 00:00:00

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm({
    validate: zodResolver(InputCreatePost(reportStartDate)),
    initialValues: {
      date: today,
      day: timeDifferenceDays,
      title: "",
      content: "",
      growStage: GrowStage.VEGETATIVE_STAGE,
      lightHoursPerDay: 12,
      images: imageIds,
    },
  });

  function handleSubmit(values: {
    date: Date;
    day: number;
    title: string;
    content: string;
    growStage: GrowStage | undefined;
    lightHoursPerDay: number;
    images: string[];
  }) {
    console.debug(values);
    const { day, ...restValues } = values; // Omitting the 'day' field
    const editorHtml = editor?.getHTML() as string;
    restValues.content = editorHtml;

    const savePost: PostDbInput = {
      ...restValues,
      images: imageIds,
      growStage: restValues.growStage as GrowStage,
      reportId: report.id as string,
      authorId: report.authorId as string,
    };

    console.debug(savePost);
    tRPCaddPostToReport(savePost);
  }
  const handleErrors = (errors: typeof form.errors) => {
    console.debug(errors);
    if (errors.id) {
      toast.error(errors.id as string);
    }
    if (errors.title) {
      toast.error(errors.title as string);
    }
    if (errors.images) {
      toast.error(errors.images as string);
    }
  };

  return (
    <Container p={0} mt="lg" size="md">
      {/* <Paper withBorder> */}
      <Title order={2}>Update your Grow </Title>

      <Box mt="sm">
        <form
          className="space-y-4"
          onSubmit={form.onSubmit((values) => {
            console.log("Form submitted");
            console.debug(values);
            handleSubmit(values);
          }, handleErrors)}
        >
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
              <Grid.Col xs={12} sm={6} md={6} lg={6} xl={6}>
                <Flex className="justify-start space-x-2" align="baseline">
                  <NumberInput
                    label="Grow day"
                    description="Start is day 0"
                    w={142}
                    placeholder="1"
                    icon={<IconNumber size="1.2rem" />}
                    withAsterisk
                    min={0}
                    {...form.getInputProps("day")}
                    onChange={(value: number) => {
                      const growDayOffSet = parseInt(value.toString(), 10);
                      if (!growDayOffSet && growDayOffSet != 0) return; // prevent error if changed to empty string
                      const newPostDate = new Date(reportStartDate); // Create a new Date object using the reportStartDate
                      newPostDate.setUTCDate(
                        newPostDate.getUTCDate() + growDayOffSet
                      );
                      form.setFieldValue("date", newPostDate);
                      form.setFieldValue("day", growDayOffSet);
                    }}
                  />
                  <DateInput
                    label="Date for this update"
                    description="Sets 'Updated at' of Grow"
                    valueFormat="MMM DD, YYYY HH:mm"
                    // valueFormat="DD/MM/YYYY HH:mm:ss"
                    className="w-full"
                    icon={<IconCalendarEvent size="1.2rem" />}
                    withAsterisk
                    {...form.getInputProps("date")}
                    onChange={(selectedDate: Date) => {
                      const newDate = new Date(selectedDate);
                      /* 
                      newDate.setHours(reportStartDate.getHours());
                      newDate.setMinutes(reportStartDate.getMinutes());
                      newDate.setSeconds(reportStartDate.getSeconds());
                      newDate.setMilliseconds(reportStartDate.getMilliseconds()); 
                      */

                      form.setFieldValue("date", newDate);

                      /* const timeDifferenceMs =
                        selectedDate.getTime() - reportStartDate.getTime(); */

                      const timeDifferenceDays = Math.floor(
                        (selectedDate.getTime() - reportStartDate.getTime()) /
                          (1000 * 60 * 60 * 24)
                      );

                      form.setFieldValue("day", timeDifferenceDays);
                    }}
                  />
                </Flex>
              </Grid.Col>
              <Grid.Col xs={12} sm={6} md={6} lg={6} xl={6}>
                <Flex className="justify-start space-x-2" align="baseline">
                  <NumberInput
                    label="Light hours"
                    description="Light / day (h)"
                    withAsterisk
                    w={142}
                    min={0}
                    max={24}
                    {...form.getInputProps("lightHoursPerDay")}
                    icon={<IconBulb size="1.2rem" />}
                  />
                  <Select
                    label="Grow stage"
                    description="Actual grow stage"
                    data={Object.keys(GrowStage).map((key) => ({
                      value: key,
                      label: formatLabel(key),
                    }))}
                    withAsterisk
                    {...form.getInputProps("growStage")}
                    className="w-full"
                    icon={<IconPlant size="1.2rem" />}
                  />
                </Flex>
              </Grid.Col>
            </Grid>
          </Box>
          <TextInput
            withAsterisk
            label="Titel for this update"
            placeholder="Titel of this Update"
            {...form.getInputProps("title")}
          />
          <TextInput hidden {...form.getInputProps("content")} />

          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
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
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>

          <ImageUploader
            report={report}
            imageIds={imageIds}
            setImageIds={setImageIds}
          />

          <Group position="right" mt="xl">
            <Button w={180} variant="outline" type="submit">
              Update Grow 🪴
            </Button>
          </Group>
        </form>
      </Box>
      {/* </Paper> */}
    </Container>
  );
};

export default AddPost;
