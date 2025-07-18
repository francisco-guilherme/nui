import { cn } from "@nui/core";
import React from "react";

interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

interface StepProps {
  children: React.ReactNode;
  className?: string;
  stepNumber?: number;
}

export const Steps: React.FC<StepsProps> = ({ children, className }) => {
  return (
    <div className={cn("space-y-6", className)}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === Step) {
          return React.cloneElement(child as React.ReactElement<StepProps>, {
            ...((child.props as object) ?? {}),
            key: (child as React.ReactElement).key ?? `step-${index}`,
            // Pass the step number to the child
            stepNumber: index + 1,
          });
        }
        return child;
      })}
    </div>
  );
};

export const Step: React.FC<StepProps & { stepNumber?: number }> = ({
  children,
  className,
  stepNumber,
}) => {
  return (
    <div className={cn("relative flex gap-4", className)}>
      {/* Step number indicator */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm">
        {stepNumber}
      </div>

      {/* Step content */}
      <div className="flex-1 space-y-2">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};
