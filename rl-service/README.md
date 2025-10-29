# RL service (DQN) — scaffold

This folder contains a minimal scaffold for a centralized RL microservice that learns price adjustments using DQN.

Files added:
- `app/main.py` — FastAPI app with simple endpoints to request actions and post observations.
- `models/env.py` — a small Gymnasium environment for price adjustment and simulated bookings.
- `train.py` — trainer script that trains a DQN agent and saves the policy.
- `simulate.py` — simple simulator to generate trajectories for testing.
- `requirements.txt` — Python dependencies.

Quick start (local, requires Python and pip):

```powershell
cd rl-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Train (short run)
python train.py --timesteps 10000
# Run API
uvicorn app.main:app --reload --port 8001
```

This is a scaffold — review safety (price caps, A/B rollout) before using in production.
