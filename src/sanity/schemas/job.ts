import { defineField, defineType } from "sanity";

export const jobSchema = defineType({
  name: "job",
  title: "Job Listing",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
      options: {
        list: [
          { title: "Operations",     value: "Operations"     },
          { title: "Administration", value: "Administration" },
          { title: "Finance",        value: "Finance"        },
          { title: "IT & Systems",   value: "IT & Systems"   },
          { title: "Marketing",      value: "Marketing"      },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "jobType",
      title: "Job Type",
      type: "string",
      options: {
        list: [
          { title: "Full-time",  value: "Full-time"  },
          { title: "Part-time",  value: "Part-time"  },
          { title: "Contract",   value: "Contract"   },
          { title: "Internship", value: "Internship" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      initialValue: "Nairobi, Kenya",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      description: "One or two sentences shown on the careers listing page",
      type: "text",
      rows: 2,
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: "description",
      title: "Job Description",
      description: "Full role description with context, responsibilities, and expectations",
      type: "array",
      of: [{ type: "block" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      description: "Must-have qualifications (shown as a checklist)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "niceToHave",
      title: "Nice to Have",
      description: "Bonus qualifications (shown as an optional list)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "salaryRange",
      title: "Salary Range",
      description: 'e.g. "KES 80,000 – 120,000/month" — leave blank to omit',
      type: "string",
    }),
    defineField({
      name: "screeningQuestions",
      title: "Screening Questions",
      description: "Questions applicants must answer when applying",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
            defineField({ name: "required", title: "Required?", type: "boolean", initialValue: true }),
          ],
          preview: {
            select: { title: "question", subtitle: "required" },
            prepare({ title, subtitle }) {
              return { title, subtitle: subtitle ? "Required" : "Optional" };
            },
          },
        },
      ],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Open",   value: "open"   },
          { title: "Draft",  value: "draft"  },
          { title: "Paused", value: "paused" },
          { title: "Closed", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "closesAt",
      title: "Closing Date",
      description: "Leave blank for no closing date",
      type: "datetime",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: {
      title:      "title",
      department: "department",
      status:     "status",
    },
    prepare({ title, department, status }) {
      const badge = status === "open" ? "🟢" : status === "draft" ? "⚪" : status === "paused" ? "🟡" : "🔴";
      return { title, subtitle: `${badge} ${status} · ${department}` };
    },
  },
  orderings: [
    {
      title: "Published Date (newest first)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
