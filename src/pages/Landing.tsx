import { Brain, Sparkles, TrendingUp, ChevronRight, BookOpen, Clock, Check, User, Bell } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] overflow-x-hidden">
      {/* Background Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#6CB6E8]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#F2C078]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-white/80 to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6CB6E8] to-[#4A9CD6] flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#1F2A44] tracking-tight">
              <span className="text-[#6CB6E8]">Wildmind</span> Education
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#7B8794] hover:text-[#1F2A44] transition-colors text-sm font-medium">Features</a>
            <a href="#preview" className="text-[#7B8794] hover:text-[#1F2A44] transition-colors text-sm font-medium">Preview</a>
            <a href="#about" className="text-[#7B8794] hover:text-[#1F2A44] transition-colors text-sm font-medium">About</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-12 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1F2A44] mb-6 tracking-tight leading-[1.1] opacity-0 animate-fade-in-up">
            Elevate Your{' '}
            <span className="bg-gradient-to-r from-[#6CB6E8] to-[#4A9CD6] bg-clip-text text-transparent">
              Learning
            </span>{' '}
            Experience
          </h1>

          {/* Subheadline */}
          <p className="text-[#7B8794] text-lg md:text-xl mb-8 opacity-0 animate-fade-in-up animation-delay-100">
            AI-Driven · Human Guided · Empowered Success
          </p>

          {/* Hero Brain Visual */}
          <div className="relative w-full max-w-lg mx-auto h-[300px] md:h-[380px] mb-8 opacity-0 animate-fade-in-up animation-delay-200">
            {/* Glow Platform */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-8">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-[#6CB6E8]/30 to-transparent rounded-full blur-xl animate-pulse-glow" />
            </div>
            
            {/* Brain Container */}
            <div className="absolute inset-0 flex items-center justify-center animate-float">
              <div className="relative">
                {/* Brain Icon Large */}
                <div className="w-48 h-48 md:w-64 md:h-64 relative">
                  {/* Left side - Organic */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-[#E8D4C4] via-[#D4B8A8] to-[#C4A090] rounded-full opacity-60 blur-sm" />
                  </div>
                  {/* Right side - Digital */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-bl from-[#6CB6E8] via-[#4A9CD6] to-[#3A8CC6] rounded-full opacity-40 blur-sm" />
                  </div>
                  {/* Center Brain */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-32 h-32 md:w-44 md:h-44 text-[#1F2A44]/80" strokeWidth={1} />
                  </div>
                  {/* Sparkle Effects */}
                  <Sparkles className="absolute top-4 right-4 w-6 h-6 text-[#F2C078] animate-pulse-glow" />
                  <Sparkles className="absolute bottom-8 left-2 w-4 h-4 text-[#6CB6E8] animate-pulse-glow animation-delay-200" />
                </div>
                
                {/* Cityscape Silhouette */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[200%] opacity-20">
                  <svg viewBox="0 0 400 60" className="w-full">
                    <path 
                      d="M0,60 L0,45 L20,45 L20,30 L35,30 L35,40 L50,40 L50,25 L60,25 L60,35 L80,35 L80,20 L95,20 L95,35 L110,35 L110,15 L125,15 L125,30 L140,30 L140,25 L160,25 L160,40 L180,40 L180,20 L195,20 L195,30 L210,30 L210,35 L225,35 L225,25 L240,25 L240,45 L260,45 L260,30 L275,30 L275,40 L290,40 L290,25 L310,25 L310,35 L330,35 L330,20 L345,20 L345,40 L360,40 L360,30 L380,30 L380,45 L400,45 L400,60 Z" 
                      fill="#1F2A44"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Value Props Strip */}
          <div className="flex flex-wrap justify-center gap-8 mb-10 opacity-0 animate-fade-in-up animation-delay-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6CB6E8]/20 to-[#6CB6E8]/5 flex items-center justify-center border border-[#6CB6E8]/20">
                <Sparkles className="w-5 h-5 text-[#6CB6E8]" />
              </div>
              <span className="text-[#1F2A44] font-medium">Smart Assessments</span>
            </div>
            <div className="w-px h-8 bg-[#E6EAF0] hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F2C078]/20 to-[#F2C078]/5 flex items-center justify-center border border-[#F2C078]/20">
                <TrendingUp className="w-5 h-5 text-[#F2C078]" />
              </div>
              <span className="text-[#1F2A44] font-medium">Track Progress</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up animation-delay-400">
            <button className="group px-8 py-4 bg-gradient-to-r from-[#E8887C] to-[#D67268] text-white font-semibold rounded-xl shadow-lg btn-glow-coral transition-all duration-300 min-w-[180px]">
              <span className="flex items-center justify-center gap-2">
                Student Login
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="group px-8 py-4 bg-white border-2 border-[#F2C078] text-[#D4A054] font-semibold rounded-xl shadow-lg btn-glow-gold transition-all duration-300 min-w-[180px] hover:bg-[#F2C078]/5">
              <span className="flex items-center justify-center gap-2">
                Teacher Login
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A44] mb-2">
            Assessments for the{' '}
            <span className="text-[#6CB6E8]">Future</span>
          </h2>
        </div>
      </div>

      {/* Dashboard Preview Section */}
      <section id="preview" className="relative z-10 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Two Glass Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* Current Courses Card */}
            <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in-up animation-delay-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#6CB6E8] rounded-full" />
                  <h3 className="text-lg font-semibold text-[#1F2A44]">Current Courses</h3>
                </div>
                <button className="text-xs text-[#7B8794] hover:text-[#1F2A44] border border-[#E6EAF0] px-3 py-1.5 rounded-lg transition-colors">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                <CourseItem 
                  icon={<BookOpen className="w-5 h-5" />}
                  name="Advanced Science"
                  details="Dpt - Code"
                  status="Open"
                  statusColor="blue"
                />
                <CourseItem 
                  icon={<BookOpen className="w-5 h-5" />}
                  name="Modern History"
                  details="Dpt - Code"
                  status="Closed"
                  statusColor="coral"
                />
              </div>
            </div>

            {/* Past Courses Card */}
            <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in-up animation-delay-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#1F2A44]">Past Courses</h3>
              </div>
              
              <div className="space-y-4">
                <CourseItem 
                  icon={<BookOpen className="w-5 h-5" />}
                  name="Fundamentals of Math"
                  details="Har Coltr - Learn Masten"
                  progress="13/08"
                  score="86/100"
                  statusColor="muted"
                />
                <CourseItem 
                  icon={<BookOpen className="w-5 h-5" />}
                  name="World Literature"
                  details="Har Coltr - Learn Masten"
                  progress="13/06"
                  score="96/100"
                  statusColor="muted"
                />
              </div>
            </div>
          </div>

          {/* Full Dashboard Preview */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Welcome Dashboard */}
            <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in-up animation-delay-400">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E6EAF0]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6CB6E8] to-[#4A9CD6] flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-[#1F2A44]">
                    <span className="text-[#6CB6E8]">Wildmind</span> Education
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#7B8794]" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6CB6E8] to-[#4A9CD6] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Welcome */}
              <h2 className="text-2xl font-bold text-[#1F2A44] mb-6">Welcome back, Alex!</h2>
              
              {/* Current Courses */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#7B8794] mb-4">Current Courses</h4>
                <div className="space-y-3">
                  <DashboardCourseItem 
                    name="Advanced Science"
                    code="Dpt - Code"
                    date="12/96"
                    status="OPEN"
                    statusColor="blue"
                  />
                  <DashboardCourseItem 
                    name="Modern History"
                    code="Dpt - Code"
                    date="12/28"
                    status="CLOSED"
                    statusColor="coral"
                  />
                </div>
              </div>

              {/* Past Courses */}
              <div>
                <h4 className="text-sm font-medium text-[#7B8794] mb-4">Past Courses</h4>
                <div className="space-y-3">
                  <DashboardCourseItem 
                    name="Fundamentals of Math"
                    code="Har Coltr - Learn Masten"
                    date="12/55"
                    status="SPSED"
                    statusColor="gold"
                  />
                  <DashboardCourseItem 
                    name="World Literature"
                    code="Har Coltr - Learn Masten"
                    date="12/26"
                    status="CLOSED"
                    statusColor="coral"
                  />
                </div>
              </div>
            </div>

            {/* Assessment with AI Assistant */}
            <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in-up animation-delay-500">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E6EAF0]">
                <div className="flex items-center gap-3">
                  <button className="text-[#7B8794] hover:text-[#1F2A44]">
                    ☰ Dashboard
                  </button>
                  <span className="text-[#7B8794]">/</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6CB6E8]/20 to-[#6CB6E8]/5 flex items-center justify-center">
                      <BookOpen className="w-3 h-3 text-[#6CB6E8]" />
                    </div>
                    <span className="font-medium text-[#1F2A44]">Advanced Science</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#7B8794]" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F2C078] to-[#D4A054] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Assessment Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#6CB6E8] rounded-full" />
                  <span className="font-medium text-[#1F2A44]">Assessments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#6CB6E8]/10 text-[#6CB6E8] text-xs font-medium rounded-lg border border-[#6CB6E8]/20">
                    Open
                  </span>
                  <button className="w-6 h-6 bg-[#6CB6E8] rounded flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Assessment Content */}
              <div className="bg-white/50 rounded-xl p-4 mb-4 border border-[#E6EAF0]">
                <p className="text-sm text-[#1F2A44]">
                  Explain Einstein's theory of relativity and its impact on modern physics. Provide examples of its application.
                </p>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-4">
                {/* AI Assistant */}
                <div className="bg-gradient-to-br from-[#6CB6E8]/5 to-[#6CB6E8]/10 rounded-xl p-4 border border-[#6CB6E8]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#6CB6E8]" />
                    <span className="text-sm font-medium text-[#1F2A44]">AI Assistant</span>
                  </div>
                  <p className="text-xs text-[#7B8794] mb-3">
                    As you go! Your Options: This guides concepts. PEEL improves answers to be Structured improvements by Phnet Courses Mean...
                  </p>
                  <ul className="text-xs text-[#7B8794] space-y-1 mb-3">
                    <li className="flex items-start gap-1">
                      <span className="text-[#6CB6E8]">•</span>
                      Senthrnh_AI 'The Stanplay of Relief Cost' : (105)
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#6CB6E8]">•</span>
                      Gathalt 2 - Aat 'Quilitcotue Bualogy' : (598)
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#6CB6E8]">•</span>
                      Gupelt 4 - Ah Coperkent tai Geofred Plasticity
                    </li>
                  </ul>
                </div>

                {/* Satesment Section */}
                <div className="bg-white/50 rounded-xl p-4 border border-[#E6EAF0]">
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="w-4 h-4 text-[#F2C078]" />
                    <span className="text-sm font-medium text-[#1F2A44]">☆ Satesment.on</span>
                  </div>
                  <p className="text-xs text-[#7B8794] mb-3">
                    Flash courses assistant consoles Summized or 118 stre cal bopation anchesming Srat!Sments emphasis.
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-[#7B8794]">Materia al, Skr't Hassabaliter.</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-[#6CB6E8] text-[#6CB6E8]" />
                    <span className="text-xs text-[#6CB6E8]">Mun ofdel Commerce Adcensstes</span>
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-[#F2C078] to-[#D4A054] text-white text-xs font-medium rounded-lg">
                    Utealt Help COSSttendt
                  </button>
                </div>
              </div>

              {/* Section Lisgory */}
              <div className="mt-4 bg-white/50 rounded-xl p-4 border border-[#E6EAF0]">
                <h4 className="text-sm font-medium text-[#1F2A44] mb-2">Section Lisgory</h4>
                <ul className="text-xs text-[#7B8794] space-y-1">
                  <li>• Lloosftaan Yew - There worth Balogpy if Parftad Coeft - (19945)</li>
                  <li>• Theindt d - Ai : Het smodtayed meceming Musard Gasled - (29946)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6CB6E8] to-[#4A9CD6] flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-[#1F2A44]">
              <span className="text-[#6CB6E8]">Wildmind</span> Education
            </span>
          </div>
          <p className="text-sm text-[#7B8794]">
            © {new Date().getFullYear()} Wildmind Education. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Course Item Component for Preview Cards
function CourseItem({ 
  icon, 
  name, 
  details, 
  status, 
  statusColor,
  progress,
  score 
}: { 
  icon: React.ReactNode;
  name: string;
  details: string;
  status?: string;
  statusColor: 'blue' | 'coral' | 'gold' | 'muted';
  progress?: string;
  score?: string;
}) {
  const statusStyles = {
    blue: 'bg-[#6CB6E8]/10 text-[#6CB6E8] border-[#6CB6E8]/20',
    coral: 'bg-[#E8887C]/10 text-[#E8887C] border-[#E8887C]/20',
    gold: 'bg-[#F2C078]/10 text-[#F2C078] border-[#F2C078]/20',
    muted: 'bg-[#7B8794]/10 text-[#7B8794] border-[#7B8794]/20',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-[#E6EAF0] hover:border-[#6CB6E8]/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6CB6E8]/10 to-[#6CB6E8]/5 flex items-center justify-center text-[#6CB6E8]">
          {icon}
        </div>
        <div>
          <p className="font-medium text-[#1F2A44] text-sm">{name}</p>
          <p className="text-xs text-[#7B8794]">{details}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {progress && <span className="text-xs text-[#7B8794]">{progress}</span>}
        {score && <span className="text-xs text-[#7B8794] font-medium">{score}</span>}
        {status && (
          <span className={`px-3 py-1 text-xs font-medium rounded-lg border ${statusStyles[statusColor]}`}>
            {status}
          </span>
        )}
      </div>
    </div>
  );
}

// Dashboard Course Item
function DashboardCourseItem({
  name,
  code,
  date,
  status,
  statusColor
}: {
  name: string;
  code: string;
  date: string;
  status: string;
  statusColor: 'blue' | 'coral' | 'gold';
}) {
  const statusStyles = {
    blue: 'bg-[#6CB6E8] text-white',
    coral: 'bg-[#E8887C] text-white',
    gold: 'bg-[#F2C078] text-white',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl border border-[#E6EAF0]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6CB6E8]/20 to-[#4A9CD6]/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-[#6CB6E8]" />
        </div>
        <div>
          <p className="font-medium text-[#1F2A44] text-sm">{name}</p>
          <p className="text-xs text-[#7B8794]">{code}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#7B8794]">{date}</span>
        <span className={`px-3 py-1 text-xs font-bold rounded-lg ${statusStyles[statusColor]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
