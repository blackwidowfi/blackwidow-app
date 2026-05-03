import { useI18n } from "#/lib/translation/useI18n";
import { Button } from "#/lib/ui/button";

export function WaitlistSection() {
  const { t } = useI18n(["common", "form"]);

  return (
    <section id="waitlist" className="bg-background py-20 md:py-28">
      <div className="container text-center">
        <p className="text-primary mb-4 font-mono text-[0.68rem] font-medium tracking-[0.18em] uppercase">
          {t("common:waitlist.kicker")}
        </p>
        <h2 className="font-display mb-4 text-4xl font-bold text-white sm:text-5xl">
          {t("common:waitlist.heading")}
        </h2>
        <p className="text-muted-foreground mx-auto mb-10 max-w-lg text-sm leading-7">
          {t("common:waitlist.body")}
        </p>

        <Button
          size="lg"
          className="px-12 py-6 text-base shadow-[0_0_36px_oklch(0.9395_0.2231_120.04/0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_0_52px_oklch(0.9395_0.2231_120.04/0.4)]"
          asChild
        >
          <a href={`mailto:${t("form:labels.waitlist_email")}`} className="no-underline">
            {t("form:actions.join_waitlist")}
          </a>
        </Button>

        <p className="text-muted-foreground/40 mt-6 font-mono text-xs">
          {t("common:waitlist.note")}
        </p>
      </div>
    </section>
  );
}
