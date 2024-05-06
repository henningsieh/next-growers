import type { ZodType } from "zod";
import { z } from "zod";

import { Environment, GrowStage } from "~/types";

export const InputLogin = z.string().email("Invalid email address");

export const InputSaveUserName = z.object({
  id: z.string().min(1),
  name: z.string().min(5, {
    message: "Username must have at least 5 letters",
  }),
});

export const InputSaveUserImage = z.object({
  id: z.string().min(1),
  imageURL: z.string().url({
    message: "imageURL must be a valid URL",
  }),
});

export const InputEditProfile = z.object({
  name: z.string().min(5, {
    message: "Username must have at least 5 letters",
  }),
  email: z.string().email({ message: "Invalid email address" }),
});

export const InputCreateReportForm = z.object({
  title: z
    .string()
    .min(8, { message: "Title must have at least 8 letters" })
    .max(64, { message: "Title must have max 64 letters" })
    .refine(
      (val) => val.length < 64,
      (val) => ({
        message: `Title must have max 64 letters. ${val.length + 1} letters given.`,
      })
    ),
  imageId: z.string().min(1, { message: "Header image is missing" }),
  description: z
    .string()
    .min(12, {
      message: "Content must have at least 12 letters",
    })
    .max(64, { message: "Description must have max 64 letters" })
    .refine(
      (val) => val.length < 64,
      (val) => ({
        message: `Description must have max 64 letters. ${val.length + 1} letters given.`,
      })
    ),
});

export const InputEditReportForm = z.object({
  id: z.string().min(1),
  title: z
    .string()
    .min(8, { message: "Title must have at least 8 letters" })
    .max(64, { message: "Title must have max 64 letters" })
    .refine(
      (val) => val.length < 64,
      (val) => ({
        message: `Title must have max 64 letters. ${val.length + 1} letters given.`,
      })
    ),
  imageId: z.string().min(1, { message: "Header image is missing" }),
  description: z
    .string()
    .min(12, {
      message: "Content must have at least 12 letters",
    })
    .max(64, { message: "Content must have max 64 letters" })
    .refine(
      (val) => val.length < 64,
      (val) => ({
        message: `Content must have max 64 letters. ${val.length + 1} letters given.`,
      })
    ),
  strains: z.array(z.string()).min(0, {
    // min(0), giving setStrain a own Page or Form!
    message: "Report must have at least 1 strain",
  }),
  environment: z.enum(
    Object.keys(Environment) as [keyof typeof Environment]
  ),
  createdAt: z.date(),
});

export const InputGetAllBreders = z.object({
  withStrains: z.boolean(),
});

export const InputGetStrainInfo = z.object({
  breederId: z.string(),
  strainId: z.string(),
});

export const InputGetReports = z.object({
  orderBy: z.string().min(1),
  desc: z.boolean(),
  search: z.string(),
});

export const InputLike = z.object({
  id: z.string(),
});

export const InputDeletePost = z.object({
  id: z.string(),
});

export const InputGetCommentsByPostId = z.object({
  postId: z.string().min(1),
});

export const InputEditCommentForm = z.object({
  id: z.string().optional(),
  isResponseTo: z.string().optional(),
  postId: z.string(),
  content: z
    .string()
    .min(1, "Comments must have at least 1 chracter")
    .max(1000),
});

export const InputCreatePostForm: (reportStartDate: Date) => ZodType = (
  reportStartDate: Date
) => {
  return z.object({
    date: z
      .date()
      .refine((value) => value >= reportStartDate, {
        message:
          "Date must be greater than or equal to 'Grow start date'",
      })
      .refine((value) => value <= new Date(), {
        message: "Date must be less than or equal to today",
      }),
    id: z.string().optional(),
    day: z.number().min(0, { message: "Day must be greater than 0" }),
    title: z
      .string()
      .min(8, {
        message: "Title must have at least 8 letters",
      })
      .max(64, { message: "Title must have max 64 letters" }),
    lightHoursPerDay: z
      .number({
        invalid_type_error: "(h) must be set, may be 0",
      })
      .nullable(),
    watt: z.number().optional(),
    growStage: z
      .enum(Object.keys(GrowStage) as [keyof typeof GrowStage])
      .nullable(),
    content: z.string(),
    images: z.array(
      z.object({
        id: z.string(),
        postOrder: z.number().nullable(),
      })
    ),
  });
};

export const InputCreatePostServer = z.object({
  id: z.string().optional(),
  date: z.date(),
  title: z.string().min(1),
  lightHoursPerDay: z.number().nullable(),
  watt: z.number().optional(),
  growStage: z.enum(Object.keys(GrowStage) as [keyof typeof GrowStage]),
  content: z.string().min(1),
  reportId: z.string().min(1),
  authorId: z.string().min(1),
  images: z.array(
    z.object({
      id: z.string(),
      postOrder: z.number().nullable(),
    })
  ),
});
