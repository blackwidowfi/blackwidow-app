import { useI18n } from "#/lib/translation/useI18n";
import { Badge } from "#/lib/ui/badge";
import { Card } from "#/lib/ui/card";

export function SolanaSection() {
  const { t } = useI18n("common");
  const stats = t("solana.stats", { returnObjects: true });
  const protocols = t("solana.protocols", { returnObjects: true });

  return (
    <section id="solana" className="bg-sidebar py-20 md:py-28">
      <div className="container text-center">
        <p className="text-primary mb-4 font-mono text-[0.68rem] font-medium tracking-[0.18em] uppercase">
          {t("solana.kicker")}
        </p>
        <h2 className="font-display mb-4 text-4xl font-bold text-white sm:text-5xl">
          {t("solana.heading")}
        </h2>
        <p className="text-muted-foreground mx-auto mb-12 max-w-xl text-sm leading-7">
          {t("solana.body")}
        </p>

        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          {stats.map(({ value, label }) => (
            <Card
              key={label}
              className="bg-card border-border hover:border-ring gap-0 rounded-2xl border p-6 text-center transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5"
            >
              <p className="text-foreground font-mono text-3xl font-medium tabular-nums">{value}</p>
              <p className="text-muted-foreground mt-1 text-xs">{label}</p>
            </Card>
          ))}
        </div>

        <p className="text-muted-foreground mb-4 font-mono text-xs tracking-widest uppercase">
          {t("solana.protocols_label")}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {protocols.map((protocol) => (
            <Badge key={protocol} variant="outline">
              {protocol}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
