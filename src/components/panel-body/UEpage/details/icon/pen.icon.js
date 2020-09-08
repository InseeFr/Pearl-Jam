import React from 'react';

const Icon = ({ onClick, style, width = 131, color = '#0F417A' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width={width}
    viewBox="-0.5 -0.5 293 293"
    style={style}
    onClick={onClick}
    className={'edit-icon'}
  >
    <defs />
    <g>
      <rect
        x="43"
        y="104"
        width="220"
        height="70"
        fill={color}
        stroke="none"
        transform="rotate(-45,153,139)"
        pointerEvents="all"
      />
      <path
        d="M 18 214 L 68 249 L 18 284 Z"
        fill={color}
        stroke={color}
        strokeMiterlimit="10"
        transform="rotate(-225,43,249)"
        pointerEvents="all"
      />
      <rect
        x="241"
        y="1"
        width="30"
        height="70"
        fill={color}
        stroke="none"
        transform="rotate(-45,256,36)"
        pointerEvents="all"
      />
    </g>
  </svg>
);

export default Icon;
