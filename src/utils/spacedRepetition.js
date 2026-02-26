/**
 * SM-2 Spaced Repetition Algorithm
 *
 * This implements the SuperMemo 2 algorithm for optimal review scheduling.
 *
 * Quality ratings:
 * 0 - Complete blackout
 * 1 - Incorrect response, but familiar
 * 2 - Incorrect response, but easy to recall correct one
 * 3 - Correct response, but with difficulty
 * 4 - Correct response, after hesitation
 * 5 - Perfect response
 */

/**
 * Calculate the next review schedule based on quality rating
 * @param {number} quality - Quality rating (0-5)
 * @param {Object} currentData - Current schedule data
 * @returns {Object} New schedule data
 */
export function calculateNextReview(quality, currentData = {}) {
  // Default values for new items
  let easinessFactor = currentData.easiness_factor || 2.5
  let repetitionCount = currentData.repetition_count || 0
  let intervalDays = currentData.interval_days || 1

  // If quality < 3, reset the learning process
  if (quality < 3) {
    repetitionCount = 0
    intervalDays = 1
  } else {
    // Increment repetition count
    repetitionCount += 1

    // Calculate interval based on repetition count
    if (repetitionCount === 1) {
      intervalDays = 1
    } else if (repetitionCount === 2) {
      intervalDays = 6
    } else {
      intervalDays = Math.round(intervalDays * easinessFactor)
    }
  }

  // Update easiness factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  // Ensure easiness factor doesn't go below 1.3
  if (easinessFactor < 1.3) {
    easinessFactor = 1.3
  }

  // Calculate next review date
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays)

  return {
    easiness_factor: Math.round(easinessFactor * 100) / 100, // Round to 2 decimals
    repetition_count: repetitionCount,
    interval_days: intervalDays,
    next_review_at: nextReviewDate.toISOString()
  }
}

/**
 * Map user-friendly rating to quality number
 * @param {string} rating - 'again', 'hard', 'good', or 'easy'
 * @returns {number} Quality rating (0-5)
 */
export function ratingToQuality(rating) {
  const ratingMap = {
    'again': 1,  // Need to see it again soon
    'hard': 3,   // Correct but difficult
    'good': 4,   // Correct with some hesitation
    'easy': 5    // Perfect recall
  }

  return ratingMap[rating.toLowerCase()] || 3
}

/**
 * Get the next review interval in human-readable format
 * @param {number} intervalDays - Interval in days
 * @returns {string} Human-readable interval
 */
export function getIntervalText(intervalDays) {
  if (intervalDays === 1) {
    return '1 day'
  } else if (intervalDays < 7) {
    return `${intervalDays} days`
  } else if (intervalDays < 30) {
    const weeks = Math.round(intervalDays / 7)
    return weeks === 1 ? '1 week' : `${weeks} weeks`
  } else if (intervalDays < 365) {
    const months = Math.round(intervalDays / 30)
    return months === 1 ? '1 month' : `${months} months`
  } else {
    const years = Math.round(intervalDays / 365)
    return years === 1 ? '1 year' : `${years} years`
  }
}

/**
 * Check if an item is due for review
 * @param {string|Date} nextReviewAt - Next review date
 * @returns {boolean} Whether the item is due
 */
export function isDue(nextReviewAt) {
  const now = new Date()
  const reviewDate = new Date(nextReviewAt)
  return reviewDate <= now
}

/**
 * Get the number of days until next review
 * @param {string|Date} nextReviewAt - Next review date
 * @returns {number} Days until review (negative if overdue)
 */
export function getDaysUntilReview(nextReviewAt) {
  const now = new Date()
  const reviewDate = new Date(nextReviewAt)
  const diffTime = reviewDate - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Get status text for an item's review schedule
 * @param {string|Date} nextReviewAt - Next review date
 * @returns {string} Status text
 */
export function getReviewStatus(nextReviewAt) {
  const days = getDaysUntilReview(nextReviewAt)

  if (days < 0) {
    const overdueDays = Math.abs(days)
    return `Overdue by ${overdueDays} ${overdueDays === 1 ? 'day' : 'days'}`
  } else if (days === 0) {
    return 'Due today'
  } else if (days === 1) {
    return 'Due tomorrow'
  } else if (days < 7) {
    return `Due in ${days} days`
  } else {
    return `Due in ${getIntervalText(days)}`
  }
}

/**
 * Calculate retention probability based on time since last review
 * This is a simplified model for visualization purposes
 * @param {number} daysSinceReview - Days since last review
 * @param {number} easinessFactor - Current easiness factor
 * @returns {number} Estimated retention probability (0-1)
 */
export function estimateRetention(daysSinceReview, easinessFactor = 2.5) {
  // Simplified forgetting curve: R = e^(-t/S)
  // where S is stability (related to easiness factor)
  const stability = easinessFactor * 2
  const retention = Math.exp(-daysSinceReview / stability)
  return Math.max(0, Math.min(1, retention))
}
