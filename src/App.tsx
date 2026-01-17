import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth/AuthContext';
import { RouteGuard } from './components/RouteGuard';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { StudentHome } from './pages/student/StudentHome';
import { StudentCourse } from './pages/student/StudentCourse';
import { StudentAssessment } from './pages/student/StudentAssessment';
import { TeacherHome } from './pages/teacher/TeacherHome';
import { TeacherCourse } from './pages/teacher/TeacherCourse';
import { TeacherStudent } from './pages/teacher/TeacherStudent';
import { TeacherAssessment } from './pages/teacher/TeacherAssessment';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login/:role" element={<Login />} />

          {/* Student routes */}
          <Route
            path="/student/home"
            element={
              <RouteGuard allowedRoles={['STUDENT']}>
                <StudentHome />
              </RouteGuard>
            }
          />
          <Route
            path="/student/courses/:courseId"
            element={
              <RouteGuard allowedRoles={['STUDENT']}>
                <StudentCourse />
              </RouteGuard>
            }
          />
          <Route
            path="/student/courses/:courseId/assessments/:assessmentId"
            element={
              <RouteGuard allowedRoles={['STUDENT']}>
                <StudentAssessment />
              </RouteGuard>
            }
          />

          {/* Teacher routes */}
          <Route
            path="/teacher/home"
            element={
              <RouteGuard allowedRoles={['TEACHER']}>
                <TeacherHome />
              </RouteGuard>
            }
          />
          <Route
            path="/teacher/courses/:courseId"
            element={
              <RouteGuard allowedRoles={['TEACHER']}>
                <TeacherCourse />
              </RouteGuard>
            }
          />
          <Route
            path="/teacher/courses/:courseId/students/:studentId"
            element={
              <RouteGuard allowedRoles={['TEACHER']}>
                <TeacherStudent />
              </RouteGuard>
            }
          />
          <Route
            path="/teacher/courses/:courseId/students/:studentId/assessments/:assessmentId"
            element={
              <RouteGuard allowedRoles={['TEACHER']}>
                <TeacherAssessment />
              </RouteGuard>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <RouteGuard allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RouteGuard>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
