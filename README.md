# 🛡️ ScamShield AI
> **Detect Scams Before They Detect You.**  
> Privacy-Conscious, Explainable AI-Powered Scam Calls, SMS Phishing, UPI Fraud, and Malicious URL Defense Platform.

---

## 🌟 Vision & Overview

**ScamShield AI** is an explainable cybersecurity defense application engineered to detect and dismantle modern fraud techniques before victims take irreversible action. It analyzes:
1. **SMS Phishing & Text Messages** (Fake KYC, OTP theft, lottery lures, UPI collection fraud, malicious APK drops).
2. **Scam Call Transcripts** (Digital Arrest intimidation, law enforcement impersonation, screen sharing, AnyDesk/TeamViewer coercion).
3. **Phishing & Suspicious URLs** (Local static analysis: Subdomain brand squatting, raw IP hosts, shorteners, embedded credentials, SSRF-safe).

### Key Architectural Tenets:
- **Explainable Risk Scoring**: Computes a deterministic 0–100 risk score with human-readable rationale, evidence snippets, and categorized severity indicators.
- **Benign Advisory Disambiguation**: Intelligently differentiates authentic safety warnings (e.g. *"Bank never asks for OTP or password"*) from phishing attacks (e.g. *"Send OTP immediately to unlock account"*).
- **Privacy by Default**: Performs analysis locally. Never harvests private SMS inboxes, microphone audio, or contact logs. Does not store raw message text by default.
- **Zero-Network Static URL Inspection**: Inspects URL syntax, apex registrable domains, and obfuscation parameters completely offline without visiting or pinging destination servers (preventing SSRF).
- **Dual-Language Localization**: Full bilingual user interface support in **English** and **Telugu (తెలుగు)**.
- **No Paid APIs Required**: 100% operational offline without paid OpenAI/Gemini/Anthropic keys or cloud subscriptions.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts |
| **Backend** | Python 3.13, FastAPI, Uvicorn, Pydantic v2, SQLAlchemy, SQLite |
| **Detection Engine** | Rule-Based Heuristic Matching, Public Suffix Domain Decomposition |
| **Testing** | Pytest, FastAPI TestClient, Automated End-to-End API suites |
| **Operating System** | Cross-platform (Optimized for Windows PowerShell) |

---

## 📂 Project Structure

```
hackthon/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI lifespan entry & CORS
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py            # Settings, thresholds, limits
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── models.py            # SQLite ScanRecord table
│   │   │   └── session.py           # SQLAlchemy session setup
│   │   ├── engine/
│   │   │   ├── __init__.py
│   │   │   ├── rules.py             # Rule definitions & brand catalog
│   │   │   ├── scorer.py            # Explainable scoring algorithm (0-100)
│   │   │   ├── sms_analyzer.py      # SMS fraud & benign advisory detection
│   │   │   ├── call_analyzer.py     # Digital arrest & remote access analyzer
│   │   │   └── url_analyzer.py      # SSRF-safe local URL structural inspector
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── analysis.py          # Pydantic request & response models
│   │   └── api/
│   │       ├── __init__.py
│   │       └── routes.py            # REST endpoints (/analyze, /history, /stats)
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_sms_analyzer.py     # SMS rules & boundary tests
│   │   ├── test_call_analyzer.py    # Call coercion & digital arrest tests
│   │   ├── test_url_analyzer.py     # Local URL heuristic tests
│   │   └── test_api.py              # FastAPI integration tests
│   ├── requirements.txt
│   └── scamshield.db
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Branding, language toggle, status
│   │   │   ├── Sidebar.tsx          # 9-page responsive navigation drawer
│   │   │   ├── RiskBadge.tsx        # Low Risk / Suspicious / High Risk chip
│   │   │   ├── RiskGauge.tsx        # Animated SVG radial meter (0-100)
│   │   │   ├── IndicatorsList.tsx   # Evidence snippets & rule breakdown
│   │   │   └── RecommendationsCard.tsx # Safety actions & Cyber Helpline 1930
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx        # Hero, live telemetry charts, recent scans
│   │   │   ├── SmsAnalyzer.tsx      # SMS fraud input & sample loader
│   │   │   ├── CallAnalyzer.tsx     # Call transcript & digital arrest detector
│   │   │   ├── UrlChecker.tsx       # Local static URL safety inspector
│   │   │   ├── ScanHistory.tsx      # Local history filter & report modal
│   │   │   ├── ThreatInsights.tsx   # Visual threat playbooks
│   │   │   ├── SafetyCenter.tsx     # Offline-ready safety guides & helpline
│   │   │   ├── About.tsx            # Project mission & architecture
│   │   │   └── Settings.tsx         # Language toggle & privacy controls
│   │   ├── services/
│   │   │   └── api.ts               # Backend API client
│   │   ├── i18n/
│   │   │   └── translations.ts      # English & Telugu translation catalog
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces
│   │   ├── App.tsx                  # Main application shell
│   │   ├── index.css                # Dark cyber aesthetics & glassmorphism
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
│
├── .gitignore
├── .env.example
└── README.md
```

