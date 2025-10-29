"""
Small script to generate sample observations using random policy and the env.
Writes observations to observations.jsonl (same path used by the FastAPI app).
"""
from models.env import PricingEnv
import json
import os

def run(n=1000):
    env = PricingEnv()
    obs_file = os.path.join(os.path.dirname(__file__), 'observations.jsonl')
    with open(obs_file, 'w', encoding='utf-8') as f:
        for _ in range(n):
            state, _ = env.reset()
            action = env.action_space.sample()
            next_state, reward, done, truncated, info = env.step(action)
            rec = {
                'state': state.tolist(),
                'action': int(action),
                'reward': float(reward),
                'next_state': next_state.tolist(),
                'done': bool(done)
            }
            f.write(json.dumps(rec) + '\n')
    print(f'Wrote {n} observations to {obs_file}')

if __name__ == '__main__':
    run(500)
