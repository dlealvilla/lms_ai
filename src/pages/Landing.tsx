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
      <section className="relative z-10 px-6 pt-0 pb-8">
        <div className="w-full flex flex-col items-center text-center" style={{ transform: 'translateY(-80px)' }}>
          {/* Headline - Cinzel font */}
          <h1 className="
            font-cinzel
            text-2xl md:text-3xl lg:text-4xl
            text-wm-navy-900 mb-3
            opacity-0 animate-fade-in
          ">
            Education for the{' '}
            <span className="text-[#3F6F88]">Future</span>
          </h1>

          {/* Subheadline - Cinzel font, black */}
          <p className="
            font-cinzel text-base md:text-lg mb-4
            text-black
            opacity-0 animate-fade-in delay-100
          ">
            Develop Human Intelligence and AI Skills
          </p>

          {/* Hero Brain Illustration - Centered */}
          <div className="
            w-full flex justify-center mb-0
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

          {/* Student & Educator Buttons - Glassy Texture */}
          <div className="
            flex flex-col sm:flex-row gap-8 justify-center items-center mb-24
            opacity-0 animate-fade-in delay-300
          ">
            <button className="
              font-cinzel
              px-16 py-8 text-2xl md:text-3xl font-semibold rounded-3xl
              bg-[#3F6F88]/80 backdrop-blur-md
              text-white shadow-xl
              hover:shadow-2xl hover:scale-105 hover:bg-[#3F6F88]/90
              transition-all duration-300
              min-w-[280px] md:min-w-[320px]
              border border-white/30
              bg-gradient-to-b from-white/20 to-transparent
            ">
              Student
            </button>
            <button className="
              font-cinzel
              px-16 py-8 text-2xl md:text-3xl font-semibold rounded-3xl
              bg-[#C9962D]/80 backdrop-blur-md
              text-white shadow-xl
              hover:shadow-2xl hover:scale-105 hover:bg-[#C9962D]/90
              transition-all duration-300
              min-w-[280px] md:min-w-[320px]
              border border-white/30
              bg-gradient-to-b from-white/20 to-transparent
            ">
              Educator
            </button>
          </div>

          {/* Feature Strip - Moved down with more spacing */}
          <div 
            className="
              flex flex-wrap justify-center gap-6 md:gap-10 mt-16
              opacity-0 animate-fade-in delay-400
            "
            style={{ transform: 'translateY(20px)' }}
          >
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
