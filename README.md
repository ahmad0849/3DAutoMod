# 3DAutoMod

AI-powered car customization studio. Upload a photo of a car, change its paint colour, swap its rims, and generate a 3D model — then send the finished spec to nearby mechanics for bids.

Final Year Project.

## Demo

[`FYP Vid.mp4`](FYP%20Vid.mp4) — full walkthrough of the app (click the file, then **View raw** to play).

## Features

- **Studio** — upload a car image, segment its parts, recolour the body, replace rims with a chosen rim image
- **3D generation** — turn the customized 2D car into a viewable 3D model (`@react-three/fiber` + `drei` viewer)
- **Mechanics** — browse mechanics, filter, request bids on a customization job
- **Bids & Chat** — mechanics submit bids; owner chats with the mechanic in-app
- **Auth** — Supabase auth with `owner` / `mechanic` roles and row-level security

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router |
| 3D | Three.js, `@react-three/fiber`, `@react-three/drei` |
| Backend | Python, FastAPI, Uvicorn |
| Vision | Detectron2, OpenCV, COCO-format instance segmentation |
| Data / Auth | Supabase (Postgres, Auth, RLS) |

## Repository Layout

```
src/                     React frontend
  components/studio/     Upload zone, 3D viewer, toolbox, navigation
  components/mechanics/  Mechanic list, bid list, filters, selection modal
  components/chat/       Chat header, history, input
  components/auth/       Login / signup form
  pages/                 Home, Studio, Mechanics, MechanicBids, Chat
  lib/supabase.ts        Supabase client
APIs/                    FastAPI vision backend
  main.py                API entrypoint - mounts all endpoints
  colorChangeFastAPI_partseg.py    Colour change via part segmentation
  rim_change_coco_FastAPI.py       Rim replacement (COCO masks)
  segmentation_FastAPI.py          Car part segmentation
  API_file_return_3d.py            2D -> 3D model generation
  rims_change/rims/                Rim segmentation notebook + scripts
supabase/migrations/     Postgres schema, RLS policies, auth triggers
```

## API Endpoints

Served by `APIs/main.py` on `http://0.0.0.0:8001`, interactive docs at `/docs`.

| Method | Path | Body | Purpose |
|---|---|---|---|
| POST | `/change_car_color` | `file`, `r`, `g`, `b` | Recolour the car body |
| POST | `/segment_car` | `file` | Return part segmentation |
| POST | `/segment_car_rims` | `car_file`, `rim_file` | Swap rims onto the car |
| POST | `/generate_3d` | `file` | Generate a 3D model from the image |

## Setup

### 1. Frontend

```bash
npm install
cp .env.example .env      # fill in your Supabase project URL and anon key
npm run dev
```

### 2. Backend

```bash
cd APIs
python -m venv .venv && .venv\Scripts\activate    # Windows
pip install -r requirements.txt
```

Detectron2 must be installed separately or the build fails:

```bash
pip install --no-build-isolation "detectron2 @ git+https://github.com/facebookresearch/detectron2.git@9604f5995cc628619f0e4fd913453b4d7d61db3f"
```

Then run:

```bash
python main.py
```

### 3. Database

Apply `supabase/migrations/` to your Supabase project. It creates the `profiles` table, enables RLS, and adds a trigger that populates a profile on signup.

## Datasets and Model Weights

Not committed — they exceed GitHub's 100 MB per-file limit and would bloat the repo:

- `APIs/rims_change.zip` (114 MB) — rim segmentation dataset
- `APIs/JPEGImages.zip` (18 MB) — training images
- `APIs/Car-Parts-Segmentation/` (110 MB) — third-party dataset, clone it from https://github.com/dsmlr/Car-Parts-Segmentation
- Trained `.pth` weights

Place them back in the paths above to run training or the full segmentation pipeline locally.

## Environment Variables

| Name | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key |

`.env` is gitignored. Use `.env.example` as the template.
