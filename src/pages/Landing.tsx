import { Sparkles, TrendingUp, MessageCircle } from 'lucide-react';
import { FeatureItem, Navbar } from '../components/wm';

export function Landing() {
  return (
    <div className="wm-bg wm-noise min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative z-10 px-6 pt-4 pb-8">
        <div className="w-full flex flex-col items-center text-center">
          {/* Headline */}
          <h1 className="
            font-display
            text-2xl md:text-3xl lg:text-4xl
            text-wm-navy-900 mb-3
            opacity-0 animate-fade-in
          ">
            Education for the{' '}
            <span className="text-wm-blue-500">Future</span>
          </h1>

          {/* Subheadline */}
          <p className="
            text-wm-muted text-base md:text-lg mb-4
            opacity-0 animate-fade-in delay-100
          ">
            Develop Human Intelligence and AI Skills
          </p>

          {/* Hero Brain Illustration - Centered */}
          <div className="
            w-full flex justify-center mb-2
            opacity-0 animate-fade-in delay-200
          ">
            <div className="wm-brain-container animate-float">
              <img 
                src="/hero-brain.png" 
                alt="Futuristic AI-human brain illustration"
                className="wm-brain-image"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>

          {/* Student & Educator Buttons - 3x Larger, Distinctive Colors */}
          <div className="
            flex flex-col sm:flex-row gap-8 justify-center items-center mb-24
            opacity-0 animate-fade-in delay-300
          ">
            <button className="
              px-16 py-8 text-2xl md:text-3xl font-bold rounded-3xl
              bg-gradient-to-br from-[#4A90D9] to-[#2E5C8A]
              text-white shadow-xl
              hover:shadow-2xl hover:scale-105
              transition-all duration-300
              min-w-[280px] md:min-w-[320px]
              border-2 border-white/20
            ">
              Student
            </button>
            <button className="
              px-16 py-8 text-2xl md:text-3xl font-bold rounded-3xl
              bg-gradient-to-br from-[#E07B4C] to-[#C45A2C]
              text-white shadow-xl
              hover:shadow-2xl hover:scale-105
              transition-all duration-300
              min-w-[280px] md:min-w-[320px]
              border-2 border-white/20
            ">
              Educator
            </button>
          </div>

          {/* Feature Strip - Moved down with more spacing */}
          <div className="
            flex flex-wrap justify-center gap-6 md:gap-10 mt-16
            opacity-0 animate-fade-in delay-400
          ">
            <FeatureItem
              icon={<Sparkles className="w-5 h-5" />}
              label="Smart Assessments"
              color="blue"
            />
            <div className="hidden sm:block w-px h-12 bg-wm-border/50" />
            <FeatureItem
              icon={<TrendingUp className="w-5 h-5" />}
              label="Track Progress"
              color="gold"
            />
            <div className="hidden sm:block w-px h-12 bg-wm-border/50" />
            <FeatureItem
              icon={<MessageCircle className="w-5 h-5" />}
              label="Personalized Feedback"
              color="coral"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
