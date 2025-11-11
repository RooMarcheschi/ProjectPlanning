import { useState, useEffect } from "react";

const CircularProgress = ({ percentage, strokeColor }) => {
  const [progress, setProgress] = useState(0);

  const strokeWidth = 10;
  const size = 100;
  const duration = 500;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const stepTime = 10;
    const totalSteps = duration / stepTime;
    const increment = percentage / totalSteps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= percentage) {
        start = percentage;
        clearInterval(interval);
      }
      setProgress(start);
    }, stepTime);

    return () => clearInterval(interval);
  }, [percentage, duration]);

  return (
    <div className="flex justify-center items-center mr-6">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />

        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.25}
          fontWeight="600"
          fill="#1f2937"
          transform="rotate(90, 50, 50)"         >
          {Math.round(progress)}%
        </text>
      </svg>
    </div>
  );
};

export default CircularProgress;