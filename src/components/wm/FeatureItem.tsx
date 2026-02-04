import { type ReactNode } from 'react';

interface FeatureItemProps {
  icon: ReactNode;
  label: string;
  color?: 'blue' | 'gold' | 'coral';
}

const colorStyles = {
  blue: {
    bg: 'from-wm-blue-50 to-wm-blue-100',
    border: 'border-wm-blue-200/60',
    icon: 'text-wm-blue-500',
    glow: 'group-hover:shadow-[0_0_20px_rgba(108,182,232,0.3)]',
  },
  gold: {
    bg: 'from-wm-gold-50 to-wm-gold-100',
    border: 'border-wm-gold-200/60',
    icon: 'text-wm-gold-500',
    glow: 'group-hover:shadow-[0_0_20px_rgba(242,192,120,0.3)]',
  },
  coral: {
    bg: 'from-rose-50 to-rose-100',
    border: 'border-rose-200/60',
    icon: 'text-wm-coral-500',
    glow: 'group-hover:shadow-[0_0_20px_rgba(232,136,124,0.3)]',
  },
};

export function FeatureItem({ icon, label, color = 'blue' }: FeatureItemProps) {
  const styles = colorStyles[color];

  return (
    <div className="flex items-center gap-3.5 group">
      <div className={`
        w-12 h-12 
        rounded-full 
        bg-gradient-to-br ${styles.bg}
        border ${styles.border}
        flex items-center justify-center
        transition-shadow duration-300
        ${styles.glow}
      `}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <span className="font-medium text-wm-navy-900">{label}</span>
    </div>
  );
}
