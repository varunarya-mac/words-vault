import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

// Components
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import WordsLibrary from './pages/WordsLibrary'
import IdiomsLibrary from './pages/IdiomsLibrary'
import AddNew from './pages/AddNew'
import WordDetail from './pages/WordDetail'
import IdiomDetail from './pages/IdiomDetail'
import FindBySituation from './pages/FindBySituation'
import Quiz from './pages/Quiz'
import QuizSession from './pages/QuizSession'
import Review from './pages/Review'
import TagsManager from './pages/TagsManager'

function AppContent() {
  const [toast, setToast] = useState(null)
  const location = useLocation()

  // Global toast function that can be passed to all pages
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    // Auto-dismiss after 3 seconds
    setTimeout(() => setToast(null), 3000)
  }

  // Hide navbar on login page
  const showNavbar = location.pathname !== '/login'

  return (
    <div className="min-h-screen pb-20">
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login showToast={showToast} />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Home showToast={showToast} /></ProtectedRoute>} />
        <Route path="/words" element={<ProtectedRoute><WordsLibrary showToast={showToast} /></ProtectedRoute>} />
        <Route path="/idioms" element={<ProtectedRoute><IdiomsLibrary showToast={showToast} /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><AddNew showToast={showToast} /></ProtectedRoute>} />
        <Route path="/word/:id" element={<ProtectedRoute><WordDetail showToast={showToast} /></ProtectedRoute>} />
        <Route path="/idiom/:id" element={<ProtectedRoute><IdiomDetail showToast={showToast} /></ProtectedRoute>} />
        <Route path="/find" element={<ProtectedRoute><FindBySituation showToast={showToast} /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><Quiz showToast={showToast} /></ProtectedRoute>} />
        <Route path="/quiz/:type" element={<ProtectedRoute><QuizSession showToast={showToast} /></ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute><Review showToast={showToast} /></ProtectedRoute>} />
        <Route path="/tags" element={<ProtectedRoute><TagsManager showToast={showToast} /></ProtectedRoute>} />
      </Routes>

      {/* Global Navbar - hidden on login page */}
      {showNavbar && <Navbar />}

      {/* Global Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
