import React from 'react';

interface EnvelopeLogoProps {
  className?: string;
  size?: number;
  color?: string; // Hex code or tailwind color
}

export const EnvelopeLogo: React.FC<EnvelopeLogoProps> = ({
  className = '',
  size = 48,
  color = 'currentColor'
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300`}
    >
      {/* Background shape wrapper for depth (optional, keeping it flat minimalist as requested) */}
      <g id="envelope-with-document">
        {/* The Open Envelope Flap / Back Panel */}
        <path
          d="M10 40 L60 15 L110 40"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* The Emerging Document (Sheet of paper sliding up) */}
        <rect
          x="30"
          y="25"
          width="60"
          height="65"
          rx="5"
          fill="white"
          stroke={color}
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Lines/Detail on the emerging document */}
        <line
          x1="42"
          y1="38"
          x2="78"
          y2="38"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Bold "@" Symbol on the central page */}
        <text
          x="60"
          y="72"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="800"
          fontSize="30"
          fill={color}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ userSelect: 'none' }}
        >
          @
        </text>

        {/* Envelope Front Overlay (V-Shape pockets) */}
        {/* Bottom pocket cover */}
        <path
          d="M10 40 L10 100 A6 6 0 0 0 16 106 L104 106 A6 6 0 0 0 110 100 L110 40"
          fill="rgba(240, 240, 240, 0.9)"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Diagonal folder lines meeting in center to form the front overlap fold */}
        <path
          d="M10 40 L60 75 L110 40"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
};
