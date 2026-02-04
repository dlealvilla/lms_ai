import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'coral' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-wm-blue-500/90 to-wm-blue-500 
    text-white font-medium
    shadow-wm-elev1
    hover:shadow-wm-glow-blue hover:-translate-y-0.5
  `,
  secondary: `
    bg-gradient-to-r from-wm-gold-400/90 to-wm-gold-400 
    text-white font-medium
    shadow-wm-elev1
    hover:shadow-wm-glow-gold hover:-translate-y-0.5
  `,
  coral: `
    bg-gradient-to-r from-wm-coral-500/90 to-wm-coral-500 
    text-white font-medium
    shadow-wm-elev1
    hover:shadow-wm-glow-coral hover:-translate-y-0.5
  `,
  ghost: `
    bg-transparent
    text-wm-navy-900 font-medium
    border border-wm-border
    hover:bg-wm-blue-50 hover:border-wm-blue-200
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-small',
  md: 'h-11 px-6 text-body',
  lg: 'h-14 px-8 text-body',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-wm-md
          transition-all duration-200 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
