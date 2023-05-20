/* eslint-disable @typescript-eslint/no-unused-vars */

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
import type { Post, PostDbInput, Report } from "~/types";
import React, { FormEvent, useEffect, useRef } from "react";
import { useForm, zodResolver } from "@mantine/form";

import { DateInput } from "@mantine/dates";
import { GrowStage } from "~/types";
import Highlight from "@tiptap/extension-highlight";
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
import { InputCreatePost } from "~/helpers/inputValidation";

interface AddPostProps {
  report: Report;
}
const content =
  '<h1 style="text-align: center">Update your Grow with a nice rich text</h1><p><code>RichTextEditor</code> <mark>component focuses on usability </mark>and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a target="_blank" rel="noopener noreferrer nofollow" href="https://tiptap.dev/">Tiptap.dev</a> and supports all of its features:</p><ul><li><p>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s></p></li><li><p>Headings (h1-h6)</p></li><li><p>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</p></li><li><p>Ordered and bullet lists* <sub>(*buggy: bullets and numbers are invisible ;-) )</sub></p></li><li><p>Text align&nbsp;</p></li><li><p>And all <a target="_blank" rel="noopener noreferrer nofollow" href="https://tiptap.dev/extensions">other extensions</a></p></li></ul>';

const AddPost = (props: AddPostProps) => {
  const { report: report } = props;

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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm({
    validate: zodResolver(InputCreatePost(reportStartDate)),
    initialValues: {
      date: new Date(),
      day: timeDifferenceDays,
      title: "",
      content: "",
      growStage: GrowStage.VEGETATIVE_STAGE,
      lightHoursPerDay: 12,
    },
  });

  function handleSubmit(values: {
    date: Date;
    day: number;
    title: string;
    content: string;
    growStage: GrowStage | undefined;
    lightHoursPerDay: number;
  }) {
    const { day, ...restValues } = values; // Omitting the 'day' field

    const editorHtml = editor?.getHTML() as string;
    restValues.content = editorHtml;

    const savePost: PostDbInput = {
      ...restValues,
      growStage: restValues.growStage as GrowStage,
      reportId: report.id,
      authorId: report.authorId,
    };

    console.debug(savePost);
    tRPCaddPostToReport(savePost);
  }

  return (
    <Container size="md">
      {/* <Paper withBorder> */}
      <Title order={2}>Update your Grow </Title>

      <Box>
        <form
          className="space-y-4"
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <Box>
            <Grid gutter="sm">
              <Grid.Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <Flex className="justify-start space-x-2" align="baseline">
                  <NumberInput
                    label="Grow day"
                    description="Start is day 0"
                    miw={90}
                    placeholder="1"
                    icon={<IconNumber size="1.2rem" />}
                    withAsterisk
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
                    miw={180}
                    className="w-full"
                    icon={<IconCalendarEvent size="1.2rem" />}
                    withAsterisk
                    {...form.getInputProps("date")}
                    onChange={(selectedDate: Date) => {
                      const newDate = new Date(selectedDate); /* 
                      newDate.setHours(reportStartDate.getHours());
                      newDate.setMinutes(reportStartDate.getMinutes());
                      newDate.setSeconds(reportStartDate.getSeconds());
                      newDate.setMilliseconds(
                        reportStartDate.getMilliseconds()
                      ); */

                      form.setFieldValue("date", newDate);

                      const timeDifferenceMs =
                        selectedDate.getTime() - reportStartDate.getTime();
                      const timeDifferenceDays = Math.floor(
                        timeDifferenceMs / (1000 * 60 * 60 * 24)
                      );

                      form.setFieldValue("day", timeDifferenceDays);
                    }}
                  />
                </Flex>
              </Grid.Col>
              <Grid.Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <Flex className="justify-start space-x-2" align="baseline">
                  <NumberInput
                    label="Light hours"
                    miw={90}
                    min={0}
                    max={24}
                    description="Light / day (h)"
                    {...form.getInputProps("lightHoursPerDay")}
                    icon={<IconBulb size="1.2rem" />}
                  />
                  <Select
                    miw={180}
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
            label="Titel of this update"
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
