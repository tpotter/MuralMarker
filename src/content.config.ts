import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/* ---------- shared shapes (requirements §1.1–§1.3) ---------- */

const MuralDate = z
  .object({
    year: z.int().min(1900).max(2100),
    month: z.int().min(1).max(12).optional(), // absent = year-only (§3.2)
    precision: z.enum(["exact", "circa"]),
  })
  .strict();

const Artist = z
  .object({
    name: z.string().min(1),
    url: z.url().optional(), // absent for anonymous/unclaimed
  })
  .strict();

const Photo = z
  .object({
    key: z.string().min(1), // opaque (§5.1)
    width: z.int().positive(),
    height: z.int().positive(),
    caption: z.string().optional(),
    dateTaken: z.string().optional(),
    credit: z.string().optional(),
  })
  .strict();

const Source = z
  .object({
    label: z.string().min(1),
    url: z.url(),
  })
  .strict();

/* ---------- the entry (requirements §1) ---------- */
// NOTE: no `id` — identity is the filename (§3.5)

const Mural = z
  .object({
    title: z.string().min(1).optional(),
    artists: z.array(Artist).min(1),
    description: z.string().min(1),

    location: z
      .object({
        lat: z.number().min(38.79).max(39.0), // DC bounding box
        lng: z.number().min(-77.12).max(-76.9),
        address: z.string().optional(),
        neighborhood: z.string().optional(),
      })
      .strict(),

    status: z.enum(["existing", "removed"]),
    dateStart: MuralDate,
    dateEnd: MuralDate.optional(), // required when removed — see below
    removalDateUncertain: z.boolean().default(false),

    lastUpdated: z.iso.date(), // string, deliberately not coerced (§3.6.2)
    photos: z.array(Photo), // required field, may be empty (req. §1.3)
    sources: z.array(Source).default([]),
  })
  .strict();

// local, 2 lines, no imports — year-only dates bias inclusive per §3.2
const months = (d: { year: number; month?: number }, edge: "start" | "end") =>
  d.year * 12 + (d.month ?? (edge === "start" ? 1 : 12));

const MuralEntry = Mural.refine(
  (d) => d.status !== "removed" || d.dateEnd !== undefined,
  {
    message: 'dateEnd is required when status is "removed"',
    path: ["dateEnd"],
  },
).refine(
  (d) => !d.dateEnd || months(d.dateEnd, "end") >= months(d.dateStart, "start"),
  {
    message: "dateEnd must not precede dateStart",
    path: ["dateEnd"],
  },
);

export const collections = {
  murals: defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/murals" }),
    schema: MuralEntry,
  }),
};

export type Mural = z.infer<typeof MuralEntry>;
