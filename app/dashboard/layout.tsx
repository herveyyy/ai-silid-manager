import type { Metadata } from "next";
import { AdminShell } from "@/components/organisms/admin-shell";
import { db } from "@/db";
import { requireDashboardAccess } from "@/lib/auth/require-dashboard-access";
import { sql } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Dashboard · Silid Admin",
  description: "School management console",
};

function getEnvironmentLabel(): "LOCAL" | "STAGING" | "PROD" {
  const env = (
    process.env.VERCEL_ENV ??
    process.env.APP_ENV ??
    process.env.NODE_ENV ??
    "development"
  ).toLowerCase();

  if (env === "production" || env === "prod") return "PROD";
  if (env === "preview" || env === "staging" || env === "stage") {
    return "STAGING";
  }

  return "LOCAL";
}

async function getDatabaseConnectionStatus(): Promise<boolean> {
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch (error) {
    console.error("Failed to check database connection", error);
    return false;
  }
}

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireDashboardAccess();

  const [environmentLabel, isDatabaseConnected] = await Promise.all([
    Promise.resolve(getEnvironmentLabel()),
    getDatabaseConnectionStatus(),
  ]);

  return (
    <AdminShell
      environmentLabel={environmentLabel}
      isDatabaseConnected={isDatabaseConnected}
    >
      {children}
    </AdminShell>
  );
}
