import React from "react";
import { cn } from "@/utils/cn";

const ProgressRing = ({ 
  progress = 0, 
  size = "md",
  showLabel = true,
  className 
}) => {
  const sizes = {
    sm: { width: 40, height: 40, strokeWidth: 3, fontSize: "text-xs" },
    md: { width: 60, height: 60, strokeWidth: 4, fontSize: "text-sm" },
    lg: { width: 80, height: 80, strokeWidth: 5, fontSize: "text-base" },
  };

  const config = sizes[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={config.width}
        height={config.height}
        className="transform -rotate-90"
      >
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={config.strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      
      {showLabel && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center font-semibold text-gray-900",
          config.fontSize
        )}>
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default ProgressRing;