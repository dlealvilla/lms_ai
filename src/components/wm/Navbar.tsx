export function Navbar() {
  return (
    <header className="relative z-20 px-10 pt-8 pb-4">
      <nav className="max-w-container mx-auto flex items-center justify-between">
        {/* Logo - moved slightly down and right */}
        <a href="/" className="flex items-center group ml-4">
          <img 
            src="/wildmindlogo_new.png" 
            alt="Wildmind Education"
            className="h-[300px] w-auto object-contain"
          />
        </a>

        {/* Nav Links - moved slightly away from corner */}
        <div className="hidden md:flex items-center gap-8 mr-4">
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
