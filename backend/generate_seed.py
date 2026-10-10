"""
Generates fresh demo data for SahayakNet covering all 5 states.
Run once: python generate_seed.py
Produces data.json in the backend directory.
"""
from __future__ import annotations
import json
import random
from datetime import datetime, timezone, timedelta
from pathlib import Path
from math import ceil

# ── Location data ──────────────────────────────────────────────────────────
LOCATIONS = [
    # (state, district/zone, city, lat, lng)
    ("Chhattisgarh", "Raipur",       "Raipur",       21.2514, 81.6296),
    ("Chhattisgarh", "Durg",         "Durg",         21.1904, 81.2849),
    ("Chhattisgarh", "Bhilai Nagar", "Bhilai Nagar", 21.2093, 81.3782),
    ("Chhattisgarh", "Bilaspur",     "Bilaspur",     22.0796, 82.1391),
    ("Chhattisgarh", "Korba",        "Korba",        22.3595, 82.7501),
    ("Odisha",       "Khordha",      "Bhubaneswar",  20.2961, 85.8245),
    ("Odisha",       "Cuttack",      "Cuttack",      20.5147, 85.9231),
    ("Odisha",       "Sundargarh",   "Rourkela",     22.2604, 84.8536),
    ("Odisha",       "Sambalpur",    "Sambalpur",    21.4669, 83.9812),
    ("Odisha",       "Ganjam",       "Berhampur",    19.3149, 84.7941),
    ("Jharkhand",    "Ranchi",       "Ranchi",       23.3441, 85.3096),
    ("Jharkhand",    "East Singhbhum","Jamshedpur",  22.8046, 86.2029),
    ("Jharkhand",    "Dhanbad",      "Dhanbad",      23.7957, 86.4304),
    ("Jharkhand",    "Bokaro",       "Bokaro Steel City", 23.6693, 86.1511),
    ("Jharkhand",    "Hazaribagh",   "Hazaribagh",   23.9925, 85.3637),
    ("Bihar",        "Patna",        "Patna",        25.5941, 85.1376),
    ("Bihar",        "Gaya",         "Gaya",         24.7964, 85.0077),
    ("Bihar",        "Muzaffarpur",  "Muzaffarpur",  26.1209, 85.3647),
    ("Bihar",        "Bhagalpur",    "Bhagalpur",    25.2425, 86.9842),
    ("Bihar",        "Darbhanga",    "Darbhanga",    26.1542, 85.9000),
    ("Assam",        "Kamrup Metropolitan","Guwahati",26.1445, 91.7362),
    ("Assam",        "Dibrugarh",    "Dibrugarh",    27.4728, 94.9120),
    ("Assam",        "Jorhat",       "Jorhat",       26.7509, 94.2037),
    ("Assam",        "Cachar",       "Silchar",      24.8333, 92.7789),
    ("Assam",        "Sonitpur",     "Tezpur",       26.6338, 92.8003),
]

CATEGORIES = ["food", "medical", "rescue", "shelter", "baby_care", "women_care", "water", "emergency_help"]
SOURCES = ["web", "ivr", "whatsapp", "missed_call", "drone", "web", "web"]

SEVERITY_MAP = {
    "medical": 60, "emergency_help": 58, "rescue": 55,
    "baby_care": 52, "women_care": 50, "water": 42,
    "food": 35, "shelter": 25,
}

