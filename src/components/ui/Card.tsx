import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'outline';
}

const Card = ({ children, className, variant = 'default', ...props }: CardProps) => {
  const variants = {
    default: 'bg-card text-card-foreground shadow-sm',
    glass: 'glass-dark border-white/5',
    outline: 'border border-border bg-transparent',
  };

  return (
    <div
      className={cn(
        'rounded-3xl p-6 transition-all duration-300',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
