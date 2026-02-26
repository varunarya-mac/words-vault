import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllIdioms, getAllTags } from '../services/supabase'
import IdiomCard from '../components/IdiomCard'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

export default function IdiomsLibrary({ showToast }) {
  const [idioms, setIdioms] = useState([])
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
      const [idiomsData, tagsData] = await Promise.all([
        getAllIdioms(),
        getAllTags()
      ])
      setIdioms(idiomsData)
      setAllTags(tagsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      showToast('Failed to load idioms', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filteredIdioms = idioms
    .filter(i => i.idiom.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(i => selectedTags.length === 0 || selectedTags.some(tag => i.tags && i.tags.includes(tag)))
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at)
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at)
      } else {
        return a.idiom.localeCompare(b.idiom)
      }
    })

  if (loading) return <Spinner fullScreen />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Idioms Library
          </h1>
          <p className="text-gray-600">
            {idioms.length} {idioms.length === 1 ? 'idiom' : 'idioms'} in your collection
          </p>
        </div>

        {/* Search Bar */}
        <div className="glass-card p-4 mb-4">
          <input
            type="text"
            placeholder="Search idioms..."
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

        {/* Idioms Grid */}
        {filteredIdioms.length === 0 ? (
          <EmptyState
            icon="💬"
            title={idioms.length === 0 ? "No idioms yet" : "No matching idioms"}
            description={idioms.length === 0 ? "Add your first idiom to get started" : "Try adjusting your search or filters"}
            action={idioms.length === 0 ? <Link to="/add" className="btn-primary">Add Your First Idiom</Link> : null}
          />
        ) : (
          <div className="space-y-4">
            {filteredIdioms.map((idiom) => (
              <IdiomCard key={idiom.id} idiom={idiom} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
