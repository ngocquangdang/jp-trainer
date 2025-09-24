import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import wordsData from './data/words.json'

type WordItem = {
  hiragana: string
  kana: string
  roma: string
  kanji: string
}

const getRandomIndex = (length: number): number => {
  return Math.floor(Math.random() * length)
}

const App = () => {
  const [words, setWords] = useState<WordItem[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [inputValue, setInputValue] = useState<string>('')
  const [shownCounts, setShownCounts] = useState<Record<number, number>>({})
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [selectedSeconds, setSelectedSeconds] = useState<number>(10)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(10)
  const timerRef = useRef<number | null>(null)
  const [viewMode, setViewMode] = useState<'hiragana' | 'katakana'>('hiragana')
  const handleSelectViewMode = (mode: 'hiragana' | 'katakana') => setViewMode(mode)


  useEffect(() => {
    const data = (wordsData as WordItem[]) ?? []
    if (data.length === 0) return
    setWords(data)
    const first = getRandomIndex(data.length)
    setCurrentIndex(first)
    setShownCounts({ [first]: 1 })
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentIndex])

  const currentWord = useMemo(() => {
    if (words.length === 0) return null
    return words[currentIndex]
  }, [words, currentIndex])

  // removed: currentChar, panel renders the correct char per mode

  const renderPanel = (mode: 'hiragana' | 'katakana') => {
    if (!currentWord) return null
    const char = mode === 'hiragana' ? currentWord.hiragana : currentWord.kana
    return (
      <>
        <div
          id={`panel-${mode}`}
          role="heading"
          aria-level={1}
          className="text-7xl font-semibold tracking-wide text-gray-900 select-none w-full flex items-center justify-center"
          aria-label={mode === 'hiragana' ? 'Ký tự hiragana' : 'Ký tự katakana'}
        >
          {char}
        </div>

        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          aria-label="Nhập romaji"
          placeholder="Nhập romaji và nhấn Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
          tabIndex={0}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="w-full flex items-center justify-between text-sm text-gray-500 mt-2">
          <span>
            Lượt đã hiển thị: {(shownCounts[currentIndex] ?? 1)} / 2
          </span>
          <span>Từ vựng: {currentIndex + 1} / {words.length}</span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          aria-label="Xác nhận câu trả lời"
          className="w-full mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          tabIndex={0}
        >
          Tiếp tục
        </button>
      </>
    )
  }


  const findNextIndex = useCallback((): number | null => {
    if (words.length === 0) return null
    const candidates = words
      .map((_, idx) => idx)
      .filter((idx) => (shownCounts[idx] ?? 0) < 2)

    if (candidates.length === 0) return null
    return candidates[getRandomIndex(candidates.length)]
  }, [words, shownCounts])

  const goToNextRandomWord = useCallback(() => {
    const next = findNextIndex()
    if (next === null) {
      setError('Hoàn thành! Không còn từ nào để luyện nữa.')
      return
    }
    setCurrentIndex(next)
    setShownCounts((prev) => ({ ...prev, [next]: (prev[next] ?? 0) + 1 }))
    setInputValue('')
  }, [findNextIndex])

  // Countdown: reset and start when word or selection changes
  useEffect(() => {
    if (!currentWord) return
    setRemainingSeconds(selectedSeconds)
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
    }
    timerRef.current = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          // time's up → auto advance
          window.clearInterval(timerRef.current || undefined)
          goToNextRandomWord()
          return selectedSeconds // will be reset by effect on index change
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [currentIndex, selectedSeconds, currentWord, goToNextRandomWord])

  const handleSubmit = () => {
    if (!currentWord) return
    const isCorrect = inputValue.trim().toLowerCase() === currentWord.roma.toLowerCase()
    if (!isCorrect) return setError('Sai! Vui lòng thử lại.')

    goToNextRandomWord()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null)
    if (e.key === 'Enter' || e.key === ' ') handleSubmit()
  }

  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">{error || 'Không có dữ liệu.'}</p>
      </div>
    )
  }

  

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Countdown selector */}
          <div className="w-full">
            <fieldset className="w-full" aria-label="Chọn thời gian tự chuyển">
              <legend className="text-sm font-medium text-gray-700 mb-2">Tự chuyển sau</legend>
              <div className="grid grid-cols-3 gap-2" role="radiogroup">
                {[5, 10, 15].map((sec) => {
                  const isActive = selectedSeconds === sec
                  const base = 'w-full rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2'
                  const active = 'border-blue-600 bg-blue-600 text-white focus:ring-blue-500'
                  const inactive = 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 focus:ring-gray-300'
                  const className = `${base} ${isActive ? active : inactive}`
                  return (
                    <button
                      key={sec}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      aria-label={`${sec} giây`}
                      tabIndex={0}
                      className={className}
                      onClick={() => setSelectedSeconds(sec)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setSelectedSeconds(sec)
                      }}
                    >
                      {sec}s
                    </button>
                  )
                })}
              </div>
            </fieldset>
            <div className="mt-2 text-xs text-gray-500" aria-live="polite">
              Còn lại: {remainingSeconds}s
            </div>
          </div>

          {/* Tabs: Hiragana / Katakana */}
          <div className="w-full">
            <div role="tablist" aria-label="Chọn bảng chữ" className="grid grid-cols-2 gap-2">
              {[
                { key: 'hiragana', label: 'Hiragana' },
                { key: 'katakana', label: 'Katakana' },
              ].map((tab) => {
                const isActive = viewMode === (tab.key as 'hiragana' | 'katakana')
                const base = 'w-full rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2'
                const active = 'border-purple-600 bg-purple-600 text-white focus:ring-purple-500'
                const inactive = 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 focus:ring-gray-300'
                const className = `${base} ${isActive ? active : inactive}`
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.key}`}
                    id={`tab-${tab.key}`}
                    tabIndex={0}
                    className={className}
                    onClick={() => handleSelectViewMode(tab.key as 'hiragana' | 'katakana')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleSelectViewMode(tab.key as 'hiragana' | 'katakana')
                    }}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active tab panel wrapping inner component */}
          {viewMode === 'hiragana' ? (
            <div role="tabpanel" id="panel-hiragana" aria-labelledby="tab-hiragana" className="w-full items-center justify-center">
              {renderPanel('hiragana')}
            </div>
          ) : (
            <div role="tabpanel" id="panel-katakana" aria-labelledby="tab-katakana" className="w-full items-center justify-center">
              {renderPanel('katakana')}
            </div>
          )}


        </div>
      </div>
    </main>
  )
}

export default App
