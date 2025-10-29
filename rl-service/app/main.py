from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import os
import json

app = FastAPI(title="rl-pricing-service")

# Simple in-memory buffer for observations (also persisted to disk)
OBS_FILE = os.path.join(os.path.dirname(__file__), '..', 'observations.jsonl')
OBS_FILE = os.path.abspath(OBS_FILE)

class ObservePayload(BaseModel):
    state: List[float]
    action: int
    reward: float
    next_state: List[float]
    done: bool

class ActionRequest(BaseModel):
    state: List[float]


@app.post('/observe')
def observe(payload: ObservePayload):
    # append to jsonl file
    line = json.dumps(payload.dict())
    with open(OBS_FILE, 'a', encoding='utf-8') as f:
        f.write(line + '\n')
    return {"status": "ok"}


@app.post('/action')
def action(req: ActionRequest):
    # For scaffold: return a random safe action or a simple heuristic
    # Actions: 0:-10%, 1:-5%, 2:0%, 3:+5%, 4:+10%
    # A real deployment would load a trained policy and return model.predict(state)
    # Here we use a heuristic: if price is high (state[0] normalized > 0.6) -> reduce
    state = req.state
    if len(state) == 0:
        raise HTTPException(status_code=400, detail="empty state")
    price_norm = state[0]
    if price_norm > 0.7:
        act = 1
    elif price_norm > 0.55:
        act = 2
    else:
        act = 3
    return {"action": int(act), "explanation": "heuristic (scaffold)"}


@app.post('/train')
def train():
    # Trigger training externally (trainer script should be run as a separate process)
    return {"status": "training_triggered", "note": "Run train.py manually or via CI"}


@app.get('/status')
def status():
    return {"status": "ok", "obs_file": OBS_FILE}
