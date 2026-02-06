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
        <div className="max-w-5xl mx-auto text-center">
          {/* Headline - Large & Futuristic */}
          <h1 className="
            font-futuristic
            text-4xl md:text-5xl lg:text-6xl
            text-wm-navy-900 mb-4 text-balance
            opacity-0 animate-fade-in
            tracking-wider
          ">
            Elevate Your{' '}
            <span className="bg-gradient-to-r from-wm-blue-500 to-wm-blue-600 bg-clip-text text-transparent">
              Learning
            </span>{' '}
            Experience
          </h1>

          {/* Subheadline */}
          <p className="
            text-wm-muted text-lg md:text-xl mb-6
            opacity-0 animate-fade-in delay-100
            tracking-wide
          ">
            AI-Driven · Human-Guided · Empowered Success
          </p>

          {/* Hero Brain Illustration - Positioned Higher */}
          <div className="
            relative mx-auto mb-8
            opacity-0 animate-fade-in delay-200
          ">
            <div className="wm-brain-container mx-auto animate-float">
              <img 
                src="/hero-brain.png" 
                alt="Futuristic AI-human brain illustration"
                className="wm-brain-image"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>

          {/* Student & Educator Buttons - Large, Side by Side */}
          <div className="
            flex flex-col sm:flex-row gap-6 justify-center mb-10
            opacity-0 animate-fade-in delay-300
          ">
            <button className="
              px-12 py-5 text-xl font-semibold rounded-2xl
              bg-gradient-to-br from-wm-blue-400 to-wm-blue-600
              text-white shadow-lg
              hover:shadow-xl hover:scale-105
              transition-all duration-300
              min-w-[200px]
            ">
              Student
            </button>
            <button className="
              px-12 py-5 text-xl font-semibold rounded-2xl
              bg-gradient-to-br from-wm-gold-400 to-wm-gold-500
              text-white shadow-lg
              hover:shadow-xl hover:scale-105
              transition-all duration-300
              min-w-[200px]
            ">
              Educator
            </button>
          </div>

          {/* Feature Strip */}
          <div className="
            flex flex-wrap justify-center gap-6 md:gap-10
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
