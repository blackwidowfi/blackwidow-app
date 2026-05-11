import { ShieldCheck, Wallet, Zap, type LucideIcon } from "lucide-react";

import { useI18n } from "#/lib/translation/useI18n";

const ICONS: readonly LucideIcon[] = [Wallet, Zap, ShieldCheck];

export function HowItWorksSection() {
  const { t } = useI18n("common");
  const steps = t("how_it_works.steps", { returnObjects: true });

  return (
    <section id="how-it-works" className="bg-background py-20 md:py-28">
      <div className="container">
        <div className="mb-14 text-center">
          <p className="text-primary mb-3 font-mono text-[0.68rem] font-medium tracking-[0.18em] uppercase">
            {t("how_it_works.kicker")}
          </p>
          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
            {t("how_it_works.heading")}
          </h2>
        </div>

        <div className="hidden items-start md:flex">
          {steps.map(({ title, desc }, i) => {
            const Icon = ICONS[i];
            return (
              <div key={title} className="contents">
                <div className="flex flex-1 flex-col items-center text-center">
                  <div className="border-border text-foreground mb-4 flex h-10 w-10 items-center justify-center rounded-full border font-mono text-sm tabular-nums">
                    {i + 1}
                  </div>
                  <div className="text-muted-foreground mb-4">
                    <Icon size={28} strokeWidth={1.25} />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{title}</h3>
                  <p className="text-muted-foreground max-w-50 text-sm leading-6">{desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="mx-2 mt-5 h-px flex-1 shrink-0 bg-[linear-gradient(90deg,var(--ring),transparent)]" />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-8 md:hidden">
          {steps.map(({ title, desc }, i) => {
            const Icon = ICONS[i];
            return (
              <div key={title} className="flex items-start gap-5">
                <div className="flex shrink-0 flex-col items-center">
                  <div className="border-border text-foreground flex h-9 w-9 items-center justify-center rounded-full border font-mono text-sm tabular-nums">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="mt-2 h-8 w-px bg-[linear-gradient(180deg,var(--ring),transparent)]"
                      style={{ minHeight: "calc(var(--spacing) * 8 + 2rem)" }}
                    />
                  )}
                </div>
                <div>
                  <div className="text-muted-foreground mb-2">
                    <Icon size={22} strokeWidth={1.25} />
                  </div>
                  <h3 className="mb-1 font-semibold text-white">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-6">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
