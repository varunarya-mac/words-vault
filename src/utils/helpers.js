/**
 * Utility helper functions for WordVault
 */

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array (new array, original unchanged)
 */
export function shuffle(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Convert a date to relative time string (e.g., "2 hours ago")
 * @param {string|Date} date - Date to convert
 * @returns {string} Relative time string
 */
export function timeAgo(date) {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) {
    return 'just now'
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`
  } else if (diffDay < 7) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`
  } else if (diffWeek < 4) {
    return `${diffWeek} ${diffWeek === 1 ? 'week' : 'weeks'} ago`
  } else if (diffMonth < 12) {
    return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`
  } else {
    return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`
  }
}

/**
 * Get Tailwind color classes for a tag color name
 * @param {string} colorName - Color name (e.g., 'purple', 'blue')
 * @returns {Object} Object with bg, text, and border classes
 */
export function getTagColor(colorName) {
  const colorMap = {
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
      bgDark: 'bg-purple-500'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      bgDark: 'bg-blue-500'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      bgDark: 'bg-green-500'
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-700',
      border: 'border-indigo-300',
      bgDark: 'bg-indigo-500'
    },
    pink: {
      bg: 'bg-pink-100',
      text: 'text-pink-700',
      border: 'border-pink-300',
      bgDark: 'bg-pink-500'
    },
    cyan: {
      bg: 'bg-cyan-100',
      text: 'text-cyan-700',
      border: 'border-cyan-300',
      bgDark: 'bg-cyan-500'
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      bgDark: 'bg-yellow-500'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      bgDark: 'bg-red-500'
    },
    gray: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
      bgDark: 'bg-gray-500'
    }
  }

  return colorMap[colorName.toLowerCase()] || colorMap.gray
}

/**
 * Format a date to a readable string
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export function formatDate(date, includeTime = false) {
  const d = new Date(date)
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return d.toLocaleDateString('en-US', options)
}

/**
 * Truncate text to a maximum length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis if needed
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Get a random item from an array
 * @param {Array} array - Array to pick from
 * @returns {*} Random item
 */
export function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Calculate percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @returns {number} Percentage (0-100)
 */
export function percentage(value, total) {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Check if the app is running in standalone mode (PWA)
 * @returns {boolean} Whether app is in standalone mode
 */
export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  )
}

/**
 * Check if the device is online
 * @returns {boolean} Whether device is online
 */
export function isOnline() {
  return navigator.onLine
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Get available tag colors
 * @returns {Array<string>} Array of color names
 */
export function getAvailableColors() {
  return ['purple', 'blue', 'green', 'indigo', 'pink', 'cyan', 'yellow', 'red', 'gray']
}

/**
 * Validate if a string is not empty after trimming
 * @param {string} str - String to validate
 * @returns {boolean} Whether string is valid
 */
export function isValidString(str) {
  return typeof str === 'string' && str.trim().length > 0
}

/**
 * Get quiz type display name
 * @param {string} type - Quiz type slug
 * @returns {string} Display name
 */
export function getQuizTypeName(type) {
  const typeMap = {
    'meaning_match': 'Meaning Match',
    'fill_blank': 'Fill in the Blank',
    'situation_match': 'Situation Match'
  }
  return typeMap[type] || type
}

/**
 * Calculate reading time for text
 * @param {string} text - Text to analyze
 * @param {number} wordsPerMinute - Reading speed
 * @returns {number} Reading time in minutes
 */
export function getReadingTime(text, wordsPerMinute = 200) {
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
