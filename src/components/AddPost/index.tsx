import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  NumberInput,
  Paper,
  TextInput,
  Title,
} from "@mantine/core";
import { Editor, useEditor } from "@tiptap/react";
import React, { FormEvent, useEffect, useRef } from "react";
import { useForm, zodResolver } from "@mantine/form";

import { DateInput } from "@mantine/dates";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import type { Report } from "~/types";
import { RichTextEditor } from "@mantine/tiptap";
import StarterKit from "@tiptap/starter-kit";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { z } from "zod";

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

  const reportStartDate = new Date(report.createdAt);
  reportStartDate.setHours(0, 0, 0, 0); // Set time to midnight for calculation
  reportStartDate.setDate(reportStartDate.getDate());
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set time to midnight for calculation
  currentDate.setDate(currentDate.getDate());
  // Calculate the difference in milliseconds
  const timeDifferenceMs = currentDate.getTime() - reportStartDate.getTime();

  // Convert milliseconds to days
  const timeDifferenceDays = Math.floor(
    timeDifferenceMs / (1000 * 60 * 60 * 24)
  );
  const schema = z.object({
    date: z.date().refine((value) => value >= reportStartDate, {
      message:
        "Date should be greater than or equal to the report's start date (germination date)",
    }),
    day: z.number().min(0, { message: "Day of Growmust be greater than zero" }),
    title: z
      .string()
      .min(8, { message: "Title should have at least 8 letters" })
      .max(32, { message: "Title should have max 32 letters" }),
    description: z.string(),
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      date: new Date(),
      day: timeDifferenceDays,
      title: "",
      description: "",
    },
  });

  function handleSubmit(values: {
    date: Date;
    day: number;
    title: string;
    description: string;
  }) {
    const editorHtml = editor?.getHTML() as string;
    values.description = editorHtml;
    console.debug(values);
  }

  return (
    <Container size="md">
      {/* <Paper withBorder> */}
      <Title order={2}>Update your Grow </Title>

      <Box>
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <Flex className="justify-between" align="baseline">
            <DateInput
              className="w-full"
              size="sm"
              label="Select a date for this update"
              description="This handles the sorting of all updates of your Grow"
              withAsterisk
              {...form.getInputProps("date")}
              onChange={(selectedDate: Date) => {
                form.setFieldValue("date", selectedDate);

                const reportStartDate = new Date(report.createdAt);
                reportStartDate.setHours(0, 0, 0, 0);
                reportStartDate.setDate(reportStartDate.getDate());
                const timeDifferenceMs =
                  selectedDate.getTime() - reportStartDate.getTime();
                const timeDifferenceDays = Math.floor(
                  timeDifferenceMs / (1000 * 60 * 60 * 24)
                );
                console.debug("reportStartDate", reportStartDate);
                console.debug("currentDate", currentDate);
                console.debug("timeDifferenceDays", timeDifferenceDays);

                form.setFieldValue("day", timeDifferenceDays);
              }}
            />
            <NumberInput
              ml="sm"
              withAsterisk
              label="Day of Grow"
              description="Start is day 0"
              placeholder="1"
              mt="sm"
              {...form.getInputProps("day")}
              onChange={(value: number) => {
                const newDay = parseInt(value.toString(), 10);

                const reportStartDate = new Date(report.createdAt);
                reportStartDate.setHours(0, 0, 0, 0);
                reportStartDate.setDate(reportStartDate.getDate());

                const newDate = new Date(
                  reportStartDate.getTime() + newDay * 24 * 60 * 60 * 1000
                );

                form.setFieldValue("date", newDate);
                form.setFieldValue("day", newDay); // Convert newDay to a string
              }}
            />
          </Flex>
          <TextInput
            withAsterisk
            label="Titel of this update"
            placeholder="Titel of this Update"
            {...form.getInputProps("title")}
          />
          <TextInput
            hidden
            withAsterisk
            label="Update text"
            placeholder=""
            mt="sm"
            {...form.getInputProps("description")}
          />

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
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Box>
      {/* </Paper> */}
    </Container>
  );
};

export default AddPost;
