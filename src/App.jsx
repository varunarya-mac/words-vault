import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Components
import Navbar from './components/Navbar'
import Toast from './components/Toast'

// Pages
import Home from './pages/Home'
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

function App() {
  const [toast, setToast] = useState(null)

  // Global toast function that can be passed to all pages
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    // Auto-dismiss after 3 seconds
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen pb-20">
        <Routes>
          <Route path="/" element={<Home showToast={showToast} />} />
          <Route path="/words" element={<WordsLibrary showToast={showToast} />} />
          <Route path="/idioms" element={<IdiomsLibrary showToast={showToast} />} />
          <Route path="/add" element={<AddNew showToast={showToast} />} />
          <Route path="/word/:id" element={<WordDetail showToast={showToast} />} />
          <Route path="/idiom/:id" element={<IdiomDetail showToast={showToast} />} />
          <Route path="/find" element={<FindBySituation showToast={showToast} />} />
          <Route path="/quiz" element={<Quiz showToast={showToast} />} />
          <Route path="/quiz/:type" element={<QuizSession showToast={showToast} />} />
          <Route path="/review" element={<Review showToast={showToast} />} />
          <Route path="/tags" element={<TagsManager showToast={showToast} />} />
        </Routes>

        {/* Global Navbar - appears on all pages */}
        <Navbar />

        {/* Global Toast Notification */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </BrowserRouter>
  )
}

export default App
