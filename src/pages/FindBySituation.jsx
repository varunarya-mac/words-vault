import { useState } from 'react'
import { findBySituation } from '../services/openai'
import { createWord, createIdiom } from '../services/supabase'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

export default function FindBySituation({ showToast }) {
  const [situation, setSituation] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const examplePrompts = [
    "I need to praise someone professionally",
    "I want to express disagreement politely",
    "Describing something very difficult",
    "Talking about a surprising event"
  ]

  const handleSearch = async () => {
    if (!situation.trim()) {
      showToast('Please describe a situation', 'error')
      return
    }

    try {
      setLoading(true)
      const aiResults = await findBySituation(situation)
      setResults(aiResults)
    } catch (error) {
      showToast('Failed to find suggestions', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveWord = async (wordData) => {
    try {
      await createWord({
        word: wordData.word,
        meaning: wordData.reason,
        examples: [],
        tags: []
      })
      showToast('Word saved to library!', 'success')
    } catch (error) {
      showToast('Failed to save word', 'error')
    }
  }

  const handleSaveIdiom = async (idiomData) => {
    try {
      await createIdiom({
        idiom: idiomData.idiom,
        meaning: idiomData.reason,
        origin: '',
        examples: [],
        tags: []
      })
      showToast('Idiom saved to library!', 'success')
    } catch (error) {
      showToast('Failed to save idiom', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Find by Situation
          </h1>
          <p className="text-gray-600">
            Describe a situation and AI will suggest relevant words and idioms
          </p>
        </div>

        {/* Search Form */}
        <div className="glass-card p-6 mb-6">
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="Describe the situation where you want to use certain words or idioms..."
            className="textarea-field h-32 mb-4"
            disabled={loading}
          />

          <button
            onClick={handleSearch}
            disabled={loading || !situation.trim()}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Searching...' : '🔍 Find Suggestions'}
          </button>
        </div>

        {/* Example Prompts */}
        {!results && (
          <div className="glass-card p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Try these examples:</h2>
            <div className="space-y-2">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setSituation(prompt)}
                  className="block w-full text-left px-4 py-3 bg-white hover:bg-primary-50 rounded-lg transition-colors text-gray-700"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {loading && <Spinner />}

        {results && !loading && (
          <div className="space-y-6">
            {/* Words */}
            {results.words && results.words.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                  📚 Suggested Words
                </h2>
                <div className="space-y-4">
                  {results.words.map((word, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{word.word}</h3>
                        <button
                          onClick={() => handleSaveWord(word)}
                          className="text-sm bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700"
                        >
                          Save
                        </button>
                      </div>
                      <p className="text-gray-700">{word.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Idioms */}
            {results.idioms && results.idioms.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                  💬 Suggested Idioms
                </h2>
                <div className="space-y-4">
                  {results.idioms.map((idiom, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{idiom.idiom}</h3>
                        <button
                          onClick={() => handleSaveIdiom(idiom)}
                          className="text-sm bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700"
                        >
                          Save
                        </button>
                      </div>
                      <p className="text-gray-700">{idiom.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
