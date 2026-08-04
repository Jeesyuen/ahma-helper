# 阿嬤小幫手 — Ahma Helper

A mobile-first web app that helps elderly Malaysian patients understand medical documents in their own language and dialect.

## The Problem

A Cantonese-speaking grandmother receives a hospital appointment letter written in formal Bahasa Malaysia. She cannot read it. She calls three family members. She almost misses the appointment.

This happens every day across Malaysia. Elderly patients — especially those who speak Hokkien, Cantonese, or Hakka as their first language — receive medical documents they cannot understand, leading to missed appointments, incorrect medication, and unnecessary stress on both patient and caregiver.

## What Ahma Helper Does

Ahma Helper turns any medical document into something an elderly person can actually understand — in seconds.

1. **Scan or upload** a hospital letter, clinic receipt, prescription, or discharge summary
2. **AI reads the document** and extracts the key information — date, time, location, doctor, what to bring
3. **Picture guideline** converts the information into a visual step-by-step sequence using emoji and icons — no reading required
4. **Audio summary** reads the summary aloud in the patient's chosen language
5. **Send to family** shares the full summary via WhatsApp with one tap

## Supported Languages

- 廣東話 Cantonese
- 中文 Mandarin
- Bahasa Malaysia
- English

## Who It's For

- Elderly Malaysian patients who struggle with formal Bahasa Malaysia or English medical documents
- Caregivers managing appointments for a parent or grandparent
- Family members who want to stay informed about a loved one's medical care

## SDG Alignment

**SDG 3.8 — Universal Health Coverage**

Language and literacy barriers are healthcare access barriers. A patient who cannot understand their appointment letter is effectively excluded from the care system. Ahma Helper removes that barrier for Malaysia's elderly dialect-speaking population.

## Features

| Feature | Description |
|---|---|
| 📸 Camera scan | Photograph any document directly in the app |
| 📁 File upload | Upload images or PDFs from your device |
| 🌏 Multi-language | Summary generated in Cantonese, Mandarin, BM, or English |
| 📖 Picture guideline | Visual step-by-step using emoji — works even for low-literacy users |
| 🔊 Audio playback | Tap to hear the summary read aloud |
| 💬 WhatsApp share | Send the full summary to a family member in one tap |
| 🔒 Privacy first | No documents or health data are stored |

## How to Use

### For the elderly user (or their caregiver)

1. Open the app on your phone
2. Tap **Ambil Gambar** to photograph your document, or **Muat Naik Fail** to upload it
3. Wait a few seconds while the app reads the document
4. Choose your language at the top of the summary card
5. Read the plain-language summary, or tap **Dengar Ringkasan** to hear it read aloud
6. Follow the picture guideline steps
7. Tap **Hantar WhatsApp** to send the summary to a family member

### For developers

#### Prerequisites
- Node.js v18+
- An Anthropic API key ([get one here](https://console.anthropic.com))

#### Setup

```bash
git clone https://github.com/Jeesyuen/ahma-helper.git
cd ahma-helper
npm install
```

Create a `.env` file in the root:
Paste the api key at VITE_ANTHROPIC_API_KEY=your_api_key_here
Run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Build for production

```bash
npm run build
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| AI | Anthropic Claude (claude-sonnet-4-6) |
| Document reading | Claude Vision API |
| Audio | Web Speech API (built-in, no cost) |
| Hosting | Vercel |

## Privacy

Ahma Helper does not store any documents, images, or personal health information. Documents are sent directly to the Anthropic API for processing and are not retained. No user accounts are required.

## Built With

Made with ❤️ for our grandparents.

> "她收到一封信，但她看不懂。"
> *She received a letter, but she couldn't read it.*
