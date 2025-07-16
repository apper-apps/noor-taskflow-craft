import React from "react";
import { cn } from "@/utils/cn";

const Avatar = React.forwardRef(({ 
  className, 
  size = "md",
  name,
  src,
  ...props 
}, ref) => {
  const baseStyles = "rounded-full flex items-center justify-center font-medium text-white bg-gradient-to-br from-indigo-500 to-purple-600";
  
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        className={cn(baseStyles, sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(baseStyles, sizes[size], className)}
      ref={ref}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;