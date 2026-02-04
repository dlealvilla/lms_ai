import { Brain } from 'lucide-react';

export function Navbar() {
  return (
    <header className="relative z-20 px-6 py-5">
      <nav className="max-w-container mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="
            w-10 h-10 rounded-wm-btn 
            bg-gradient-to-br from-wm-blue-400 to-wm-blue-600 
            flex items-center justify-center 
            shadow-wm-md
            group-hover:shadow-glow-blue
            transition-shadow duration-300
          ">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-wm-navy-900 tracking-tight">
            <span className="text-wm-blue-500">Wildmind</span> Education
          </span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a 
            href="#features" 
            className="text-wm-muted hover:text-wm-navy-900 transition-colors text-small font-medium"
          >
            Features
          </a>
          <a 
            href="#preview" 
            className="text-wm-muted hover:text-wm-navy-900 transition-colors text-small font-medium"
          >
            Preview
          </a>
          <a 
            href="#about" 
            className="text-wm-muted hover:text-wm-navy-900 transition-colors text-small font-medium"
          >
            About
          </a>
        </div>
      </nav>
    </header>
  );
}
