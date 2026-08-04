
export const TIME_ICONS = {
  morning: { emoji: '🌅', label: 'Pagi / 早上' },
  afternoon: { emoji: '☀️', label: 'Tengah hari / 下午' },
  evening: { emoji: '🌆', label: 'Petang / 傍晚' },
  night: { emoji: '🌙', label: 'Malam / 晚上' },
}

export const LOCATION_ICONS = {
  hospital: { emoji: '🏥', label: 'Hospital' },
  clinic: { emoji: '🏨', label: 'Klinik / 诊所' },
  pharmacy: { emoji: '💊', label: 'Farmasi / 药房' },
  lab: { emoji: '🔬', label: 'Makmal / 化验室' },
  default: { emoji: '📍', label: 'Lokasi / 地点' },
}

export const ACTION_ICONS = {
  bring_ic: { emoji: '🪪', label: 'Bawa IC / 带身份证' },
  bring_card: { emoji: '💳', label: 'Bawa kad / 带卡' },
  default: { emoji: '✅', label: 'Tindakan / 行动' },
}

export function buildPictureGuideline(extracted) {
  const steps = []

  if (extracted.date || extracted.time) {
    const timeOfDay = getTimeOfDay(extracted.time)
    steps.push({
      type: 'time',
      emoji: timeOfDay.emoji,
      label: timeOfDay.label,
      detail: [extracted.date, extracted.time].filter(Boolean).join(' • '),
    })
  }

  if (extracted.location) {
    const locIcon = getLocationIcon(extracted.location)
    steps.push({
      type: 'location',
      emoji: locIcon.emoji,
      label: locIcon.label,
      detail: extracted.location,
    })
  }

  if (extracted.doctor || extracted.department) {
    steps.push({
      type: 'person',
      emoji: '👨‍⚕️',
      label: 'Doktor / 医生',
      detail: extracted.doctor || extracted.department,
    })
  }

  if (extracted.bring_items && extracted.bring_items.length > 0) {
    extracted.bring_items.forEach(item => {
      const icon = getBringIcon(item)
      steps.push({
        type: 'bring',
        emoji: icon.emoji,
        label: icon.label,
        detail: item,
      })
    })
  }

  if (extracted.action_required) {
    steps.push({
      type: 'action',
      emoji: '✅',
      label: 'Perlu buat / 需要做',
      detail: extracted.action_required,
    })
  }

  if (extracted.contact_number) {
    steps.push({
      type: 'contact',
      emoji: '📞',
      label: 'Hubungi / 联系',
      detail: extracted.contact_number,
    })
  }

  return steps
}

function getTimeOfDay(timeStr) {
  if (!timeStr) return { emoji: '🕐', label: 'Masa / 时间' }
  const hour = parseInt(timeStr.replace(/[^0-9]/g, '').substring(0, 2))
  if (hour < 12) return TIME_ICONS.morning
  if (hour < 17) return TIME_ICONS.afternoon
  if (hour < 20) return TIME_ICONS.evening
  return TIME_ICONS.night
}

function getLocationIcon(location) {
  const loc = location.toLowerCase()
  if (loc.includes('hospital')) return LOCATION_ICONS.hospital
  if (loc.includes('klinik') || loc.includes('clinic')) return LOCATION_ICONS.clinic
  if (loc.includes('farmasi') || loc.includes('pharmacy')) return LOCATION_ICONS.pharmacy
  if (loc.includes('lab') || loc.includes('makmal')) return LOCATION_ICONS.lab
  return LOCATION_ICONS.default
}

function getBringIcon(item) {
  const i = item.toLowerCase()
  if (i.includes('ic') || i.includes('kad pengenalan') || i.includes('identity')) return ACTION_ICONS.bring_ic
  if (i.includes('kad') || i.includes('card')) return ACTION_ICONS.bring_card
  return { emoji: '🎒', label: 'Bawa / 带' }
}