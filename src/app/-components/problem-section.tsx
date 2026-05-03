import { AlertTriangle, Eye, ShieldOff, type LucideIcon } from "lucide-react";

import { useI18n } from "#/lib/translation/useI18n";
import { Card } from "#/lib/ui/card";

const ICONS: readonly LucideIcon[] = [AlertTriangle, Eye, ShieldOff];

export function ProblemSection() {
  const { t } = useI18n("common");
  const points = t("problem.points", { returnObjects: true });

  return (
    <section id="problem" className="bg-sidebar py-20 md:py-28">
      <div className="container">
        <div className="mb-12 text-center">
          <p className="text-primary mb-3 font-mono text-[0.68rem] font-medium tracking-[0.18em] uppercase">
            {t("problem.kicker")}
          </p>
          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
            {t("problem.heading")}
          </h2>
        </div>

        <div className="border-border bg-card mb-12 rounded-2xl border p-8 text-center">
          <span className="text-foreground font-mono text-[clamp(2.2rem,5vw,3.5rem)] font-medium tracking-tight">
            {t("problem.stat")}
          </span>
          <p className="text-muted-foreground mt-2 font-mono text-sm tabular-nums">
            {t("problem.stat_label")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {points.map(({ title, desc }, i) => {
            const Icon = ICONS[i];
            return (
              <Card
                key={title}
                className="bg-card border-border hover:border-ring animate-fade-up gap-0 rounded-2xl border p-6 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="text-muted-foreground mb-4">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <p className="text-muted-foreground text-sm leading-6">{desc}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
