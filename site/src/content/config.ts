import { defineCollection, z } from "astro:content";
import { BookSchema } from "../../../shared/schema";

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
