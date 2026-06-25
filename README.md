# 🎯 LeadRadar

> Find businesses before they go online.

LeadRadar scans any city for restaurants, cafes, and local food businesses that have **no website** — giving freelance developers a warm, pre-qualified pitch list exported as a formatted Excel sheet.

**Built for your CV:** Full-stack app — React + Tailwind + Redux Toolkit (frontend) · FastAPI + Python (backend) · OpenStreetMap (free data source) · openpyxl (Excel export)

---

## Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS v4         |
| State     | Redux Toolkit                             |
| HTTP      | Axios                                     |
| Icons     | React Icons (Feather set)                 |
| UI Base   | Flowbite React                            |
| Backend   | FastAPI (Python)                          |
| Data      | OpenStreetMap Overpass API (100% free)    |
| Export    | openpyxl (.xlsx)                          |

---

## Project Structure

```
leadradar/
├── backend/
│   ├── main.py              # FastAPI app — /api/search, /api/export
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Hero.jsx
    │   │   ├── HowItWorks.jsx
    │   │   ├── BusinessCard.jsx
    │   │   ├── SkeletonCard.jsx
    │   │   ├── Results.jsx
    │   │   ├── Fallback.jsx
    │   │   └── Footer.jsx
    │   ├── store/
    │   │   ├── index.js
    │   │   └── searchSlice.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vite.config.js
    └── package.json
```

---

## Setup & Run

### 1. Backend (Python — FastAPI)

```bash
cd leadradar/backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

---

### 2. Frontend (React + Vite)

```bash
cd leadradar/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

> The Vite dev server proxies `/api` requests to `http://localhost:8000` automatically.

---

## API Endpoints

| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| GET    | `/api/search?city=` | Returns all businesses as JSON     |
| GET    | `/api/export?city=` | Downloads formatted `.xlsx` file   |
| GET    | `/api/health`       | Health check                       |

---

## Usage

1. Run both backend and frontend
2. Open `http://localhost:5173`
3. Type a city name (e.g. **Jodhpur**, **Jaipur**, **Udaipur**)
4. Click **Scan City**
5. Filter by **No Website** to see pitch targets
6. Click **Export .xlsx** to download your lead list

---

## Color Palette

| Name      | Hex       | Used On               |
|-----------|-----------|-----------------------|
| Black     | `#262626` | Background, cards     |
| Dove Grey | `#676B6C` | Secondary text, icons |
| Casper    | `#AABBC5` | Accents, badges, CTA  |
| Dark Text | `#212023` | Text on Casper bg     |
| White     | `#FFFFFF` | Primary text          |

---

## No API Keys Required

LeadRadar uses **OpenStreetMap's Overpass API** — completely free, no account, no credit card, no rate limit for reasonable usage.

---

## CV-Ready Feature List

- Full-stack app: Python backend + React frontend
- REST API design with FastAPI
- Redux Toolkit global state management
- Axios HTTP client with proxy config
- OpenStreetMap Overpass API integration
- Excel export with openpyxl (formatted, two sheets)
- Glassmorphism UI design
- Skeleton loaders + fallback UI states
- Fully responsive (mobile → desktop)
- Tailwind CSS v4 utility-first styling
