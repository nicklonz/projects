# Python To‑Do App (CLI)

A minimal command‑line To‑Do app in pure Python with JSON storage.

## Quick Start
```bash
# 1) Run help
python todo.py -h

# 2) Add tasks
python todo.py add "Buy milk"
python todo.py add "Email Alex about the proposal" --priority 2 --due 2025-08-25

# 3) List tasks
python todo.py list
python todo.py list --all          # include completed
python todo.py list --overdue

# 4) Mark done / delete / edit
python todo.py done 1
python todo.py delete 2
python todo.py edit 3 --title "Email Alex and Sam" --priority 1 --due 2025-08-24

# 5) Clear completed tasks
python todo.py clear-completed
```

## Data
Tasks are stored in `tasks.json` in the same folder as `todo.py`.
Each task has: id, title, done, created_at, due (optional), priority (1 high – 3 low).

## Tips
- Use `--data PATH` to point to a different JSON file (e.g., per project).
- IDs are stable integers and never reused within a file.
