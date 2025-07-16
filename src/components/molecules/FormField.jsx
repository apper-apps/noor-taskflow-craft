import React from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  type = "text", 
  required = false, 
  error, 
  children,
  className,
  ...props 
}) => {
  const id = props.id || props.name;

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      
      {type === "select" ? (
        <Select id={id} error={!!error} {...props}>
          {children}
        </Select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          className={cn(
            "block w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-indigo-500 focus:ring-indigo-500 placeholder:text-gray-400 resize-none",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
          {...props}
        />
      ) : (
        <Input id={id} type={type} error={!!error} {...props} />
      )}
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;