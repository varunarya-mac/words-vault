import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getIdiomById, updateIdiom, deleteIdiom, createReviewSchedule, getReviewScheduleForItem } from '../services/supabase'
import { generateMoreExamples, simplifyExplanation } from '../services/openai'
import { formatDate } from '../utils/helpers'
import TagChip from '../components/TagChip'
import Spinner from '../components/Spinner'

export default function IdiomDetail({ showToast }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [idiom, setIdiom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generatingExamples, setGeneratingExamples] = useState(false)
  const [simplifying, setSimplifying] = useState(false)
  const [addingToReview, setAddingToReview] = useState(false)
  const [inReviewSchedule, setInReviewSchedule] = useState(false)

  useEffect(() => {
    fetchIdiom()
  }, [id])

  const fetchIdiom = async () => {
    try {
      setLoading(true)
      const data = await getIdiomById(id)
      setIdiom(data)
      const schedule = await getReviewScheduleForItem('idiom', id)
      setInReviewSchedule(!!schedule)
    } catch (error) {
      showToast('Failed to load idiom', 'error')
      navigate('/idioms')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateExamples = async () => {
    try {
      setGeneratingExamples(true)
      const newExamples = await generateMoreExamples(idiom.idiom, idiom.examples || [], true)
      const updatedExamples = [...(idiom.examples || []), ...newExamples]
      await updateIdiom(id, { examples: updatedExamples })
      setIdiom({ ...idiom, examples: updatedExamples })
      showToast('New examples generated!', 'success')
    } catch (error) {
      showToast('Failed to generate examples', 'error')
    } finally {
      setGeneratingExamples(false)
    }
  }

  const handleSimplify = async () => {
    try {
      setSimplifying(true)
      const simpleExplanation = await simplifyExplanation(idiom.idiom, idiom.meaning, true)
      await updateIdiom(id, { simplified_meaning: simpleExplanation })
      setIdiom({ ...idiom, simplified_meaning: simpleExplanation })
      showToast('Simplified explanation added!', 'success')
    } catch (error) {
      showToast('Failed to simplify explanation', 'error')
    } finally {
      setSimplifying(false)
    }
  }

  const handleAddToReview = async () => {
    try {
      setAddingToReview(true)
      await createReviewSchedule('idiom', id)
      setInReviewSchedule(true)
      showToast('Added to review schedule!', 'success')
    } catch (error) {
      showToast('Failed to add to review', 'error')
    } finally {
      setAddingToReview(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this idiom?')) return
    try {
      await deleteIdiom(id)
      showToast('Idiom deleted successfully', 'success')
      navigate('/idioms')
    } catch (error) {
      showToast('Failed to delete idiom', 'error')
    }
  }

  if (loading) return <Spinner fullScreen />
  if (!idiom) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <Link to="/idioms" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          ← Back to Idioms
        </Link>

        <div className="glass-card p-8 mb-6">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">{idiom.idiom}</h1>

          {idiom.tags && idiom.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {idiom.tags.map((tagName, index) => (
                <TagChip key={index} tag={{ name: tagName, color: 'blue' }} />
              ))}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Meaning</h2>
            <p className="text-gray-800 leading-relaxed">{idiom.meaning}</p>
          </div>

          {idiom.origin && (
            <div className="mb-6 p-4 bg-amber-50 rounded-lg">
              <h2 className="text-lg font-semibold text-amber-700 mb-2">Origin</h2>
              <p className="text-gray-800 leading-relaxed">{idiom.origin}</p>
            </div>
          )}

          {idiom.simplified_meaning && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">Simpler Explanation</h2>
              <p className="text-gray-800 leading-relaxed">{idiom.simplified_meaning}</p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Examples</h2>
            {idiom.examples && idiom.examples.length > 0 ? (
              <ul className="space-y-2">
                {idiom.examples.map((example, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-primary-600 font-bold">{index + 1}.</span>
                    <span className="text-gray-800">{example}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No examples yet</p>
            )}
          </div>

          <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
            Added on {formatDate(idiom.created_at)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={handleGenerateExamples} disabled={generatingExamples} className="btn-secondary disabled:opacity-50">
            {generatingExamples ? 'Generating...' : '✨ More Examples'}
          </button>
          <button onClick={handleSimplify} disabled={simplifying || idiom.simplified_meaning} className="btn-secondary disabled:opacity-50">
            {simplifying ? 'Simplifying...' : '💡 Explain Simpler'}
          </button>
          <button onClick={handleAddToReview} disabled={addingToReview || inReviewSchedule} className="btn-secondary disabled:opacity-50">
            {inReviewSchedule ? '✓ In Review' : '📝 Add to Review'}
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-600 transition-colors">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  )
}