CITIZEN_NAMES = [
    "Rajesh Kumar", "Priya Sharma", "Amit Singh", "Neha Verma", "Suresh Patel",
    "Ananya Singh", "Vikram Yadav", "Pooja Kumari", "Manoj Verma", "Kavya Iyer",
    "Rohit Tiwari", "Deepa Nair", "Arjun Thakur", "Meera Joshi", "Sunil Jha",
    "Sunita Devi", "Karan Mishra", "Lakshmi Reddy", "Deepak Sharma", "Radha Singh",
    "Ravi Prasad", "Savitri Yadav", "Anil Dubey", "Geeta Kumari", "Nitin Choudhary",
    "Usha Patel", "Harish Pandey", "Champa Devi", "Mohit Gupta", "Rekha Singh",
    "Ajay Mehta", "Sushila Devi", "Pankaj Sinha", "Bimla Thakur", "Sanjay Das",
    "Jayanti Kumari", "Rahul Kulkarni", "Lata Mishra", "Dinesh Reddy", "Pushpa Verma",
    "Vinay Kumar", "Kamla Devi", "Santosh Singh", "Gita Sharma", "Mukesh Yadav",
    "Urmila Patel", "Gopal Das", "Shakuntala Devi", "Naresh Kumar", "Ranjana Singh",
    "Suman Gupta", "Kalpana Roy", "Binod Kumar", "Pratima Devi", "Mohan Lal",
    "Anita Kumari", "Hemant Singh", "Sarla Devi", "Pramod Tiwari", "Manju Verma",
    "Dilip Kumar", "Sarika Jha", "Ramesh Chandra", "Sangeeta Sharma", "Ashok Mishra",
    "Nirmala Devi", "Jitendra Singh", "Mamta Kumari", "Satish Patel", "Ritu Sinha",
    "Bhupendra Yadav", "Shyama Devi", "Arvind Kumar", "Pramila Singh", "Arun Sharma",
    "Savita Gupta", "Nagesh Rao", "Indira Devi", "Suresh Chandra", "Rukmini Devi",
    "Rajendra Prasad", "Meena Kumari", "Surendra Singh", "Vimala Devi", "Tribhuvan Das",
    "Sudha Sharma", "Baijnath Kumar", "Radha Devi", "Omprakash Yadav", "Savitri Singh",
    "Girish Chandra", "Kalyani Devi", "Brij Mohan", "Shakila Begum", "Javed Akhtar",
    "Farhana Khatoon", "Abdul Rahman", "Aisha Bano", "Mohammad Alam", "Zubeda Khatun",
]

VOLUNTEER_NAMES = [
    "Ranjit Kumar", "Monika Sharma", "Siddharth Rao", "Preethi Nair", "Arpit Tiwari",
    "Kavitha Reddy", "Sumit Banerjee", "Anita Roy", "Kamlesh Verma", "Swati Joshi",
    "Rajan Mishra", "Poornima Devi", "Ganesh Patel", "Sabita Das", "Ashwin Kumar",
    "Rina Chakraborty", "Prasad Iyer", "Vandana Singh", "Naresh Yadav", "Sunita Gupta",
    "Balram Tiwari", "Rekha Kumari", "Dhruvendra Singh", "Sharda Patel", "Lokesh Verma",
    "Poonam Thakur", "Bharat Kumar", "Sudha Kumari", "Ramesh Joshi", "Geeta Yadav",
    "Dinesh Chandra", "Kavita Mishra", "Suresh Babu", "Sarla Sharma", "Deependra Singh",
]

SKILL_SETS = [
    ["First Aid", "Swimming"],
    ["Boat Operation", "Navigation"],
    ["Medical", "CPR"],
    ["Cooking", "Logistics"],
    ["Search & Rescue", "Rope Rescue"],
    ["Driving", "Coordination"],
    ["Communication", "Ham Radio"],
    ["Doctor", "Emergency Medicine"],
    ["Water Purification", "Sanitation"],
    ["Counselling", "Language"],
    ["Fire Fighting", "Rescue"],
    ["Nursing", "First Aid"],
    ["Engineering", "Structural Assessment"],
]

def now_utc() -> datetime:
    return datetime.now(timezone.utc)

def iso(dt: datetime) -> str:
    return dt.isoformat()

def rand_offset(base_lat: float, base_lng: float, radius: float = 0.08) -> tuple[float, float]:
    return (
        round(base_lat + random.uniform(-radius, radius), 5),
        round(base_lng + random.uniform(-radius, radius), 5),
    )

