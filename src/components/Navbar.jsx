import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getItemsDueForReview } from '../services/supabase'

export default function Navbar() {
  const location = useLocation()
  const [dueCount, setDueCount] = useState(0)

  useEffect(() => {
    // Fetch due items count
    const fetchDueCount = async () => {
      try {
        const items = await getItemsDueForReview()
        setDueCount(items.length)
      } catch (error) {
        console.error('Error fetching due count:', error)
      }
    }

    fetchDueCount()
  }, [location]) // Refresh on navigation

  const tabs = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/words', icon: '📚', label: 'Words' },
    { path: '/idioms', icon: '💬', label: 'Idioms' },
    { path: '/add', icon: '➕', label: 'Add' },
    { path: '/quiz', icon: '🎯', label: 'Quiz', badge: dueCount > 0 ? dueCount : null }
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 z-40">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 relative ${
                isActive(tab.path)
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-2xl mb-1">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>

              {/* Badge for due items */}
              {tab.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}

              {/* Active indicator */}
              {isActive(tab.path) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
