// lib/globalDraft.ts
import { z } from "zod";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  author: z.string().min(2, { message: "Co-Owners must be at least 2 characters." }),
  tags: z
    .string()
    .min(2, { message: "Tags must be at least 2 characters." })
    .refine((value) => value.split(",").every((tag) => tag.trim().length > 0), {
      message: "Each tag must be non-empty and separated by commas.",
    }),
  coverImage: z.string().min(1, { message: "Cover image is required." }),
  content: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("paragraph"),
        paragraphTitle: z.string().min(1, { message: "Paragraph title is required." }),
        paragraphText: z.string().min(1, { message: "Paragraph text is required." }),
      }),
      z.object({
        type: z.literal("image"),
        imageFile: z.string().min(1, { message: "Image file URL is required." }),
      }),
    ])
  ),
});

export type DraftData = z.infer<typeof formSchema> & { id?: string };

// Initialize globalDraft as an object with a mutable data property
export const globalDraft = {
  data: {
    title: "",
    author: "",
    tags: "",
    coverImage: "",
    content: [],
  } as DraftData,
  fromPreview: false, // Add flag to track navigation from /preview
};