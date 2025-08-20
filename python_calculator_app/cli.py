#!/usr/bin/env python3
# cli.py - fresh build
from safe_eval import evaluate

BANNER = """\
Calculator (CLI) — Fresh Build
Type an expression and press Enter.
Examples:
  2+2
  (5+3)*2 - 4
  10/3
  2**10
Type 'quit' to exit.
"""

def main():
    print(BANNER)
    while True:
        try:
            s = input("calc> ").strip()
            if s.lower() in {"quit", "exit"}:
                print("Bye!")
                break
            if not s:
                continue
            try:
                print(evaluate(s))
            except ZeroDivisionError as zde:
                print("Error:", zde)
            except Exception as e:
                print("Error:", e)
        except (EOFError, KeyboardInterrupt):
            print("\nBye!")
            break

if __name__ == "__main__":
    main()
