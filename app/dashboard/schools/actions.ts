"use server";

import { createSchoolsController } from "@/app/actions";
import { hashPassword } from "@/lib/auth/password";
import { StoredSchoolConfig } from "@/lib/school-config-storage";
import { revalidatePath } from "next/cache";
export async function updateSchoolConfigurationAction(
    schoolId: string,
    data: StoredSchoolConfig,
): Promise<{ success: boolean; message: string }> {
    const tokenLimit = Number(data.tokenLimit);
    const storageLimit = Number(data.storageLimit);
    const defaultAiModelId =
        typeof data.defaultAiModelId === "string" &&
        data.defaultAiModelId.trim() !== ""
            ? data.defaultAiModelId
            : null;

    if (
        !schoolId ||
        !Number.isFinite(tokenLimit) ||
        tokenLimit < 0 ||
        !Number.isFinite(storageLimit) ||
        storageLimit < 0
    ) {
        return {
            success: false,
            message: "Invalid school configuration values.",
        };
    }

    try {
        const schoolsController = await createSchoolsController();
        await schoolsController.updateSchoolConfiguration(schoolId, {
            aiFeat: Boolean(data.aiFeat),
            defaultAiModelId,
            unlimitedStorage: Boolean(data.unlimitedStorage),
            unlimitedToken: Boolean(data.unlimitedToken),
            tokenLimit: Math.floor(tokenLimit),
            storageLimit: Math.floor(storageLimit),
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/schools");
        revalidatePath(`/dashboard/schools/${schoolId}`);

        return {
            success: true,
            message: "School configuration saved.",
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to save school configuration.",
        };
    }
}

const SCHOOL_CODE_MAX = 50;
const USERNAME_MAX = 100;
const NAME_MAX = 500;
const SITE_MAX = 2000;

export async function createSchoolAction(form: {
    name: string;
    schoolCode: string;
    site: string;
    username?: string;
    password?: string;
}): Promise<{ success: boolean; message: string; schoolId?: string }> {
    const name = form.name.trim();
    const schoolCode = form.schoolCode.trim();
    const site = form.site.trim();
    const usernameRaw = form.username?.trim() ?? "";
    const passwordRaw = form.password ?? "";

    if (!name || name.length > NAME_MAX) {
        return {
            success: false,
            message: "Name is required (max 500 characters).",
        };
    }
    if (!schoolCode || schoolCode.length > SCHOOL_CODE_MAX) {
        return {
            success: false,
            message: `School code is required (max ${SCHOOL_CODE_MAX} characters).`,
        };
    }
    if (!site || site.length > SITE_MAX) {
        return {
            success: false,
            message: `Site URL or label is required (max ${SITE_MAX} characters).`,
        };
    }
    if (usernameRaw.length > USERNAME_MAX) {
        return {
            success: false,
            message: `Username must be at most ${USERNAME_MAX} characters.`,
        };
    }
    if (passwordRaw.length > 0 && passwordRaw.length < 8) {
        return {
            success: false,
            message: "Password must be at least 8 characters when set.",
        };
    }

    const username = usernameRaw === "" ? null : usernameRaw;
    let password: string | null = null;
    if (passwordRaw !== "") {
        password = await hashPassword(passwordRaw);
    }

    try {
        const schoolsController = await createSchoolsController();
        const school = await schoolsController.createSchool({
            name,
            schoolCode,
            site,
            username,
            password,
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/schools");
        revalidatePath(`/dashboard/schools/${school.id}`);

        return {
            success: true,
            message: "School created.",
            schoolId: school.id,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to create school.",
        };
    }
}
