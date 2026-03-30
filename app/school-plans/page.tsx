import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "School plans · Silid-AI Lite & Pro",
  description:
    "Silid-AI Lite & Pro for schools—pricing, apps, and alignment with DepEd AI guidelines (DO 003, s. 2026). Data not used to train models.",
};

const CONTRACT_MONTHS = 12;
const OVERAGE_PER_1M = 150;

const tiers = [
  {
    id: "lite",
    productName: "Silid-AI Lite",
    monthlyPeso: 15_000,
    tokensPerMonth: "150 million",
    summary:
      "Full Silid-AI app suite for schools that want a cost-efficient tier with solid everyday performance.",
  },
  {
    id: "pro",
    productName: "Silid-AI Pro",
    monthlyPeso: 30_000,
    tokensPerMonth: "300 million",
    summary:
      "Same apps as Lite, with a higher-capability engine and double the included monthly token pool for heavier use.",
  },
] as const;

/**
 * Order-of-magnitude illustrations only (token length per task varies).
 * Helps principals / ICT compare ceilings without quoting “prompt counts.”
 */
const usagePerspectiveRows = [
  {
    label: "Full lesson plans",
    lite: "~30,000",
    pro: "~60,000",
    hint: "If each plan uses ~5k tokens end-to-end.",
  },
  {
    label: "Student work reviewed (essays, outputs)",
    lite: "~15,000",
    pro: "~30,000",
    hint: "Roughly ~10k tokens per piece reviewed.",
  },
  {
    label: "Presentation / slide outlines",
    lite: "~15,000",
    pro: "~30,000",
    hint: "If each deck outline uses ~10k tokens.",
  },
  {
    label: "Short hub or chat-style turns",
    lite: "~300,000",
    pro: "~600,000",
    hint: "Many small questions with modest context.",
  },
] as const;

const teacherApps = [
  {
    name: "Lesson Planner",
    blurb:
      "Objectives, activities, and assessments in one flow—DepEd-friendly pacing.",
  },
  {
    name: "Quiz generator",
    blurb:
      "Checks for understanding from your lesson focus; tune item types and difficulty.",
  },
  {
    name: "PowerPoint generator",
    blurb:
      "Slide decks from your outline or topic—less formatting, more teaching.",
  },
] as const;

const studentApps = [
  {
    name: "Student Hub",
    blurb:
      "Share class notes, read what classmates captured, build flashcards from the same hub—one place for notes and review.",
  },
] as const;

