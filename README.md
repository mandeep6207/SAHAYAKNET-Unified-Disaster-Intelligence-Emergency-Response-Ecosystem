# SahayakNet 2.0 — AI Disaster Coordination System

<div align="center">

![SahayakNet Banner](https://img.shields.io/badge/NDMA-Disaster%20Coordination-0b3c5d?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6TTIgMTdsOC45OTkgNEwyMiAxN1Y3bC0xMCA1eiIvPjwvc3ZnPg==)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-0.142-009688?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)

**HackBios 2026 Finals — Team Submission**

*Real-time AI-powered disaster response and coordination platform for India*

[Live Demo](#running-locally) · [API Docs](http://localhost:8000/docs) · [Features](#features) · [Architecture](#architecture)

</div>

---

## Overview

SahayakNet 2.0 is a full-stack disaster coordination system built for the **National Disaster Management Authority (NDMA)** of India. It connects citizens needing help, field volunteers, NGOs, and government control rooms in real time during disaster events.

The system covers **5 Indian states** — Chhattisgarh, Odisha, Jharkhand, Bihar, and Assam — with a complete multi-channel request pipeline (web, IVR, WhatsApp, SMS, missed-call, drone surveillance) and live AI-assisted volunteer assignment.

---

## Features

### Citizen
- **One-tap emergency help** — 8 categories (medical, rescue, food, water, shelter, baby care, women care, emergency)
- **Guided request form** — 3-level State → District → City location picker (5 states × 5 districts × 5 cities)
- **GPS location detection** — auto-detect and fallback to manual entry
- **Live status tracking** — request ID, volunteer name, ETA, mission timeline
- **Offline mode** — requests queued locally and synced when network returns
- **Request history** — full history with status badges and detail modal

### Volunteer
- **Field operations dashboard** — assigned missions with live 3-second polling
- **State machine buttons** — Accept → Start Mission → Complete (correct state shown per mission stage)
- **AI assist panel** — nearest pending request suggested with priority reason
- **Live map** — own location + mission locations with ETA
- **Mission history & profile** — tasks completed, average response time, success rate

### Government / Admin
- **Command center dashboard** — live KPIs: active requests, critical cases, completed, volunteers available
- **Request management** — Priority / Status / State / District filters; Assign, Auto-assign, Increase Priority, Merge Duplicates
- **Resource gauges** — Food Packets, Medical Kits, Water Supply, Shelter Units, Baby/Women Care Kits, Emergency Essentials
- **Broadcast alerts** — role-gated (government/NGO only), rate-limited (5/5min), delivery to SMS/WhatsApp/App channels
- **Relief camps** — 5 state camp occupancy overview

### Multi-channel Input
| Channel | Endpoint | Mode |
|---------|----------|------|
| Web form | `POST /request` | JSON |
| IVR (Twilio) | `POST /ivr` | TwiML + JSON |
| WhatsApp (Twilio) | `POST /whatsapp` | TwiML + JSON |
| SMS (Twilio) | `POST /sms` | TwiML + JSON |
| Missed call | `POST /missed-call` | JSON |
| Drone surveillance | `POST /drone` | JSON |

### AI / Intelligence
- **Priority scoring** — category severity + family size + wait time
- **Duplicate detection** — same category + location merges requests, accumulates family count
- **Auto-assignment** — zone-first, then lowest load, then nearest distance
- **30-second timeout** — unaccepted assignments auto-reassign to next volunteer
- **YOLO person detection** — YOLOv8n model for drone frame analysis
- **Weather risk analysis** — OpenWeatherMap integration with simulated fallback

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js 16)              │
│  /citizen  /volunteer  /government  /drone  /admin  │
│  Leaflet maps · Tailwind CSS · Real-time polling    │
└──────────────────────┬──────────────────────────────┘
                       │ REST API (JSON)
                       │ CORS: localhost:3000
┌──────────────────────▼──────────────────────────────┐
│                 BACKEND (FastAPI)                    │
│  33 endpoints · Uvicorn · Python 3.12               │
│  In-memory state + atomic JSON persistence          │
│  Background tasks: auto-assign, cache refresh       │
└──────────┬──────────────────────┬───────────────────┘
           │                      │
    data.json               YOLO model
  (persistence)            yolov8n.pt
```

**Tech stack:**
- **Frontend:** Next.js 16.2 (Turbopack), React 19, TypeScript 5, Tailwind CSS 3, Leaflet/React-Leaflet
- **Backend:** FastAPI 0.142, Uvicorn 0.54, Pydantic v2, Python 3.12
- **AI/ML:** Ultralytics YOLOv8n (person detection), custom priority scoring
- **Comms:** Twilio (IVR TwiML, WhatsApp TwiML, SMS)
- **Maps:** OpenStreetMap via Leaflet, heatmap layer, marker clustering
- **Storage:** Atomic JSON file (`backend/data.json`) — no external DB required

---

## Project Structure

```
SahayakNet/
├── backend/
│   ├── main.py              # FastAPI app — all 33 endpoints
│   ├── requirements.txt     # Python dependencies
│   ├── data.json            # Persistent state (auto-written)
│   └── events/frames/       # Drone capture images
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # Home / landing
│   │   ├── citizen/         # Citizen portal + profile
│   │   ├── volunteer/       # Volunteer dashboard + profile
│   │   ├── government/      # Admin dashboard + sub-pages
│   │   ├── command-center/  # Broadcast alerts
│   │   ├── drone/           # Drone surveillance
│   │   ├── request-help/    # Emergency request form
│   │   ├── request-status/  # Track by ID / phone
│   │   └── request-history/ # Citizen history
│   ├── components/          # Shared React components
│   │   ├── MapView.tsx      # Leaflet map wrapper
│   │   ├── RequestDetailModal.tsx
│   │   ├── MissionTimeline.tsx
│   │   ├── ResourceGauge.tsx
│   │   └── ...
│   └── lib/
│       ├── api.ts           # All backend API calls
│       ├── store.tsx        # React context + state management
│       ├── locationData.ts  # 5 states × 5 districts × 5 cities
│       ├── aiLogic.ts       # Priority, resource estimation, AI assist
│       └── mergeRequests.ts # Live + demo data merge
├── public/                  # Static assets
├── .env.local               # Local config (NEXT_PUBLIC_API_BASE)
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Running Locally

### Prerequisites
- Node.js 20+
- Python 3.10+
- Git

### 1. Clone
```bash
git clone https://github.com/mandeep6207/HackBios_2026_Finals_SahayakNet_2.0.git
cd HackBios_2026_Finals_SahayakNet_2.0
```

### 2. Backend setup
```bash
cd backend
python -m venv .venv

# Windows
.\.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

If this project was moved or copied from another drive, recreate `.venv`
because Windows virtual-environment launchers contain absolute paths:
```powershell
cd C:\SahayakNet-AI_Disaster_Coordination_System-main\backend
deactivate  # Ignore the error if no environment is active
Remove-Item -Recurse -Force .venv
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

> **YOLO model:** Download `yolov8n.pt` from [Ultralytics](https://github.com/ultralytics/assets/releases) and place it at `backend/yolov8n.pt`. The drone detection endpoint returns a 503 without it; all other endpoints work normally.

### 3. Start backend
```bash
# From backend/ directory
.\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Backend: http://localhost:8000  
API docs: http://localhost:8000/docs

### 4. Frontend setup
```bash
# From repo root
npm install
npm run dev
```
Frontend: http://localhost:3000

### 5. Environment (optional)
The `.env.local` file is pre-configured for local development:
```
NEXT_PUBLIC_API_BASE=http://localhost:8000
NEXT_TELEMETRY_DISABLED=1
```
Set `OPENWEATHER_API_KEY` in the backend environment for live weather data (falls back to realistic simulation without it).

---

## API Reference (key endpoints)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/request` | Create help request |
| `GET` | `/requests` | List all requests |
| `GET` | `/request/{id}` | Get single request |
| `POST` | `/assign` | Manual volunteer assignment |
| `POST` | `/auto-assign` | Trigger auto-assignment |
| `POST` | `/volunteer/accept` | Accept assigned mission |
| `POST` | `/volunteer/reject` | Reject → triggers reassignment |
| `POST` | `/mission/start` | Set on_the_way status |
| `POST` | `/complete` | Complete mission |
| `GET` | `/volunteers` | List volunteers |
| `POST` | `/volunteer` | Register volunteer |
| `GET` | `/dashboard` | Full dashboard payload |
| `GET` | `/weather` | Weather data (zone) |
| `GET` | `/risk-analysis` | Risk assessment (zone) |
| `POST` | `/broadcast` | Send alert (govt/NGO role) |
| `POST` | `/drone` | Create request from drone data |
| `POST` | `/drone/detect` | YOLO person detection |
| `POST` | `/ivr` | IVR digit handler (Twilio + JSON) |
| `POST` | `/whatsapp` | WhatsApp handler (Twilio + JSON) |
| `POST` | `/sms` | SMS handler (Twilio + JSON) |
| `POST` | `/missed-call` | Missed call → rescue request |

Full OpenAPI spec at `http://localhost:8000/docs` when the backend is running.

---

## Data & State

- All state is held **in memory** and written atomically to `backend/data.json` on every mutation
- On startup, `data.json` is loaded; if absent, seed data (80 requests, 34 volunteers across 5 states) is generated
- Counters (`request_counter`, `volunteer_counter`, `mission_counter`) are persisted so IDs never collide after restart
- The frontend polls `GET /dashboard?compact=1` every 3 seconds for live updates

---

## Location Coverage

| State | Districts (5) |
|-------|--------------|
| Chhattisgarh | Raipur, Durg, Bhilai Nagar, Bilaspur, Korba |
| Odisha | Khordha, Cuttack, Sundargarh, Sambalpur, Ganjam |
| Jharkhand | Ranchi, East Singhbhum, Dhanbad, Bokaro, Hazaribagh |
| Bihar | Patna, Gaya, Muzaffarpur, Bhagalpur, Darbhanga |
| Assam | Kamrup Metropolitan, Dibrugarh, Jorhat, Cachar, Sonitpur |

Each district has 5 cities — **125 mapped locations** total with precise lat/lng coordinates.

---

## Team — HackBios 2026 Finals

Built for the HackBios 2026 national hackathon finals.

---

## License

[MIT](LICENSE)
