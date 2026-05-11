import { Link, useLocation } from "@tanstack/react-router";

import type { Translate } from "#/lib/translation/getI18n";
import { useI18n } from "#/lib/translation/useI18n";
import { Button } from "#/lib/ui/button";
import { cn } from "#/lib/ui/utils";

import { WalletButton } from "./wallet-button";

const getAnchorLinks = (t: Translate) => [
  { href: "/#how-it-works", label: t("common:nav.how_it_works") },
  { href: "/#features", label: t("common:nav.features") },
  { href: "/#solana", label: t("common:nav.solana") },
];

const navLinkClass = cn(
  "text-muted-foreground duration-160ms relative no-underline transition-colors",
  "after:absolute after:inset-x-0 after:-bottom-1.5 after:h-[1.5px] after:origin-left after:scale-x-0 after:transition-transform after:duration-160",
  "after:from-primary after:to-ring after:bg-linear-to-r",
  "hover:text-foreground hover:after:scale-x-100",
  "data-active:text-foreground data-active:after:scale-x-100",
);

export default function Header() {
  const { t } = useI18n(["common", "form"]);
  const anchorLinks = getAnchorLinks(t);
  const { pathname } = useLocation();

  return (
    <header className="border-border bg-background/88 sticky top-0 z-50 border-b backdrop-blur-lg">
      <nav className="container flex items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <Link to="/" className="inline-flex items-center gap-2.5 no-underline">
          <img
            src="/images/logos/blackwidow-logo.png"
            alt={t("titles.site_short")}
            width={26}
            height={26}
          />
          <span className="font-display text-foreground text-sm font-semibold tracking-tight">
            {t("common:nav.brand")}
          </span>
        </Link>

        <div className="ml-6 hidden items-center gap-6 text-sm font-medium md:flex">
          {anchorLinks.map((link) => (
            <a key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </a>
          ))}

          <Link to="/demo" className={navLinkClass} data-active={pathname === "/demo" || undefined}>
            {t("common:nav.demo")}
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <WalletButton />
          <Button size="sm" className="rounded px-4 text-xs" asChild>
            <a href="/#waitlist" className="no-underline">
              {t("form:actions.launch_app")}
            </a>
          </Button>
        </div>
      </nav>
    </header>
  );
}
