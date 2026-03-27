"use server";

import { createSchoolsController } from "@/app/actions";
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
