import Link from "next/link";
import DiaryEntryLink from "@/components/DiaryEntryLink";

export default function Landing() {
  return (
    <main className="scene min-h-dvh flex flex-col" data-level="3">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="eyebrow anim-fade-up" style={{ animationDelay: "0.1s" }}>
          Alma Celeste · трансформационная игра
        </p>

        <h1
          className="font-display anim-fade-up mt-8 text-[13vw] leading-[0.95] sm:text-7xl md:text-8xl"
          style={{ animationDelay: "0.35s" }}
        >
          Матрица
          <br />
          <em className="italic font-light">Создателя</em>
        </h1>

        <div
          className="anim-fade-up mt-10 h-px w-24"
          style={{ background: "var(--line)", animationDelay: "0.6s" }}
        />

        <p
          className="anim-fade-up mt-10 max-w-md text-base leading-relaxed sm:text-lg"
          style={{ color: "var(--ink-dim)", animationDelay: "0.75s" }}
        >
          Это не игра о том, каким нужно стать.
          <br />
          Это путь к тому, кем ты уже являешься — под тем,
          что привык(ла) думать о себе.
        </p>

        <div className="anim-fade-up mt-14" style={{ animationDelay: "1s" }}>
          <Link href="/play" className="btn-quiet solid">
            Начать путешествие
          </Link>
        </div>

        <DiaryEntryLink />

        <p
          className="anim-fade-up mt-16 text-[10px] tracking-[0.18em] uppercase sm:text-xs sm:tracking-[0.25em]"
          style={{ color: "var(--ink-dim)", animationDelay: "1.2s" }}
        >
          Персонаж&nbsp;&nbsp;·&nbsp;&nbsp;Наблюдатель&nbsp;&nbsp;·&nbsp;&nbsp;Создатель&nbsp;&nbsp;·&nbsp;&nbsp;Поток
        </p>
      </div>

      <footer className="pb-8 text-center text-[11px] tracking-[0.3em] uppercase" style={{ color: "var(--ink-dim)" }}>
        ALMA CELESTE
      </footer>
    </main>
  );
}
