import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: "default" | "dark" | "frosted" | "glowing";
}

export function GlassCard({
    children,
    className,
    variant = "default",
    ...props
}: GlassCardProps) {
    return (
        <div
            className={cn(
                // Base glassmorphism
                "rounded-[var(--radius-card)] border backdrop-blur-xl transition-all",
                // iOS touch fix
                "touch-action-manipulation",
                // Variants with enhanced glass effects
                variant === "default" &&
                "bg-white/50 border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
                variant === "frosted" &&
                "bg-white/70 border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-2xl",
                variant === "dark" &&
                "bg-black/10 border-white/20 backdrop-blur-md",
                variant === "glowing" &&
                "bg-white/40 border-primary/20 shadow-[0_0_30px_rgba(224,122,61,0.15)]",
                className
            )}
            style={{ WebkitBackdropFilter: 'blur(20px)' }}
            {...props}
        >
            {children}
        </div>
    );
}
