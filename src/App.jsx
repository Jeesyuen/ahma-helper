import { useState } from 'react'
import './App.css'
import DocumentScanner from './components/DocumentScanner'
import PictureGuideline from './components/PictureGuideline'
import SummaryCard from './components/SummaryCard'
import ShareButton from './components/ShareButton'
import { extractDocumentData, generateSummary } from './lib/claude'
import { buildPictureGuideline } from './lib/iconMap'

const STEPS = {
  SCAN: 'scan',
  RESULT: 'result',
}

export default function App() {
  const [step, setStep] = useState(STEPS.SCAN)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [extracted, setExtracted] = useState(null)
  const [guidelineSteps, setGuidelineSteps] = useState([])
  const [summary, setSummary] = useState('')
  const [language, setLanguage] = useState('cantonese')
  const [error, setError] = useState(null)

  const handleCapture = async (base64, mimeType) => {
    setError(null)
    setIsProcessing(true)

    try {
      const data = await extractDocumentData(base64, mimeType)
      setExtracted(data)
      const steps = buildPictureGuideline(data)
      setGuidelineSteps(steps)
      setIsProcessing(false)
      setStep(STEPS.RESULT)
      setIsLoadingSummary(true)
      const summaryText = await generateSummary(data, language)
      setSummary(summaryText)
    } catch (err) {
      setError(err.message || 'Ralat berlaku. Sila cuba lagi.')
      setIsProcessing(false)
    } finally {
      setIsLoadingSummary(false)
    }
  }

  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang)
    if (!extracted) return
    setIsLoadingSummary(true)
    setSummary('')
    try {
      const summaryText = await generateSummary(extracted, newLang)
      setSummary(summaryText)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoadingSummary(false)
    }
  }

  const handleReset = () => {
    setStep(STEPS.SCAN)
    setExtracted(null)
    setGuidelineSteps([])
    setSummary('')
    setError(null)
    setIsProcessing(false)
    setIsLoadingSummary(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <span className="header-logo">阿嬤</span>
            <div>
              <h1 className="header-title">Ahma Helper</h1>
              <p className="header-subtitle">阿嬤小幫手</p>
            </div>
          </div>
          {step === STEPS.RESULT && (
            <button className="btn-new" onClick={handleReset}>
              + Baru
            </button>
          )}
        </div>
        {extracted?.urgency === 'urgent' && (
          <div className="urgency-banner">
            ⚠️ Dokumen Mendesak / 紧急文件 — Sila ambil tindakan segera
          </div>
        )}
      </header>

      {error && (
        <div className="error-banner">
          <span>❌ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <main className="app-main">
        {step === STEPS.SCAN && (
          <DocumentScanner
            onCapture={handleCapture}
            isProcessing={isProcessing}
          />
        )}
        {step === STEPS.RESULT && (
          <div className="result-container">
            {extracted?.document_type && (
              <div className="doc-type-badge">
                📄 {extracted.document_type}
              </div>
            )}
            <SummaryCard
              summary={summary}
              language={language}
              onLanguageChange={handleLanguageChange}
              isLoadingSummary={isLoadingSummary}
            />
            <PictureGuideline steps={guidelineSteps} />
            <ShareButton summary={summary} extracted={extracted} />
            <button className="btn-scan-another" onClick={handleReset}>
              📄 Imbas Dokumen Lain / 扫描其他文件
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Ahma Helper • SDG 3 • Made with ❤️ for our grandparents</p>
      </footer>
    </div>
  )
}
