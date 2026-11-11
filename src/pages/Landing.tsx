import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Eye, CheckCircle } from 'lucide-react';

const SAMPLE_COURSES = [
  { label: 'COMP101', color: '#C45C4A', height: 72 },
  { label: 'WRIT201', color: '#3D6B9A', height: 88 },
  { label: 'HIST201', color: '#4A7A52', height: 64 },
  { label: 'MATH', color: '#A08020', height: 80 },
] as const;

export function Landing() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-ink flex flex-col">
      <header className="border-b border-[#E8E6E1] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-ink text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-[15px]">WildMind</div>
              <div className="text-[11px] text-[#555]">AI for Education</div>
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 text-sm font-medium">
            <Link to="/login/student" className="text-ink-muted hover:text-ink">
              Student login
            </Link>
            <Link to="/login/teacher" className="text-ink-muted hover:text-ink">
              Teacher login
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-6 lg:px-16 py-16 lg:py-24 flex-1">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl tracking-[0.01em] mb-5 leading-tight">
            Assessments,
            <br />
            <span className="text-[#C45C4A]">without the noise.</span>
          </h1>
          <p className="text-lg text-ink-muted mb-10 max-w-xl leading-relaxed">
            Write with autosave. Teach with visibility. Grade with confidence — from a quiet shelf of courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <Link to="/login/student" className="folio-btn-secondary !px-5 !py-3 text-center">
              I&apos;m a Student
            </Link>
            <Link to="/login/teacher" className="folio-btn-primary !px-5 !py-3 text-center">
              I&apos;m a Teacher
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
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
            <div key={title} className="folio-card p-6">
              <div className="w-10 h-10 bg-[#F3F2EE] rounded-lg flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-[#3D6B9A]" />
              </div>
              <h3 className="font-serif text-xl mb-2">{title}</h3>
              <p className="text-sm text-ink-muted">{body}</p>
            </div>
          ))}
        </div>

        <figure className="mt-4">
          <div className="flex items-end gap-2.5" aria-hidden>
            {SAMPLE_COURSES.map((course) => (
              <div
                key={course.label}
                className="w-5 rounded-sm shadow-sm flex items-end justify-center overflow-hidden"
                style={{ height: course.height, background: course.color }}
              >
                <span className="writing-spine text-[9px] font-bold tracking-[0.14em] text-white/95 pb-2">
                  {course.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-0 h-1.5 w-40 rounded-sm bg-[#E8E6E1]" aria-hidden />
          <figcaption className="mt-3 text-sm text-ink-muted">
            A quiet shelf of sample courses
          </figcaption>
        </figure>
      </main>

      <footer className="mt-auto border-t border-[#E8E6E1] bg-white py-8 text-sm text-ink-muted">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>WildMind AI for Education</p>
          <a
            href="https://github.com/dlealvilla/wildmind-ai-for-education"
            className="hover:text-ink underline-offset-4 hover:underline"
            rel="noopener noreferrer"
          >
            Source on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
