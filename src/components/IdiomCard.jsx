import { useNavigate } from 'react-router-dom'
import { timeAgo, truncate } from '../utils/helpers'
import TagChip from './TagChip'

export default function IdiomCard({ idiom }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/idiom/${idiom.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="glass-card p-5 cursor-pointer hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-fade-in"
    >
      {/* Idiom Title */}
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-2">
        {idiom.idiom}
      </h3>

      {/* Meaning */}
      <p className="text-gray-700 mb-2 leading-relaxed">
        {truncate(idiom.meaning, 120)}
      </p>

      {/* Origin (if available) */}
      {idiom.origin && (
        <p className="text-sm text-gray-600 italic mb-3">
          {truncate(idiom.origin, 80)}
        </p>
      )}

      {/* Tags */}
      {idiom.tags && idiom.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {idiom.tags.slice(0, 3).map((tagName, index) => (
            <TagChip
              key={index}
              tag={{ name: tagName, color: 'blue' }}
              size="sm"
            />
          ))}
          {idiom.tags.length > 3 && (
            <span className="text-xs text-gray-500 self-center">
              +{idiom.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-200">
        <span>{Array.isArray(idiom.examples) ? idiom.examples.length : 0} examples</span>
        <span>{timeAgo(idiom.created_at)}</span>
      </div>
    </div>
  )
}
