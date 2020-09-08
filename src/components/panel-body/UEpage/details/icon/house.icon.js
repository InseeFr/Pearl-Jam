import React from 'react';

const Icon = ({ width = 131, height = 131, color = '#0F417A' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} viewBox="-0.5 -0.5 131 131">
    <defs />
    <g>
      <rect x="0" y="0" width="130" height="130" fill="none" stroke="none" pointerEvents="all" />
      <path
        d="M 10.92 130 L 10.92 67.56 L 5.7 67.56 C 1.7 67.41 0 63.17 2.34 60.25 L 60.26 3.15 C 64.11 0 65.71 0.31 69.1 2.81 L 95.68 28.54 L 95.68 12.88 C 95.68 11.13 97.12 9.03 99.54 9.03 L 111.2 9.03 C 113.12 9.03 114.95 10.59 114.95 12.98 L 114.95 48.08 L 127.3 60.2 C 130 63.4 127.64 67.56 123.91 67.56 L 118.8 67.56 L 118.8 130 L 78.34 130 L 78.34 83.17 L 51.37 83.17 L 51.37 130 Z"
        fill={color}
        stroke="none"
        pointerEvents="all"
      />
    </g>
  </svg>
);

export default Icon;
