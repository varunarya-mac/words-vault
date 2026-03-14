import { useState } from 'react'
import useVoiceRecorder from '../hooks/useVoiceRecorder'
import { transcribeAudio } from '../services/openai'
import Spinner from './Spinner'

export default function VoiceButton({ onTranscription, onError, disabled = false, className = '' }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { isRecording, isSupported, error, mimeType, startRecording, stopRecording } = useVoiceRecorder()

  // Don't render if not supported
  if (!isSupported) {
    return null
  }

  const handleMouseDown = async (e) => {
    e.preventDefault()
    if (disabled || isProcessing) return
    await startRecording()
  }

  const handleMouseUp = async (e) => {
    e.preventDefault()
    if (!isRecording || isProcessing) return

    try {
      setIsProcessing(true)
      const audioBlob = await stopRecording()

      if (!audioBlob || audioBlob.size === 0) {
        onError?.('No audio recorded')
        return
      }

      const transcription = await transcribeAudio(audioBlob, mimeType)

      if (!transcription || transcription.trim() === '') {
        onError?.('No speech detected')
        return
      }

      onTranscription(transcription)
    } catch (err) {
      console.error('Transcription error:', err)
      onError?.(err.message || 'Failed to transcribe')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    e.preventDefault()
    handleMouseDown(e)
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    handleMouseUp(e)
  }

  // Handle case where user moves mouse/finger away
  const handleMouseLeave = () => {
    if (isRecording) {
      handleMouseUp({ preventDefault: () => {} })
    }
  }

  // Show error from recorder hook
  if (error) {
    onError?.(error)
  }

  return (
    <button
      type="button"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={disabled || isProcessing}
      className={`
        flex items-center justify-center
        w-12 h-12 rounded-full
        transition-all duration-200
        ${isRecording
          ? 'bg-red-500 text-white animate-recording'
          : isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-wait'
            : 'bg-primary-100 text-primary-600 hover:bg-primary-200 active:scale-95'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      aria-label={isRecording ? 'Recording... Release to stop' : isProcessing ? 'Processing...' : 'Hold to speak'}
      title={isRecording ? 'Release to stop' : isProcessing ? 'Processing...' : 'Hold to speak'}
    >
      {isProcessing ? (
        <Spinner size="sm" />
      ) : isRecording ? (
        // Recording wave icon
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2c0 4.08-3.06 7.44-7 7.93V20h4v2H8v-2h4v-4.07z"/>
        </svg>
      ) : (
        // Microphone icon
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20H8v2h8v-2h-3v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
        </svg>
      )}
    </button>
  )
}
