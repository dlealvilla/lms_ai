import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gold';
}

export function Avatar({ src, alt, size = 'md', color = 'blue' }: AvatarProps) {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const colorStyles = {
    blue: 'from-wm-blue-500 to-wm-blue-600',
    gold: 'from-wm-gold-400 to-wm-gold-500',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeStyles[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`
      ${sizeStyles[size]} 
      rounded-full 
      bg-gradient-to-br ${colorStyles[color]}
      flex items-center justify-center
    `.trim().replace(/\s+/g, ' ')}>
      <User className={`${iconSizes[size]} text-white`} />
    </div>
  );
}
