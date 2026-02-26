import { getTagColor } from '../utils/helpers'

export default function TagChip({ tag, onDelete = null, size = 'md' }) {
  const colors = getTagColor(tag.color || 'gray')

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  return (
    <span
      className={`${colors.bg} ${colors.text} ${sizeClasses[size]} rounded-full font-medium inline-flex items-center gap-2 border ${colors.border}`}
    >
      <span>{tag.name}</span>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(tag)
          }}
          className="hover:opacity-70 transition-opacity"
          aria-label="Remove tag"
        >
          ✕
        </button>
      )}
    </span>
  )
}
