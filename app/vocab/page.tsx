'use client'

import { useMemo, useState, useEffect } from 'react'
import raw from '../../src/data/VocabList_N5.json'

type VocabDetail = {
  kanji?: string
  eng?: string
  vni?: string
  example?: string
  example_vni?: string
}

type VocabItem = {
  key: string
  detail: VocabDetail
}

const toList = (data: any): VocabItem[] => {
  const bucket = Array.isArray(data) ? data[0] : data
  if (!bucket) return []
  return Object.keys(bucket).map((k) => ({ key: k, detail: bucket[k] as VocabDetail }))
}

export default function VocabPage() {
  const list = useMemo(() => toList(raw), [])
  const [index, setIndex] = useState<number>(0)
  const [showMeaning, setShowMeaning] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('')

  const filtered = useMemo(() => {
    if (!query.trim()) return list
    const q = query.trim().toLowerCase()
    return list.filter(({ key, detail }) =>
      key.toLowerCase().includes(q) ||
      (detail.kanji || '').toLowerCase().includes(q) ||
      (detail.eng || '').toLowerCase().includes(q) ||
      (detail.vni || '').toLowerCase().includes(q)
    )
  }, [list, query])

  useEffect(() => {
    if (index >= filtered.length) setIndex(0)
  }, [filtered.length, index])

  const item = filtered[index]
  if (!item) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-gray-500">Không có dữ liệu từ vựng.</div>
      </main>
    )
  }

  const handlePrev = () => {
    setShowMeaning(false)
    setIndex((i) => (i - 1 + filtered.length) % filtered.length)
  }
  const handleNext = () => {
    setShowMeaning(false)
    setIndex((i) => (i + 1) % filtered.length)
  }
  const handleShuffle = () => {
    const rand = Math.floor(Math.random() * filtered.length)
    setShowMeaning(false)
    setIndex(rand)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm (kana/kanji/eng/vni)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Ô tìm kiếm từ vựng"
            />
            <span className="text-xs text-gray-500 whitespace-nowrap">{index + 1} / {filtered.length}</span>
          </div>

          <div className="flex items-baseline justify-center gap-3">
            <div className="text-6xl font-semibold text-gray-900 select-none" aria-label="Kana">{item.key}</div>
            {item.detail.kanji && (
              <div className="text-3xl text-gray-700 select-none" aria-label="Kanji">{item.detail.kanji}</div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 text-sm font-medium"
              onClick={handlePrev}
              aria-label="Trước"
            >Trước</button>
            <button
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm font-medium"
              onClick={() => setShowMeaning((s) => !s)}
              aria-label="Hiện nghĩa"
            >{showMeaning ? 'Ẩn nghĩa' : 'Hiện nghĩa'}</button>
            <button
              className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 text-sm font-medium"
              onClick={handleNext}
              aria-label="Tiếp"
            >Tiếp</button>
          </div>

          <div className="flex items-center justify-center">
            <button
              className="rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 text-sm font-medium"
              onClick={handleShuffle}
              aria-label="Ngẫu nhiên"
            >Ngẫu nhiên</button>
          </div>

          {showMeaning && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              {item.detail.eng && <div><span className="font-medium">EN:</span> {item.detail.eng}</div>}
              {item.detail.vni && <div><span className="font-medium">VI:</span> {item.detail.vni}</div>}
              {item.detail.example && (
                <div className="mt-2">
                  <div className="text-gray-800">{item.detail.example}</div>
                  {item.detail.example_vni && <div className="text-gray-600">{item.detail.example_vni}</div>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}


