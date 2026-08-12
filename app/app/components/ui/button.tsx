import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "glass" | "ghost";
    size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", onClick, ...props }, ref) => {
        // iOS fix: Use both onClick and onTouchEnd to ensure reliability
        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (onClick) {
                e.preventDefault();
                e.stopPropagation();
                onClick(e);
            }
        };

        const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
            if (onClick) {
                e.preventDefault();
                e.stopPropagation();
                // Convert TouchEvent to MouseEvent for onClick handler
                onClick(e as any);
            }
        };

        return (
            <button
                ref={ref}
                className={cn(
                    // Base styles with aggressive iOS fixes
                    "inline-flex items-center justify-center rounded-[var(--radius-button)] font-semibold",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "active:scale-95 cursor-pointer",
                    // iOS specific touch fixes
                    "touch-action-manipulation select-none",
                    "-webkit-tap-highlight-color-transparent",
                    "-webkit-user-select-none",
                    // Prevent 300ms delay on iOS
                    "transition-none",
                    // Variants with softer pastel styling
                    variant === "primary" && "bg-primary text-primary-text shadow-lg shadow-primary/20 hover:bg-primary-dark",
                    variant === "secondary" && "bg-secondary text-text-heading shadow-md shadow-secondary/20 hover:bg-secondary-dark",
                    variant === "glass" && "bg-white/50 text-text-heading border border-gray-200 shadow-md hover:bg-white/70",
                    variant === "ghost" && "bg-transparent text-text-primary hover:bg-gray-100",
                    // Sizes
                    size === "sm" && "h-9 px-4 text-sm min-h-[36px]",
                    size === "md" && "h-12 px-6 text-base min-h-[48px]",
                    size === "lg" && "h-14 px-8 text-lg min-h-[56px]",
                    size === "icon" && "h-12 w-12 min-h-[48px] min-w-[48px]",
                    className
                )}
                style={{
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                }}
                onClick={handleClick}
                onTouchEnd={handleTouchEnd}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
