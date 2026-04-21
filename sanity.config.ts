import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "chabrin-studio",
  title: "Chabrin Agencies CMS",
  projectId,
  dataset,
  plugins: [
    structureTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  basePath: "/studio",
});
