export type PieChartData = { label: string; value: number; color: string };

type Props = {
  data: PieChartData[];
};

export default function PieChart({ data }: Readonly<Props>) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 120;
  const cx = 200;
  const cy = 200;

  let currentAngle = -90;

  const slices = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = radius + 50;
    const labelX = cx + labelRadius * Math.cos((midAngle * Math.PI) / 180);
    const labelY = cy + labelRadius * Math.sin((midAngle * Math.PI) / 180);

    const lineRadius = radius + 10;
    const lineX = cx + lineRadius * Math.cos((midAngle * Math.PI) / 180);
    const lineY = cy + lineRadius * Math.sin((midAngle * Math.PI) / 180);

    currentAngle = endAngle;

    return { path, labelX, labelY, lineX, lineY, ...item };
  });

  return (
    <svg width="1000px" height="400px" viewBox="0 0 400 400">
      {slices.map(slice => (
        <g key={slice.label}>
          <path d={slice.path} fill={slice.color} stroke="#E8EBF0" strokeWidth="2" />
          <line
            x1={slice.lineX}
            y1={slice.lineY}
            x2={slice.labelX}
            y2={slice.labelY}
            stroke="#666"
            strokeWidth="1.5"
          />
          <text
            x={slice.labelX}
            y={slice.labelY}
            textAnchor={slice.labelX > cx ? 'start' : 'end'}
            dominantBaseline="middle"
            style={{
              fontSize: '12px',
              fontFamily: 'Arial, sans-serif',
              fill: '#333',
              fontWeight: '500',
            }}
          >
            {slice.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
