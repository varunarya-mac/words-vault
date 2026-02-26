import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRandomItems, saveQuizResult } from '../services/supabase'
import { generateFillInBlank, generateSituationMatch, getRandomDistractors } from '../services/openai'
import { shuffle } from '../utils/helpers'
import Spinner from '../components/Spinner'

export default function QuizSession({ showToast }) {
  const { type } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  useEffect(() => {
    generateQuestions()
  }, [type])

  const generateQuestions = async () => {
    try {
      setLoading(true)
      const items = await getRandomItems(10, 'both')

      if (items.length === 0) {
        showToast('Add some words or idioms first!', 'error')
        navigate('/quiz')
        return
      }

      let questionData = []

      if (type === 'meaning_match') {
        // Pre-generate all questions (no AI during quiz)
        const allMeanings = items.map(item => item.type === 'word' ? item.meaning : item.meaning)
        questionData = items.map(item => {
          const correctMeaning = item.type === 'word' ? item.meaning : item.meaning
          const otherMeanings = allMeanings.filter(m => m !== correctMeaning)
          const shuffledOthers = shuffle(otherMeanings).slice(0, 3)
          return {
            question: item.type === 'word' ? item.word : item.idiom,
            correctAnswer: correctMeaning,
            options: shuffle([correctMeaning, ...shuffledOthers])
          }
        })
      } else if (type === 'fill_blank') {
        // AI generates sentences
        questionData = await Promise.all(items.map(async item => {
          const text = item.type === 'word' ? item.word : item.idiom
          try {
            const result = await generateFillInBlank(text, item.type === 'idiom')
            return {
              question: result.sentence,
              correctAnswer: text,
              options: shuffle(result.options)
            }
          } catch {
            return {
              question: `Complete: _____ is used here`,
              correctAnswer: text,
              options: shuffle([text, 'option1', 'option2', 'option3'])
            }
          }
        }))
      } else if (type === 'situation_match') {
        // AI generates situations
        questionData = await Promise.all(items.map(async item => {
          const text = item.type === 'word' ? item.word : item.idiom
          const meaning = item.type === 'word' ? item.meaning : item.meaning
          try {
            const result = await generateSituationMatch(text, meaning, item.type === 'idiom')
            return {
              question: result.situation,
              correctAnswer: text,
              options: shuffle(result.options)
            }
          } catch {
            return {
              question: `Which would you use in this situation?`,
              correctAnswer: text,
              options: shuffle([text, 'option1', 'option2', 'option3'])
            }
          }
        }))
      }

      setQuestions(questionData)
    } catch (error) {
      showToast('Failed to generate quiz', 'error')
      navigate('/quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (option) => {
    setSelectedAnswer(option)
    const newAnswers = [...userAnswers, option]
    setUserAnswers(newAnswers)

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setSelectedAnswer(null)
      } else {
        finishQuiz(newAnswers)
      }
    }, 1000)
  }

  const finishQuiz = async (answers) => {
    const correct = answers.filter((ans, i) => ans === questions[i].correctAnswer).length

    try {
      await saveQuizResult({
        type,
        score: correct,
        total_questions: questions.length,
        completed_at: new Date().toISOString()
      })
      setCompleted(true)
    } catch (error) {
      showToast('Failed to save quiz results', 'error')
    }
  }

  const getScore = () => {
    return userAnswers.filter((ans, i) => ans === questions[i].correctAnswer).length
  }

  if (loading) return <Spinner fullScreen />

  if (completed) {
    const score = getScore()
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24 flex items-center justify-center">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className={`text-6xl mb-6 ${percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Quiz Complete!
          </h2>
          <div className="text-5xl font-bold text-gray-900 mb-4">
            {score}/{questions.length}
          </div>
          <div className="text-2xl font-semibold text-gray-700 mb-6">
            {percentage}%
          </div>
          <button
            onClick={() => navigate('/quiz')}
            className="btn-primary w-full"
          >
            Back to Quiz Center
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="glass-card p-8 mb-6">
          <p className="text-2xl font-display font-semibold text-gray-900 text-center">
            {currentQuestion.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentQuestion.correctAnswer
            const showResult = selectedAnswer !== null

            return (
              <button
                key={index}
                onClick={() => !selectedAnswer && handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`w-full p-5 rounded-xl font-medium text-left transition-all ${
                  showResult
                    ? isCorrect
                      ? 'bg-green-500 text-white'
                      : isSelected
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700'
                    : 'bg-white hover:bg-primary-50 text-gray-900 hover:shadow-lg'
                }`}
              >
                <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
