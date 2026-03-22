import * as React from "react";
import { cn } from "../../lib/clsx.ts";

interface RadioGroupCardProps {
  value: string;
  onChange: (value: string) => void;
  options: {
    id: string;
    title: string;
    description?: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}

export const RadioGroupCard: React.FC<RadioGroupCardProps> = ({
  value,
  onChange,
  options,
  className
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {options.map((option) => {
        const isActive = value === option.id;
        
        return (
          <div
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/30",
              isActive 
                ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600" 
                : "border-gray-100 bg-white"
            )}
          >
            <div className="flex flex-col gap-4">
              {option.icon && (
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                  isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                )}>
                  {option.icon}
                </div>
              )}
              <div>
                <h3 className={cn(
                  "text-lg font-bold transition-colors",
                  isActive ? "text-blue-900" : "text-gray-900"
                )}>
                  {option.title}
                </h3>
                {option.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
            {isActive && (
              <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
