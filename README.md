# HookSense — AI-Powered Content Decision Tool

> Helping small business owners decide which Instagram Reel to post — using AI analysis of hook strength, pacing, and audio energy, with plain-English explanations.

---

## The Problem

India has 63M+ small businesses increasingly relying on short-form video marketing. Most business owners cannot evaluate the content created for them by freelancers or agencies. They approve or reject reels based on personal taste, not performance potential — leading to wasted marketing spend and vague feedback for creators.

Existing tools either automate content creation (for creators) or provide complex analytics dashboards (requiring expertise) — leaving a gap for the person who must approve content but has no marketing background.

---

## The Solution

HookSense lets a business owner upload two draft reel versions. The AI analyzes each across hook strength, pacing, and audio energy — then generates a clear, plain-English comparison explaining which version is likely to perform better and why.

---

## How It Works
**Stage 1 — Video Analysis (OpenCV)**
- Frame extraction and resize for efficient processing
- Hook analysis: scene changes, motion intensity, brightness in first 3 seconds
- Pacing analysis: cuts per second across full video duration
- Hook Score and Pacing Score generated per video

**Stage 2 — Audio Analysis (librosa + ffmpeg)**
- Audio extracted from video using ffmpeg
- RMS energy analysis using librosa
- Audio Score generated per video

**Stage 3 — AI Explanation (Groq + LLaMA 3)**
- All extracted signals passed to LLaMA 3.3 70B via Groq API
- Model generates plain-English verdict: winner, reasoning, weakness, actionable tip
- Output structured as JSON, rendered in frontend

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS + Vite |
| Backend | Python + FastAPI |
| Video Processing | OpenCV |
| Audio Processing | librosa + ffmpeg |
| AI Explanation | Groq API (LLaMA 3.3 70B) |
| Runtime | Node.js v22.9.0 + Python 3.14.3 |

---

## Project Structure
HookSense/

├── backend/

│   ├── main.py          # FastAPI app + CORS + endpoints

│   ├── analyzer.py      # Video + audio analysis pipeline

│   ├── scorer.py        # Comparative scoring logic

│   ├── explainer.py     # Groq LLM explanation generation

│   └── requirements.txt

├── frontend/

│   ├── src/

│   │   ├── App.jsx      # Main UI — upload, results, comparison

│   │   ├── main.jsx     # React entry point

│   │   └── index.css    # Tailwind + global styles

│   ├── index.html

│   ├── package.json

│   ├── vite.config.js

│   ├── tailwind.config.js

│   └── postcss.config.js

├── .gitignore

└── README.md

---

## Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js v18+
- ffmpeg installed and available in PATH
- Groq API key (free at console.groq.com)

### 1. Clone the repository
```bash
git clone https://github.com/Hassan-valorwala/HookSense.git
cd HookSense
```

### 2. Create environment file
Create a `.env` file in the root directory

### 3. Backend setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Frontend setup
```bash
cd frontend
npm install
```

### 5. Install ffmpeg (Windows)
Download from https://www.gyan.dev/ffmpeg/builds/ and add the `bin` folder to your system PATH.

---

## Running the Application

### Start backend (Terminal 1)
```bash
cd backend
venv\Scripts\activate
# Add ffmpeg to PATH if not system-wide
$env:PATH += ";path\to\ffmpeg\bin"
python -m uvicorn main:app --reload --port 8000
```

### Start frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Usage

1. Open the app at http://localhost:5173
2. Upload two draft reel versions (MP4, MOV, MKV)
3. Preview both videos directly in the browser
4. Click **Analyse →**
5. Wait ~60 seconds for full AI analysis
6. Review the plain-English comparison, score breakdown, and actionable tip

---

## Scoring System

| Dimension | Weight | What It Measures |
|---|---|---|
| Hook Strength | 40% | Visual activity and scene changes in first 3 seconds |
| Pacing | 30% | Cuts per second across full video (ideal: 1–3 cuts/sec) |
| Audio Energy | 30% | RMS energy level of audio track |

---

## Evaluation Criteria Addressed

| Criterion | How HookSense Addresses It |
|---|---|
| Technical Implementation | Multimodal AI pipeline: OpenCV + librosa + Groq LLM |
| Innovation & Creativity | Novel client-creator approval workflow, not a generic analyzer |
| User Experience | Plain-English output, video preview, clean comparison UI |
| Scalability & Architecture | Modular FastAPI backend, separable analysis stages |
| Problem-Solution Fit | Directly targets the expertise gap in small business content approval |

---

## Future Improvements

- OCR-based CTA detection
- Thumbnail analysis
- Competitor benchmarking
- YouTube Shorts support
- Historical performance tracking
- WhatsApp bot integration for Indian small businesses

---

## Built By

**Mohammad Hassan Valorwala**
B.Tech Artificial Intelligence & Machine Learning
Parul University

Bharat Academix CodeQuest 2026 — Round 2 Submission
