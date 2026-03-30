import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "School plans · Silid-AI for DepEd classrooms",
  description:
    "Silid-AI plans for teachers and learners: lesson planning, quizzes, slides, and a student hub to share class notes and review—aligned with DepEd classroom needs.",
};

const teacherPlans = [
  {
    title: "Lesson Planner",
    description:
      "Shape objectives, activities, and assessments in one flow so every period matches your learning goals and DepEd-friendly pacing.",
    tag: "PLAN",
  },
  {
    title: "Quiz generator",
    description:
      "Turn your lesson focus into checks for understanding—item types and difficulty you can tune before class.",
    tag: "ASSESS",
  },
  {
    title: "PowerPoint generator",
    description:
      "Draft slide decks from your outline or topic so you spend less time formatting and more time teaching.",
    tag: "PRESENT",
  },
] as const;

const studentPlans = [
  {
    title: "Student Hub",
    description:
      "One place for learners to share class notes with the group, read what classmates captured, and spin review flashcards from those same hub notes—so sharing and study stay connected to the lesson.",
    tag: "HUB",
  },
] as const;

export default function SchoolPlansPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="theme-grid pointer-events-none absolute inset-0 opacity-[0.85]" />
      <div className="pointer-events-none absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
        SILID-AI // SCHOOL PLANS
      </div>
      <div className="pointer-events-none absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
        DEPED-READY // WORKFLOWS
      </div>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16 lg:px-10 lg:py-20">
        <header className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-(--muted)">
            SILID-AI · SCHOOL PLANS
          </p>
          <h1 className="mt-4 text-3xl font-bold uppercase leading-tight tracking-[0.12em] sm:text-4xl lg:text-5xl">
            Plans built for
            <br />
            <span className="text-(--accent)">DepEd classrooms</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl font-mono text-[13px] leading-7 text-(--muted)">
            Silid-AI splits cleanly between what teachers need to prepare and
            deliver, and what students need to capture, share, and remember—so
            your school can adopt AI without losing structure. On the student
            side, everything runs through the hub: post notes, see peers&apos;
            notes, then review with flashcards built from that shared material.
          </p>
        </header>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <section className="space-y-6">
            <div className="border-b pb-4" style={{ borderColor: "var(--border-strong)" }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-(--muted)">
                For teachers
              </p>
              <h2 className="mt-2 text-2xl font-bold uppercase tracking-[0.1em] text-foreground">
                Prepare & present
              </h2>
              <p className="mt-2 font-mono text-[12px] leading-6 text-(--muted)">
                From weekly planning to formative checks and visuals at the
                board—tools that respect how you already plan under DepEd
                guidance.
              </p>
            </div>
            <ul className="space-y-4">
              {teacherPlans.map((item) => (
                <li
                  key={item.title}
                  className="theme-panel-strong border p-5 transition-colors"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-(--accent)">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold uppercase tracking-[0.08em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-mono text-[11px] leading-6 text-(--muted)">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <div className="border-b pb-4" style={{ borderColor: "var(--border-strong)" }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-(--muted)">
                For students
              </p>
              <h2 className="mt-2 text-2xl font-bold uppercase tracking-[0.1em] text-foreground">
                Capture & review
              </h2>
              <p className="mt-2 font-mono text-[12px] leading-6 text-(--muted)">
                The Student Hub is where notes live: students share there first,
                then use that shared pool when they want flashcards or quick
                review—no duplicate “notes app” beside the hub.
              </p>
            </div>
            <ul className="space-y-4">
              {studentPlans.map((item) => (
                <li
                  key={item.title}
                  className="theme-panel-strong border p-5 transition-colors"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-(--success)">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold uppercase tracking-[0.08em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-mono text-[11px] leading-6 text-(--muted)">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="theme-panel theme-inset-shadow mx-auto mt-16 max-w-3xl border px-6 py-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
            NEXT STEP
          </p>
          <p className="mt-3 font-mono text-[12px] leading-6 text-(--muted-strong)">
            Administrators configure Silid-AI access per school. Teachers and
            students sign in through your school&apos;s Silid workspace.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center">
            <Link
              href="/"
              className="theme-button inline-flex w-full items-center justify-center border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] transition-colors sm:w-auto"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
