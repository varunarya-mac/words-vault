import { useState, useRef, useCallback, useEffect } from 'react'

// Get supported MIME type for cross-browser compatibility
function getSupportedMimeType() {
  if (typeof MediaRecorder === 'undefined') return null

  const types = [
    'audio/webm;codecs=opus',  // Chrome, Firefox, Edge
    'audio/webm',               // Fallback webm
    'audio/mp4',                // Safari
    'audio/mpeg',               // Fallback
  ]

  return types.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm'
}

export default function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState(null)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)

  const mimeType = getSupportedMimeType()
  const isSupported = typeof MediaRecorder !== 'undefined' && mimeType !== null

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Voice recording is not supported in this browser')
      return
    }

    try {
      setError(null)
      chunksRef.current = []

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Create MediaRecorder with supported MIME type
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Error starting recording:', err)
      if (err.name === 'NotAllowedError') {
        setError('Microphone permission denied')
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found')
      } else {
        setError('Failed to start recording')
      }
    }
  }, [isSupported, mimeType])

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !isRecording) {
        resolve(null)
        return
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        chunksRef.current = []

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }

        setIsRecording(false)
        resolve(blob)
      }

      mediaRecorderRef.current.stop()
    })
  }, [isRecording, mimeType])

  return {
    isRecording,
    isSupported,
    error,
    mimeType,
    startRecording,
    stopRecording,
  }
}
