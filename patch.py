import re

with open('backend/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add threading lock to save_state_to_disk
if 'import threading' not in content:
    content = content.replace('import traceback', 'import traceback\nimport threading\nSTATE_LOCK = threading.Lock()')

if 'STATE_LOCK.acquire()' not in content:
    content = content.replace('def atomic_write_json(path: Path, data: object) -> None:', 'def atomic_write_json(path: Path, data: object) -> None:\n    with STATE_LOCK:')

# 2. Fix blocking YOLO model inference
if 'asyncio.to_thread' not in content:
    content = content.replace(
        'results = model(frame, classes=[0], conf=confidence, verbose=False)',
        'results = await asyncio.to_thread(model, frame, classes=[0], conf=confidence, verbose=False)'
    )

with open('backend/main.py', 'w', encoding='utf-8') as f:
    f.write(content)
print('Patched successfully')
