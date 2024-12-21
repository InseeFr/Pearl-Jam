import { useEffect, useRef, useState } from 'react';
import { Typography } from '../Typography';

/**
 * Convert an angle into a tuple representing x, y
 */
const angleToPoint = (angle: number, radius = 1) => {
  return [Math.cos(angle) * radius, Math.sin(angle) * radius];
};

const sliceToPath = (slice: { start: number; end: number }, radius: number) => {
  const isLargeArc = slice.end - slice.start > Math.PI;
  const startPoint = angleToPoint(slice.start, radius)
    .map(v => v.toFixed(2))
    .join(' ');
  const endPoint = angleToPoint(slice.end, radius)
    .map(v => v.toFixed(2))
    .join(' ');
  return `M 0 0 L ${startPoint} A ${radius} ${radius} 0 ${
    isLargeArc ? '1' : '0'
  } 1 ${endPoint} L 0 0`;
};

/**
 * Helper to place the text correctly, choose between 3 value starting with negative one
 */
const selectAlignment = (
  value: number,
  options: [number | string, number | string, number | string]
) => {
  const middle = 0.7;
  if (value < middle && value > middle * -1) {
    return options[1];
  }
  return value < 0 ? options[0] : options[2];
};

interface PieChartProps {
  parts: { label: string; value: number; color: string }[];
  size: number;
  paddingInline: number;
  paddingBlock: number;
}

export function PieChart({
  parts,
  size,
  paddingInline = 0,
  paddingBlock = 0,
}: Readonly<PieChartProps>) {
  const radius = size / 2;
  let angle = Math.PI / -2;
  /** @type {{start: number, end: number}} */
  const pieSlices = parts.map(part => {
    const start = angle;
    const end = start + part.value * 2 * Math.PI;
    angle = end;
    return { start, end };
  });
  const lineEndings = pieSlices.map(slice =>
    angleToPoint(slice.end, radius).map(v => v.toFixed(2))
  );

  return (
    <div>
      <svg
        viewBox={`${radius * -1 - paddingInline} ${radius * -1 - paddingBlock} ${
          size + 2 * paddingInline
        } ${size + 2 * paddingBlock}`}
        style={{ width: size + 5 * paddingInline, height: size + 1.5 * paddingBlock }}
      >
        <g mask="url(#pieMask)">
          {parts.map((part, k) =>
            part.value === 1 ? (
              <circle fill={part.color} x={0} y={0} r={radius} key="soloValue" />
            ) : (
              <path key={k} fill={part.color} d={sliceToPath(pieSlices[k], radius)} />
            )
          )}
        </g>
        <mask id="pieMask">
          <rect fill="white" x={radius * -1} y={radius * -1} width={size} height={size}></rect>
          {lineEndings.map(([x, y], k) => (
            <line
              key={k}
              stroke="#000"
              strokeWidth="5"
              x1={x * 0.005}
              y1={y * 0.005}
              x2={x}
              y2={y}
              strokeLinecap="round"
            />
          ))}
        </mask>
        {parts.map((part, k) => (
          <PieChartLabel key={k} slice={pieSlices[k]} radius={radius} label={part.label} />
        ))}
      </svg>
    </div>
  );
}

/**
 * Generate a label (point, line and text) as a svg group element
 */

interface PieChartLabelProps {
  slice: { start: number; end: number };
  radius: number;
  label: string;
}
function PieChartLabel({ slice, radius, label }: Readonly<PieChartLabelProps>) {
  const [textSize, setTextSize] = useState([0, 0]);
  const textRef = useRef<HTMLDivElement>(null);
  const endPoint = angleToPoint(slice.start + (slice.end - slice.start) * 0.5, radius);
  const inside = 0.85;
  const outside = 1.1;
  const text = 1.11;
  const textAlign = selectAlignment(endPoint[0] / radius, ['right', 'center', 'left']);
  const translateX = selectAlignment(endPoint[0] / radius, [
    -1 * textSize[0],
    textSize[0] * -0.5,
    0,
  ]);
  const translateY = selectAlignment(endPoint[1] / radius, [
    -1 * textSize[1],
    textSize[1] * -0.5,
    0,
  ]);

  useEffect(() => {
    if (textRef.current) {
      setTextSize([textRef.current.offsetWidth, textRef.current.offsetHeight]);
    }
  }, []);

  return (
    <g>
      <circle cx={endPoint[0] * inside} cy={endPoint[1] * inside} r="3" />
      <path
        d={`M ${endPoint.map(v => v * inside).join(' ')} L ${endPoint
          .map(v => v * outside)
          .join(' ')}`}
        stroke="#000"
        strokeWidth="1"
      />
      {/* Use foreign object to get text wrapping */}
      <foreignObject
        x={endPoint[0] * text}
        y={endPoint[1] * text}
        width="160"
        height="100%"
        style={{ transform: `translate(${translateX}px, ${translateY}px)` }}
      >
        <div>
          <Typography
            variant="xs"
            color="textTertiary"
            as="div"
            textAlign={textAlign}
            ref={textRef}
          >
            {label}
          </Typography>
        </div>
      </foreignObject>
    </g>
  );
}
