import { createAiModelsController, createAiPromptsController } from "@/app/actions";
import { AiConsole } from "@/components/organisms/ai-console";
import type { AiConsoleProps } from "@/components/organisms/ai-console";

const AiConsoleClient = AiConsole as (props: AiConsoleProps) => React.JSX.Element;

export default async function AiPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; offset?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  function parsePositiveInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  function parseNonNegativeInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  }

  const page = parsePositiveInt(resolvedSearchParams.page, 1);
  const limit = parsePositiveInt(resolvedSearchParams.limit, 10);
  const offset = parseNonNegativeInt(resolvedSearchParams.offset, 0);
  const aiPromptsController = await createAiPromptsController();
  const aiModelsController = await createAiModelsController();
  const [promptLogs, paginatedPromptLogs, aiModels] = await Promise.all([
    aiPromptsController.getAIPrompts(),
    aiPromptsController.getPaginatedAIPrompts(page, offset, limit),
    aiModelsController.getAiModels(),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--muted)">
          Module · AI
        </p>
        <h1 className="mt-1 text-2xl font-bold uppercase tracking-[0.12em] text-foreground">
          Prompt usage & models
        </h1>
        <p className="mt-2 max-w-2xl font-mono text-[12px] leading-relaxed text-(--muted)">
          Mirrors `prompt`: feat_type, status, ai_model_name, token_ai_value,
          credits_spent, user_prompt, prompt_title, result, timestamps, plus
          `ai_models` management.
        </p>
      </header>
      <AiConsoleClient
        promptLogs={promptLogs}
        paginatedPromptLogs={paginatedPromptLogs}
        aiModels={aiModels}
      />
    </div>
  );
}
