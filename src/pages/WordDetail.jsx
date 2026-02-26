import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getWordById, updateWord, deleteWord, createReviewSchedule, getReviewScheduleForItem } from '../services/supabase'
import { generateMoreExamples, simplifyExplanation } from '../services/openai'
import { formatDate } from '../utils/helpers'
import TagChip from '../components/TagChip'
import Spinner from '../components/Spinner'

export default function WordDetail({ showToast }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [word, setWord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generatingExamples, setGeneratingExamples] = useState(false)
  const [simplifying, setSimplifying] = useState(false)
  const [addingToReview, setAddingToReview] = useState(false)
  const [inReviewSchedule, setInReviewSchedule] = useState(false)

  useEffect(() => {
    fetchWord()
  }, [id])

  const fetchWord = async () => {
    try {
      setLoading(true)
      const data = await getWordById(id)
      setWord(data)

      // Check if in review schedule
      const schedule = await getReviewScheduleForItem('word', id)
      setInReviewSchedule(!!schedule)
    } catch (error) {
      console.error('Error fetching word:', error)
      showToast('Failed to load word', 'error')
      navigate('/words')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateExamples = async () => {
    try {
      setGeneratingExamples(true)
      const newExamples = await generateMoreExamples(word.word, word.examples || [], false)
      const updatedExamples = [...(word.examples || []), ...newExamples]
      await updateWord(id, { examples: updatedExamples })
      setWord({ ...word, examples: updatedExamples })
      showToast('New examples generated!', 'success')
    } catch (error) {
      console.error('Error generating examples:', error)
      showToast('Failed to generate examples', 'error')
    } finally {
      setGeneratingExamples(false)
    }
  }

  const handleSimplify = async () => {
    try {
      setSimplifying(true)
      const simpleExplanation = await simplifyExplanation(word.word, word.meaning, false)
      await updateWord(id, { simplified_meaning: simpleExplanation })
      setWord({ ...word, simplified_meaning: simpleExplanation })
      showToast('Simplified explanation added!', 'success')
    } catch (error) {
      console.error('Error simplifying:', error)
      showToast('Failed to simplify explanation', 'error')
    } finally {
      setSimplifying(false)
    }
  }

  const handleAddToReview = async () => {
    try {
      setAddingToReview(true)
      await createReviewSchedule('word', id)
      setInReviewSchedule(true)
      showToast('Added to review schedule!', 'success')
    } catch (error) {
      console.error('Error adding to review:', error)
      showToast('Failed to add to review', 'error')
    } finally {
      setAddingToReview(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this word?')) return

    try {
      await deleteWord(id)
      showToast('Word deleted successfully', 'success')
      navigate('/words')
    } catch (error) {
      console.error('Error deleting word:', error)
      showToast('Failed to delete word', 'error')
    }
  }

  if (loading) return <Spinner fullScreen />
  if (!word) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link to="/words" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          ← Back to Words
        </Link>

        {/* Word Card */}
        <div className="glass-card p-8 mb-6">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            {word.word}
          </h1>

          {/* Tags */}
          {word.tags && word.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {word.tags.map((tagName, index) => (
                <TagChip key={index} tag={{ name: tagName, color: 'purple' }} />
              ))}
            </div>
          )}

          {/* Meaning */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Meaning</h2>
            <p className="text-gray-800 leading-relaxed">{word.meaning}</p>
          </div>

          {/* Simplified Meaning */}
          {word.simplified_meaning && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">Simpler Explanation</h2>
              <p className="text-gray-800 leading-relaxed">{word.simplified_meaning}</p>
            </div>
          )}

          {/* Examples */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Examples</h2>
            {word.examples && word.examples.length > 0 ? (
              <ul className="space-y-2">
                {word.examples.map((example, index) => (
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

          {/* Metadata */}
          <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
            Added on {formatDate(word.created_at)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleGenerateExamples}
            disabled={generatingExamples}
            className="btn-secondary disabled:opacity-50"
          >
            {generatingExamples ? 'Generating...' : '✨ More Examples'}
          </button>
          <button
            onClick={handleSimplify}
            disabled={simplifying || word.simplified_meaning}
            className="btn-secondary disabled:opacity-50"
          >
            {simplifying ? 'Simplifying...' : '💡 Explain Simpler'}
          </button>
          <button
            onClick={handleAddToReview}
            disabled={addingToReview || inReviewSchedule}
            className="btn-secondary disabled:opacity-50"
          >
            {inReviewSchedule ? '✓ In Review' : '📝 Add to Review'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-600 transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  )
}
