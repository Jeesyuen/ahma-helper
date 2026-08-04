export default function PictureGuideline({ steps }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="guideline-empty">
        <p>Tiada maklumat visual / 暂无视觉信息</p>
      </div>
    )
  }

  return (
    <div className="guideline-container">
      <h3 className="guideline-title">
        <span>📖</span> Panduan Gambar / 图示指南
      </h3>
      <div className="guideline-steps">
        {steps.map((step, index) => (
          <div key={index} className="guideline-step">
            <div className="step-number">{index + 1}</div>
            <div className="step-emoji">{step.emoji}</div>
            <div className="step-content">
              <p className="step-label">{step.label}</p>
              {step.detail && (
                <p className="step-detail">{step.detail}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}