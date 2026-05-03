import { useI18n } from "#/lib/translation/useI18n";
import { Badge } from "#/lib/ui/badge";
import { Button } from "#/lib/ui/button";

import { SpiderWeb } from "./spider-web";

export function HeroSection() {
  const { t } = useI18n(["common", "form"]);

  return (
    <section className="bg-background relative min-h-svh overflow-hidden">
      <SpiderWeb />
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,oklch(0.88_0.23_155/0.06),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,oklch(0.88_0.23_155/0.04),transparent_70%)]" />

      <div className="relative z-10 container flex min-h-svh flex-col items-center justify-center py-24 text-center">
        <div className="animate-fade-up mb-8">
          <Badge className="bg-primary/20 border-ring/35 text-primary inline-flex items-center gap-2 rounded border font-mono text-[0.65rem] tracking-widest">
            <span className="animate-pulse-dot bg-primary size-1.5 shrink-0 rounded-full shadow-[0_0_5px_oklch(0.9395_0.2231_120.04/0.2)]" />
            {t("common:hero.badge")}
          </Badge>
        </div>

        <h1 className="font-display animate-fade-up mb-6 text-5xl leading-[1.06] font-bold tracking-tight text-white delay-80 sm:text-6xl lg:text-7xl">
          {t("common:hero.headline_1")}
          <br />
          <span className="from-accent-foreground to-muted-foreground bg-linear-to-br via-white bg-clip-text text-transparent">
            {t("common:hero.headline_2")}
          </span>
        </h1>

        <p className="animate-fade-up text-muted-foreground mx-auto mb-10 max-w-xl text-base leading-7 delay-160 sm:text-lg">
          {t("common:hero.body")}
        </p>

        <div className="animate-fade-up flex flex-wrap items-center justify-center gap-4 delay-240">
          <Button size="lg" className="hover:-translate-y-0.5" asChild>
            <a href="#waitlist" className="no-underline">
              {t("form:actions.launch_app")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
