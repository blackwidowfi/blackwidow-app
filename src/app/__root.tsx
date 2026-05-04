import "#/lib/translation/config";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { HeadContent, Link, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import en from "#/lib/translation/locales/en";
import { useI18n } from "#/lib/translation/useI18n";
import { Button } from "#/lib/ui/button";

import Footer from "./-components/footer";
import Header from "./-components/header";
import PostHogProvider from "./-integrations/posthog/provider";
import SolanaProvider from "./-integrations/solana/provider";
import TanStackQueryDevtools from "./-integrations/tanstack-query/devtools";

import appCss from "./styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: en.common.titles.site,
      },
      {
        name: "description",
        content: en.common.descriptions.site,
      },
      {
        name: "keywords",
        content: en.common.meta.keywords,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: en.common.titles.site,
      },
      {
        property: "og:description",
        content: en.common.descriptions.site_short,
      },
      {
        property: "og:site_name",
        content: en.common.meta.og_site_name,
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: en.common.titles.site,
      },
      {
        name: "twitter:description",
        content: en.common.descriptions.site_short,
      },
      {
        name: "robots",
        content: "index, follow",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "canonical",
        href: "https://blackwidow.fi",
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function NotFound() {
  const { t } = useI18n(["common", "form"]);

  return (
    <main className="bg-background text-foreground relative flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="pointer-events-none fixed -top-32 -left-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,oklch(0.88_0.23_155/0.07),transparent_70%)]" />
      <div className="pointer-events-none fixed -right-24 -bottom-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,oklch(0.88_0.23_155/0.04),transparent_70%)]" />

      <div className="relative mb-8 opacity-60">
        <img src="/images/logos/blackwidow-logo.png" alt="BlackWidow" width={64} height={64} />
      </div>

      <p className="text-primary mb-4 font-mono text-[0.68rem] font-medium tracking-[0.18em] uppercase">
        {t("common:not_found.kicker")}
      </p>

      <h1 className="font-display mb-4 text-4xl font-bold text-white sm:text-5xl">
        {t("common:titles.not_found")}
      </h1>
      <p className="text-muted-foreground mx-auto mb-10 max-w-sm text-sm leading-7">
        {t("common:descriptions.not_found")}
      </p>

      <Button variant="outline" size="lg" asChild>
        <Link to="/">{t("form:actions.back_to_home")}</Link>
      </Button>
    </main>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className="selection:bg-primary/20 font-sans wrap-anywhere antialiased">
        <PostHogProvider>
          <SolanaProvider>
            <Header />
            {children}
            <Footer />
            <TanStackDevtools
              config={{
                position: "bottom-right",
              }}
              plugins={[
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
          </SolanaProvider>
        </PostHogProvider>
        <Scripts />
      </body>
    </html>
  );
}