---

## ⚡ Quick Start (Windows PowerShell)

### Prerequisites
- **Python 3.10+** (Tested on Python 3.13)
- **Node.js 18+** (Tested on Node.js v20.18+)

---

### Step 1: Start the Backend (Terminal 1)

```powershell
# Navigate to the backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Upgrade pip and install dependencies
pip install -r requirements.txt

# Run the FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be online at: **`http://localhost:8000`**  
Interactive API Docs (Swagger UI): **`http://localhost:8000/docs`**

---

### Step 2: Start the Frontend (Terminal 2)

```powershell
# Open a second PowerShell terminal and navigate to frontend
cd frontend

# Install npm dependencies
npm install

# Start the Vite development server
npm run dev
```

Frontend will be accessible at: **`http://localhost:5173`**

---

### Step 3: Run Automated Backend Tests

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pytest -v -p no:cacheprovider
```

**Results:** 29 passed in under 1 second.

---

## 🔍 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health & privacy-safe mode telemetry |
| `POST` | `/api/analyze/sms` | Analyzes SMS for OTP theft, KYC threats, APKs |
| `POST` | `/api/analyze/call` | Analyzes call scripts for digital arrest & remote access |
| `POST` | `/api/analyze/url` | Pure static inspection of suspicious URLs |
| `GET` | `/api/history` | Fetches privacy-conscious scan logs |
| `GET` | `/api/history/{id}` | Fetches individual scan report details |
| `DELETE`| `/api/history` | Clears all stored scan metadata |
| `GET` | `/api/stats` | Returns aggregate counts & risk distribution |

---

## 🛡️ Privacy & Security Disclosures

1. **User-Initiated Analysis**: ScamShield AI never accesses device contacts, inbox SMS, or microphone audio.
2. **No Raw Content Storage**: Database stores only risk metrics, timestamps, and scan types by default. Original messages are discarded after evaluation.
3. **SSRF Safe**: Target URLs are never visited, resolved, or requested over the internet.
4. **Heuristic Limitation**: Risk scores are heuristic estimations based on recognized indicators. The absence of flags does not guarantee absolute safety.

---

## 🎤 5-Minute Hackathon Presentation Script

- **[0:00 - 0:45] The Problem**: Every day, thousands of ordinary citizens, elders, and students in India receive deceptive calls about 'Digital Arrest' by fake police, urgent electricity cutoff SMS messages, or fraudulent UPI cashback requests. Fear and urgency prevent people from verifying the truth before transferring money.
- **[0:45 - 1:45] The Solution (ScamShield AI)**: ScamShield AI is a privacy-first, explainable digital safety companion. Unlike opaque LLMs that can hallucinate, ScamShield uses a deterministic, transparent rule engine that identifies exact malicious patterns and explains *why* something is dangerous.
- **[1:45 - 3:15] Live Demonstration**:
  - *SMS Analyzer*: Load the 'Fake KYC' sample. Click Analyze. Show the High Risk score, the exact triggered indicators, and immediate safe action protocol.
  - *Call Analyzer*: Load the 'Digital Arrest' scenario. Explain how scammers pose as police and how ScamShield flags the coercion tactics and advises dialing 1930.
  - *URL Checker*: Show how ScamShield analyzes lookalike banking subdomains (`sbi.login-portal.xyz`) locally without making dangerous outbound web requests.
  - *Telugu Localization*: Switch to 'తెలుగు' with one click, showing accessibility for regional language speakers.
- **[3:15 - 4:15] Privacy & Architecture**: We never store private messages. The system operates 100% offline without costly cloud APIs.
- **[4:15 - 5:00] Conclusion & Q&A**: ScamShield AI turns ordinary citizens into informed defenders against cybercrime. "Detect Scams Before They Detect You."
