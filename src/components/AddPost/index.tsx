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
import { Form, useForm, zodResolver } from "@mantine/form";
import React, { FormEvent } from "react";

import { DateInput } from "@mantine/dates";
import { Locale } from "~/types";
import type { Report } from "~/types";
import { sanatizeDateString } from "~/helpers";
import { z } from "zod";

interface AddPostProps {
  report: Report;
}

const AddPost = (props: AddPostProps) => {
  const { report: report } = props;

  const reportStartDate = new Date(report.createdAt);
  reportStartDate.setHours(0, 0, 0, 0); // Set time to midnight
  reportStartDate.setDate(reportStartDate.getDate()); // Subtract one day
  const currentDate = new Date();

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
    title: z
      .string()
      .min(8, { message: "Title should have at least 8 letters" })
      .max(32, { message: "Title should have max 32 letters" }),
    description: z
      .string()
      .min(12, { message: "Description should have at least 12 letters" })
      .max(64, { message: "Description should have max 64 letters" }),
    day: z.number().min(1, { message: "Day of Growmust be greater than zero" }),
  });

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
    console.log(values);
  }

  return (
    <Container size="md">
      {/* <Paper withBorder> */}
      <Title order={2}>Update your Grow </Title>

      <Box>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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
                reportStartDate.setDate(reportStartDate.getDate() - 1);
                const timeDifferenceMs =
                  selectedDate.getTime() - reportStartDate.getTime();
                const timeDifferenceDays = Math.floor(
                  timeDifferenceMs / (1000 * 60 * 60 * 24)
                );

                form.setFieldValue("day", timeDifferenceDays);
              }}
            />
            <NumberInput
              ml="sm"
              withAsterisk
              label="Day of Grow"
              description="this calculates"
              placeholder="1"
              mt="sm"
              {...form.getInputProps("day")}
              onChange={(value: number) => {
                const newDay = parseInt(value.toString(), 10);

                const reportStartDate = new Date(report.createdAt);
                reportStartDate.setHours(0, 0, 0, 0);
                reportStartDate.setDate(reportStartDate.getDate() - 1);

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
            label="Update titel"
            placeholder="Titel of this Update"
            {...form.getInputProps("title")}
          />
          <TextInput
            withAsterisk
            label="Update text"
            placeholder="John Doe"
            mt="sm"
            {...form.getInputProps("description")}
          />
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
