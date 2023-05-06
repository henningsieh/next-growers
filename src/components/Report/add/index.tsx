/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Box,
  Button,
  Group,
  Space,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

import type { OwnReport } from "~/types";
import { api } from "~/utils/api";
import { reportInput } from "~/types";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  titel: z
    .string()
    .min(12, { message: "Titel should have at least 12 letters" }),
  description: z
    .string()
    .min(42, { message: "Description should have at least 42 letters" }),
  // email: z.string().email({ message: 'Invalid email' }),
  // age: z.number().min(18, { message: 'You must be at least 18 to create an account' }),
});

export default function AddReport() {
  const [newReport, setNewReport] = useState({ title: "", description: "" });
  const { data: session } = useSession();
  const trpc = api.useContext();

  const form = useForm({
    validateInputOnChange: true,
    validate: zodResolver(schema),
    initialValues: {
      titel: "",
      description: "",
    },
  });

  if (!session) {
    return <p className="text-6xl">Access Denied</p>;
  }

  const { mutate } = api.reports.create.useMutation({
    onMutate: async (newReport) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await trpc.reports.getOwnReports.cancel();

      // Snapshot the previous value
      const previousReports = trpc.reports.getOwnReports.getData();

      // Optimistically update to the new value
      trpc.reports.getOwnReports.setData(undefined, (prev) => {
        const optimisticReport: OwnReport = {
          id: "TEMP_ID", // 'placeholder'
          title: newReport.title,
          description: newReport.description,
          updatedAt: new Date(),
          createdAt: new Date(),
        };

        // Return optimistically updated reports
        if (!prev) return [optimisticReport];
        return [...prev, optimisticReport];
      });

      // Clear input
      setNewReport({ title: "", description: "" });

      // Return a context object with the snapshotted value
      return { previousReports };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newReport, context) => {
      toast.error("An error occured when creating reports");
      // Clear input
      setNewReport(newReport);
      if (!context) return;
      trpc.reports.getOwnReports.setData(
        undefined,
        () => context.previousReports
      );
    },
    // Always refetch after error or success:
    onSettled: async () => {
      console.log("SETTLED");
      await trpc.reports.getOwnReports.invalidate();
    },
  });

  return (
    <Box className="flex w-full flex-col space-y-4" mx="auto">
      <Space h={42} />

      <Title order={2}>Create a Report</Title>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const result = reportInput.safeParse(newReport);
          console.log(result);
          if (!result.success) {
            toast.error(result.error.format()._errors.toString());
            const errorString = result.error.format()._errors.toString();
            return;
          }
          mutate(newReport);
        }}
      >
        <p>{}</p>
        <TextInput
          withAsterisk
          label="Titel"
          placeholder="High Life Chronicles: A Thrilling Cannabis Grow Report"
          {...form.getInputProps("titel")}
          onChange={(e) => {
            setNewReport((prevState) => ({
              ...prevState,
              title: e.target.value,
            }));
          }}
          value={newReport.title}
        />
        <Textarea
          withAsterisk
          label="Description"
          placeholder="Welcome to the high life with our epic cannabis grow report! Follow along as we document the journey of cultivating the finest strains of cannabis, from seed to harvest. Our expert growers will share their tips and tricks for producing big, beautiful buds that will blow your mind. Get ready to learn about the best nutrients, lighting, and growing techniques for cultivating potent and flavorful cannabis. Whether you're a seasoned cultivator or just starting out, our cannabis grow report has something for everyone. So sit back, relax, and enjoy the ride as we take you on a journey through the wonderful world of cannabis cultivation!"
          mt="sm"
          autosize
          minRows={8}
          {...form.getInputProps("description")}
          onChange={(e) => {
            setNewReport((prevState) => ({
              ...prevState,
              description: e.target.value,
            }));
          }}
          value={newReport.description}
        />
        {/* <NumberInput
          withAsterisk
          label="Age"
          placeholder="Your age"
          mt="sm"
          {...form.getInputProps('age')}
        />  */}

        <Group position="right" mt="xl">
          {/* <Button type="submit" fullWidth className=" 
            font-medium rounded-lg sm:w-auto px-5 py-2 
            bg-gradient-to-r from-pink-600 via-red-600 to-orange-500">
          Create new report! 🚀</Button> */}

          {/*           <Button type="submit" color="orange.6" variant="outline" >
          Create new report! 🚀
          </Button> */}
          <Button
            type="submit"
            className="border-1 border-orange-800"
            color="orange.7"
            radius="sm"
            variant="filled"
            uppercase
          >
            Create new report! 🚀
          </Button>
        </Group>
      </form>
    </Box>
  );
}
