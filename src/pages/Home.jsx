import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../services/supabase'
import { getQuizTypeName, percentage } from '../utils/helpers'
import Spinner from '../components/Spinner'

export default function Home({ showToast }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const data = await getStats()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      showToast('Failed to load stats', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spinner fullScreen />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
            WordVault
          </h1>
          <p className="text-gray-600">
            Your AI-powered vocabulary companion
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 animate-slide-up">
          <div className="glass-card p-6">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {stats?.totalWords || 0}
            </div>
            <div className="text-gray-600 font-medium">Words</div>
          </div>

          <div className="glass-card p-6">
            <div className="text-4xl font-bold text-secondary-600 mb-2">
              {stats?.totalIdioms || 0}
            </div>
            <div className="text-gray-600 font-medium">Idioms</div>
          </div>

          <div className="glass-card p-6 col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-accent-600 mb-2">
                  {stats?.dueCount || 0}
                </div>
                <div className="text-gray-600 font-medium">Due for Review</div>
              </div>
              {stats?.dueCount > 0 && (
                <Link
                  to="/review"
                  className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow"
                >
                  Review Now
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/add" className="btn-primary text-center">
              ➕ Add New
            </Link>
            <Link to="/quiz" className="btn-secondary text-center">
              🎯 Take Quiz
            </Link>
            <Link to="/find" className="btn-secondary text-center">
              🔍 Find by Situation
            </Link>
            <Link to="/tags" className="btn-secondary text-center">
              🏷️ Manage Tags
            </Link>
          </div>
        </div>

        {/* Recent Quiz Results */}
        {stats?.recentQuizzes && stats.recentQuizzes.length > 0 && (
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
              Recent Quiz Results
            </h2>
            <div className="space-y-3">
              {stats.recentQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {getQuizTypeName(quiz.type)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(quiz.completed_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      percentage(quiz.score, quiz.total_questions) >= 80
                        ? 'text-green-600'
                        : percentage(quiz.score, quiz.total_questions) >= 60
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {percentage(quiz.score, quiz.total_questions)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {quiz.score}/{quiz.total_questions}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
