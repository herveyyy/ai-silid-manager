import { AdminPanel } from "@/components/molecules/admin-panel";
import { UserAccessControlConsole } from "@/components/organisms/user-access-control-console";
import { createOwnerUsersAction } from "@/app/actions";
import { requireOwnerAccess } from "@/lib/auth/require-owner-access";

export default async function UserAccessControlPage() {
    const session = await requireOwnerAccess();
    const currentUserId = (session.user as { id?: string }).id ?? "";
    const usersController = await createOwnerUsersAction();
    const users = await usersController.getDashboardAccessUsers();

    return (
        <div className="space-y-8">
            <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--muted)">
                    security · access control
                </p>
                <h1 className="mt-1 text-2xl font-bold uppercase tracking-[0.12em] text-foreground">
                    User Access Control
                </h1>
                <p className="mt-2 max-w-2xl font-mono text-[12px] leading-relaxed text-(--muted)">
                    Owner-only console for granting and revoking{" "}
                    <span className="text-(--muted-strong)">admin</span> dashboard
                    access. Owner accounts cannot be modified here.
                </p>
            </div>

            <AdminPanel
                title="Dashboard operators"
                subtitle="Roles with admin or owner access to this console"
            >
                <UserAccessControlConsole
                    users={users}
                    currentUserId={currentUserId}
                />
            </AdminPanel>
        </div>
    );
}
