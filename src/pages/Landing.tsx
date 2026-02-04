import { Sparkles, TrendingUp, MessageCircle, ChevronRight, Bell, User } from 'lucide-react';
import { 
  Button, 
  GlassCard, 
  CourseCard, 
  FeatureItem, 
  Navbar, 
  Footer,
  AIAssistantPanel 
} from '../components/wm';

export function Landing() {
  return (
    <div className="wm-bg wm-noise">
      {/* Navbar */}
      <Navbar />

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative z-10 px-6 pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="max-w-hero mx-auto text-center">
          {/* Headline */}
          <h1 className="
            font-display text-hero
            text-wm-navy-900 mb-5 text-balance
            opacity-0 animate-fade-in
          ">
            Elevate Your{' '}
            <span className="bg-gradient-to-r from-wm-blue-500 to-wm-blue-600 bg-clip-text text-transparent">
              Learning
            </span>{' '}
            Experience
          </h1>

          {/* Subheadline */}
          <p className="
            text-wm-muted text-subheading mb-10
            opacity-0 animate-fade-in delay-100
          ">
            AI-Driven · Human-Guided · Empowered Success
          </p>

          {/* Hero Brain Illustration */}
          {/* 
            TODO: Replace this placeholder with actual brain illustration.
            Suggested image prompt for AI generation:
            "A futuristic split human and artificial intelligence brain, 
            left side organic and biological with warm tones, 
            right side glowing with blue circuitry and neural networks, 
            floating above a luminous circular platform, 
            ethereal atmosphere, soft bloom lighting, 
            minimal sci-fi aesthetic, premium education technology style, 
            transparent/white background"
          */}
          <div className="
            relative mx-auto mb-12
            opacity-0 animate-fade-in delay-200
          ">
            <div className="wm-brain-container mx-auto animate-float">
              {/* Outer glow ring */}
              <div className="wm-brain-glow-ring" />
              
              {/* Brain visual placeholder */}
              <div className="wm-brain-visual" />
              
              {/* Platform glow */}
              <div className="wm-brain-platform" />
            </div>
          </div>

          {/* Feature Strip */}
          <div className="
            flex flex-wrap justify-center gap-6 md:gap-10 mb-12
            opacity-0 animate-fade-in delay-300
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
            <div className="hidden sm:block w-px h-12 bg-wm-border" />
            <FeatureItem
              icon={<MessageCircle className="w-5 h-5" />}
              label="Personalized Feedback"
              color="coral"
            />
          </div>

          {/* CTA Buttons */}
          <div className="
            flex flex-col sm:flex-row gap-4 justify-center
            opacity-0 animate-fade-in delay-400
          ">
            <Button variant="primary" size="lg">
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
      <section className="relative z-10 py-16 md:py-20">
        <div className="max-w-container mx-auto px-6 text-center">
          <h2 className="font-display text-display text-wm-navy-900 text-balance">
            Assessments for the{' '}
            <span className="text-wm-blue-500">Future</span>
          </h2>
        </div>
      </section>

      {/* ============================================
          DASHBOARD PREVIEW
          ============================================ */}
      <section id="preview" className="relative z-10 px-6 pb-16 md:pb-24">
        <div className="max-w-content mx-auto">
          {/* Two Column Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Current Courses */}
            <GlassCard
              title="Current Courses"
              titleAction={
                <Button variant="ghost" size="sm">View All</Button>
              }
              className="opacity-0 animate-fade-in delay-200"
            >
              <div className="space-y-3">
                <CourseCard
                  title="Advanced Science"
                  meta="Dept - SCI101"
                  status="open"
                  progress={{ value: 12, max: 96 }}
                />
                <CourseCard
                  title="Modern History"
                  meta="Dept - HIS201"
                  status="closed"
                  progress={{ value: 12, max: 28 }}
                />
              </div>
            </GlassCard>

            {/* Past Courses */}
            <GlassCard
              title="Past Courses"
              className="opacity-0 animate-fade-in delay-300"
            >
              <div className="space-y-3">
                <CourseCard
                  title="Fundamentals of Math"
                  meta="Har Coltr - Learn Master"
                  status="completed"
                  score="86/100"
                />
                <CourseCard
                  title="World Literature"
                  meta="Har Coltr - Learn Master"
                  status="completed"
                  score="96/100"
                />
              </div>
            </GlassCard>
          </div>

          {/* Welcome + AI Assistant Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Welcome Panel */}
            <GlassCard className="opacity-0 animate-fade-in delay-400">
              {/* Mini navbar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-wm-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-wm-btn bg-gradient-to-br from-wm-blue-400 to-wm-blue-600 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-wm-navy-900 text-small">
                    <span className="text-wm-blue-500">Wildmind</span> Education
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-full hover:bg-wm-border/30 transition-colors">
                    <Bell className="w-5 h-5 text-wm-muted" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wm-blue-400 to-wm-blue-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Welcome message */}
              <h2 className="text-heading font-bold text-wm-navy-900 mb-6">
                Welcome back, Alex!
              </h2>

              {/* Current Courses */}
              <div className="mb-6">
                <h4 className="text-small font-medium text-wm-muted mb-3">Current Courses</h4>
                <div className="space-y-2.5">
                  <CourseCard
                    title="Advanced Science"
                    meta="Dept - SCI101"
                    status="open"
                    progress={{ value: 12, max: 96 }}
                    compact
                  />
                  <CourseCard
                    title="Modern History"
                    meta="Dept - HIS201"
                    status="closed"
                    progress={{ value: 12, max: 28 }}
                    compact
                  />
                </div>
              </div>

              {/* Past Courses */}
              <div>
                <h4 className="text-small font-medium text-wm-muted mb-3">Past Courses</h4>
                <div className="space-y-2.5">
                  <CourseCard
                    title="Fundamentals of Math"
                    meta="Completed"
                    status="completed"
                    score="86/100"
                    compact
                  />
                </div>
              </div>
            </GlassCard>

            {/* AI Assistant Panel */}
            <div className="opacity-0 animate-fade-in delay-500">
              <AIAssistantPanel
                prompt="Explain Einstein's theory of relativity and its impact on modern physics. Provide an example of its application."
                suggestions={[
                  "Clarify key terms like 'spacetime' and 'mass-energy equivalence'",
                  "Add a real-world example such as GPS satellite corrections",
                  "Structure your response into 3 clear paragraphs"
                ]}
                ctaLabel="Improve Answer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
