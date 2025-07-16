import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  variant = "default",
  hover = false,
  children,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg transition-all duration-200";
  
  const variants = {
    default: "shadow-card border border-gray-200",
    elevated: "shadow-elevated border border-gray-200",
    glass: "backdrop-blur-sm bg-white/80 border border-white/20",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-card border border-gray-200",
  };

  const hoverStyles = hover ? "hover:shadow-card-hover hover:scale-[1.02] cursor-pointer" : "";

  return (
    <div
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;