import { useState } from 'react'

export default function ShareButton({ summary, extracted }) {
  const [copied, setCopied] = useState(false)

  if (!summary) return null

  const buildMessage = () => {
    let msg = '🏥 *Ahma Helper - Ringkasan Dokumen*\n\n'
    msg += summary
    msg += '\n\n'
    if (extracted?.date || extracted?.time) {
      msg += `📅 *Tarikh/Masa:* ${[extracted.date, extracted.time].filter(Boolean).join(' ')}\n`
    }
    if (extracted?.location) {
      msg += `📍 *Lokasi:* ${extracted.location}\n`
    }
    if (extracted?.contact_number) {
      msg += `📞 *Telefon:* ${extracted.contact_number}\n`
    }
    if (extracted?.bring_items?.length > 0) {
      msg += `🎒 *Bawa:* ${extracted.bring_items.join(', ')}\n`
    }
    msg += '\n_Dihantar melalui Ahma Helper 阿嬤小幫手_'
    return msg
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(buildMessage())
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildMessage())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = buildMessage()
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="share-container">
      <h3 className="share-title">
        📤 Hantar kepada keluarga / 发送给家人
      </h3>
      <p className="share-desc">
        Pastikan ahli keluarga tahu tentang temujanji ini
        <br />
        <span style={{ fontSize: 13, color: 'var(--text-light)' }}>
          让家人知道这次预约
        </span>
      </p>

      <div className="share-buttons">
        <button className="btn-whatsapp" onClick={handleWhatsApp}>
          <span>💬</span>
          <span>
            <strong>Hantar WhatsApp</strong>
            <small>发送 WhatsApp</small>
          </span>
        </button>

        <button className="btn-copy" onClick={handleCopy}>
          <span>{copied ? '✅' : '📋'}</span>
          <span>
            <strong>{copied ? 'Disalin!' : 'Salin Teks'}</strong>
            <small>{copied ? '已复制！' : '复制文字'}</small>
          </span>
        </button>
      </div>
    </div>
  )
}