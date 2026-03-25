import type { Metadata } from "next";
import { AdminShell } from "@/components/organisms/admin-shell";

export const metadata: Metadata = {
  title: "Dashboard · Silid Admin",
  description: "School management console",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
