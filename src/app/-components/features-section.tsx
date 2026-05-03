import {
  Activity,
  Bot,
  KeyRound,
  LogOut,
  ShieldAlert,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { useI18n } from "#/lib/translation/useI18n";
import { Card } from "#/lib/ui/card";

const ICONS: readonly LucideIcon[] = [
  ShieldAlert,
  LogOut,
  TrendingUp,
  Activity,
  Bot,
  KeyRound,
] as const;

export function FeaturesSection() {
  const { t } = useI18n("common");
  const items = t("features.items", { returnObjects: true });

  return (
    <section id="features" className="bg-sidebar py-20 md:py-28">
      <div className="container">
        <div className="mb-12 text-center">
          <p className="text-primary mb-3 font-mono text-[0.68rem] font-medium tracking-[0.18em] uppercase">
            {t("features.kicker")}
          </p>
          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
            {t("features.heading")}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, desc }, i) => {
            const Icon = ICONS[i];
            return (
              <Card
                key={title}
                className="bg-card border-border hover:border-ring animate-fade-up gap-0 rounded-2xl border p-6 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 60}ms` }}
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
