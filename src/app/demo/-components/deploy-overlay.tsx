import type { Translate } from "#/lib/translation/getI18n";
import { useI18n } from "#/lib/translation/useI18n";
import { cn } from "#/lib/ui/utils";

import { ALLOCATION_STEPS, type AllocationStep } from "../-utils/entities";

interface DeployOverlayProps {
  visible: boolean;
  step: AllocationStep;
}

const CX = 600;
const CY = 500;
const SPOKE_LEN = 520;
const n = (v: number) => v.toFixed(4);

const RING_POLYGONS = [80, 160, 240, 320, 400, 480].map((r) => {
  const pts = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    return `${n(CX + r * Math.cos(a))},${n(CY + r * Math.sin(a))}`;
  }).join(" ");
  return { r, pts };
});

const SPOKE_LINES = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180;
  return { i, x2: n(CX + SPOKE_LEN * Math.cos(a)), y2: n(CY + SPOKE_LEN * Math.sin(a)) };
});

function OverlayWeb() {
  return (
    <svg
      viewBox="0 0 1200 1000"
      className="animate-web-drift pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
      aria-hidden
    >
      {RING_POLYGONS.map(({ r, pts }) => (
        <polygon
          key={r}
          points={pts}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          className="text-primary"
        />
      ))}
      {SPOKE_LINES.map(({ i, x2, y2 }) => (
        <line
          key={i}
          x1={CX}
          y1={CY}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="0.6"
          className="text-primary"
        />
      ))}
    </svg>
  );
}

const getSteps = (t: Translate) =>
  [t("demo.overlay_step_0"), t("demo.overlay_step_1"), t("demo.overlay_step_2")] as const;

export function DeployOverlay({ visible, step }: DeployOverlayProps) {
  const { t } = useI18n("common");

  return (
    <div
      className={cn(
        "bg-background/95 fixed inset-0 z-50 backdrop-blur-sm transition-opacity duration-500",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-live="polite"
      aria-label={t("demo.overlay_title")}
    >
      <OverlayWeb />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6">
        <img
          src="/images/logos/blackwidow-logo.png"
          alt="Blackwidow"
          width={64}
          height={64}
          className="animate-pulse-dot"
        />

        <p className="text-primary font-mono text-sm font-medium tracking-[0.18em] uppercase">
          {t("demo.overlay_title")}
        </p>

        <div className="flex flex-col items-center gap-2">
          {getSteps(t).map((label, i) => (
            <p
              key={i}
              className={cn(
                "font-mono text-xs transition-all duration-300",
                i === step && "animate-fade-up text-white",
                i < step && "text-primary/50",
                i > step && "text-white/20",
              )}
            >
              {label}
            </p>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {Object.values(ALLOCATION_STEPS).map((s) => (
            <span
              key={s}
              className="bg-primary animate-pulse-dot size-1.5 rounded-full"
              style={{ animationDelay: `${s * 0.3}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
