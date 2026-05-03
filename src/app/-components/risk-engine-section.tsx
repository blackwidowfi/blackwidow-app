import { useI18n } from "#/lib/translation/useI18n";

const TERMINAL_STATUSES = ["green", "green", "yellow", "green", "green"] as const;

const DOT_CLASSES = {
  green: "bg-primary shadow-[0_0_5px_oklch(0.9395_0.2231_120.04/0.2)]",
  yellow: "bg-[oklch(0.79_0.15_85)] shadow-[0_0_5px_oklch(0.79_0.15_85/0.4)]",
  red: "bg-[oklch(0.59_0.19_25)] shadow-[0_0_5px_oklch(0.59_0.19_25/0.4)]",
} as const;

export function RiskEngineSection() {
  const { t } = useI18n("common");
  const signals = t("risk_engine.signals", { returnObjects: true });
  const rows = t("risk_engine.rows", { returnObjects: true });

  return (
    <section id="risk-engine" className="bg-background py-20 md:py-28">
      <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-primary mb-4 font-mono text-[0.68rem] font-medium tracking-[0.18em] uppercase">
            {t("risk_engine.kicker")}
          </p>
          <h2 className="font-display mb-5 text-3xl font-bold text-white sm:text-4xl">
            {t("risk_engine.heading_1")}
            <br />
            {t("risk_engine.heading_2")}
          </h2>
          <p className="text-muted-foreground mb-8 text-sm leading-7">{t("risk_engine.body")}</p>
          <ul className="space-y-3">
            {signals.map((signal) => (
              <li key={signal} className="text-foreground flex items-center gap-3 text-sm">
                <span
                  className={`animate-pulse-dot size-1.5 shrink-0 rounded-full ${DOT_CLASSES.green}`}
                />
                {signal}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-ring/35 text-primary/50 rounded-xl border bg-neutral-950 p-5 font-mono text-xs">
          <div className="border-border mb-4 flex items-center gap-2 border-b pb-3">
            <span className={`size-1.5 shrink-0 rounded-full ${DOT_CLASSES.red}`} />
            <span className={`size-1.5 shrink-0 rounded-full ${DOT_CLASSES.yellow}`} />
            <span className={`size-1.5 shrink-0 rounded-full ${DOT_CLASSES.green}`} />
            <span className="text-muted-foreground/50 ml-3 text-xs">
              {t("risk_engine.terminal_title")}
            </span>
          </div>
          {rows.map(({ label, value, time }, i) => {
            const status = TERMINAL_STATUSES[i];
            return (
              <div
                key={label}
                className="border-primary/20 flex items-center gap-3 border-b py-1.5 last:border-0"
              >
                <span className={`size-1.5 shrink-0 rounded-full ${DOT_CLASSES[status]}`} />
                <span className="min-w-37.5 text-white/50">{label}</span>
                <span className={status === "green" ? "text-foreground" : "text-muted-foreground"}>
                  {value}
                </span>
                <span className="ml-auto text-white/25">{time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
