import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/request";

/**
 * Root page — immediately redirects to the default locale.
 * All real pages live under /[locale]/...
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
