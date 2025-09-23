import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
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

  const findNextIndex = (): number | null => {
    if (words.length === 0) return null
    const candidates = words
      .map((_, idx) => idx)
      .filter((idx) => (shownCounts[idx] ?? 0) < 2)

    if (candidates.length === 0) return null
    return candidates[getRandomIndex(candidates.length)]
  }

  const handleSubmit = () => {
    if (!currentWord) return
    const isCorrect = inputValue.trim().toLowerCase() === currentWord.roma.toLowerCase()
    if (!isCorrect) return setError('Sai! Vui lòng thử lại.')

    const next = findNextIndex()
    if (next === null) {
      setError('Hoàn thành! Không còn từ nào để luyện nữa.')
      return
    }

    setCurrentIndex(next)
    setShownCounts((prev) => ({ ...prev, [next]: (prev[next] ?? 0) + 1 }))
    setInputValue('')
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
          <div
            role="heading"
            aria-level={1}
            className="text-7xl font-semibold tracking-wide text-gray-900 select-none"
          >
            {currentWord.hiragana}
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
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            tabIndex={0}
          />

          {error && <p className="text-red-500">{error}</p>}
          <div className="w-full flex items-center justify-between text-sm text-gray-500">
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
        </div>
      </div>
    </main>
  )
}

export default App
