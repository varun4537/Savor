import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export function H1({ children, className, ...props }: TypographyProps) {
    return (
        <h1 className={cn("font-heading text-3xl font-bold text-text-heading", className)} {...props}>
            {children}
        </h1>
    );
}

export function H2({ children, className, ...props }: TypographyProps) {
    return (
        <h2 className={cn("font-heading text-2xl font-semibold text-text-heading", className)} {...props}>
            {children}
        </h2>
    );
}

export function Text({ children, className, ...props }: TypographyProps) {
    return (
        <p className={cn("font-body text-base text-text-primary leading-relaxed", className)} {...props}>
            {children}
        </p>
    );
}

export function Caption({ children, className, ...props }: TypographyProps) {
    return (
        <p className={cn("font-body text-sm text-text-secondary", className)} {...props}>
            {children}
        </p>
    );
}
