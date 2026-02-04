import { Brain } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 px-6 py-8 border-t border-wm-border/50">
      <div className="max-w-container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-wm-btn bg-gradient-to-br from-wm-blue-400 to-wm-blue-600 flex items-center justify-center shadow-sm">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-small font-semibold text-wm-navy-900">
            <span className="text-wm-blue-500">Wildmind</span> Education
          </span>
        </a>

        {/* Copyright */}
        <p className="text-small text-wm-muted">
          © {new Date().getFullYear()} Wildmind Education. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
