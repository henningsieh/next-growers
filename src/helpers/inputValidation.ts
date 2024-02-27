import type { ZodType } from "zod";
import { z } from "zod";

import { Environment, GrowStage } from "~/types";

export const InputLogin = z.string().email("Invalid email address");

export const InputEditProfile = z.object({
  name: z.string().min(6, {
    message: "Username must have at least 6 letters",
  }),
  /*       .refine((value) => !/\s/.test(value), {
      message: "Userame must not contain whitespace characters",
    }),
    */
  email: z.string().email({ message: "Invalid email address" }),
});

export const InputCreateReport = z.object({
  title: z
    .string()
    .min(8, { message: "Title should have at least 8 letters" })
    .max(32, { message: "Title should have max 32 letters" }),
  description: z
    .string()
    .min(12, {
      message: "Content should have at least 12 letters",
    })
    .max(64, { message: "Content should have max 64 letters" }),
  imageId: z.string().min(1, { message: "Header image is missing" }),
});

export const InputEditReport = z.object({
  id: z.string().min(1),
  title: z
    .string()
    .min(8, { message: "Title should have at least 8 letters" })
    .max(32, { message: "Title should have max 32 letters" }),
  imageId: z.string().min(1, { message: "Header image is missing" }),
  description: z
    .string()
    .min(12, {
      message: "Content should have at least 12 letters",
    })
    .max(64, { message: "Content should have max 64 letters" }),
  strains: z.array(z.string()).min(1, {
    message: "Report should have at least 1 strain",
  }),
  environment: z.enum(
    Object.keys(Environment) as [keyof typeof Environment]
  ),
  createdAt: z.date(),
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
  id: z.string(),
});

export const InputGetCommentsByPostId = z.object({
  postId: z.string().min(1),
});

export const InputSaveComment = z.object({
  id: z.string().optional(),
  postId: z.string(),
  content: z
    .string()
    .min(1, "Comments must have at least 1 chracter")
    .max(1000),
});

export const InputCreatePost: (reportStartDate: Date) => ZodType = (
  reportStartDate: Date
) => {
  return z.object({
    date: z.date().refine((value) => value >= reportStartDate, {
      message:
        "Date should be greater than or equal to report's germination date",
    }),
    id: z.string().optional(),
    day: z.number().min(0, { message: "Day must be greater than 0" }),
    title: z
      .string()
      .min(8, {
        message: "Title should have at least 8 letters",
      })
      .max(32, { message: "Title should have max 32 letters" }),
    lightHoursPerDay: z
      .number({
        invalid_type_error: "(h) must be set, may be 0",
      })
      .nullable(),
    growStage: z.string().min(1, {
      message: "Grow stage must be set with every update",
    }),
    content: z.string(),
    images: z.array(z.string()),
  });
};

export const InputCreatePostServer = z.object({
  id: z.string().optional(),
  date: z.date(),
  title: z.string().min(1),
  lightHoursPerDay: z.number().nullable(),
  growStage: z.enum(Object.keys(GrowStage) as [keyof typeof GrowStage]),
  content: z.string().min(1),
  reportId: z.string().min(1),
  authorId: z.string().min(1),
  images: z.array(z.string()),
});
