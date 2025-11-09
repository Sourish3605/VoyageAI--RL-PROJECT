"""smartfare_rl.py

Single-file RL system for dynamic pricing of flights, trains, and buses.
Adapted to use gymnasium (compatible with stable-baselines3 v2).

Usage:
python smartfare_rl.py --mode flight --timesteps 200000

Author: Sourish-friendly version (you can adapt constants easily)
"""

import argparse
import math
import os
from typing import Tuple

# Use gymnasium (repo requirements use gymnasium)
import gymnasium as gym
from gymnasium import spaces
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.callbacks import BaseCallback

# -------------------------
# Environment
# -------------------------
class SmartFareEnv(gym.Env):
    """
    Gymnasium environment for dynamic pricing (flight/train/bus).
    Each episode simulates a single trip from `start_days` until departure (day 0).
    Action: continuous multiplier in [0.5, 2.0] applied to a base price.
    Observation: [days_left_norm, seats_remaining_norm, demand_index, last_price]
    """

    metadata = {"render.modes": ["human"]}

    def __init__(
        self,
        distance_km: float = 500.0,
        mode: str = "flight",  # "flight" / "train" / "bus"
        total_seats: int = 150,
        start_days: int = 60,
        base_rate_per_km: float = None,
        seed: int = None,
    ):
        super().__init__()

        assert mode in ("flight", "train", "bus")
        self.mode = mode
        self.distance_km = float(distance_km)
        self.total_seats = int(total_seats)
        self.start_days = int(start_days)
        self.seed = seed

        # default base rates by mode (₹/km rough)
        if base_rate_per_km is None:
            if mode == "flight":
                base_rate_per_km = 5.0
            elif mode == "train":
                base_rate_per_km = 0.8
            else:
                base_rate_per_km = 1.2
        self.base_rate_per_km = float(base_rate_per_km)

        # set mode-specific parameters
        if mode == "flight":
            self.fuel = 1500.0
            self.airport_fees = 800.0
            self.elasticity = 1.2
        elif mode == "train":
            self.fuel = 0.0
            self.airport_fees = 0.0
            self.elasticity = 0.6
        else:  # bus
            self.fuel = 0.0
            self.airport_fees = 0.0
            self.elasticity = 0.9

        # Action space: continuous multiplier
        self.action_space = spaces.Box(low=np.array([0.5], dtype=np.float32),
                                       high=np.array([2.0], dtype=np.float32),
                                       dtype=np.float32)

        # Observation: 4 continuous values normalized to [0,1] (last_price kept in [0.5,2])
        obs_low = np.array([0.0, 0.0, 0.0, 0.5], dtype=np.float32)
        obs_high = np.array([1.0, 1.0, 2.0, 2.0], dtype=np.float32)
        self.observation_space = spaces.Box(obs_low, obs_high, dtype=np.float32)

        self.rng = np.random.default_rng(seed)
        self.reset()

    def reset(self, *, seed=None, options=None):
        # gymnasium style reset signature (seed & options optional)
        if seed is not None:
            self.rng = np.random.default_rng(seed)
        self.days_left = self.start_days
        self.seats_remaining = self.total_seats
        self.seats_sold = 0
        self.last_price = 1.0
        self.cumulative_revenue = 0.0
        self.history = []  # store logs for analysis
        obs = self._get_obs()
        return obs, {}

    def step(self, action):
        # Clip and interpret action (multiplier)
        multiplier = float(np.clip(action, self.action_space.low, self.action_space.high)[0])
        self.last_price = multiplier

        # Build price
        base_fare = self.distance_km * self.base_rate_per_km
        fixed_charges = self.fuel + self.airport_fees
        price = max(1.0, (base_fare + fixed_charges) * multiplier)

        # Demand profile: more demand near departure
        base_demand = self._base_demand_profile(self.days_left)

        # Price elasticity effect on purchase rate (exponential)
        purchase_rate = base_demand * math.exp(-self.elasticity * (price / (base_fare + 1e-6) - 1.0))

        # Potential buyers per step: tuneable - larger route => more buyers
        potential_buyers = max(1, int(5 + 0.02 * self.distance_km))  # heuristic
        arrivals = self.rng.poisson(lam=max(0.0, purchase_rate * potential_buyers))

        # Sales can't exceed inventory
        sales = min(arrivals, self.seats_remaining)
        revenue = sales * price
        self.seats_remaining -= sales
        self.seats_sold += sales
        self.cumulative_revenue += revenue

        # Reward = immediate revenue minus mild penalty for high prices (to reflect demand loss)
        demand_acceptable_price = (base_fare + fixed_charges) * 1.2
        price_spike_penalty = max(0.0, price - demand_acceptable_price) * 0.005

        reward = revenue - price_spike_penalty

        # Time progression (we step daily)
        self.days_left -= 1
        done = (self.days_left <= 0) or (self.seats_remaining <= 0)

        # End-of-episode unsold penalty (applied once when done)
        if done and self.seats_remaining > 0:
            unsold_penalty = self.seats_remaining * 2.0
            reward -= unsold_penalty

        # Store history row for debugging / plotting
        self.history.append({
            "days_left": self.days_left,
            "price": price,
            "sales": int(sales),
            "seats_remaining": int(self.seats_remaining),
            "revenue": float(revenue),
        })

        obs = self._get_obs()
        info = {"price": price, "sales": int(sales), "seats_remaining": int(self.seats_remaining)}

        # gymnasium uses (obs, reward, terminated, truncated, info)
        terminated = done
        truncated = False
        return obs, float(reward), terminated, truncated, info

    def _get_obs(self):
        return np.array([
            self.days_left / float(self.start_days),
            self.seats_remaining / float(self.total_seats),
            1.0,  # placeholder demand index (extendable)
            self.last_price
        ], dtype=np.float32)

    def _base_demand_profile(self, days_left: int) -> float:
        # Smooth demand: low far out, rises closer to departure
        if days_left > 30:
            return 0.4
        elif days_left > 7:
            return 1.0
        else:
            return 1.8  # last-minute surge

    def render(self, mode="human"):
        print(f"[{self.mode.upper()}] Days left: {self.days_left}, Seats rem: {self.seats_remaining}, last_price_mult: {self.last_price:.2f}")

