#!/usr/bin/env python3
import argparse
import json
import os
from datetime import datetime, date
from typing import List, Dict, Any, Optional

DEFAULT_FILE = "tasks.json"
DATE_FMT = "%Y-%m-%d"

def load_tasks(path: str) -> List[Dict[str, Any]]:
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def save_tasks(path: str, tasks: List[Dict[str, Any]]) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(tasks, f, indent=2)

def next_id(tasks: List[Dict[str, Any]]) -> int:
    return (max((t["id"] for t in tasks), default=0) + 1)

def parse_date(s: Optional[str]) -> Optional[str]:
    if not s:
        return None
    try:
        # Validate and normalize
        dt = datetime.strptime(s, DATE_FMT).date()
        return dt.strftime(DATE_FMT)
    except ValueError:
        raise argparse.ArgumentTypeError(f"Invalid date '{s}'. Use YYYY-MM-DD.")

def prio_str(p: int) -> str:
    return {1:"H", 2:"M", 3:"L"}.get(p, "?")

def is_overdue(task: Dict[str, Any]) -> bool:
    if not task.get("due"):
        return False
    try:
        due = datetime.strptime(task["due"], DATE_FMT).date()
        return (not task["done"]) and (due < date.today())
    except Exception:
        return False

def fmt_row(t: Dict[str, Any]) -> str:
    due = t.get("due") or "-"
    over = "!" if is_overdue(t) else " "
    status = "✓" if t["done"] else " "
    return f'{t["id"]:>3}  [{status}]  P{prio_str(t["priority"])}  {due:>10}  {over}  {t["title"]}'

def list_tasks(tasks: List[Dict[str, Any]], include_done=False, only_overdue=False) -> None:
    rows = []
    for t in tasks:
        if only_overdue and not is_overdue(t):
            continue
        if not include_done and t["done"]:
            continue
        rows.append(fmt_row(t))

    if not rows:
        print("(no tasks match)")
        return

    print(" ID  [✓]  Pr  Due         !  Title")
    print("---- ---- -- ---------- -- ------------------------------")
    for r in rows:
        print(r)

def cmd_add(args, tasks, path):
    t = {
        "id": next_id(tasks),
        "title": args.title,
        "done": False,
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "due": parse_date(args.due),
        "priority": args.priority,
    }
    tasks.append(t)
    save_tasks(path, tasks)
    print(f"Added #{t['id']}: {t['title']}")

def cmd_list(args, tasks, path):
    list_tasks(tasks, include_done=args.all, only_overdue=args.overdue)

def cmd_done(args, tasks, path):
    for t in tasks:
        if t["id"] == args.id:
            if t["done"]:
                print(f"Task #{args.id} already completed.")
            else:
                t["done"] = True
                save_tasks(path, tasks)
                print(f"Marked #{args.id} as done.")
            return
    print(f"Task #{args.id} not found.")

def cmd_delete(args, tasks, path):
    before = len(tasks)
    tasks[:] = [t for t in tasks if t["id"] != args.id]
    if len(tasks) == before:
        print(f"Task #{args.id} not found.")
    else:
        save_tasks(path, tasks)
        print(f"Deleted #{args.id}.")

def cmd_edit(args, tasks, path):
    for t in tasks:
        if t["id"] == args.id:
            if args.title:
                t["title"] = args.title
            if args.priority:
                t["priority"] = args.priority
            if args.due is not None:  # allow clearing with empty string
                t["due"] = parse_date(args.due) if args.due else None
            save_tasks(path, tasks)
            print(f"Updated #{args.id}.")
            return
    print(f"Task #{args.id} not found.")

def cmd_clear_completed(args, tasks, path):
    kept = [t for t in tasks if not t["done"]]
    removed = len(tasks) - len(kept)
    tasks[:] = kept
    save_tasks(path, tasks)
    print(f"Removed {removed} completed task(s).")

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Minimal To‑Do app (JSON storage).")
    p.add_argument("--data", default=DEFAULT_FILE, help="Path to tasks JSON file (default: tasks.json)")
    sub = p.add_subparsers(dest="cmd", required=True)

    a = sub.add_parser("add", help="Add a new task")
    a.add_argument("title", help="Task title")
    a.add_argument("--priority", type=int, choices=[1,2,3], default=2, help="Priority 1=High,2=Med,3=Low (default 2)")
    a.add_argument("--due", type=str, help="Due date YYYY-MM-DD")
    a.set_defaults(func=cmd_add)

    l = sub.add_parser("list", help="List tasks")
    l.add_argument("--all", action="store_true", help="Include completed tasks")
    l.add_argument("--overdue", action="store_true", help="Only overdue tasks")
    l.set_defaults(func=cmd_list)

    d = sub.add_parser("done", help="Mark a task done")
    d.add_argument("id", type=int, help="Task id")
    d.set_defaults(func=cmd_done)

    rm = sub.add_parser("delete", help="Delete a task")
    rm.add_argument("id", type=int, help="Task id")
    rm.set_defaults(func=cmd_delete)

    e = sub.add_parser("edit", help="Edit a task")
    e.add_argument("id", type=int, help="Task id")
    e.add_argument("--title", help="New title")
    e.add_argument("--priority", type=int, choices=[1,2,3], help="Priority 1/2/3")
    e.add_argument("--due", nargs="?", const="", help="Set due date YYYY-MM-DD; omit value to clear")
    e.set_defaults(func=cmd_edit)

    cc = sub.add_parser("clear-completed", help="Remove all completed tasks")
    cc.set_defaults(func=cmd_clear_completed)

    return p

def main():
    parser = build_parser()
    args = parser.parse_args()
    tasks = load_tasks(args.data)
    args.func(args, tasks, args.data)

if __name__ == "__main__":
    main()
