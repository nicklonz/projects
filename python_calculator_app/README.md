# Calculator App — Fresh Build (Pure Python)

A clean, beginner-friendly calculator built from scratch. Two entry points:

- **CLI**: Type expressions in your terminal (REPL)
- **GUI (Tkinter)**: Click buttons like a basic desktop calculator

No third‑party dependencies. Uses Python’s `ast` to safely parse math (no `eval`).

---

## Features
- Safe expression evaluator (supports numbers, parentheses, + - * / // % **, unary +/-)
- CLI REPL with friendly errors
- Tkinter GUI with: Enter-to-evaluate, C/⌫, integer & float math, Quit menu, status line
- Cross‑platform (macOS, Windows, Linux). On macOS you can silence the system Tk warning.

---

## Quick Start

### 1) Run the CLI
```bash
python cli.py
# Examples:
# 2+2
# (5+3)*2 - 4
# 10/3
# 2**10
# quit
```

### 2) Run the GUI
```bash
# macOS: optionally silence the Tk deprecation warning
TK_SILENCE_DEPRECATION=1 python gui.py
```

---

## Safety Notes
- Parsing via `ast` ensures only arithmetic constructs are allowed.
- Names, attributes, imports, and non-numeric constants are rejected.

---

## File Overview
- `safe_eval.py` — AST-based safe math parser/evaluator
- `cli.py`       — Terminal REPL using `safe_eval`
- `gui.py`       — Tkinter GUI using `safe_eval`
- `tests_sample.py` — Simple tests (optional); run with `python -m pytest -q`

---

## Troubleshooting (macOS Tk)
If the GUI doesn’t show, your Python may be linked to an older Tk.
- Easiest fix: install Python from python.org (includes a modern Tk).
- Temporary: run with `TK_SILENCE_DEPRECATION=1 python gui.py`
- CLI (`cli.py`) works regardless of Tk.
