import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className, 
  children,
  variant = "default",
  size = "md",
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "block w-full rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white";
  
  const variants = {
    default: "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
    filled: "bg-gray-50 border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500",
    outlined: "border-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const errorStyles = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";

  return (
    <select
      className={cn(baseStyles, variants[variant], sizes[size], errorStyles, className)}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;