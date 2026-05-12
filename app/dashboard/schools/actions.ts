"use server";

import { createSchoolsAction } from "@/app/actions";
import { StoredSchoolConfig } from "@/lib/school-config-storage";
import { revalidatePath } from "next/cache";
const SCHOOL_SECRET_MAX = 100;
const SCHOOL_API_KEY_MAX = 100;
const SCHOOL_PASSWORD_MAX = 100;
const SCHOOL_CODE_MAX = 50;
const USERNAME_MAX = 100;
const NAME_MAX = 500;
const SITE_MAX = 2000;

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

    const secretRaw =
        data.secret != null && typeof data.secret === "string"
            ? data.secret.trim()
            : "";
    const apiKeyRaw =
        data.apiKey != null && typeof data.apiKey === "string"
            ? data.apiKey.trim()
            : "";
    const secret = secretRaw === "" ? null : secretRaw;
    const apiKey = apiKeyRaw === "" ? null : apiKeyRaw;

    if (secret !== null && secret.length > SCHOOL_SECRET_MAX) {
        return {
            success: false,
            message: `Secret must be at most ${SCHOOL_SECRET_MAX} characters.`,
        };
    }
    if (apiKey !== null && apiKey.length > SCHOOL_API_KEY_MAX) {
        return {
            success: false,
            message: `API key must be at most ${SCHOOL_API_KEY_MAX} characters.`,
        };
    }

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
        const schoolsController = await createSchoolsAction();
        await schoolsController.updateSchoolConfiguration(schoolId, {
            aiFeat: Boolean(data.aiFeat),
            defaultAiModelId,
            unlimitedStorage: Boolean(data.unlimitedStorage),
            unlimitedToken: Boolean(data.unlimitedToken),
            tokenLimit: Math.floor(tokenLimit),
            storageLimit: Math.floor(storageLimit),
            secret,
            apiKey,
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

export async function updateSchoolProfileAction(
    schoolId: string,
    form: {
        name: string;
        schoolCode: string;
        site: string;
        username?: string;
    },
): Promise<{ success: boolean; message: string }> {
    const name = form.name.trim();
    const schoolCode = form.schoolCode.trim();
    const site = form.site.trim();
    const usernameRaw = form.username?.trim() ?? "";

    if (!schoolId) {
        return { success: false, message: "Missing school." };
    }
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

    const username = usernameRaw === "" ? null : usernameRaw;

    try {
        const schoolsController = await createSchoolsAction();
        await schoolsController.updateSchoolProfile(schoolId, {
            name,
            schoolCode,
            site,
            username,
        });
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/schools");
        revalidatePath(`/dashboard/schools/${schoolId}`);
        return { success: true, message: "School info saved." };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to save school info.",
        };
    }
}

export async function updateSchoolPasswordAction(
    schoolId: string,
    form:
        | { removeCredential: true }
        | { newPassword: string; confirmPassword: string },
): Promise<{ success: boolean; message: string }> {
    if (!schoolId) {
        return { success: false, message: "Missing school." };
    }

    try {
        const schoolsController = await createSchoolsAction();

        if ("removeCredential" in form) {
            await schoolsController.updateSchoolPassword(schoolId, null);
            revalidatePath("/dashboard");
            revalidatePath("/dashboard/schools");
            revalidatePath(`/dashboard/schools/${schoolId}`);
            return { success: true, message: "Stored password removed." };
        }

        const { newPassword, confirmPassword } = form;
        if (newPassword.length < 8) {
            return {
                success: false,
                message: "New password must be at least 8 characters.",
            };
        }
        if (newPassword !== confirmPassword) {
            return { success: false, message: "Passwords do not match." };
        }

        if (newPassword.length > SCHOOL_PASSWORD_MAX) {
            return {
                success: false,
                message: `Password must be at most ${SCHOOL_PASSWORD_MAX} characters.`,
            };
        }

        await schoolsController.updateSchoolPassword(schoolId, newPassword);
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/schools");
        revalidatePath(`/dashboard/schools/${schoolId}`);
        return { success: true, message: "Password updated." };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to update school password.",
        };
    }
}

export async function createSchoolAction(form: {
    name: string;
    schoolCode: string;
    site: string;
    username?: string;
    password?: string;
    secret?: string;
    apiKey?: string;
}): Promise<{ success: boolean; message: string; schoolId?: string }> {
    const name = form.name.trim();
    const schoolCode = form.schoolCode.trim();
    const site = form.site.trim();
    const usernameRaw = form.username?.trim() ?? "";
    const passwordRaw = form.password ?? "";
    const secretRaw = (form.secret ?? "").trim();
    const apiKeyRaw = (form.apiKey ?? "").trim();
    const secret = secretRaw === "" ? null : secretRaw;
    const apiKey = apiKeyRaw === "" ? null : apiKeyRaw;

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
    if (passwordRaw.length > SCHOOL_PASSWORD_MAX) {
        return {
            success: false,
            message: `Password must be at most ${SCHOOL_PASSWORD_MAX} characters.`,
        };
    }
    if (secret !== null && secret.length > SCHOOL_SECRET_MAX) {
        return {
            success: false,
            message: `Secret must be at most ${SCHOOL_SECRET_MAX} characters.`,
        };
    }
    if (apiKey !== null && apiKey.length > SCHOOL_API_KEY_MAX) {
        return {
            success: false,
            message: `API key must be at most ${SCHOOL_API_KEY_MAX} characters.`,
        };
    }

    const username = usernameRaw === "" ? null : usernameRaw;
    const password =
        passwordRaw === "" ? null : passwordRaw;

    try {
        const schoolsController = await createSchoolsAction();
        const school = await schoolsController.createSchool({
            name,
            schoolCode,
            site,
            username,
            password,
            secret,
            apiKey,
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
