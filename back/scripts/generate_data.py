"""Generate synchronized April 2026 MES datasets with deterministic seed 42."""

import csv
import math
import random
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path


SEED = 42
START_DATE = datetime(2026, 4, 1)
NUM_DAYS = 30
TARGET_TEMP = 600.0
AMBIENT_TEMP = 25.0
BASE_RATE_KG_H = 224.0
PLANNED_DOWNTIME_MIN = 144
WARMUP_MIN = 120
REHEAT_MIN = 35
BAG_MIN = 175.0
BAG_MAX = 225.0
BAG_MEAN = 200.0
DATA_DIR = Path(__file__).resolve().parents[1] / "data"

# The former 1.05 high multiplier is capped at nominal capacity.
DAILY_MULTIPLIERS = [0.60, 0.85, 1.00, 0.75, 0.95, 0.60, 0.85]
UNPLANNED_STOPS = {
    3: [(14 * 60, 45)],
    5: [(10 * 60, 90)],
}


def clamp(value, low, high):
    return max(low, min(high, value))


def in_unplanned_stop(day_index, minute_of_day):
    return any(
        start <= minute_of_day < start + duration
        for start, duration in UNPLANNED_STOPS.get(day_index % 7, [])
    )


@dataclass
class Reactor:
    reactor_id: str
    silo_weight: float
    temperature: float = AMBIENT_TEMP
    state: str = "stopped"
    warmup_started: datetime | None = None
    warmup_from: float = AMBIENT_TEMP
    warmup_duration: int = WARMUP_MIN
    cooldown_started: datetime | None = None
    cooldown_from: float = TARGET_TEMP
    accumulated: float = 0.0
    temp_offset: float = field(default_factory=lambda: random.uniform(-2.0, 2.0))
    rate_offset: float = field(default_factory=lambda: random.uniform(-0.03, 0.03))

    def start_warmup(self, now):
        self.state = "warming"
        self.warmup_started = now
        self.warmup_from = self.temperature
        self.warmup_duration = WARMUP_MIN if self.temperature < 100 else REHEAT_MIN

    def start_cooldown(self, now):
        self.state = "cooling"
        self.cooldown_started = now
        self.cooldown_from = self.temperature

    def update_state(self, now, is_down):
        if is_down:
            if self.state in {"producing", "warming"}:
                self.start_cooldown(now)
        elif self.state in {"stopped", "cooling"}:
            self.start_warmup(now)

    def update_temperature(self, now):
        if self.state == "warming":
            elapsed = (now - self.warmup_started).total_seconds() / 60
            if elapsed >= self.warmup_duration:
                self.state = "producing"
                self.temperature = TARGET_TEMP + self.temp_offset + random.gauss(0, 3)
            else:
                fraction = elapsed / self.warmup_duration
                self.temperature = (
                    self.warmup_from
                    + fraction * (TARGET_TEMP - self.warmup_from)
                    + random.gauss(0, 1.5)
                )
        elif self.state == "producing":
            self.temperature = TARGET_TEMP + self.temp_offset + random.gauss(0, 3)
        elif self.state == "cooling":
            elapsed = (now - self.cooldown_started).total_seconds() / 60
            self.temperature = AMBIENT_TEMP + (
                self.cooldown_from - AMBIENT_TEMP
            ) * math.exp(-elapsed / 45)
            self.temperature += random.gauss(0, 0.7)
            if elapsed >= 240:
                self.state = "stopped"
        else:
            self.temperature = max(AMBIENT_TEMP, self.temperature - 0.5)
            self.temperature += random.gauss(0, 0.3)
        self.temperature = clamp(self.temperature, 23.0, 620.0)

    def update_production(self, now, multiplier):
        # Weight must not vary while stopped, cooling or warming.
        if self.state != "producing":
            return []

        effective_rate = min(
            BASE_RATE_KG_H,
            BASE_RATE_KG_H * multiplier * (1 + self.rate_offset),
        )
        produced = max(
            0.0,
            effective_rate / 60 * (1 + random.gauss(0, 0.05)),
        )
        self.silo_weight += produced
        self.accumulated += produced

        threshold = BAG_MEAN * random.uniform(0.95, 1.05)
        if self.accumulated < threshold:
            return []

        requested = clamp(random.gauss(BAG_MEAN, 10), BAG_MIN, BAG_MAX)
        bag_weight = min(requested, self.accumulated, self.silo_weight)
        if bag_weight < BAG_MIN:
            return []

        self.silo_weight -= bag_weight
        self.accumulated -= bag_weight
        return [{
            "timestamp": now,
            "peso_bag": round(bag_weight, 1),
            "reactor_id": self.reactor_id,
        }]


def generate():
    random.seed(SEED)
    reactors = [Reactor("R1", 400.0), Reactor("R2", 350.0)]
    telemetry = []
    production = []

    for minute_index in range(NUM_DAYS * 1440):
        now = START_DATE + timedelta(minutes=minute_index)
        day_index = (now.date() - START_DATE.date()).days
        minute_of_day = now.hour * 60 + now.minute
        multiplier = DAILY_MULTIPLIERS[day_index % 7]
        down = (
            minute_of_day < PLANNED_DOWNTIME_MIN
            or in_unplanned_stop(day_index, minute_of_day)
        )

        minute_bags = []
        for reactor in reactors:
            reactor.update_state(now, down)
            reactor.update_temperature(now)
            minute_bags.extend(reactor.update_production(now, multiplier))

        telemetry.append({
            "timestamp": now.strftime("%Y-%m-%d %H:%M:%S"),
            "temp_r1": round(reactors[0].temperature, 1),
            "temp_r2": round(reactors[1].temperature, 1),
            "silo_weight_r1": round(reactors[0].silo_weight, 1),
            "silo_weight_r2": round(reactors[1].silo_weight, 1),
        })
        production.extend(minute_bags)

    production_rows = []
    for index, bag in enumerate(production, start=1):
        production_rows.append({
            "id_bag": f"BAG-{index:05d}",
            "timestamp_production": bag["timestamp"].strftime(
                "%Y-%m-%d %H:%M:%S"
            ),
            "peso_bag": bag["peso_bag"],
        })
    return telemetry, production_rows


def write_csv(path, rows, fieldnames):
    with path.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main():
    telemetry, production = generate()
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    write_csv(
        DATA_DIR / "telemetry_data.csv",
        telemetry,
        [
            "timestamp",
            "temp_r1",
            "temp_r2",
            "silo_weight_r1",
            "silo_weight_r2",
        ],
    )
    write_csv(
        DATA_DIR / "production_data.csv",
        production,
        ["id_bag", "timestamp_production", "peso_bag"],
    )
    total_kg = sum(float(row["peso_bag"]) for row in production)
    print(f"[generate] seed={SEED}")
    print(f"[generate] telemetria={len(telemetry)}")
    print(f"[generate] bags={len(production)}")
    print(f"[generate] producao_kg={total_kg:.1f}")
    print(
        "[generate] multiplicadores="
        + ",".join(f"{value:.2f}" for value in DAILY_MULTIPLIERS)
    )


if __name__ == "__main__":
    main()
