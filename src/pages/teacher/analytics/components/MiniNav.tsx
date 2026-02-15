import { cn } from '@/lib/utils';

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'breakdown', label: 'Breakdown' },
  { id: 'prompt-analysis', label: 'Prompts' },
];

interface MiniNavProps {
  className?: string;
}

export function MiniNav({ className }: MiniNavProps) {
  return (
    <nav
      className={cn(
        'fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block',
        className
      )}
    >
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-sm">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="block px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="block px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              ↑ Top
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
