import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWord, createIdiom } from '../services/supabase'
import AddForm from '../components/AddForm'

export default function AddNew({ showToast }) {
  const [type, setType] = useState('word')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (generatedData) => {
    setLoading(true)
    try {
      if (type === 'word') {
        const newWord = await createWord(generatedData)
        showToast('Word added successfully!', 'success')
        navigate(`/word/${newWord.id}`)
      } else {
        const newIdiom = await createIdiom(generatedData)
        showToast('Idiom added successfully!', 'success')
        navigate(`/idiom/${newIdiom.id}`)
      }
    } catch (error) {
      console.error('Error adding item:', error)
      showToast('Failed to add item', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Add New
          </h1>
          <p className="text-gray-600">
            AI will generate meaning, examples, and more
          </p>
        </div>

        {/* Type Toggle */}
        <div className="glass-card p-2 mb-6 inline-flex rounded-xl">
          <button
            onClick={() => setType('word')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              type === 'word'
                ? 'bg-white text-primary-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📚 Word
          </button>
          <button
            onClick={() => setType('idiom')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              type === 'idiom'
                ? 'bg-white text-primary-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            💬 Idiom
          </button>
        </div>

        {/* Form */}
        <div className="glass-card p-6">
          <AddForm
            type={type}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
