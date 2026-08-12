import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, autoComplete = "off", ...props }, ref) => {
        return (
            <input
                type={type}
                autoComplete={autoComplete}
                className={cn(
                    "flex h-12 w-full rounded-[var(--radius-button)] border border-primary/20 bg-white/50 px-4 py-2 text-text-primary placeholder:text-text-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
