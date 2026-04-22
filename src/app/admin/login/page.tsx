import { redirect } from "next/navigation";

// Legacy /admin/login — redirect to the current login page
export default function AdminLoginRedirect() {
  redirect("/admin-login");
}
