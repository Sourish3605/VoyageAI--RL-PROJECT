import gymnasium as gym
from gymnasium import spaces
import numpy as np

class PricingEnv(gym.Env):
    """A tiny environment that simulates user booking probability based on price.

    State vector (float32): [price_norm, demand_estimate, days_until_departure]
    Actions (discrete): 0:-10%, 1:-5%, 2:0%, 3:+5%, 4:+10%
    Reward: revenue if booking happens (price_after_action * booking), else 0.
    """
    metadata = {"render.modes": ["human"]}

    def __init__(self, base_price=1000.0):
        super().__init__()
        # price_norm in [0,1] where 1 corresponds to a high price cap
        self.observation_space = spaces.Box(low=np.array([0.0, 0.0, 0.0]),
                                            high=np.array([1.0, 1.0, 365.0]),
                                            dtype=np.float32)
        self.action_space = spaces.Discrete(5)
        self.base_price = base_price
        self.state = None
        self.max_steps = 1

    def reset(self, *, seed=None, options=None):
        price_norm = np.random.uniform(0.3, 0.9)
        demand = np.random.uniform(0.1, 0.9)
        days_until = np.random.randint(0, 60)
        self.state = np.array([price_norm, demand, float(days_until)], dtype=np.float32)
        return self.state, {}

    def step(self, action):
        # map action to multiplier
        multipliers = [-0.10, -0.05, 0.0, 0.05, 0.10]
        change = multipliers[int(action)]
        price_norm, demand, days = self.state
        # compute new price and normalized price
        price = self.base_price * (1.0 + price_norm)
        price_after = price * (1.0 + change)

        # booking probability decreases with price, increases with demand
        # simple logistic model
        price_factor = np.exp(-0.001 * (price_after - self.base_price))
        booking_prob = np.clip(demand * price_factor, 0.0, 1.0)

        booked = np.random.random() < booking_prob
        reward = float(price_after) if booked else 0.0

        # next state: small random walk for demand and price_norm
        next_price_norm = np.clip(price_norm + np.random.normal(0, 0.02), 0.0, 1.0)
        next_demand = np.clip(demand + np.random.normal(0, 0.02), 0.0, 1.0)
        next_days = max(0.0, days - 1.0)
        self.state = np.array([next_price_norm, next_demand, next_days], dtype=np.float32)

        done = True  # one-step episode (for simplicity)
        info = {"booked": booked, "price_after": price_after}
        return self.state, reward, done, False, info

    def render(self, mode='human'):
        print(f"state={self.state}")
