import { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'

export default function DocumentScanner({ onCapture, isProcessing }) {
  const webcamRef = useRef(null)
  const fileInputRef = useRef(null)
  const [showCamera, setShowCamera] = useState(false)
  const [preview, setPreview] = useState(null)
  const [cameraError, setCameraError] = useState(false)

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setPreview(imageSrc)
      setShowCamera(false)
      const base64 = imageSrc.split(',')[1]
      onCapture(base64, 'image/jpeg')
    }
  }, [onCapture])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target.result
      setPreview(result)
      const base64 = result.split(',')[1]
      const mimeType = file.type || 'image/jpeg'
      onCapture(base64, mimeType)
    }
    reader.readAsDataURL(file)
  }

  const handleRetake = () => {
    setPreview(null)
    setShowCamera(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (isProcessing) {
    return (
      <div className="scanner-processing">
        <div className="processing-animation">
          <div className="pulse-ring" />
          <span className="processing-emoji">📄</span>
        </div>
        <p className="processing-text">正在讀取文件...</p>
        <p className="processing-subtext">Membaca dokumen anda</p>
      </div>
    )
  }

  if (preview) {
    return (
      <div className="scanner-preview">
        <img src={preview} alt="Document preview" className="preview-image" />
        <button className="btn-secondary" onClick={handleRetake}>
          🔄 Cuba Lagi / 重新拍攝
        </button>
      </div>
    )
  }

  if (showCamera) {
    return (
      <div className="scanner-camera">
        {!cameraError ? (
          <>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.9}
              className="webcam-view"
              onUserMediaError={() => setCameraError(true)}
              videoConstraints={{
                facingMode: { ideal: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 960 },
              }}
            />
            <div className="camera-overlay">
              <div className="camera-frame" />
              <p className="camera-hint">Letakkan dokumen dalam kotak / 将文件放在框内</p>
            </div>
            <div className="camera-controls">
              <button className="btn-ghost" onClick={() => setShowCamera(false)}>
                ✕ Batal
              </button>
              <button className="btn-capture" onClick={handleCapture}>
                📸
              </button>
              <div style={{ width: 80 }} />
            </div>
          </>
        ) : (
          <div className="camera-error">
            <p>📵 Kamera tidak dapat diakses</p>
            <p style={{ fontSize: 14, color: 'var(--text-light)', marginTop: 8 }}>
              Sila benarkan akses kamera / 请允许摄像头访问
            </p>
            <button className="btn-secondary" onClick={() => { setCameraError(false); setShowCamera(false) }}>
              Kembali / 返回
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="scanner-home">
      <div className="scanner-illustration">
        <span className="scanner-icon">📋</span>
        <p className="scanner-title">Imbas Dokumen Anda</p>
        <p className="scanner-subtitle">扫描您的文件</p>
        <p className="scanner-desc">
          Surat hospital, resit klinik, atau apa-apa dokumen perubatan
        </p>
      </div>

      <div className="scanner-buttons">
        <button
          className="btn-primary btn-large"
          onClick={() => setShowCamera(true)}
        >
          <span className="btn-icon">📸</span>
          <span>
            <strong>Ambil Gambar</strong>
            <small>拍照</small>
          </span>
        </button>

        <button
          className="btn-secondary btn-large"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="btn-icon">📁</span>
          <span>
            <strong>Muat Naik Fail</strong>
            <small>上传文件</small>
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>

      <p className="scanner-privacy">
        🔒 Dokumen anda selamat dan tidak disimpan / 您的文件安全，不会被储存
      </p>
    </div>
  )
}