import { defineCollection, z } from "astro:content";

export const colorSchema = z.object({
  value: z.array(z.number()).length(4),
  rgb: z.string(),
  rgba: z.string(),
  hex: z.string(),
  hexa: z.string(),
  isDark: z.boolean(),
  isLight: z.boolean(),
  error: z.unknown().optional(),
});

// all in cm
export const dimensionsSchema = z.object({
  width: z.number().optional(),
  height: z.number().optional(),
  thickness: z.number().optional(),
});

export type Color = z.infer<typeof colorSchema>;

export const BookSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  publishers: z.array(z.string()),
  authors: z.array(z.string()),
  genre: z.string().array().optional(),
  isbn: z.string().array(),
  googleBooksId: z.string().optional(),
  goodreadsId: z.string().optional(),
  openLibraryId: z.string().optional(),
  pages: z.number().optional(),
  published: z.string(),
  image: z.string(),
  color: colorSchema,
  weight: z.number().nullish(),
  dimensions: z
    .object({
      width: z.number().optional(),
      height: z.number().optional(),
      thickness: z.number().optional(),
    })
    .optional(),
  //   dimensions: dimensionsSchema.optional(),
});

export type Book = z.infer<typeof BookSchema>;

export const collections = {
  library: defineCollection({
    type: "data",
    schema: ({ image }) =>
      BookSchema.merge(
        z.object({
          image: image(),
        })
      ),
  }),
};
