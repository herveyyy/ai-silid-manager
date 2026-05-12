"use server";

import { createAiModelsAction } from "@/app/actions";
import type { AiModelMutationInput } from "@/lib/types/admin-types";
import { revalidatePath } from "next/cache";

function normalizeAiModelInput(
    data: AiModelMutationInput,
): AiModelMutationInput | null {
    const name = data.name.trim();
    const description = data.description?.trim() || null;
    const status = data.status.trim().toLowerCase();
    const inCostValue = data.inCostValue?.trim() || null;
    const outCostValue = data.outCostValue?.trim() || null;

    if (!name || !status) {
        return null;
    }

    return {
        name,
        description,
        status,
        inCostValue,
        outCostValue,
    };
}

export async function createAiModelAction(
    data: AiModelMutationInput,
): Promise<{ success: boolean; message: string }> {
    const normalized = normalizeAiModelInput(data);

    if (!normalized) {
        return { success: false, message: "Name and status are required." };
    }

    try {
        const controller = await createAiModelsAction();
        await controller.createAiModel(normalized);
        revalidatePath("/dashboard/ai");
        return { success: true, message: "AI model created." };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to create AI model." };
    }
}

export async function updateAiModelAction(
    modelId: string,
    data: AiModelMutationInput,
): Promise<{ success: boolean; message: string }> {
    const normalized = normalizeAiModelInput(data);

    if (!modelId || !normalized) {
        return { success: false, message: "Invalid AI model values." };
    }

    try {
        const controller = await createAiModelsAction();
        const updated = await controller.updateAiModel(modelId, normalized);

        if (!updated) {
            return { success: false, message: "AI model not found." };
        }

        revalidatePath("/dashboard/ai");
        return { success: true, message: "AI model updated." };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to update AI model." };
    }
}
