import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("HealthCalcHub Editorial"),
    category: z.enum(["fitness", "nutrition", "pregnancy", "health"]),
    tags: z.array(z.string()).default([]),
    relatedCalculators: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

export const collections = { blog };
