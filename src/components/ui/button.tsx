import React from 'react';

import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-accent-deep to-accent-gold text-white hover:from-accent-gold-hover hover:to-accent-gold shadow-[var(--shadow-card)]',
  secondary:
    'bg-text-primary text-white hover:bg-text-secondary shadow-sm',
  outline:
    'border border-border-default text-text-primary hover:border-accent-deep hover:text-accent-gold hover:bg-surface-dim bg-transparent',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-surface-dim bg-transparent',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
  icon: 'p-2 rounded-md flex items-center justify-center aspect-square',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  asChild = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </Comp>
  );
}
