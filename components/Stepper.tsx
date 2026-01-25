'use client';

import { Step } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: Step;
  steps: { key: Step; label: string }[];
  onStepClick?: (step: Step) => void;
}

export function Stepper({ currentStep, steps, onStepClick }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = index < currentIndex;
          const isClickable = onStepClick && (isCompleted || index === currentIndex);

          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() => isClickable && onStepClick?.(step.key)}
                  disabled={!isClickable}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                    {
                      'bg-primary border-primary text-primary-foreground': isActive,
                      'bg-green-500 border-green-500 text-white': isCompleted,
                      'border-gray-300 dark:border-gray-600 bg-background': !isActive && !isCompleted,
                      'cursor-pointer hover:scale-110': isClickable,
                      'cursor-not-allowed opacity-50': !isClickable,
                    }
                  )}
                  aria-label={`Step ${index + 1}: ${step.label}`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </button>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center hidden sm:block',
                    {
                      'text-primary': isActive,
                      'text-gray-500 dark:text-gray-400': !isActive,
                    }
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2 transition-colors',
                    {
                      'bg-primary': index < currentIndex,
                      'bg-gray-300 dark:bg-gray-600': index >= currentIndex,
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
