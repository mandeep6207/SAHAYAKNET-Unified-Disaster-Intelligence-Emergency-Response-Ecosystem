import json
from datetime import datetime, timezone
from collections import Counter

with open("data.json", encoding="utf-8") as f:
    d = json.load(f)

reqs = d["requests"]
vols = d["volunteers"]
now = datetime.now(timezone.utc)

print(f"Total requests: {len(reqs)}")
print(f"Total volunteers: {len(vols)}")
print()

state_counts = Counter(r.get("state", r.get("zone", "?")) for r in reqs)
print("State distribution:")
for state, count in sorted(state_counts.items()):
    print(f"  {state}: {count}")
print()

status_counts = Counter(r["status"] for r in reqs)
print("Status distribution:")
for st, count in sorted(status_counts.items()):
    print(f"  {st}: {count}")
print()

# Check timestamps
oldest_days = 0
bad_timestamps = 0
response_times = []
for r in reqs:
    try:
        created = datetime.fromisoformat(r["createdAt"])
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        age_days = (now - created).total_seconds() / 86400
        if age_days > oldest_days:
            oldest_days = age_days
        if r.get("assignedAt") and r.get("createdAt"):
            assigned = datetime.fromisoformat(r["assignedAt"])
            created2 = datetime.fromisoformat(r["createdAt"])
            if assigned.tzinfo is None: assigned = assigned.replace(tzinfo=timezone.utc)
            if created2.tzinfo is None: created2 = created2.replace(tzinfo=timezone.utc)
            diff_min = (assigned - created2).total_seconds() / 60
            if 0 < diff_min < 1440:
                response_times.append(diff_min)
    except Exception as e:
        bad_timestamps += 1

print(f"Oldest request: {oldest_days:.1f} days ago")
print(f"Bad timestamps: {bad_timestamps}")
if response_times:
    avg_rt = sum(response_times) / len(response_times)
    print(f"Avg response time (assigned-created): {avg_rt:.1f} min  (n={len(response_times)})")
print()
print("Sample requests:")
for r in reqs[:5]:
    print(f"  {r['id']} | {r.get('state','?')} / {r['zone']} | {r['category']} | {r['status']} | created {r['createdAt'][:10]}")
