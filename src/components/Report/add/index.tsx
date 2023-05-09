import {
  Button,
  Container,
  Group,
  Space,
  Text,
  TextInput,
  Textarea,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";

import AccessDenied from "~/components/Atom/AccessDenied";
import type { ImageUploadResponse } from "~/types";
import type { OwnReport } from "~/types";
import { api } from "~/utils/api";
import axios from "axios";
import { reportInput } from "~/types";
import toast from "react-hot-toast";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    marginBottom: rem(30),
  },

  dropzone: {
    borderWidth: rem(1),
    paddingBottom: rem(50),
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  control: {
    position: "absolute",
    width: rem(250),
    left: `calc(50% - ${rem(125)})`,
    bottom: rem(-20),
  },
}));
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
  const { classes, theme } = useStyles();
  const openRef = useRef<() => void>(null);
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

  if (!session) return <AccessDenied />;

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
          authorId: "",
          authorImage: "",
          authorName: "",
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
      console.log("END api.reports.create.useMutation");
      await trpc.reports.getOwnReports.invalidate();
    },
  });

  const handleDrop = async (files: File[]): Promise<void> => {
    const formData = new FormData();
    console.log(files);
    if (files && files[0]) {
      // files.map((file) => formData.append("image", file));
      formData.append("image", files[0]); // Assuming only one file is uploaded
      try {
        const {
          data,
        }: {
          data: ImageUploadResponse;
        } = await axios.post("/api/image", formData);

        /* const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        }); */
        if (data.success) {
          console.log("File uploaded successfully");
        } else {
          throw new Error("File uploaded NOT successfully");
        }
      } catch (error) {
        console.log(error);
        throw new Error("Error uploading file");
      }
    }
  };

  const handleDropWrapper = (files: File[]): void => {
    handleDrop(files).catch((error) => {
      console.log(error);
    });
  };

  return (
    <Container
      size="sm"
      px={0}
      className="flex w-full flex-col space-y-4"
      mx="auto"
    >
      <Space h={42} />

      <Title order={2}>Create a Report</Title>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const result = reportInput.safeParse(newReport);
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
        <Space h="sm" />
        <label className="mantine-InputWrapper-label mantine-Textarea-label mantine-1mo4y8r">
          File Upload
          <span
            className="mantine-ifziax mantine-InputWrapper-required mantine-Textarea-required"
            aria-hidden="true"
          >
            {/* * */}
          </span>
        </label>
        <div className={classes.wrapper}>
          <Dropzone
            openRef={openRef}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onDrop={handleDropWrapper}
            className={classes.dropzone}
            radius="md"
            accept={[MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.gif]}
            maxSize={30 * 1024 ** 2}
          >
            <div style={{ pointerEvents: "none" }}>
              <Group position="center">
                <Dropzone.Accept>
                  <IconDownload
                    size={rem(50)}
                    color={
                      theme.colorScheme === "dark"
                        ? theme.colors.blue[0]
                        : theme.white
                    }
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    size={rem(50)}
                    color={theme.colors.red[6]}
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconCloudUpload
                    size={rem(50)}
                    color={
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[0]
                        : theme.black
                    }
                    stroke={1.5}
                  />
                </Dropzone.Idle>
              </Group>

              <Text ta="center" fw={700} fz="lg" mt="xl">
                <Dropzone.Accept>Drop files here</Dropzone.Accept>
                <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
                <Dropzone.Idle>Upload Images</Dropzone.Idle>
              </Text>
              <Text ta="center" fz="sm" mt="xs" c="dimmed">
                Drag&apos;n&apos;drop files here to upload. We can accept only{" "}
                <i>.pdf</i> files that are less than 30mb in size.
              </Text>
            </div>
          </Dropzone>

          <Button
            className={`${
              theme.colorScheme === "light" ? "text-gray-900" : ""
            } border-1 border-orange-500`}
            size="sm"
            radius="xl"
            onClick={() => openRef.current?.()}
          >
            Select files
          </Button>
        </div>

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
            // className="border-1 border-orange-500"
            className={`${
              theme.colorScheme === "light" ? "text-gray-900" : ""
            } border-1 border-orange-500`}
            radius="sm"
            uppercase
          >
            Create new report! 🚀
          </Button>
        </Group>
      </form>
    </Container>
  );
}
