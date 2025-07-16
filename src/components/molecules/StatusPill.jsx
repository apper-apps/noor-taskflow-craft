import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const StatusPill = ({ status, className }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "todo":
      case "to do":
        return { variant: "default", label: "To Do" };
      case "in progress":
      case "inprogress":
        return { variant: "info", label: "In Progress" };
      case "done":
      case "completed":
        return { variant: "success", label: "Done" };
      case "active":
        return { variant: "success", label: "Active" };
      case "planning":
        return { variant: "warning", label: "Planning" };
      case "on hold":
      case "onhold":
        return { variant: "warning", label: "On Hold" };
      case "cancelled":
        return { variant: "danger", label: "Cancelled" };
      default:
        return { variant: "default", label: status || "Unknown" };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant}
      className={cn("capitalize", className)}
    >
      {config.label}
    </Badge>
  );
};

export default StatusPill;