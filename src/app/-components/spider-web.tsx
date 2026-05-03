const cx = 600;
const cy = 500;
const rings = [80, 160, 240, 320, 400, 480];
const angles = Array.from({ length: 12 }, (_, i) => (i * 30 * Math.PI) / 180);

export function SpiderWeb() {
  return (
    <svg
      className="animate-web-drift pointer-events-none absolute inset-0 h-full w-full opacity-[0.032]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 1000"
    >
      {rings.map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} stroke="white" strokeWidth="0.8" fill="none" />
      ))}
      {angles.map((a, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={parseFloat((cx + Math.cos(a) * 520).toFixed(4))}
          y2={parseFloat((cy + Math.sin(a) * 520).toFixed(4))}
          stroke="white"
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}
