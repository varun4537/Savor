'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

export interface SoftCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'hover' | 'active';
}

export function SoftCard({
    children,
    className,
    variant = 'default',
    ...props
}: SoftCardProps) {
    return (
        <div
            className={cn(
                // Base soft card styling
                "bg-white rounded-3xl transition-all",
                // Soft shadow (not glassmorphism)
                "shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
                "border border-gray-100",
                // Variants
                variant === 'hover' && "hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
                variant === 'active' && 'shadow-[0_4px_16px_rgba(0,0,0,0.08)] scale-[0.99]',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
