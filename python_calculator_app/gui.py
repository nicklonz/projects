#!/usr/bin/env python3
# gui.py - fresh build
import tkinter as tk
from tkinter import ttk, messagebox
from safe_eval import evaluate
import signal

APP_TITLE = "Calculator — Fresh Build"

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title(APP_TITLE)
        self.geometry("340x460")
        self.resizable(False, False)
        self._make_menu()

        self.expr = tk.StringVar()
        self.status = tk.StringVar(value="Ready")
        self.result = tk.StringVar(value="")

        self._build_ui()

        # Enter to evaluate
        self.bind("<Return>", lambda e: self.on_equals())

        # Graceful Ctrl+C
        try:
            signal.signal(signal.SIGINT, lambda *_: self._quit())
        except Exception:
            pass

    def _make_menu(self):
        m = tk.Menu(self)
        app = tk.Menu(m, tearoff=0)
        app.add_command(label="Quit", command=self._quit, accelerator="Ctrl+Q")
        m.add_cascade(label="App", menu=app)
        self.config(menu=m)
        self.bind_all("<Control-q>", lambda e: self._quit())

    def _build_ui(self):
        entry = ttk.Entry(self, textvariable=self.expr, font=("Helvetica", 18))
        entry.pack(fill=tk.X, padx=12, pady=(12,6), ipady=8)
        entry.focus()

        # Result display
        out = ttk.Label(self, textvariable=self.result, anchor="e", font=("Helvetica", 16, "bold"))
        out.pack(fill=tk.X, padx=12, pady=(0,6))

        grid = ttk.Frame(self)
        grid.pack(fill=tk.BOTH, expand=True, padx=12, pady=12)

        rows = [
            ["7","8","9","/"],
            ["4","5","6","*"],
            ["1","2","3","-"],
            ["0",".","(",")"],
            ["C","⌫","//","%"],
            ["**","=", "+"],
        ]

        for r in range(len(rows)):
            grid.rowconfigure(r, weight=1)
        for c in range(4):
            grid.columnconfigure(c, weight=1)

        for r, row in enumerate(rows):
            for c, label in enumerate(row):
                btn = ttk.Button(grid, text=label, command=lambda t=label: self.on_press(t))
                btn.grid(row=r, column=c, sticky="nsew", padx=4, pady=4, ipady=12)

        # Status line
        status = ttk.Label(self, textvariable=self.status, anchor="w", foreground="gray")
        status.pack(fill=tk.X, padx=12, pady=(0,8))

    def on_press(self, t: str):
        if t == "C":
            self.expr.set("")
            self.result.set("")
            self.status.set("Cleared")
            return
        if t == "⌫":
            self.expr.set(self.expr.get()[:-1])
            self.status.set("Backspace")
            return
        if t == "=":
            self.on_equals()
            return
        self.expr.set(self.expr.get() + t)

    def on_equals(self):
        s = self.expr.get().strip()
        if not s:
            self.status.set("Enter an expression")
            return
        try:
            val = evaluate(s)
            self.result.set(str(val))
            self.expr.set(str(val))  # allow chaining
            self.status.set("OK")
        except ZeroDivisionError as zde:
            self.result.set("")
            self.status.set(f"Error: {zde}")
        except Exception as e:
            self.result.set("")
            self.status.set("Error")

    def _quit(self):
        try:
            self.quit()
        finally:
            self.destroy()

def main():
    app = App()
    try:
        app.mainloop()
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    main()
