import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'

// Public layout components
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

// Public pages
import Home from './Components/Home'
import About from './Components/About'
import Portfolio from './Components/Portfolio'
import ProjectDetail from './Components/ProjectDetail'
import Services from './Components/Services'
import Contact from './Components/Contact'

// Admin pages
import LoginPage from './admin/LoginPage'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import ProjectList from './admin/projects/ProjectList'
import ProjectForm from './admin/projects/ProjectForm'
import SectionList from './admin/sections/SectionList'
import SectionForm from './admin/sections/SectionForm'
import MediaLibrary from './admin/media/MediaLibrary'
import Settings from './admin/settings/Settings'

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Public Routes ── */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <About />
              </PublicLayout>
            }
          />
          <Route
            path="/portfolio"
            element={
              <PublicLayout>
                <Portfolio />
              </PublicLayout>
            }
          />
          <Route
            path="/portfolio/:slug"
            element={
              <PublicLayout>
                <ProjectDetail />
              </PublicLayout>
            }
          />
          <Route
            path="/services"
            element={
              <PublicLayout>
                <Services />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />

          {/* ── Admin Routes ── */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:id/edit" element={<ProjectForm />} />
            <Route path="sections" element={<SectionList />} />
            <Route path="sections/new" element={<SectionForm />} />
            <Route path="sections/:id/edit" element={<SectionForm />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4 gap-4">
                <h1 className="text-5xl font-extrabold text-white" style={{ fontFamily: 'var(--font-heading)' }}>404</h1>
                <p className="text-white/50">Page not found.</p>
                <a href="/" className="text-[#05d1ed] hover:underline text-sm">← Back to home</a>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
