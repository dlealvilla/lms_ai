import { Brain, Sparkles, TrendingUp, ChevronRight, Bell } from 'lucide-react';
import { Button, GlassCard, CourseCard, FeatureItem, Avatar } from '../components';

export function Landing() {
  return (
    <div className="min-h-screen bg-wm-canvas overflow-x-hidden">
      {/* ============================================
          BACKGROUND EFFECTS
          ============================================ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Blue glow - top left */}
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-wm-blue-500/10 rounded-full blur-[120px]" />
        {/* Gold glow - top right */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-wm-gold-400/10 rounded-full blur-[100px]" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-white/60 to-transparent" />
      </div>

      {/* ============================================
          NAVBAR
          ============================================ */}
      <header className="relative z-20 px-6 py-5">
        <nav className="max-w-wm-container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-wm-md bg-gradient-to-br from-wm-blue-500 to-wm-blue-600 flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-wm-navy-900 tracking-tight">
              <span className="text-wm-blue-500">Wildmind</span> Education
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-wm-muted hover:text-wm-navy-900 transition-colors text-small font-medium">
              Features
            </a>
            <a href="#preview" className="text-wm-muted hover:text-wm-navy-900 transition-colors text-small font-medium">
              Preview
            </a>
            <a href="#about" className="text-wm-muted hover:text-wm-navy-900 transition-colors text-small font-medium">
              About
            </a>
          </div>
        </nav>
      </header>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative z-10 px-6 pt-wm-12 pb-wm-8">
        <div className="max-w-wm-hero mx-auto text-center">
          {/* Headline */}
          <h1 className="
            font-display text-display-1
            text-wm-navy-900 mb-6
            opacity-0 wm-animate-fade-in
          ">
            Elevate Your{' '}
            <span className="bg-gradient-to-r from-wm-blue-500 to-wm-blue-600 bg-clip-text text-transparent">
              Learning
            </span>{' '}
            Experience
          </h1>

          {/* Subheadline */}
          <p className="
            text-wm-muted text-body md:text-lg mb-wm-8
            opacity-0 wm-animate-fade-in wm-delay-100
          ">
            AI-Driven · Human Guided · Empowered Success
          </p>

          {/* Hero Visual */}
          <div className="relative w-full max-w-md mx-auto h-[320px] mb-wm-8 opacity-0 wm-animate-fade-in wm-delay-200">
            {/* Glow platform */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-6">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-wm-blue-500/30 to-transparent rounded-full blur-xl wm-animate-pulse" />
            </div>

            {/* Brain container */}
            <div className="absolute inset-0 flex items-center justify-center wm-animate-float">
              <div className="relative">
                {/* Background organic glow */}
                <div className="absolute inset-0 w-56 h-56 bg-gradient-to-br from-amber-200/40 via-orange-100/30 to-transparent rounded-full blur-2xl -translate-x-8" />
                
                {/* Background digital glow */}
                <div className="absolute inset-0 w-56 h-56 bg-gradient-to-bl from-wm-blue-500/30 via-wm-blue-400/20 to-transparent rounded-full blur-2xl translate-x-8" />

                {/* Brain icon */}
                <Brain className="w-40 h-40 text-wm-navy-900/70" strokeWidth={0.8} />

                {/* Sparkles */}
                <Sparkles className="absolute -top-2 right-0 w-6 h-6 text-wm-gold-400 wm-animate-pulse" />
                <Sparkles className="absolute bottom-4 -left-4 w-4 h-4 text-wm-blue-500 wm-animate-pulse wm-delay-300" />
              </div>
            </div>

            {/* Cityscape silhouette */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] opacity-15">
              <svg viewBox="0 0 400 50" className="w-full">
                <path 
                  d="M0,50 L0,40 L15,40 L15,28 L28,28 L28,36 L42,36 L42,22 L52,22 L52,32 L68,32 L68,18 L82,18 L82,30 L98,30 L98,14 L112,14 L112,26 L128,26 L128,20 L145,20 L145,34 L162,34 L162,18 L178,18 L178,28 L195,28 L195,32 L212,32 L212,24 L228,24 L228,38 L245,38 L245,26 L262,26 L262,34 L278,34 L278,22 L295,22 L295,30 L312,30 L312,18 L328,18 L328,36 L345,36 L345,28 L365,28 L365,40 L385,40 L385,50 Z" 
                  fill="currentColor"
                  className="text-wm-navy-900"
                />
              </svg>
            </div>
          </div>

          {/* Value Props Strip */}
          <div className="
            flex flex-wrap justify-center gap-8 mb-wm-12
            opacity-0 wm-animate-fade-in wm-delay-300
          ">
            <FeatureItem
              icon={<Sparkles className="w-5 h-5" />}
              label="Smart Assessments"
              color="blue"
            />
            <div className="hidden sm:block w-px h-12 bg-wm-border" />
            <FeatureItem
              icon={<TrendingUp className="w-5 h-5" />}
              label="Track Progress"
              color="gold"
            />
          </div>

          {/* CTA Buttons */}
          <div className="
            flex flex-col sm:flex-row gap-4 justify-center
            opacity-0 wm-animate-fade-in wm-delay-400
          ">
            <Button variant="coral" size="lg">
              Student Login
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="lg">
              Teacher Login
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION DIVIDER
          ============================================ */}
      <section className="relative z-10 py-wm-16">
        <div className="max-w-wm-container mx-auto px-6 text-center">
          <h2 className="font-display text-display-2 text-wm-navy-900">
            Assessments for the{' '}
            <span className="text-wm-blue-500">Future</span>
          </h2>
        </div>
      </section>

      {/* ============================================
          DASHBOARD PREVIEW SECTION
          ============================================ */}
      <section id="preview" className="relative z-10 px-6 pb-wm-24">
        <div className="max-w-wm-container mx-auto">
          {/* Two preview cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-wm-12">
            {/* Current Courses */}
            <GlassCard
              header={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-wm-blue-500" />
                    <h3 className="font-semibold text-wm-navy-900">Current Courses</h3>
                  </div>
                  <button className="text-label text-wm-muted hover:text-wm-navy-900 border border-wm-border px-3 py-1.5 rounded-wm-sm transition-colors">
                    View All
                  </button>
                </div>
              }
              className="opacity-0 wm-animate-fade-in wm-delay-200"
            >
              <div className="space-y-3">
                <CourseCard
                  title="Advanced Science"
                  meta="Dpt - Code"
                  status="open"
                />
                <CourseCard
                  title="Modern History"
                  meta="Dpt - Code"
                  status="closed"
                />
              </div>
            </GlassCard>

            {/* Past Courses */}
            <GlassCard
              header={
                <h3 className="font-semibold text-wm-navy-900">Past Courses</h3>
              }
              className="opacity-0 wm-animate-fade-in wm-delay-300"
            >
              <div className="space-y-3">
                <CourseCard
                  title="Fundamentals of Math"
                  meta="Har Coltr - Learn Master"
                  status="completed"
                  progress="13/08"
                  score="86/100"
                />
                <CourseCard
                  title="World Literature"
                  meta="Har Coltr - Learn Master"
                  status="completed"
                  progress="13/06"
                  score="96/100"
                />
              </div>
            </GlassCard>
          </div>

          {/* Full Dashboard Preview */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Welcome Panel */}
            <GlassCard className="opacity-0 wm-animate-fade-in wm-delay-400">
              {/* Mini navbar */}
              <div className="flex items-center justify-between mb-wm-6 pb-4 border-b border-wm-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-wm-sm bg-gradient-to-br from-wm-blue-500 to-wm-blue-600 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-wm-navy-900 text-small">
                    <span className="text-wm-blue-500">Wildmind</span> Education
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-wm-muted" />
                  <Avatar size="sm" color="blue" />
                </div>
              </div>

              {/* Welcome */}
              <h2 className="text-heading-1 font-bold text-wm-navy-900 mb-wm-6">
                Welcome back, Alex!
              </h2>

              {/* Current Courses Section */}
              <div className="mb-wm-6">
                <h4 className="text-small font-medium text-wm-muted mb-4">Current Courses</h4>
                <div className="space-y-3">
                  <DashboardCourseRow
                    title="Advanced Science"
                    code="Dpt - Code"
                    date="12/96"
                    status="OPEN"
                    statusColor="blue"
                  />
                  <DashboardCourseRow
                    title="Modern History"
                    code="Dpt - Code"
                    date="12/28"
                    status="CLOSED"
                    statusColor="coral"
                  />
                </div>
              </div>

              {/* Past Courses Section */}
              <div>
                <h4 className="text-small font-medium text-wm-muted mb-4">Past Courses</h4>
                <div className="space-y-3">
                  <DashboardCourseRow
                    title="Fundamentals of Math"
                    code="Har Coltr - Learn Master"
                    date="12/55"
                    status="PASSED"
                    statusColor="gold"
                  />
                  <DashboardCourseRow
                    title="World Literature"
                    code="Har Coltr - Learn Master"
                    date="12/26"
                    status="CLOSED"
                    statusColor="coral"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Assessment Preview Panel */}
            <GlassCard className="opacity-0 wm-animate-fade-in wm-delay-500">
              {/* Breadcrumb header */}
              <div className="flex items-center justify-between mb-wm-4 pb-4 border-b border-wm-border/50">
                <div className="flex items-center gap-2 text-small">
                  <span className="text-wm-muted">☰ Dashboard</span>
                  <span className="text-wm-muted">/</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-wm-sm bg-wm-blue-100 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-wm-blue-500" />
                    </div>
                    <span className="font-medium text-wm-navy-900">Advanced Science</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-wm-muted">⏱</span>
                  <Avatar size="sm" color="gold" />
                </div>
              </div>

              {/* Assessment header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-wm-blue-500" />
                  <span className="font-medium text-wm-navy-900">Assessments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-wm-blue-100 text-wm-blue-600 text-label font-medium rounded-wm-sm border border-wm-blue-200">
                    Open
                  </span>
                  <button className="w-6 h-6 bg-wm-blue-500 rounded flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Assessment question */}
              <div className="bg-white/60 rounded-wm-md p-4 mb-4 border border-wm-border">
                <p className="text-small text-wm-navy-900">
                  Explain Einstein's theory of relativity and its impact on modern physics. Provide examples of its application.
                </p>
              </div>

              {/* Two column: AI Assistant + Statements */}
              <div className="grid grid-cols-2 gap-4">
                {/* AI Assistant */}
                <div className="bg-gradient-to-br from-wm-blue-50 to-wm-blue-100/50 rounded-wm-md p-4 border border-wm-blue-200/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-wm-blue-500" />
                    <span className="text-small font-medium text-wm-navy-900">AI Assistant</span>
                  </div>
                  <p className="text-label text-wm-muted mb-3">
                    Structure your answer using PEEL format for better clarity...
                  </p>
                  <ul className="text-label text-wm-muted space-y-1">
                    <li className="flex gap-1">
                      <span className="text-wm-blue-500">•</span>
                      Point: State your main argument
                    </li>
                    <li className="flex gap-1">
                      <span className="text-wm-blue-500">•</span>
                      Evidence: Support with facts
                    </li>
                    <li className="flex gap-1">
                      <span className="text-wm-blue-500">•</span>
                      Explain: Analyze the evidence
                    </li>
                  </ul>
                </div>

                {/* Statements */}
                <div className="bg-white/60 rounded-wm-md p-4 border border-wm-border">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-wm-gold-400">★</span>
                    <span className="text-small font-medium text-wm-navy-900">Statements</span>
                  </div>
                  <p className="text-label text-wm-muted mb-3">
                    Key statements to address in your response...
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-wm-blue-500 text-wm-blue-500" defaultChecked />
                    <span className="text-label text-wm-blue-500">Define core concepts</span>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full">
                    Improve Answer
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="relative z-10 px-6 py-wm-8 border-t border-wm-border">
        <div className="max-w-wm-container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-wm-sm bg-gradient-to-br from-wm-blue-500 to-wm-blue-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-small font-medium text-wm-navy-900">
              <span className="text-wm-blue-500">Wildmind</span> Education
            </span>
          </div>
          <p className="text-small text-wm-muted">
            © {new Date().getFullYear()} Wildmind Education. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ============================================
   HELPER COMPONENTS
   ============================================ */

function DashboardCourseRow({
  title,
  code,
  date,
  status,
  statusColor,
}: {
  title: string;
  code: string;
  date: string;
  status: string;
  statusColor: 'blue' | 'coral' | 'gold';
}) {
  const statusStyles = {
    blue: 'bg-wm-blue-500 text-white',
    coral: 'bg-wm-coral-500 text-white',
    gold: 'bg-wm-gold-400 text-white',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white/70 rounded-wm-md border border-wm-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-wm-sm bg-gradient-to-br from-wm-blue-100 to-wm-blue-50 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-wm-blue-500" />
        </div>
        <div>
          <p className="font-medium text-wm-navy-900 text-small">{title}</p>
          <p className="text-label text-wm-muted">{code}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-label text-wm-muted">{date}</span>
        <span className={`px-3 py-1 text-label font-bold rounded-wm-sm ${statusStyles[statusColor]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