# -------------------------
# Callback to record training rewards for plotting
# -------------------------
class RewardLoggerCallback(BaseCallback):
    def __init__(self, verbose=0):
        super().__init__(verbose)
        self.episode_rewards = []

    def _on_step(self) -> bool:
        return True

    def _on_rollout_end(self) -> None:
        pass

# -------------------------
# Utilities: train, eval, plot
# -------------------------
def make_env_fn(distance_km, mode, total_seats, start_days, seed=None):
    def _init():
        env = SmartFareEnv(distance_km=distance_km, mode=mode, total_seats=total_seats, start_days=start_days, seed=seed)
        env = Monitor(env)  # record episode rewards in a file-like buffer
        return env
    return _init

def train_agent(mode: str = "flight",
                distance_km: float = 1150.0,
                total_seats: int = 150,
                start_days: int = 60,
                timesteps: int = 200_000,
                save_path: str = "./models/ppo_smartfare",
                seed: int = 42):
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    env_fn = make_env_fn(distance_km=distance_km, mode=mode, total_seats=total_seats, start_days=start_days, seed=seed)
    env = DummyVecEnv([env_fn])

    model = PPO("MlpPolicy", env, verbose=1, seed=seed,
                policy_kwargs=dict(net_arch=[256, 128]))

    print(f"Starting training: mode={mode}, distance={distance_km} km, seats={total_seats}, days={start_days}")
    model.learn(total_timesteps=timesteps)
    model.save(save_path)
    print(f"Model saved to {save_path}")
    env.close()
    return model

