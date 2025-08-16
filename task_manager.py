import os

def register_user():
    print("\n=== User Registration ===")
    username = input("Enter a new username: ")
    password = input("Enter a new password: ")
    
    # Check if username already exists
    if os.path.exists("users.txt"):
        with open("users.txt", "r") as f:
            for line in f:
                stored_user, _ = line.strip().split(",")
                if stored_user == username:
                    print("Username already exists. Try again.")
                    return False
    
    # Save new credentials
    with open("users.txt", "a") as f:
        f.write(f"{username},{password}\n")
    print("Registration successful!")
    return True

def login_user():
    print("\n=== User Login ===")
    username = input("Enter username: ")
    password = input("Enter password: ")

    if not os.path.exists("users.txt"):
        print("No users registered yet. Please register first.")
        return None

    with open("users.txt", "r") as f:
        for line in f:
            stored_user, stored_pass = line.strip().split(",")
            if stored_user == username and stored_pass == password:
                print("Login successful!")
                return username
    print("Login failed. Please try again.")
    return None

def get_task_file(username):
    return f"tasks_{username}.txt"

def add_task(username):
    print("\n=== Add Task ===")
    task = input("Enter task description: ")
    with open(get_task_file(username), "a") as f:
        f.write(f"{task},not completed\n")
    print("Task added!")

def view_tasks(username):
    print("\n=== Your Tasks ===")
    try:
        with open(get_task_file(username), "r") as f:
            tasks = f.readlines()
            if not tasks:
                print("No tasks yet.")
                return
            for i, line in enumerate(tasks, 1):
                task, status = line.strip().split(",")
                print(f"{i}. {task} - {status}")
    except FileNotFoundError:
        print("No tasks found. Add some!")

def mark_task_complete(username):
    view_tasks(username)
    try:
        task_num = int(input("Enter task number to mark as completed: "))
        with open(get_task_file(username), "r") as f:
            tasks = f.readlines()
        if task_num < 1 or task_num > len(tasks):
            print("Invalid task number.")
            return
        task, _ = tasks[task_num - 1].strip().split(",")
        tasks[task_num - 1] = f"{task},completed\n"
        with open(get_task_file(username), "w") as f:
            f.writelines(tasks)
        print("Task marked as completed!")
    except ValueError:
        print("Please enter a valid number.")

def delete_task(username):
    view_tasks(username)
    try:
        task_num = int(input("Enter task number to delete: "))
        with open(get_task_file(username), "r") as f:
            tasks = f.readlines()
        if task_num < 1 or task_num > len(tasks):
            print("Invalid task number.")
            return
        del tasks[task_num - 1]
        with open(get_task_file(username), "w") as f:
            f.writelines(tasks)
        print("Task deleted!")
    except ValueError:
        print("Please enter a valid number.")

def task_menu(username):
    while True:
        print("\n=== Task Menu ===")
        print("1. Add Task")
        print("2. View Tasks")
        print("3. Mark Task as Completed")
        print("4. Delete Task")
        print("5. Logout")
        choice = input("Choose an option: ")

        if choice == "1":
            add_task(username)
        elif choice == "2":
            view_tasks(username)
        elif choice == "3":
            mark_task_complete(username)
        elif choice == "4":
            delete_task(username)
        elif choice == "5":
            print("Logging out...")
            break
        else:
            print("Invalid option. Try again.")

def main():
    while True:
        print("\n=== Welcome to the Task Manager ===")
        print("1. Register")
        print("2. Login")
        print("3. Exit")
        choice = input("Select an option: ")

        if choice == "1":
            register_user()
        elif choice == "2":
            username = login_user()
            if username:
                task_menu(username)
        elif choice == "3":
            print("Exiting the program.")
            break
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main()
