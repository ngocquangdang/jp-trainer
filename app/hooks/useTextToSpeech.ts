'use client'

import { useCallback, useEffect, useState } from 'react'

interface UseTextToSpeechOptions {
  lang?: string
  rate?: number
  pitch?: number
  volume?: number
}

interface UseTextToSpeechReturn {
  speak: (text: string) => void
  stop: () => void
  isPlaying: boolean
  isSupported: boolean
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}): UseTextToSpeechReturn => {
  const {
    lang = 'ja-JP',
    rate = 0.6,
    pitch = 1,
    volume = 1,

  } = options

  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isSupported, setIsSupported] = useState<boolean>(false)

  // Check if speech synthesis is supported
  useEffect(() => {
    setIsSupported('speechSynthesis' in window)
  }, [])

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume
    
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    
    window.speechSynthesis.speak(utterance)
  }, [isSupported, lang, rate, pitch, volume])

  const stop = useCallback(() => {
    if (!isSupported) return
    
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }, [isSupported])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isSupported])

  return {
    speak,
    stop,
    isPlaying,
    isSupported
  }
}
