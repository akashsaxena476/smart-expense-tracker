from fastapi import APIRouter, HTTPException, Query, status
from .schemas import ExpenseRequest
from .data_handler import load_expenses, save_expenses

router = APIRouter()

@router.post("/expenses", status_code=status.HTTP_201_CREATED)
def add_expense(expense: ExpenseRequest):
    expenses = load_expenses()

    """
        ## Add a new expense
        This endpoint creates a new expense with a unique ID and stores it in the local JSON file
    """

    if expenses:
        expense_id = max(item["id"] for item in expenses) + 1
    else:
        expense_id = 1

    new_expense = {
        "id": expense_id,
        "title": expense.title,
        "amount": expense.amount,
        "category": expense.category,
        "date": expense.date.isoformat()
    }

    expenses.append(new_expense)

    save_expenses(expenses)

    return {
        "message": "Expense added successfully",
        "expense": new_expense
    }


@router.get("/expenses")
def get_all_expenses(category: str | None = Query(default=None)):
    expenses = load_expenses()

    """
        ## Retrieve expenses
        Returns all expenses. If a category is provided, only expenses matching that category are returned
    """


    if category:
        expenses = [
            expense
            for expense in expenses
            if expense["category"].lower() == category.lower()
        ]

    return {
        "total_expenses": len(expenses),
        "expenses": expenses
    }


@router.get("/expenses/filter")
def filter_expenses_by_category(category: str = Query(...)):
    expenses = load_expenses()

    """
        ## Retrieve expenses
        Returns all the expenses matching the given category
    """

    filtered_expenses = [
        expense
        for expense in expenses
        if expense["category"].lower() == category.lower()
    ]

    return {
        "category": category,
        "total_expenses": len(filtered_expenses),
        "expenses": filtered_expenses
    }


@router.get("/expenses/total")
def calculate_total_expenses():
    expenses = load_expenses()

    """
        ## Calculate total expenses
        Returns the sum of the amount of all recorded expenses
    """

    total = sum(expense["amount"] for expense in expenses)

    return {
        "total": total
    }


@router.get("/expenses/total/{category}")
def calculate_total_by_category(category: str):
    expenses = load_expenses()

    """
        ## Calculate total expenses by category
        Returns the total amount spent for the specified category
    """

    total = sum(
        expense["amount"]
        for expense in expenses
        if expense["category"].lower() == category.lower()
    )

    return {
        "category": category,
        "total": total
    }


@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int):
    expenses = load_expenses()

    """
        ## Delete an expense
        Removes the expense with the specified ID from the expense records
    """

    expense = next(
        (expense for expense in expenses if expense["id"] == expense_id),
        None
    )

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found."
        )

    expenses.remove(expense)
    save_expenses(expenses)

    return {
        "message": "Expense deleted successfully."
    }


@router.get("/expenses/monthly-summary")
def get_monthly_summary():
    expenses = load_expenses()

    """
        ## Generate monthly expense summary
        Returns the total number of expenses and the total amount spent for each month
    """

    monthly_summary = {}

    for expense in expenses:
        month = expense["date"][:7]

        if month not in monthly_summary:
            monthly_summary[month] = {
                "total_expenses": 0,
                "total_amount": 0
            }

        monthly_summary[month]["total_expenses"] += 1
        monthly_summary[month]["total_amount"] += expense["amount"]

    return monthly_summary