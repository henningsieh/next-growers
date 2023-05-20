import { GrowStage } from "~/types";

export const InputCreateReport = z.object({
  title: z
    .string()
    .min(8, { message: "Title should have at least 8 letters" })
    .max(32, { message: "Title should have max 32 letters" }),
  description: z
    .string()
    .min(12, { message: "Content should have at least 12 letters" })
    .max(64, { message: "Content should have max 64 letters" }),
  imageId: z.string().min(1, { message: "Header image is missing" }),
});

export const InputEditReport = z.object({
  id: z.string().min(1),
  title: z
    .string()
    .min(8, { message: "Title should have at least 8 letters" })
    .max(32, { message: "Title should have max 32 letters" }),
  description: z
    .string()
    .min(12, { message: "Content should have at least 12 letters" })
    .max(64, { message: "Content should have max 64 letters" }),
  strains: z
    .array(z.string())
    .min(1, { message: "Report should have at least 1 strain" }),
});

export const InputGetReports = z.object({
  orderBy: z.string().min(1),
  desc: z.boolean(),
  search: z.string(),
});

export const InputSetUserName = z.object({
  id: z.string().min(1),
  name: z.string().min(6).max(100),
});

export const InputLike = z.object({
  reportId: z.string(),
});
export const InputDeletelike = z.object({
  reportId: z.string(),
});

import type {
  ZodType,
  ZodEffects,
  ZodNullable,
  ZodNumber,
  ZodString,
  ZodDate,
} from "zod";
import { z } from "zod";

type InputCreatePostFormSchema = {
  date: ZodEffects<ZodDate, Date, Date>;
  day: ZodNumber;
  title: ZodString;
  content: ZodString;
  lightHoursPerDay: ZodNullable<ZodNumber>;
  growStage: ZodString;
};

export const InputCreatePost: (reportStartDate: Date) => ZodType = (
  reportStartDate: Date
) => {
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
    lightHoursPerDay: z
      .number({ invalid_type_error: "(h) must be set, may be 0" })
      .nullable(),
    growStage: z
      .string()
      .min(1, { message: "Grow stage must be set with every update" }),
  });
};

export const InputCreatePostServer = z.object({
  date: z.date(),
  title: z.string().min(1),
  growStage: z.nativeEnum(GrowStage), // Use z.nativeEnum to accept the GrowStage enum type
  lightHoursPerDay: z.number().nullable(),
  content: z.string().min(1),
  reportId: z.string().min(1),
  authorId: z.string().min(1),
});

// Create a new type by omitting the 'day' field
export type InputCreatePostFormWithoutDay = Omit<
  InputCreatePostFormSchema,
  "day"
>;
