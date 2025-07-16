import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PriorityBadge = ({ priority, className }) => {
  const getPriorityConfig = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return { 
          variant: "danger", 
          label: "High", 
          icon: "ArrowUp",
          color: "text-red-600"
        };
      case "medium":
        return { 
          variant: "warning", 
          label: "Medium", 
          icon: "Minus",
          color: "text-amber-600"
        };
      case "low":
        return { 
          variant: "success", 
          label: "Low", 
          icon: "ArrowDown",
          color: "text-emerald-600"
        };
      default:
        return { 
          variant: "default", 
          label: priority || "Medium", 
          icon: "Minus",
          color: "text-gray-600"
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <Badge 
      variant={config.variant}
      className={cn("inline-flex items-center gap-1", className)}
    >
      <ApperIcon name={config.icon} className={cn("h-3 w-3", config.color)} />
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;