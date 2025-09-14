
import React from 'react';

interface CircularProgressProps {
  percentage: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  const radius = 90;
  const strokeWidth = 20;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height="100%" width="100%" viewBox="0 0 200 200" className="transform -rotate-90">
      <defs>
        <linearGradient id="timerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8FBC8F" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
      </defs>
      <circle
        className="text-gray-300/50"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={normalizedRadius}
        cx={100}
        cy={100}
      />
      <circle
        stroke="url(#timerGradient)"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={normalizedRadius}
        cx={100}
        cy={100}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset,
          transition: 'stroke-dashoffset 0.35s',
        }}
      />
    </svg>
  );
};

export default CircularProgress;
