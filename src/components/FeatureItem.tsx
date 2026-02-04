import { type ReactNode } from 'react';

interface FeatureItemProps {
  icon: ReactNode;
  label: string;
  color?: 'blue' | 'gold';
}

export function FeatureItem({ icon, label, color = 'blue' }: FeatureItemProps) {
  const colorStyles = {
    blue: 'from-wm-blue-100 to-wm-blue-50 border-wm-blue-200/50 text-wm-blue-500',
    gold: 'from-wm-gold-100 to-wm-gold-50 border-wm-gold-200/50 text-wm-gold-500',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`
        w-12 h-12 
        rounded-full 
        bg-gradient-to-br ${colorStyles[color]}
        border
        flex items-center justify-center
        shadow-sm
      `.trim().replace(/\s+/g, ' ')}>
        {icon}
      </div>
      <span className="font-medium text-wm-navy-900">{label}</span>
    </div>
  );
}
