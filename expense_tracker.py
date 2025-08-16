import json
import os
from datetime import datetime

# ---------------------------
# Global Variables
# ---------------------------
expenses = []
budget = {}

# ---------------------------
# Add Expense with MM-DD-20YY
# ---------------------------
def add_expense():
    while True:
        date_input = input("Enter the date (MM-DD-YY): ")
        try:
            # Assume the user enters a 2-digit year (e.g., 25), and we treat it as 2025
            mm, dd, yy = date_input.split("-")
            full_year = "20" + yy  # Enforce 20YY
            full_date_str = f"{mm}-{dd}-{full_year}"

            # Validate the constructed full date
            date_obj = datetime.strptime(full_date_str, "%m-%d-%Y")
            date = date_obj.strftime("%m-%d-%Y")
            break

        except ValueError:
            print("Invalid format or date. Please enter the date as MM-DD-YY (e.g., 08-05-25)\n")

    category = input("Enter the category (e.g., Food, Rent, Transport): ")
    amount = float(input("Enter the amount spent: "))
    description = input("Enter a short description (optional): ")

    expense = {
        "date": date,
        "category": category,
        "amount": amount,
        "description": description
    }
    expenses.append(expense)
    print("Expense added successfully!\n")

# ---------------------------
# View Expenses
# ---------------------------
def view_expenses():
    if not expenses:
        print("No expenses recorded yet.\n")
        return
    print("\n--- Your Expenses ---")
    for i, exp in enumerate(expenses, 1):
        print(f"{i}. {exp['date']} | {exp['category']} | ${exp['amount']:.2f} | {exp['description']}")
    print()

# ---------------------------
# Set Monthly Budget
# ---------------------------
def set_budget():
    category = input("Enter the category to set a budget for: ")
    amount = float(input(f"Enter monthly budget for {category}: $"))
    budget[category] = amount
    print("Budget set successfully!\n")

# ---------------------------
# View Budget Status
# ---------------------------
def view_budget_status():
    if not budget:
        print("No budgets set.\n")
        return
    
    print("\n--- Budget Status ---")
    spent = {}
    for exp in expenses:
        spent[exp['category']] = spent.get(exp['category'], 0) + exp['amount']

    for cat, limit in budget.items():
        used = spent.get(cat, 0)
        print(f"{cat}: Spent ${used:.2f} of ${limit:.2f} budget")
    print()

# ---------------------------
# Save Data to File
# ---------------------------
def save_data():
    data = {
        "expenses": expenses,
        "budget": budget
    }
    with open("expenses.json", "w") as f:
        json.dump(data, f, indent=4)
    print("Data saved successfully!\n")

# ---------------------------
# Load Data from File
# ---------------------------
def load_data():
    global expenses, budget
    if os.path.exists("expenses.json"):
        with open("expenses.json", "r") as f:
            data = json.load(f)
            expenses = data.get("expenses", [])
            budget = data.get("budget", {})
        print("Data loaded successfully!\n")
    else:
        print("No saved data found.\n")

# ---------------------------
# Main Menu
# ---------------------------
def main():
    print("Welcome to Your Personal Expense Tracker!\n")
    load_data()
    
    while True:
        print("Select an option:")
        print("1. Add Expense")
        print("2. View Expenses")
        print("3. Set Monthly Budget")
        print("4. View Budget Status")
        print("5. Save Data")
        print("6. Load Data")
        print("7. Exit")
        choice = input("Enter your choice (1-7): ")

        if choice == '1':
            add_expense()
        elif choice == '2':
            view_expenses()
        elif choice == '3':
            set_budget()
        elif choice == '4':
            view_budget_status()
        elif choice == '5':
            save_data()
        elif choice == '6':
            load_data()
        elif choice == '7':
            print("Goodbye! Stay on top of your spending habits!")
            break
        else:
            print("Invalid choice. Please try again.\n")

# ---------------------------
# Run the Program
# ---------------------------
if __name__ == "__main__":
    main()




