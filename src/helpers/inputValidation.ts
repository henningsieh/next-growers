import { z } from "zod";

const InputAddPostForm = (reportStartDate: Date) => {
  return z.object({
    date: z.date().refine((value) => value >= reportStartDate, {
      message:
        "Date should be greater than or equal to report's germination date",
    }),
    day: z.number().min(0, { message: "Day must be greater than 0" }),
    title: z
      .string()
      .min(8, { message: "Title should have at least 8 letters" })
      .max(32, { message: "Title should have max 32 letters" }),
    content: z.string(),
    growStage: z
      .string()
      .min(1, { message: "Grow stage must be set with every update" }),
  });
};

export default InputAddPostForm;
