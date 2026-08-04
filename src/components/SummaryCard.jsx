import { useState, useEffect } from 'react'

const LANGUAGES = [
  { key: 'cantonese', label: '廣東話', sublabel: 'Cantonese' },
  { key: 'mandarin', label: '中文', sublabel: 'Mandarin' },
  { key: 'malay', label: 'BM', sublabel: 'Bahasa Malaysia' },
  { key: 'english', label: 'EN', sublabel: 'English' },
]

export default function SummaryCard({ summary, language, onLanguageChange, isLoadingSummary }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)

  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window)
  }, [])

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }, [summary])

  const handlePlayAudio = () => {
    if (!summary || !speechSupported) return

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(summary)
    const langMap = {
      cantonese: 'zh-HK',
      mandarin: 'zh-CN',
      malay: 'ms-MY',
      english: 'en-US',
    }
    utterance.lang = langMap[language] || 'zh-HK'
    utterance.rate = 0.85
    utterance.pitch = 1.0
    utterance.volume = 1.0
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="summary-card">
      <div className="lang-selector">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.key}
            className={`lang-btn ${language === lang.key ? 'lang-btn-active' : ''}`}
            onClick={() => onLanguageChange(lang.key)}
          >
            <span className="lang-main">{lang.label}</span>
            <span className="lang-sub">{lang.sublabel}</span>
          </button>
        ))}
      </div>

      <div className="summary-body">
        {isLoadingSummary ? (
          <div className="summary-loading">
            <div className="loading-dots">
              <span /><span /><span />
            </div>
            <p>Menjana ringkasan... / 正在生成摘要...</p>
          </div>
        ) : summary ? (
          <p className="summary-text">{summary}</p>
        ) : (
          <p className="summary-placeholder">
            Ringkasan akan muncul di sini / 摘要将显示在此处
          </p>
        )}
      </div>

      {summary && !isLoadingSummary && (
        <button
          className={`btn-audio ${isPlaying ? 'btn-audio-playing' : ''}`}
          onClick={handlePlayAudio}
          disabled={!speechSupported}
        >
          <span className="audio-icon">{isPlaying ? '⏹️' : '🔊'}</span>
          <span>
            {isPlaying ? 'Berhenti / 停止' : 'Dengar Ringkasan / 朗读摘要'}
          </span>
        </button>
      )}
    </div>
  )
}