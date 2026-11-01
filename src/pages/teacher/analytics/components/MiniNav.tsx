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
      <div className="bg-[#F3F2EE]/90 backdrop-blur-sm border border-[#E8E6E1]/40 rounded-lg p-2 shadow-md">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="block px-3 py-2 text-xs font-medium text-ink-muted hover:text-ink hover:bg-[#F3F2EE] rounded transition-colors"
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
              className="block px-3 py-2 text-xs font-medium text-ink-subtle hover:text-ink-muted hover:bg-[#F3F2EE] rounded transition-colors"
            >
              ↑ Top
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