export default function SchoolPlansPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="theme-grid pointer-events-none absolute inset-0 opacity-[0.85]" />
      <div className="pointer-events-none absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
        SILID-AI // LITE · PRO
      </div>
      <div className="pointer-events-none absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
        PRICE · APPS · DEPED
      </div>

      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 lg:px-10 lg:py-20">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-(--muted)">
            Silid-AI · school plans
          </p>
          <h1 className="mt-4 text-3xl font-bold uppercase leading-tight tracking-[0.12em] sm:text-4xl">
            Lite or Pro.
            <br />
            <span className="text-(--accent)">Same apps. Your data protected.</span>
          </h1>
          <p className="mx-auto mt-4 font-mono text-[12px] leading-6 text-(--muted)">
            Choose a monthly tier per school. Both include the same Silid-AI
            tools for teachers and students; Pro doubles the included monthly
            token pool and uses a higher-capability processing tier behind the
            scenes.
          </p>
        </header>

        {/* —— 1 · PRICE —— */}
        <section
          className="mt-16 scroll-mt-8"
          aria-labelledby="section-price"
          id="price"
        >
          <div className="flex items-baseline gap-3 border-b pb-3" style={{ borderColor: "var(--border-strong)" }}>
            <span className="font-mono text-[10px] font-bold text-(--accent)">01</span>
            <h2
              id="section-price"
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground"
            >
              Price · per school
            </h2>
          </div>
          <p className="mt-3 font-mono text-[12px] leading-6 text-(--muted)">
            {CONTRACT_MONTHS}-month minimum contract for either tier. Monthly fee
            is fixed for the term unless your signed order states otherwise.
            If you exceed your tier&apos;s monthly token pool, overage is{" "}
            <span className="text-(--muted-strong)">
              ₱{OVERAGE_PER_1M.toLocaleString("en-PH")} per 1 million tokens
            </span>{" "}
            until the next billing cycle resets the allowance. Figures below are
            illustrative—actual usage depends on how long each lesson, quiz, or
            hub interaction runs.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="theme-panel-strong flex flex-col border p-6 sm:p-7"
                style={{ borderColor: "var(--border-strong)" }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--muted)">
                  {tier.id === "pro" ? "Professional" : "Standard"}
                </p>
                <h3 className="mt-2 text-xl font-bold uppercase tracking-wide text-foreground">
                  {tier.productName}
                </h3>
                <p className="mt-1 font-mono text-4xl font-bold tabular-nums text-(--accent)">
                  ₱{tier.monthlyPeso.toLocaleString("en-PH")}
                  <span className="text-sm font-semibold uppercase tracking-wider text-(--muted)">
                    {" "}
                    / month
                  </span>
                </p>
                <p className="mt-4 font-mono text-[11px] leading-relaxed text-(--muted)">
                  {tier.summary}
                </p>
                <dl className="mt-6 space-y-3 border-t pt-5 font-mono text-[11px]" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <dt className="text-(--muted-strong)">Included AI usage / month</dt>
                    <dd className="mt-1 text-foreground">
                      {tier.tokensPerMonth} tokens per school (shared across
                      teachers and students on Silid-AI)
                    </dd>
                  </div>
                  <div>
                    <dt className="text-(--muted-strong)">Over limit</dt>
                    <dd className="mt-1 text-foreground">
                      ₱{OVERAGE_PER_1M.toLocaleString("en-PH")} per 1M tokens
                    </dd>
                  </div>
                  <div>
                    <dt className="text-(--muted-strong)">Contract</dt>
                    <dd className="mt-1 text-foreground">
                      {CONTRACT_MONTHS} months (one-year agreement)
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <div
            className="theme-panel-strong mt-10 border p-6 sm:p-7"
            style={{ borderColor: "var(--border-strong)" }}
          >
            <div className="border-b pb-4" style={{ borderColor: "var(--border)" }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--accent)">
                Perspective for schools
              </p>
              <h3 className="mt-2 text-sm font-bold uppercase tracking-wide text-foreground">
                What the monthly token pool can represent
              </h3>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-(--muted)">
                Token budgets are easier to judge when translated into familiar
                workloads. These are{" "}
                <span className="text-(--muted-strong)">rough ceilings</span>{" "}
                if you spent the whole pool on one kind of task—real schools mix
                everything below, so you usually stay well inside the allowance.
              </p>
            </div>

            <div className="mt-5 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[520px] border-collapse text-left font-mono text-[11px]">
                <thead>
                  <tr
                    className="border-b"
                    style={{ borderColor: "var(--border-strong)" }}
                  >
                    <th className="py-3 pr-4 font-semibold uppercase tracking-wide text-(--muted)">
                      Kind of work
                    </th>
                    <th className="py-3 pr-4 font-semibold uppercase tracking-wide text-(--muted)">
                      Silid-AI Lite
                      <span className="mt-0.5 block text-[9px] font-normal normal-case tracking-normal text-(--muted)">
                        150M tokens / mo
                      </span>
                    </th>
                    <th className="py-3 font-semibold uppercase tracking-wide text-(--muted)">
                      Silid-AI Pro
                      <span className="mt-0.5 block text-[9px] font-normal normal-case tracking-normal text-(--muted)">
                        300M tokens / mo
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usagePerspectiveRows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="py-3 pr-4 align-top text-foreground">
                        <span className="font-medium">{row.label}</span>
                        <span className="mt-1 block text-[10px] font-normal normal-case leading-snug text-(--muted)">
                          {row.hint}
                        </span>
                      </td>
                      <td className="py-3 pr-4 align-top tabular-nums text-(--muted-strong)">
                        {row.lite}
                      </td>
                      <td className="py-3 align-top tabular-nums text-(--muted-strong)">
                        {row.pro}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="mt-4 space-y-4 md:hidden">
              {usagePerspectiveRows.map((row) => (
                <li
                  key={row.label}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <p className="font-medium text-foreground">{row.label}</p>
                  <p className="mt-1 text-[10px] leading-snug text-(--muted)">
                    {row.hint}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-(--muted-strong)">
                    Lite: {row.lite} · Pro: {row.pro}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-5 border-t pt-4 font-mono text-[10px] leading-relaxed text-(--muted)" style={{ borderColor: "var(--border)" }}>
              For a typical Philippine private school (dozens of teachers,
              hundreds of learners), staying under 150M tokens/month is usually
              comfortable; very large or highly automated programs may prefer Pro
              or predictable overage at ₱{OVERAGE_PER_1M.toLocaleString("en-PH")}{" "}
              per additional million tokens.
            </p>
          </div>
        </section>

        {/* —— 2 · PRIVACY —— */}
        <section
          className="mt-16 scroll-mt-8"
          aria-labelledby="section-privacy"
          id="privacy"
        >
          <div className="flex items-baseline gap-3 border-b pb-3" style={{ borderColor: "var(--border-strong)" }}>
            <span className="font-mono text-[10px] font-bold text-(--accent)">02</span>
            <h2
              id="section-privacy"
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground"
            >
              Data &amp; training
            </h2>
          </div>
          <div
            className="theme-panel-strong mt-6 border p-6 sm:p-7"
            style={{ borderColor: "var(--border-strong)" }}
          >
            <p className="font-mono text-[13px] font-semibold uppercase tracking-wide text-foreground">
              Your school&apos;s data is not used to train AI models
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 font-mono text-[11px] leading-relaxed text-(--muted)">
              <li>
                Content you submit through Silid-AI (lessons, quizzes, slides,
                hub notes, etc.) is processed so your school gets answers and
                outputs—it is{" "}
                <span className="text-(--muted-strong)">
                  not used to train public or shared foundation models
                </span>{" "}
                for general improvement.
              </li>
              <li>
                Technical specifications of the inference stack behind Lite and
                Pro are not listed on this public page; your institution can
                request detailed documentation under contract or NDA where
                appropriate.
              </li>
              <li>
                Use of Silid-AI remains subject to your school&apos;s agreement
                and applicable law, including provisions that align with
                no-training and data-handling commitments from our providers
                where available.
              </li>
            </ul>
          </div>
        </section>

        {/* —— 3 · APPS —— */}
        <section
          className="mt-16 scroll-mt-8"
          aria-labelledby="section-apps"
          id="apps"
        >
          <div className="flex items-baseline gap-3 border-b pb-3" style={{ borderColor: "var(--border-strong)" }}>
            <span className="font-mono text-[10px] font-bold text-(--accent)">03</span>
            <h2
              id="section-apps"
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground"
            >
              Apps included · both tiers
            </h2>
          </div>
          <p className="mt-3 max-w-2xl font-mono text-[12px] leading-6 text-(--muted)">
            Silid-AI Lite and Silid-AI Pro include the same applications. The
            difference is monthly token allowance and processing tier (Lite vs
            Pro)—not which features you can open.
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="border-b pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)" style={{ borderColor: "var(--border)" }}>
                Teacher apps
              </h3>
              <ul className="mt-4 space-y-3">
                {teacherApps.map((app) => (
                  <li
                    key={app.name}
                    className="theme-panel-strong border p-4"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <p className="font-semibold uppercase tracking-wide text-foreground">
                      {app.name}
                    </p>
                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-(--muted)">
                      {app.blurb}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="border-b pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)" style={{ borderColor: "var(--border)" }}>
                Student apps
              </h3>
              <ul className="mt-4 space-y-3">
                {studentApps.map((app) => (
                  <li
                    key={app.name}
                    className="theme-panel-strong border p-4"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <p className="font-semibold uppercase tracking-wide text-foreground">
                      {app.name}
                    </p>
                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-(--muted)">
                      {app.blurb}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* —— 4 · DEPED AI GUIDELINES (PUBLIC CONTEXT) —— */}
        <section
          className="mt-16 scroll-mt-8"
          aria-labelledby="section-deped"
          id="deped"
        >
          <div className="flex items-baseline gap-3 border-b pb-3" style={{ borderColor: "var(--border-strong)" }}>
            <span className="font-mono text-[10px] font-bold text-(--accent)">04</span>
            <h2
              id="section-deped"
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground"
            >
              DepEd &amp; AI in public schools
            </h2>
          </div>
          <p className="mt-3 max-w-3xl font-mono text-[12px] leading-6 text-(--muted)">
            The Department of Education has moved to allow responsible use of
            artificial intelligence in public schools under national guidelines.
            The summary below is for orientation only—your division and legal
            counsel should rely on the{" "}
            <span className="text-(--muted-strong)">
              official Department Order and issuances
            </span>
            .
          </p>

          <div
            className="theme-panel-strong mt-6 border p-6 sm:p-7"
            style={{ borderColor: "var(--border-strong)" }}
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-foreground">
              Department Order No. 003, series of 2026
            </p>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-(--muted)">
              Reported as the{" "}
              <span className="text-(--muted-strong)">
                Foundational Guidelines on Artificial Intelligence (AI) in Basic
                Education
              </span>
              , issued{" "}
              <span className="text-(--muted-strong)">20 February 2026</span>.
              DepEd stated that AI may be used as a{" "}
              <span className="text-(--muted-strong)">support tool</span> for
              learning and teaching—not to replace the essential role of
              teachers in evaluating learners. Human judgment stays{" "}
              <span className="text-(--muted-strong)">paramount</span>.
            </p>

            <h3 className="mt-6 border-t pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)" style={{ borderColor: "var(--border)" }}>
              What the framework emphasizes
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-2 font-mono text-[11px] leading-relaxed text-(--muted)">
              <li>
                Teaching and non-teaching personnel and learners may explore new
                tools where use aligns with{" "}
                <span className="text-(--muted-strong)">
                  ethical, pedagogical, and human-centered standards
                </span>{" "}
                and user safety.
              </li>
              <li>
                AI should function strictly as an{" "}
                <span className="text-(--muted-strong)">auxiliary</span> tool—for
                example improving instructional materials, grammar and citation
                checks in research, data analysis support, and developing
                assessments—subject to{" "}
                <span className="text-(--muted-strong)">
                  teacher supervision, validation, and judgment
                </span>
                .
              </li>
              <li>
                Uses such as grading, admissions, scholarships, and disciplinary
                decisions are treated as{" "}
                <span className="text-(--muted-strong)">high-risk</span> and are
                only allowed with strict safeguards and human oversight.
              </li>
              <li>
                Interactions like administrative chatbots, grammar assistance,
                or IT automation are described as lower-risk categories when used
                appropriately.
              </li>
              <li>
                Learners are expected to{" "}
                <span className="text-(--muted-strong)">disclose</span> how they
                used AI and to submit{" "}
                <span className="text-(--muted-strong)">citations</span> alongside
                outputs—for brainstorming, writing, research, presentations,
                and homework support—so use can be integrated into learning.
              </li>
            </ul>

            <h3 className="mt-6 border-t pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)" style={{ borderColor: "var(--border)" }}>
              Prohibited or inappropriate uses (per reporting)
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-2 font-mono text-[11px] leading-relaxed text-(--muted)">
              <li>
                AI that poses significant risk to rights, safety, or well-being—
                including reported bans on certain biometric / emotion systems,
                manipulative chatbots aimed at minors, social scoring, and
                indiscriminate facial-image scraping.
              </li>
              <li>
                Using AI as a full substitute for human participation and
                decision-making, as a sole source of truth, or in ways that
                undermine learner privacy and safety.
              </li>
            </ul>

            <h3 className="mt-6 border-t pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)" style={{ borderColor: "var(--border)" }}>
              Broader DepEd AI effort
            </h3>
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-(--muted)">
              DepEd has also highlighted{" "}
              <span className="text-(--muted-strong)">Project AGAP.AI</span>{" "}
              (Accelerating Governance and Adaptive Pedagogy through Artificial
              Intelligence) to build AI literacy. Reporting has cited funded
              training outreach on the order of{" "}
              <span className="text-(--muted-strong)">
                at least 1.05 million learners
              </span>
              ,{" "}
              <span className="text-(--muted-strong)">300,000 teachers</span>, and{" "}
              <span className="text-(--muted-strong)">150,000 parents</span>,
              with partners including the ASEAN Foundation and Google.org—confirm
              figures in DepEd&apos;s own releases.
            </p>

            <figure className="mt-6 border-t pt-5 font-mono text-[10px] leading-relaxed text-(--muted)" style={{ borderColor: "var(--border)" }}>
              <blockquote className="border-l-2 pl-3 italic text-(--muted-strong)" style={{ borderLeftColor: "var(--accent)" }}>
                &ldquo;May ethical use of AI. Tapos hindi naman natin
                ipagbabawal ang AI.&rdquo; — Education Secretary Juan Edgardo
                &lsquo;Sonny&rsquo; Angara, on AI as support in public schools,
                as quoted in reporting on the guidelines.
              </blockquote>
              <figcaption className="mt-3 text-(--muted)">
                Context summarized from news coverage (e.g.{" "}
                <cite className="not-italic text-(--muted-strong)">
                  Philippine News Agency
                </cite>
                , 25 February 2026, Rolando Ng III). Silid-AI is not affiliated
                with DepEd or PNA; always verify against the official DepEd order
                and annexes.
              </figcaption>
            </figure>
          </div>
        </section>

        <div className="theme-panel theme-inset-shadow mx-auto mt-16 border px-6 py-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
            Next step
          </p>
          <p className="mt-3 font-mono text-[12px] leading-6 text-(--muted-strong)">
            Your school admin chooses Lite or Pro, enables Silid-AI, and shares
            the sign-in link with staff and students.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/"
              className="theme-button inline-flex w-full items-center justify-center border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] transition-colors sm:w-auto"
            >
              Back to home
            </Link>
            <a
              href="#price"
              className="theme-button-secondary inline-flex w-full items-center justify-center border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] transition-colors sm:w-auto"
            >
              Jump to price
            </a>
            <a
              href="#privacy"
              className="theme-button-secondary inline-flex w-full items-center justify-center border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] transition-colors sm:w-auto"
            >
              Data &amp; training
            </a>
            <a
              href="#deped"
              className="theme-button-secondary inline-flex w-full items-center justify-center border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] transition-colors sm:w-auto"
            >
              DepEd context
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
