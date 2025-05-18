export function ChartLine({
  path,
  fillPath,
}: {
  path: string;
  fillPath: string;
}) {
  return (
    <>
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF5403" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FF5403" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill="url(#chartGradient)" stroke="none" />
      <path
        d={path}
        fill="none"
        stroke="#FF5403"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </>
  );
}
