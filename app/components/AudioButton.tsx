'use client'

import { useTextToSpeech } from '../hooks/useTextToSpeech'

interface AudioButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  lang?: string
}

export default function AudioButton({ 
  text, 
  className = '', 
  size = 'md',
  showLabel = false,
  lang = 'ja-JP'
}: AudioButtonProps) {
  const { speak, stop, isPlaying, isSupported } = useTextToSpeech({ lang })

  if (!isSupported) {
    return null // Don't render if not supported
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const handleClick = () => {
    if (isPlaying) {
      stop()
    } else {
      speak(text)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isPlaying 
          ? 'bg-red-100 hover:bg-red-200 text-red-600 focus:ring-red-500' 
          : 'bg-blue-100 hover:bg-blue-200 text-blue-600 focus:ring-blue-500'
        }
        ${className}
      `}
      aria-label={isPlaying ? 'Dừng phát âm' : 'Phát âm'}
      title={isPlaying ? 'Dừng phát âm' : 'Phát âm'}
    >
      {isPlaying ? (
        // Stop icon
        <svg
          className={iconSizeClasses[size]}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // Play icon
        <svg
          className={iconSizeClasses[size]}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
      )}
      
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {isPlaying ? 'Dừng' : 'Phát'}
        </span>
      )}
    </button>
  )
}
