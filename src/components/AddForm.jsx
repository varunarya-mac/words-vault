import { useState, useEffect } from 'react'
import { getAllTags } from '../services/supabase'
import { generateWordContent, generateIdiomContent } from '../services/openai'
import TagChip from './TagChip'
import Spinner from './Spinner'

export default function AddForm({ type, onSubmit, loading: externalLoading }) {
  const [text, setText] = useState('')
  const [allTags, setAllTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  const isWord = type === 'word'
  const placeholder = isWord ? 'Enter a word...' : 'Enter an idiom or phrase...'
  const label = isWord ? 'Word' : 'Idiom'

  // Fetch available tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags()
        setAllTags(tags)
      } catch (error) {
        console.error('Error fetching tags:', error)
      }
    }
    fetchTags()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!text.trim()) {
      setError(`Please enter a ${type}`)
      return
    }

    try {
      setGenerating(true)

      // Generate content using AI
      const aiContent = isWord
        ? await generateWordContent(text.trim())
        : await generateIdiomContent(text.trim())

      // Combine with selected tags
      const fullData = {
        ...aiContent,
        tags: selectedTags.map(tag => tag.name)
      }

      // Pass to parent component
      onSubmit(fullData)

      // Reset form
      setText('')
      setSelectedTags([])
    } catch (error) {
      console.error('Error generating content:', error)
      setError(error.message || 'Failed to generate content. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const toggleTag = (tag) => {
    if (selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const isLoading = generating || externalLoading

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="input-field"
          disabled={isLoading}
        />
      </div>

      {/* Tag Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedTags.find(t => t.id === tag.id)
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isLoading}
            >
              {tag.name}
            </button>
          ))}
        </div>

        {selectedTags.length > 0 && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">Selected tags:</p>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <TagChip
                  key={tag.id}
                  tag={tag}
                  onDelete={() => toggleTag(tag)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />
            <span>Generating with AI...</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span>Generate {label}</span>
          </>
        )}
      </button>

      {/* Info Text */}
      {!isLoading && (
        <p className="text-sm text-gray-500 text-center">
          AI will generate the meaning, examples, and {isWord ? '' : 'origin '}automatically
        </p>
      )}
    </form>
  )
}
