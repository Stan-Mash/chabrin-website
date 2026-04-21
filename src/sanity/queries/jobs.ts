import { sanityClient } from "@/lib/sanity";

export interface SanityJob {
  slug: string;
  title: string;
  department: string;
  jobType: string;
  location: string;
  summary: string;
  salaryRange: string | null;
  status: "open" | "draft" | "paused" | "closed";
  closesAt: string | null;
  publishedAt: string;
}

export interface SanityJobDetail extends SanityJob {
  description: unknown[]; // Portable Text blocks
  requirements: string[];
  niceToHave: string[];
  screeningQuestions: { question: string; required: boolean }[];
}

/** All open jobs for the public careers listing */
export async function getAllOpenJobs(): Promise<SanityJob[]> {
  const now = new Date().toISOString();
  return sanityClient.fetch(
    `*[_type == "job" && status == "open" && publishedAt <= $now && (closesAt == null || closesAt > $now)]
     | order(publishedAt desc) {
       "slug": slug.current,
       title,
       department,
       jobType,
       location,
       summary,
       salaryRange,
       status,
       closesAt,
       publishedAt
     }`,
    { now }
  );
}

/** Single job by slug for the detail page */
export async function getJobBySlug(slug: string): Promise<SanityJobDetail | null> {
  const now = new Date().toISOString();
  return sanityClient.fetch(
    `*[_type == "job" && slug.current == $slug && status == "open" && (closesAt == null || closesAt > $now)][0] {
       "slug": slug.current,
       title,
       department,
       jobType,
       location,
       summary,
       salaryRange,
       status,
       closesAt,
       publishedAt,
       description,
       requirements,
       niceToHave,
       screeningQuestions
     }`,
    { slug, now }
  );
}

/** All open job slugs — for generateStaticParams */
export async function getAllOpenJobSlugs(): Promise<string[]> {
  const jobs = await sanityClient.fetch<{ slug: string }[]>(
    `*[_type == "job" && status == "open"] { "slug": slug.current }`
  );
  return jobs.map((j) => j.slug);
}
