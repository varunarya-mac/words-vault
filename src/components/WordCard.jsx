import { useNavigate } from 'react-router-dom'
import { timeAgo, truncate } from '../utils/helpers'
import TagChip from './TagChip'

export default function WordCard({ word }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/word/${word.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="glass-card p-5 cursor-pointer hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-fade-in"
    >
      {/* Word Title */}
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-2">
        {word.word}
      </h3>

      {/* Meaning */}
      <p className="text-gray-700 mb-3 leading-relaxed">
        {truncate(word.meaning, 120)}
      </p>

      {/* Tags */}
      {word.tags && word.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {word.tags.slice(0, 3).map((tagName, index) => (
            <TagChip
              key={index}
              tag={{ name: tagName, color: 'purple' }}
              size="sm"
            />
          ))}
          {word.tags.length > 3 && (
            <span className="text-xs text-gray-500 self-center">
              +{word.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-200">
        <span>{Array.isArray(word.examples) ? word.examples.length : 0} examples</span>
        <span>{timeAgo(word.created_at)}</span>
      </div>
    </div>
  )
}
