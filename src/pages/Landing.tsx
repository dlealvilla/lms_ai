import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, BookOpen, Eye, CheckCircle } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background-elevated">
        <div className="container mx-auto px-4 lg:px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-foreground">Wildmind</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login/student">
                <Button variant="ghost">Student Login</Button>
              </Link>
              <Link to="/login/teacher">
                <Button>Teacher Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 lg:px-6 py-24 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Assessments,
            <br />
            <span className="text-primary">without the noise.</span>
          </h1>
          
          <p className="text-xl text-foreground-muted mb-12 max-w-2xl mx-auto">
            Write with autosave. Teach with visibility. Grade with confidence.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link to="/login/student">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                I'm a Student
              </Button>
            </Link>
            <Link to="/login/teacher">
              <Button size="lg" className="w-full sm:w-auto">
                I'm a Teacher
              </Button>
            </Link>
          </div>

          {/* Value props */}
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Card>
              <CardContent className="pt-6">
                <div className="w-10 h-10 bg-primary-wash rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Open assessments with autosave
                </h3>
                <p className="text-foreground-muted">
                  Write freely with AI assistance. Your work saves automatically — never lose progress.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-10 h-10 bg-secondary-wash rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Teachers track progress instantly
                </h3>
                <p className="text-foreground-muted">
                  See student work in real-time. Know who's on track and who needs help.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Marks are locked and clear
                </h3>
                <p className="text-foreground-muted">
                  Simple 0-100 marking. Students see exactly where they stand.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* How it works */}
      <section className="bg-background-elevated py-20">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">
              How it works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Join your course</h3>
                <p className="text-foreground-muted">Sign in with your school credentials</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Complete assessments</h3>
                <p className="text-foreground-muted">Write with AI help, autosave included</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Receive marks</h3>
                <p className="text-foreground-muted">Clear feedback from your teacher</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 lg:px-6 text-center text-foreground-muted max-w-7xl">
          © {new Date().getFullYear()} Wildmind Education
        </div>
      </footer>
    </div>
  );
}
