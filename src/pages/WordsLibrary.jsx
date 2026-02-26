import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllWords, getAllTags } from '../services/supabase'
import WordCard from '../components/WordCard'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

export default function WordsLibrary({ showToast }) {
  const [words, setWords] = useState([])
  const [allTags, setAllTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [wordsData, tagsData] = await Promise.all([
        getAllWords(),
        getAllTags()
      ])
      setWords(wordsData)
      setAllTags(tagsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      showToast('Failed to load words', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filteredWords = words
    .filter(w => w.word.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(w => selectedTags.length === 0 || selectedTags.some(tag => w.tags && w.tags.includes(tag)))
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at)
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at)
      } else {
        return a.word.localeCompare(b.word)
      }
    })

  if (loading) return <Spinner fullScreen />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Words Library
          </h1>
          <p className="text-gray-600">
            {words.length} {words.length === 1 ? 'word' : 'words'} in your collection
          </p>
        </div>

        {/* Search Bar */}
        <div className="glass-card p-4 mb-4">
          <input
            type="text"
            placeholder="Search words..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by tags
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    if (selectedTags.includes(tag.name)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag.name))
                    } else {
                      setSelectedTags([...selectedTags, tag.name])
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag.name)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Words Grid */}
        {filteredWords.length === 0 ? (
          <EmptyState
            icon="📚"
            title={words.length === 0 ? "No words yet" : "No matching words"}
            description={words.length === 0 ? "Add your first word to get started" : "Try adjusting your search or filters"}
            action={words.length === 0 ? <Link to="/add" className="btn-primary">Add Your First Word</Link> : null}
          />
        ) : (
          <div className="space-y-4">
            {filteredWords.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