def compute_priority(category: str, family_size: int, created_at: datetime) -> int:
    base = SEVERITY_MAP.get(category, 35)
    people_score = max(1, family_size) * 2
    waiting_hours = max(0, int((now_utc() - created_at).total_seconds() // 3600))
    waiting_score = min(waiting_hours * 2, 30)
    return base + people_score + waiting_score

def calculate_resources(category: str, family_size: int) -> dict:
    return {
        "food_packets": family_size * 3 if category in {"food", "emergency_help"} else (family_size * 2 if category == "shelter" else 0),
        "water_liters": family_size * 5 if category in {"food", "water", "baby_care", "women_care", "emergency_help"} else 0,
        "water_supply": family_size * 5 if category in {"food", "water", "baby_care", "women_care", "emergency_help"} else 0,
        "medicine_kits": ceil(family_size / 2) if category == "medical" else (1 if category == "emergency_help" else 0),
        "shelter_units": ceil(family_size / 4) if category == "shelter" else 0,
        "baby_care_kits": ceil(family_size / 2) if category == "baby_care" else 0,
        "women_care_kits": ceil(family_size / 2) if category == "women_care" else 0,
        "rescue_boats": 1 if category == "rescue" else 0,
        "emergency_essentials": max(1, ceil(family_size / 2)) if category in {"rescue", "emergency_help"} else 0,
    }

def resource_summary(category: str, family_size: int) -> str:
    if category == "medical": return f"Medicine kits needed: {max(1, ceil(family_size/2))} units"
    if category == "rescue": return f"Rescue support needed for {family_size} people"
    if category == "shelter": return f"Shelter units needed: {max(1, ceil(family_size/4))}"
    if category == "baby_care": return f"Baby care kits needed: {max(1, ceil(family_size/2))} units"
    if category == "women_care": return f"Women care kits needed: {max(1, ceil(family_size/2))} units"
    if category == "water": return f"Water supply needed: {family_size * 5} liters"
    if category == "emergency_help": return f"Emergency essentials needed for {family_size} people"
    return f"Food needed: {family_size * 2} units"

def priority_reason(category: str, family_size: int) -> str:
    reason_map = {
        "medical": "medical emergency", "rescue": "rescue need",
        "shelter": "shelter shortage", "baby_care": "infant support need",
        "women_care": "women care shortage", "water": "water shortage",
        "emergency_help": "critical emergency", "food": "food shortage",
    }
    return f"High priority due to {reason_map[category]} + {family_size} member{'s' if family_size > 1 else ''}."

def source_label(source: str) -> str:
    return source.replace("_", " ").upper()

# ── Build volunteers ───────────────────────────────────────────────────────
def build_volunteers() -> list[dict]:
    vols = []
    # Distribute volunteers across all 5 states evenly
    all_locs = LOCATIONS.copy()
    random.shuffle(all_locs)
    loc_cycle = all_locs * 2  # enough for 34 volunteers

    for i in range(34):
        loc = loc_cycle[i % len(loc_cycle)]
        state, zone, city, base_lat, base_lng = loc
        lat, lng = rand_offset(base_lat, base_lng, 0.12)
        vols.append({
            "id": f"VOL-{i+1:03}",
            "name": VOLUNTEER_NAMES[i % len(VOLUNTEER_NAMES)],
            "phone": f"900000{i+1:03}",
            "skills": SKILL_SETS[i % len(SKILL_SETS)],
            "vehicle": i % 3 != 0,
            "availability": "available" if i < 12 else ("busy" if i < 18 else "inactive"),
            "zone": zone,
            "state": state,
            "city": city,
            "image": f"/volunteers/{'m' if i < 20 else 'f'}{(i % 20) + 1 if i < 20 else (i - 20) + 1}.jpg",
            "idCard": f"NDMA-{state[:2].upper()}-{i+1:04}",
            "age": 22 + (i % 13),
            "lat": round(lat, 5),
            "lng": round(lng, 5),
            "tasksCompleted": i % 8,
            "speed": 14 + (i % 6) * 2.5,
            "heading": 0,
            "lastSeenAt": iso(now_utc()),
            "assignedRequest": None,
        })
    return vols

# ── Build requests ──────────────────────────────────────────────────────────
def build_requests(vols: list[dict]) -> list[dict]:
    """
    Build ~80 fresh requests distributed across all 5 states.
    Statuses: ~40% pending, ~20% assigned, ~10% accepted/on_the_way, ~30% completed
    Timestamps: within last 7 days
    """
    now = now_utc()
    reqs = []
    req_counter = 1

    # ~16 requests per state = 80 total
    per_state_count = 16
    all_locs_by_state: dict[str, list] = {}
    for loc in LOCATIONS:
        state = loc[0]
        all_locs_by_state.setdefault(state, []).append(loc)

    states_order = ["Chhattisgarh", "Odisha", "Jharkhand", "Bihar", "Assam"]

    # Status distribution: 40% pending, 20% assigned, 10% accepted, 10% on_the_way, 20% completed
    def pick_status(idx: int, total: int) -> str:
        pct = idx / total
        if pct < 0.40: return "pending"
        if pct < 0.60: return "assigned"
        if pct < 0.70: return "accepted"
        if pct < 0.80: return "on_the_way"
        return "completed"

    # Severity/priority-driven category distribution
    # ~13% critical (medical/emergency_help), ~27% high (rescue/baby_care/women_care)
    # ~40% medium (water/food), ~20% low (shelter/food)
    category_weights = [
        ("medical", 13), ("emergency_help", 10), ("rescue", 13),
        ("baby_care", 8), ("women_care", 7), ("water", 16),
        ("food", 19), ("shelter", 14),
    ]
    category_pool = []
    for cat, weight in category_weights:
        category_pool.extend([cat] * weight)

    all_req_slots = []
    for state in states_order:
        locs = all_locs_by_state[state]
        for j in range(per_state_count):
            loc = locs[j % len(locs)]
            all_req_slots.append(loc)

    random.shuffle(all_req_slots)

    total_reqs = len(all_req_slots)
    # Track busy volunteers
    busy_vol_ids: set[str] = set()
    available_vols = [v for v in vols if v["availability"] == "available"]

    for idx, loc in enumerate(all_req_slots):
        state, zone, city, base_lat, base_lng = loc
        lat, lng = rand_offset(base_lat, base_lng, 0.06)
        family_size = random.choice([1, 2, 3, 4, 5, 6, 8, 10])
        category = random.choice(category_pool)
        source = random.choice(SOURCES)
        citizen_name = CITIZEN_NAMES[idx % len(CITIZEN_NAMES)]
        phone = f"9{random.randint(100000000, 999999999)}"

        # Recent timestamp: within last 7 days, skewed toward recent
        hours_ago = random.choices(
            [0.5, 2, 6, 12, 24, 48, 72, 96, 120, 144, 168],
            weights=[15, 20, 18, 15, 12, 8, 5, 3, 2, 1, 1],
            k=1
        )[0]
        created_at = now - timedelta(hours=hours_ago + random.uniform(0, hours_ago * 0.3))

        status = pick_status(idx, total_reqs)
        priority = compute_priority(category, family_size, created_at)
        req_id = f"REQ-{req_counter:04}"
        req_counter += 1

        req: dict = {
            "id": req_id,
            "name": citizen_name,
            "phone": phone,
            "category": category,
            "family_size": family_size,
            "people": family_size,
            "location": f"{city} - {zone}",
            "zone": zone,
            "state": state,
            "city": city,
            "lat": lat,
            "lng": lng,
            "priority": priority,
            "createdAt": iso(created_at),
            "status": status,
            "executionStatus": status,
            "source": source,
            "sourceLabel": source_label(source),
            "resourcesNeeded": calculate_resources(category, family_size),
            "resourceSummary": resource_summary(category, family_size),
            "priorityReason": priority_reason(category, family_size),
            "mergedCount": 1,
            "assignedVolunteerId": None,
            "assignedVolunteerName": None,
            "eta": None,
            "assignedAt": None,
            "acceptedAt": None,
            "completedAt": None,
            "inventoryUpdated": False,
        }

        # Assign volunteer for non-pending statuses
        if status != "pending" and available_vols:
            # Pick nearest volunteer in same state if possible
            state_vols = [v for v in available_vols if v.get("state") == state and v["id"] not in busy_vol_ids]
            if not state_vols:
                state_vols = [v for v in available_vols if v["id"] not in busy_vol_ids]
            if state_vols:
                vol = random.choice(state_vols[:5])  # pick from top 5 candidates
                req["assignedVolunteerId"] = vol["id"]
                req["assignedVolunteerName"] = vol["name"]
                # assigned_at = 5-30 min after created
                assigned_delay = timedelta(minutes=random.uniform(5, 30))
                assigned_at = created_at + assigned_delay
                req["assignedAt"] = iso(assigned_at)
                req["eta"] = f"{random.randint(10, 45)} mins"
                vol["availability"] = "busy"
                vol["assignedRequest"] = req_id

                if status in {"accepted", "on_the_way", "completed"}:
                    # accepted_at = 2-10 min after assigned
                    accepted_at = assigned_at + timedelta(minutes=random.uniform(2, 10))
                    req["acceptedAt"] = iso(accepted_at)

                if status in {"on_the_way", "completed"}:
                    pass  # started_at implicit in on_the_way

                if status == "completed":
                    # completed_at = 20-90 min after accepted
                    accepted_dt = datetime.fromisoformat(req["acceptedAt"])
                    completed_at = accepted_dt + timedelta(minutes=random.uniform(20, 90))
                    req["completedAt"] = iso(completed_at)
                    req["inventoryUpdated"] = True
                    vol["tasksCompleted"] = vol.get("tasksCompleted", 0) + 1
                    # Free the volunteer after completion
                    vol["availability"] = "available"
                    vol["assignedRequest"] = None
                else:
                    busy_vol_ids.add(vol["id"])

        reqs.append(req)

    # Sort by createdAt descending (newest first)
    reqs.sort(key=lambda r: r["createdAt"], reverse=True)
    # Reassign IDs sequentially after sort
    for i, r in enumerate(reqs):
        r["id"] = f"REQ-{i+1:04}"

    return reqs

# ── Main ────────────────────────────────────────────────────────────────────
def generate():
    random.seed(42)  # reproducible

    vols = build_volunteers()
    reqs = build_requests(vols)

    # Fix available_vols after request building updated availabilities
    active_vol_ids = {r["assignedVolunteerId"] for r in reqs if r.get("assignedVolunteerId") and r["status"] not in {"completed"}}
    for v in vols:
        if v["id"] not in active_vol_ids:
            if v["availability"] == "busy":
                v["availability"] = "available"
                v["assignedRequest"] = None

    req_counter = len(reqs) + 1
    vol_counter = len(vols) + 1

    payload = {
        "requests": reqs,
        "volunteers": vols,
        "missions": [],
        "request_counter": req_counter,
        "volunteer_counter": vol_counter,
        "mission_counter": 1,
    }

    out = Path(__file__).resolve().parent / "data.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    # Stats
    from collections import Counter
    state_counts = Counter(r.get("state", r.get("zone", "?")) for r in reqs)
    status_counts = Counter(r["status"] for r in reqs)
    print(f"Generated {len(reqs)} requests, {len(vols)} volunteers")
    print("State distribution:")
    for state, count in sorted(state_counts.items()):
        print(f"  {state}: {count}")
    print("Status distribution:")
    for status, count in sorted(status_counts.items()):
        print(f"  {status}: {count}")
    print(f"Saved to {out}")

if __name__ == "__main__":
    generate()
