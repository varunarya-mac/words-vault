import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/Spinner'

export default function Login({ showToast }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      showToast('Please fill in all fields', 'error')
      return
    }

    setLoading(true)
    try {
      await signIn(email, password)
      showToast('Welcome back!', 'success')
      navigate(from, { replace: true })
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
            WordVault
          </h1>
          <p className="text-gray-600">
            Your AI-powered vocabulary builder
          </p>
        </div>

        {/* Form */}
        <div className="glass-card p-6 animate-fade-in">
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6 text-center">
            Login to your account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
