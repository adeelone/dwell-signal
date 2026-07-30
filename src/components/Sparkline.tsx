export function Sparkline({
  values,
  color = "#087f83",
  label,
}: {
  values: number[];
  color?: string;
  label: string;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 36 - ((value - min) / Math.max(1, max - min)) * 30;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg className="sparkline" viewBox="0 0 100 40" role="img" aria-label={label}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
