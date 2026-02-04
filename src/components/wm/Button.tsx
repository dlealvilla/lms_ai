import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const baseStyles = `
  inline-flex items-center justify-center gap-2
  font-medium rounded-wm-btn
  transition-all duration-200 ease-out
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
`;

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-b from-wm-blue-400 to-wm-blue-500
    text-white
    shadow-wm-md
    hover:shadow-glow-blue hover:-translate-y-0.5
    focus-visible:ring-wm-blue-500
    active:translate-y-0 active:shadow-wm-sm
  `,
  secondary: `
    bg-gradient-to-b from-wm-gold-300 to-wm-gold-400
    text-white
    shadow-wm-md
    hover:shadow-glow-gold hover:-translate-y-0.5
    focus-visible:ring-wm-gold-400
    active:translate-y-0 active:shadow-wm-sm
  `,
  ghost: `
    bg-white/60 backdrop-blur-sm
    text-wm-navy-900
    border border-wm-border
    hover:bg-white hover:border-wm-blue-200 hover:shadow-wm-sm
    focus-visible:ring-wm-blue-500
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-small',
  md: 'h-11 px-6 text-body',
  lg: 'h-14 px-8 text-body',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className = '', children, disabled, ...props }, ref) => {
    const classes = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className,
    ].join(' ').replace(/\s+/g, ' ').trim();

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={classes}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
