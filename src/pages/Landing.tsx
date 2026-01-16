import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-white tracking-tight">
            Wildmind
          </span>
          <div className="flex items-center gap-4">
            <Link
              to="/login/student"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Student Login
            </Link>
            <Link
              to="/login/teacher"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Teacher Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="px-6 pt-24 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Assessments,
            <br />
            <span className="text-emerald-400">without the noise.</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Write with autosave. Teach with visibility. Grade with confidence.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              to="/login/student"
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              I'm a Student
            </Link>
            <Link
              to="/login/teacher"
              className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
            >
              I'm a Teacher
            </Link>
          </div>

          {/* Value props */}
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-emerald-400 text-xl">✍️</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Open assessments with autosave
              </h3>
              <p className="text-slate-400">
                Write freely with AI assistance. Your work saves automatically — never lose progress.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-emerald-400 text-xl">👁️</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Teachers track progress instantly
              </h3>
              <p className="text-slate-400">
                See student work in real-time. Know who's on track and who needs help.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-emerald-400 text-xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Marks are locked and clear
              </h3>
              <p className="text-slate-400">
                Simple 0-100 marking. Students see exactly where they stand.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* How it works */}
      <section className="px-6 py-20 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Join your course</h3>
              <p className="text-slate-400">Sign in with your school credentials</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Complete assessments</h3>
              <p className="text-slate-400">Write with AI help, autosave included</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Receive marks</h3>
              <p className="text-slate-400">Clear feedback from your teacher</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-slate-500">
          © {new Date().getFullYear()} Wildmind Education
        </div>
      </footer>
    </div>
  );
}

