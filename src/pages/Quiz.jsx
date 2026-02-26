import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getItemsDueForReview, getQuizHistory } from '../services/supabase'
import { percentage, getQuizTypeName } from '../utils/helpers'
import Spinner from '../components/Spinner'

export default function Quiz({ showToast }) {
  const [dueCount, setDueCount] = useState(0)
  const [recentQuizzes, setRecentQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [dueItems, quizzes] = await Promise.all([
        getItemsDueForReview(),
        getQuizHistory(5)
      ])
      setDueCount(dueItems.length)
      setRecentQuizzes(quizzes)
    } catch (error) {
      showToast('Failed to load quiz data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const quizTypes = [
    {
      type: 'meaning_match',
      icon: '🎯',
      title: 'Meaning Match',
      description: 'Match words/idioms with their meanings',
      color: 'from-purple-500 to-purple-600'
    },
    {
      type: 'fill_blank',
      icon: '✍️',
      title: 'Fill in the Blank',
      description: 'Complete sentences with the right word',
      color: 'from-blue-500 to-blue-600'
    },
    {
      type: 'situation_match',
      icon: '🎭',
      title: 'Situation Match',
      description: 'Match situations with appropriate words',
      color: 'from-green-500 to-green-600'
    }
  ]

  if (loading) return <Spinner fullScreen />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Quiz Center
          </h1>
          <p className="text-gray-600">
            Test your vocabulary knowledge
          </p>
        </div>

        {/* Due Review Alert */}
        {dueCount > 0 && (
          <div className="glass-card p-5 mb-6 bg-gradient-to-r from-accent-500/10 to-accent-600/10 border-2 border-accent-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  📝 {dueCount} items due for review
                </h3>
                <p className="text-sm text-gray-600">
                  Review them now to improve retention
                </p>
              </div>
              <Link
                to="/review"
                className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow"
              >
                Review Now
              </Link>
            </div>
          </div>
        )}

        {/* Quiz Types */}
        <div className="space-y-4 mb-8">
          {quizTypes.map((quiz) => (
            <Link
              key={quiz.type}
              to={`/quiz/${quiz.type}`}
              className="block glass-card p-6 hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${quiz.color} flex items-center justify-center text-3xl`}>
                  {quiz.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-1">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {quiz.description}
                  </p>
                </div>
                <div className="text-gray-400">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Quizzes */}
        {recentQuizzes.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
              Recent Results
            </h2>
            <div className="space-y-3">
              {recentQuizzes.map((quiz) => (
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
