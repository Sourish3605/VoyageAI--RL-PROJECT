"""
Minimal trainer for DQN using stable-baselines3.

Usage:
    python train.py --timesteps 10000
"""
import argparse
from models.env import PricingEnv
import os
import numpy as np

def main(args):
    try:
        from stable_baselines3 import DQN
    except Exception as e:
        print("stable-baselines3 is required. Install with: pip install stable-baselines3 sb3-contrib")
        raise

    env = PricingEnv(base_price=1000.0)
    model = DQN('MlpPolicy', env, verbose=1)
    model.learn(total_timesteps=args.timesteps)
    out = args.out or 'dqn_pricing'
    os.makedirs('models', exist_ok=True)
    model.save(os.path.join('models', out))
    print(f"Saved model to models/{out}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--timesteps', type=int, default=10000)
    parser.add_argument('--out', type=str, default=None)
    args = parser.parse_args()
    main(args)
