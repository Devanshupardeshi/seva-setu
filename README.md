# SevaSetu: The AI-Powered Bridge for Impact

![SevaSetu Hero](public/hero-preview.png)

> **"Coordination shouldn't take hours when every minute matters."**

SevaSetu is a next-generation volunteer mobilization and CSR impact platform built for the **Google Solution Challenge 2026**. It leverages **Gemini 2.5 Flash** to bridge the gap between India's 33 lakh NGOs and millions of willing volunteers through inclusive, voice-first technology.

---

## 🌟 The Vision

India has one of the world's largest NGO sectors, yet coordination during crises and day-to-day operations remains fragmented. SevaSetu addresses four critical pillars:
1. **Inclusivity**: Voice-onboarding in 5+ Indian languages (Hindi, Marathi, Tamil, etc.).
2. **Efficiency**: AI-powered matching that surfaces the right skills for the right needs in seconds.
3. **Accountability**: QR-based attendance tracking and verifiable impact certificates.
4. **Compliance**: Automated CSR reporting mapping social work to UN SDGs and Companies Act 2013.

---

## 🚀 Key Features

### 🎙️ For Volunteers: Voice-First Onboarding
No long forms. Volunteers describe their skills, location, and availability via a voice note. Our **Gemini-powered extraction engine** builds a structured profile automatically.
- **Smart Matching**: A real-time feed ranked by Vertex AI based on skill fit and distance.
- **Weekend Warrior Mode**: Surfaces opportunities matching your free time.
- **Impact Portfolio**: Verifiable certificates and QR-based attendance logging.

### 🏢 For NGOs: One-Sentence Need Posting
Post a requirement in plain words (e.g., *"We need 5 people for a food drive in Bandra this Sunday morning"*). Gemini handles the rest, creating a structured listing and notifying matched volunteers.
- **CSR Reporting**: AI-generated professional impact reports for funders.
- **Attendance Scanner**: Integrated QR scanner to verify on-site presence.

### 🛡️ For Government: Crisis Command Center
A unified dashboard for disaster management.
- **One-Click Incident Creation**: Geofenced disaster zones with real-time responder heatmaps.
- **Skill-Gap Analysis**: Live monitoring of responder skills vs. incident requirements.
- **SITREP Generation**: Automatic PDF situation reports for NDMA compliance.

### 💼 For Corporates: CSR Intelligence
Turn employee volunteering into measurable impact.
- **Live Impact Dashboard**: Real-time visualization of company-wide contributions.
- **SDG Mapping**: Automatic mapping of every volunteer hour to United Nations Sustainable Development Goals.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **AI Engine**: [Google Gemini 2.5 Flash](https://ai.google.dev/) (Multimodal extraction, report generation, and matching)
- **Database**: [Firebase / Cloud Firestore](https://firebase.google.com/)
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **Scanning**: Html5-QRCode

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Devanshupardeshi/seva-setu.git
   cd seva-setu
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root:
   ```env
   GEMINI_API_KEY=your_google_api_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_id
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

---

## 🗺️ Project Structure

```text
├── app/                  # Next.js App Router (Role-based folders)
│   ├── api/              # AI & Backend routes
│   ├── volunteer/        # Volunteer Dashboard & Onboarding
│   ├── ngo/              # NGO Management & CSR Reports
│   ├── command-center/   # Government Crisis Dashboard
│   └── corporate/        # CSR Boardroom Portal
├── components/           # UI Components (Shadcn/UI + Custom)
├── lib/                  # Core logic, types, and mock data
├── public/               # Static assets & Manifest
└── hooks/                # Custom React hooks (Firestore, Auth)
```

---

## 🎯 Solution Challenge Alignment

SevaSetu directly contributes to multiple UN Sustainable Development Goals:
- **SDG 17: Partnerships for the Goals** (Core mission of SevaSetu)
- **SDG 11: Sustainable Cities and Communities** (Disaster response)
- **SDG 5: Gender Equality** (Women-only task filters and safety routing)

---

## 📄 License

This project is developed for the **Google Solution Challenge 2026**. All rights reserved.

---

Created with ❤️ by **Devanshu Pardeshi** & The SevaSetu Team.
