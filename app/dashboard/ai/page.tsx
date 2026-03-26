import { AiConsole } from "@/components/organisms/ai-console";

export default function AiPage() {
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
          credits_spent, user_prompt, prompt_title, result, timestamps.
        </p>
      </header>
      <AiConsole />
    </div>
  );
}
