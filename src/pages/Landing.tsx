import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Eye, CheckCircle } from 'lucide-react';
import { DecorativeSpine } from '@/components/bookshelf';

export function Landing() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-ink">
      <header className="border-b border-[#E8E6E1] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-ink text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-[15px]">Wildmind</div>
              <div className="text-[11px] text-[#999]">Library · Folio</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login/student"
              className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-[#F3F2EE] text-ink hover:bg-[#E8E6E1]"
            >
              Student Login
            </Link>
            <Link
              to="/login/teacher"
              className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-ink text-white hover:bg-[#222]"
            >
              Teacher Login
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 lg:px-16 py-16 lg:py-24">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl tracking-[-0.02em] mb-5 leading-tight">
            Assessments,
            <br />
            <span className="text-[#C45C4A]">without the noise.</span>
          </h1>
          <p className="text-lg text-ink-muted mb-10 max-w-xl">
            Write with autosave. Teach with visibility. Grade with confidence — from a quiet folio of courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <Link
              to="/login/student"
              className="px-5 py-3 text-sm font-semibold rounded-lg bg-[#F3F2EE] text-ink text-center hover:bg-[#E8E6E1]"
            >
              I&apos;m a Student
            </Link>
            <Link
              to="/login/teacher"
              className="px-5 py-3 text-sm font-semibold rounded-lg bg-ink text-white text-center hover:bg-[#222]"
            >
              I&apos;m a Teacher
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-20">
          {[
            {
              icon: BookOpen,
              title: 'Open assessments with autosave',
              body: 'Write freely with AI assistance. Your work saves automatically — never lose progress.',
            },
            {
              icon: Eye,
              title: 'Teachers track progress instantly',
              body: "See student work in real-time. Know who's on track and who needs help.",
            },
            {
              icon: CheckCircle,
              title: 'Marks are locked and clear',
              body: 'Simple 0–100 marking. Students see exactly where they stand.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white text-ink rounded-xl border border-[#E8E6E1] shadow-folio p-6">
              <div className="w-10 h-10 bg-[#F3F2EE] rounded-lg flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-[#3D6B9A]" />
              </div>
              <h3 className="font-serif text-xl mb-2">{title}</h3>
              <p className="text-sm text-ink-muted">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-end gap-2.5 px-2">
          <DecorativeSpine label="COMP101" color="#C45C4A" height={56} />
          <DecorativeSpine label="WRIT201" color="#3D6B9A" height={72} />
          <DecorativeSpine label="HIST201" color="#4A7A52" height={48} />
          <DecorativeSpine label="MATH" color="#A08020" height={64} />
        </div>
      </main>

      <footer className="border-t border-[#E8E6E1] py-6 text-center text-xs text-ink-subtle">
        WildMind AI for Education · Folio
      </footer>
    </div>
  );
}