def evaluate_agent(model: PPO,
                   mode: str = "flight",
                   distance_km: float = 1150.0,
                   total_seats: int = 150,
                   start_days: int = 60,
                   episodes: int = 10,
                   seed: int = 1001) -> pd.DataFrame:
    env_fn = make_env_fn(distance_km=distance_km, mode=mode, total_seats=total_seats, start_days=start_days, seed=seed)
    env = DummyVecEnv([env_fn])

    rows = []
    for ep in range(episodes):
        # DummyVecEnv.reset() returns observation (batched)
        obs = env.reset()
        done = False
        total_revenue = 0.0
        step_count = 0
        while not done:
            action, _states = model.predict(obs, deterministic=True)
            obs, reward, terminated, truncated, info = env.step(action)
            done = bool(terminated or truncated)
            info0 = info[0] if isinstance(info, (list, tuple)) else info
            step_count += 1
        inner_env = env.envs[0].env
        total_revenue = getattr(inner_env, "cumulative_revenue", 0.0)
        rows.append({
            "episode": ep,
            "total_revenue": total_revenue,
            "seats_sold": inner_env.seats_sold,
            "seats_remaining": inner_env.seats_remaining,
            "steps": step_count
        })
        env.reset()
    env.close()
    df = pd.DataFrame(rows)
    return df

def plot_history_from_env(env_instance, filename=None):
    df = pd.DataFrame(env_instance.history)
    if df.empty:
        print("No history to plot.")
        return
    fig, ax = plt.subplots(2, 1, figsize=(8, 6), tight_layout=True)

    ax[0].plot(df["price"], label="price")
    ax[0].set_ylabel("Price (₹)")
    ax[0].legend(loc="best")
    ax[1].bar(df.index, df["sales"], alpha=0.7, label="sales")
    ax[1].set_ylabel("Sales / day")
    ax[1].set_xlabel("Day (step)")
    ax[1].legend(loc="best")

    if filename:
        plt.savefig(filename)
        print(f"Saved history plot to {filename}")
    else:
        plt.show()
    plt.close(fig)

# -------------------------
# Main CLI
# -------------------------
def main():
    parser = argparse.ArgumentParser(description="SmartFare RL training")
    parser.add_argument("--mode", type=str, default="flight", choices=["flight", "train", "bus"], help="Transport mode")
    parser.add_argument("--distance", type=float, default=1150.0, help="Distance in km")
    parser.add_argument("--seats", type=int, default=150, help="Total seats")
    parser.add_argument("--days", type=int, default=60, help="Days before departure (episode length)")
    parser.add_argument("--timesteps", type=int, default=200_000, help="Training timesteps for PPO")
    parser.add_argument("--save", type=str, default="./models/ppo_smartfare", help="Path to save model")
    parser.add_argument("--eval_episodes", type=int, default=5, help="Evaluation episodes after training")
    args = parser.parse_args()

    # Train
    model = train_agent(mode=args.mode,
                        distance_km=args.distance,
                        total_seats=args.seats,
                        start_days=args.days,
                        timesteps=args.timesteps,
                        save_path=args.save)

    # Evaluate
    print("Evaluating trained agent...")
    df = evaluate_agent(model,
                        mode=args.mode,
                        distance_km=args.distance,
                        total_seats=args.seats,
                        start_days=args.days,
                        episodes=args.eval_episodes)
    print(df.describe())
    print(df)

    # Show one sample episode history (inspect env)
    env = SmartFareEnv(distance_km=args.distance, mode=args.mode, total_seats=args.seats, start_days=args.days, seed=12345)
    obs, _ = env.reset()
    done = False
    while not done:
        action, _ = model.predict(obs, deterministic=True)
        obs, reward, terminated, truncated, info = env.step(action)
        done = bool(terminated or truncated)
    # Plot history to file
    plot_file = f"history_{args.mode}.png"
    plot_history_from_env(env, filename=plot_file)
    print(f"History plot saved -> {plot_file}")

if __name__ == "__main__":
    main()
