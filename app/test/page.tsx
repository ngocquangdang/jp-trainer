'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import wordsData from '../../src/data/words.json'

type WordItem = {
  hiragana: string
  kana: string
  roma: string
  kanji: string
}

const getRandomIndex = (length: number): number => Math.floor(Math.random() * length)

export default function TestPage() {
  const [words, setWords] = useState<WordItem[]>([])
  const [pool, setPool] = useState<number[]>([])
  const [pos, setPos] = useState<number>(0)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [remaining, setRemaining] = useState<number>(120)
  const [inputValue, setInputValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const timerRef = useRef<number | null>(null)
  const [viewMode, setViewMode] = useState<'hiragana' | 'katakana'>('hiragana')
  const [finished, setFinished] = useState<boolean>(false)

  useEffect(() => {
    const data = (wordsData as WordItem[]) ?? []
    setWords(data)
    if (data.length > 0) {
      const indices = data.map((_, i) => i)
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[indices[i], indices[j]] = [indices[j], indices[i]]
      }
      const p = indices.slice(0, Math.min(10, indices.length))
      setPool(p)
      setCurrentIndex(p[0])
    }
  }, [])

  const currentWord = useMemo(() => {
    if (words.length === 0) return null
    return words[currentIndex]
  }, [words, currentIndex])

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentIndex])

  // 2-minute timer
  useEffect(() => {
    setRemaining(120)
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerRef.current || undefined)
          setFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [])

  const advance = useCallback(() => {
    const nextPos = pos + 1
    if (nextPos >= pool.length) {
      setFinished(true)
      return
    }
    setPos(nextPos)
    setCurrentIndex(pool[nextPos])
    setInputValue('')
  }, [pos, pool])

  const handleSubmit = () => {
    if (!currentWord || finished) return
    const isCorrect = inputValue.trim().toLowerCase() === currentWord.roma.toLowerCase()
    if (isCorrect) setScore((s) => s + 1)
    advance()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') handleSubmit()
  }

  if (!currentWord) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-gray-500">Đang tải dữ liệu…</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="w-full flex items-center justify-between text-sm text-gray-600">
          <div>Score: {score} / {pool.length}</div>
          <div>Time: {remaining}s</div>
          <div>Q{pos + 1}/{pool.length}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4" role="tablist" aria-label="Chọn bảng chữ">
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
              <button key={tab.key} role="tab" aria-selected={isActive} className={className}
                onClick={() => setViewMode(tab.key as 'hiragana' | 'katakana')}>
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="text-7xl font-semibold tracking-wide text-gray-900 select-none w-full flex items-center justify-center mt-6">
          {viewMode === 'hiragana' ? currentWord.hiragana : currentWord.kana}
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
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-6"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full mt-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Trả lời
        </button>

        {finished && (
          <div className="mt-6 text-center text-gray-700">
            Kết thúc! Điểm: {score} / {pool.length}
            <div className="mt-3 flex items-center justify-center gap-2">
              <a href="/test" className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-sm">Làm lại</a>
              <a href="/" className="rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 text-sm">Quay lại</a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}


