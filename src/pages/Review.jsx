import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getItemsDueForReview, updateReviewSchedule, getWordById, getIdiomById } from '../services/supabase'
import { calculateNextReview, ratingToQuality } from '../utils/spacedRepetition'
import FlashCard from '../components/FlashCard'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

export default function Review({ showToast }) {
  const navigate = useNavigate()
  const [dueItems, setDueItems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    loadDueItems()
  }, [])

  const loadDueItems = async () => {
    try {
      setLoading(true)
      const items = await getItemsDueForReview()

      // Fetch full details for each item
      const itemsWithDetails = await Promise.all(items.map(async item => {
        const details = item.item_type === 'word'
          ? await getWordById(item.item_id)
          : await getIdiomById(item.item_id)
        return { ...item, details }
      }))

      setDueItems(itemsWithDetails)
    } catch (error) {
      showToast('Failed to load review items', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRating = async (rating) => {
    const currentItem = dueItems[currentIndex]
    const quality = ratingToQuality(rating)

    try {
      // Calculate next review schedule using SM-2 algorithm
      const newSchedule = calculateNextReview(quality, {
        easiness_factor: currentItem.easiness_factor,
        interval_days: currentItem.interval_days,
        repetition_count: currentItem.repetition_count
      })

      // Update in database
      await updateReviewSchedule(currentItem.id, newSchedule)

      // Move to next item or complete
      if (currentIndex < dueItems.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setFlipped(false)
      } else {
        setCompleted(true)
      }
    } catch (error) {
      showToast('Failed to update review schedule', 'error')
    }
  }

  if (loading) return <Spinner fullScreen />

  if (dueItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <EmptyState
            icon="✨"
            title="All caught up!"
            description="No items due for review right now. Great job!"
            action={
              <button onClick={() => navigate('/quiz')} className="btn-primary">
                Take a Quiz Instead
              </button>
            }
          />
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24 flex items-center justify-center">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Review Complete!
          </h2>
          <p className="text-gray-600 mb-6">
            You reviewed {dueItems.length} {dueItems.length === 1 ? 'item' : 'items'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const currentItem = dueItems[currentIndex]
  const text = currentItem.details.word || currentItem.details.idiom
  const meaning = currentItem.details.meaning

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-6 text-center">
          <p className="text-gray-600 font-medium">
            {currentIndex + 1} / {dueItems.length}
          </p>
        </div>

        {/* Flashcard */}
        <div className="mb-8">
          <FlashCard
            front={text}
            back={meaning}
            flipped={flipped}
            onFlip={() => setFlipped(!flipped)}
          />
        </div>

        {/* Rating Buttons (only show when flipped) */}
        {flipped && (
          <div className="glass-card p-6 animate-slide-up">
            <p className="text-center text-gray-700 font-medium mb-4">
              How well did you remember?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleRating('again')}
                className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
              >
                <div className="text-2xl mb-1">😕</div>
                <div>Again</div>
                <div className="text-xs opacity-80">Review in 1 day</div>
              </button>
              <button
                onClick={() => handleRating('hard')}
                className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold transition-colors"
              >
                <div className="text-2xl mb-1">🤔</div>
                <div>Hard</div>
                <div className="text-xs opacity-80">Review soon</div>
              </button>
              <button
                onClick={() => handleRating('good')}
                className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
              >
                <div className="text-2xl mb-1">😊</div>
                <div>Good</div>
                <div className="text-xs opacity-80">Review later</div>
              </button>
              <button
                onClick={() => handleRating('easy')}
                className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors"
              >
                <div className="text-2xl mb-1">😄</div>
                <div>Easy</div>
                <div className="text-xs opacity-80">Review much later</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
