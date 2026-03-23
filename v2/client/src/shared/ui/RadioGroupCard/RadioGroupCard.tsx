import * as React from "react";
import { cn } from "../../lib/clsx.ts";
import { motion } from "framer-motion";

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
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {options.map((option) => {
        const isActive = value === option.id;
        
        return (
          <motion.div
            key={option.id}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.id)}
            className={cn(
              "group relative cursor-pointer rounded-3xl border-2 p-8 transition-all duration-300",
              isActive 
                ? "border-[var(--primary)] shadow-xl shadow-[rgba(255,122,0,0.1)]" 
                : "border-gray-50 bg-white hover:border-[rgba(255,122,0,0.2)] hover:shadow-lg hover:shadow-gray-200/50"
            )}
          >
            <div className="flex flex-col gap-6">
              {option.icon && (
                <div className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 shadow-sm",
                  isActive 
                    ? "text-white" 
                    : "bg-gray-50 text-gray-400 group-hover:text-[var(--primary)]"
                )}
                style={{
                  backgroundColor: isActive ? 'var(--primary)' : undefined,
                }}>
                  {/* @ts-ignore */}
                  {React.isValidElement(option.icon) ? React.cloneElement(option.icon as any, { size: 32 }) : option.icon}
                </div>
              )}
              <div className="space-y-2">
                <h3 className={cn(
                  "text-xl font-black tracking-tight transition-colors",
                  "text-gray-900"
                )}>
                  {option.title}
                </h3>
                {option.description && (
                  <p className="text-sm font-medium leading-relaxed text-gray-500">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
            {isActive && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full shadow-lg"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  boxShadow: '0 4px 12px rgba(255, 122, 0, 0.3)' 
                }}
              >
                <div className="h-2.5 w-2.5 rounded-full bg-white" />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
