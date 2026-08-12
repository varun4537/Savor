'use client';

import { cn } from '@/lib/utils';

interface CircularProgressProps {
    value: number; // 0-100
    size?: 'sm' | 'md' | 'lg';
    strokeWidth?: number;
    color?: 'primary' | 'secondary' | 'pink' | 'blue' | 'yellow' | 'gradient';
    children?: React.ReactNode;
    className?: string;
}

export function CircularProgress({
    value,
    size = 'md',
    strokeWidth,
    color = 'gradient', // Default to gradient for calorie ring
    children,
    className
}: CircularProgressProps) {
    const sizes = {
        sm: { diameter: 60, defaultStroke: 6 },
        md: { diameter: 120, defaultStroke: 10 },
        lg: { diameter: 180, defaultStroke: 14 }
    };

    const { diameter, defaultStroke } = sizes[size];
    const stroke = strokeWidth || defaultStroke;
    const radius = (diameter - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    // Generate gradient ID unique to this instance
    const gradientId = `progress-gradient-${Math.random().toString(36).substr(2, 9)}`;

    // Dynamic color based on percentage (for 'gradient' mode)
    const getGradientColors = () => {
        if (value <= 50) {
            // Green zone: 0-50%
            return { start: '#10B981', end: '#34D399' }; // Emerald
        } else if (value <= 80) {
            // Yellow zone: 50-80%
            return { start: '#F59E0B', end: '#FBBF24' }; // Amber
        } else if (value <= 100) {
            // Orange zone: 80-100%
            return { start: '#F97316', end: '#FB923C' }; // Orange
        } else {
            // Red zone: Over 100%
            return { start: '#EF4444', end: '#F87171' }; // Red
        }
    };

    const colors = {
        primary: 'stroke-primary',
        secondary: 'stroke-secondary',
        pink: 'stroke-[#F5C6CB]',
        blue: 'stroke-[#B4D4E8]',
        yellow: 'stroke-[#FFE5B4]',
        gradient: '' // Handled by SVG gradient
    };

    const gradientColors = getGradientColors();

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: diameter, height: diameter }}>
            <svg
                width={diameter}
                height={diameter}
                className="transform -rotate-90"
            >
                {/* Define gradient for dynamic coloring */}
                {color === 'gradient' && (
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={gradientColors.start} />
                            <stop offset="100%" stopColor={gradientColors.end} />
                        </linearGradient>
                    </defs>
                )}

                {/* Background circle - thicker for visual weight */}
                <circle
                    cx={diameter / 2}
                    cy={diameter / 2}
                    r={radius}
                    fill="none"
                    stroke="#E9ECEF"
                    strokeWidth={stroke}
                />

                {/* Progress circle with gradient or solid color */}
                <circle
                    cx={diameter / 2}
                    cy={diameter / 2}
                    r={radius}
                    fill="none"
                    stroke={color === 'gradient' ? `url(#${gradientId})` : undefined}
                    className={cn(
                        color !== 'gradient' && colors[color],
                        'transition-all duration-700 ease-out'
                    )}
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{
                        filter: value > 0 ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none'
                    }}
                />
            </svg>

            {/* Content in center */}
            {children && (
                <div className="absolute inset-0 flex items-center justify-center">
                    {children}
                </div>
            )}
        </div>
    );
}
