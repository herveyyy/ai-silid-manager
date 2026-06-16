"use server";

import { createOwnerUsersAction } from "@/app/actions";
import { requireOwnerAccess } from "@/lib/auth/require-owner-access";
import { revalidatePath } from "next/cache";

const NAME_MAX = 500;
const EMAIL_MAX = 320;
const PASSWORD_MAX = 100;

export async function grantAdminAccessAction(
    userId: string,
): Promise<{ success: boolean; message: string }> {
    await requireOwnerAccess();

    if (!userId) {
        return { success: false, message: "Missing user." };
    }

    try {
        const usersController = await createOwnerUsersAction();
        await usersController.grantAdminAccess(userId);
        revalidatePath("/dashboard/user-access-control");
        return { success: true, message: "Admin access granted." };
    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error ? error.message : "Failed to grant admin access.";
        return { success: false, message };
    }
}

export async function revokeAdminAccessAction(
    userId: string,
): Promise<{ success: boolean; message: string }> {
    const session = await requireOwnerAccess();
    const currentUserId = (session.user as { id?: string }).id;

    if (!userId) {
        return { success: false, message: "Missing user." };
    }

    if (userId === currentUserId) {
        return { success: false, message: "You cannot revoke your own access." };
    }

    try {
        const usersController = await createOwnerUsersAction();
        await usersController.revokeAdminAccess(userId);
        revalidatePath("/dashboard/user-access-control");
        return { success: true, message: "Admin access revoked." };
    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error ? error.message : "Failed to revoke admin access.";
        return { success: false, message };
    }
}

export async function createAdminUserAction(form: {
    name: string;
    email: string;
    password: string;
}): Promise<{ success: boolean; message: string }> {
    await requireOwnerAccess();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!name || name.length > NAME_MAX) {
        return {
            success: false,
            message: "Name is required (max 500 characters).",
        };
    }
    if (!email || email.length > EMAIL_MAX || !email.includes("@")) {
        return { success: false, message: "Enter a valid email address." };
    }

    try {
        const usersController = await createOwnerUsersAction();
        const existing = await usersController.getUserByEmail(email);

        if (existing) {
            if (existing.role === "owner") {
                return { success: false, message: "Owner accounts are managed separately." };
            }
            if (existing.role === "admin") {
                return { success: false, message: "This user is already an admin." };
            }
            await usersController.grantAdminAccess(existing.id);
            revalidatePath("/dashboard/user-access-control");
            return { success: true, message: "Existing user promoted to admin." };
        }

        if (password.length < 8) {
            return {
                success: false,
                message: "Password must be at least 8 characters.",
            };
        }
        if (password.length > PASSWORD_MAX) {
            return {
                success: false,
                message: `Password must be at most ${PASSWORD_MAX} characters.`,
            };
        }

        await usersController.createAdminUser({
            name,
            email,
            password,
            role: "admin",
            imageUrl: "",
        });

        revalidatePath("/dashboard/user-access-control");
        return { success: true, message: "Admin user created." };
    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error ? error.message : "Failed to create admin user.";
        return { success: false, message };
    }
}
