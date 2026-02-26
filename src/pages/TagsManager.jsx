import { useState, useEffect } from 'react'
import { getAllTags, createTag, deleteTag } from '../services/supabase'
import { getAvailableColors, getTagColor } from '../utils/helpers'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import TagChip from '../components/TagChip'

export default function TagsManager({ showToast }) {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [selectedColor, setSelectedColor] = useState('purple')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      setLoading(true)
      const data = await getAllTags()
      setTags(data)
    } catch (error) {
      console.error('Error fetching tags:', error)
      showToast('Failed to load tags', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()

    if (!newTagName.trim()) {
      showToast('Please enter a tag name', 'error')
      return
    }

    try {
      setCreating(true)
      await createTag(newTagName.trim(), selectedColor)
      showToast('Tag created successfully!', 'success')
      setNewTagName('')
      setSelectedColor('purple')
      setShowForm(false)
      fetchTags()
    } catch (error) {
      console.error('Error creating tag:', error)
      showToast('Failed to create tag', 'error')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (tag) => {
    if (!confirm(`Delete tag "${tag.name}"? This won't remove it from existing words/idioms.`)) {
      return
    }

    try {
      await deleteTag(tag.id)
      showToast('Tag deleted successfully!', 'success')
      fetchTags()
    } catch (error) {
      console.error('Error deleting tag:', error)
      showToast('Failed to delete tag', 'error')
    }
  }

  if (loading) return <Spinner fullScreen />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Manage Tags
          </h1>
          <p className="text-gray-600">
            Organize your vocabulary with custom tags
          </p>
        </div>

        {/* Add Tag Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary w-full mb-6"
          >
            ➕ Create New Tag
          </button>
        )}

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="glass-card p-6 mb-6 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              New Tag
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tag Name
              </label>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="e.g., Business, Academic..."
                className="input-field"
                disabled={creating}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="grid grid-cols-3 gap-3">
                {getAvailableColors().map((color) => {
                  const colorClasses = getTagColor(color)
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? 'border-primary-600 scale-105'
                          : 'border-gray-200'
                      } ${colorClasses.bg}`}
                      disabled={creating}
                    >
                      <div className="font-medium capitalize text-gray-900">
                        {color}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Preview */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <TagChip
                  tag={{ name: newTagName || 'Preview', color: selectedColor }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating || !newTagName.trim()}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Tag'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setNewTagName('')
                  setSelectedColor('purple')
                }}
                className="btn-secondary flex-1"
                disabled={creating}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Tags List */}
        {tags.length === 0 ? (
          <EmptyState
            icon="🏷️"
            title="No tags yet"
            description="Create your first tag to start organizing your vocabulary"
          />
        ) : (
          <div className="space-y-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="glass-card p-5 flex items-center justify-between hover:shadow-xl transition-shadow"
              >
                <TagChip tag={tag} size="lg" />
                <button
                  onClick={() => handleDelete(tag)}
                  className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
