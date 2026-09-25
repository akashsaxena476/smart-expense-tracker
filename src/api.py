from fastapi import APIRouter, HTTPException, Query, status, Depends
from .auth import get_current_user
from .schemas import ExpenseRequest
from datetime import date
from storage.expense_storage import (
    create_expense,
    delete_expense as remove_expense,
    get_all_expenses as load_expenses,
    get_expense_by_id as load_expense_by_id,
    update_expense as update_expense_storage,
    get_expenses_by_date_range as load_expenses_by_date_range
)

router = APIRouter()


@router.post("/expenses", status_code=status.HTTP_201_CREATED)
def add_expense(
    expense: ExpenseRequest,
    current_user_id: int = Depends(get_current_user)
):
    """
    ## Add a new expense
    This endpoint creates a new expense and stores it in the configured storage.
    """

    new_expense = create_expense(
        user_id=current_user_id,
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
        expense_date=expense.date
    )

    return {
        "message": "Expense added successfully",
        "expense": new_expense
    }


@router.get("/expenses")
def get_all_expenses(
    current_user_id: int = Depends(get_current_user)
):
    """
    ## Retrieve all expenses
    Returns all recorded expenses.
    """

    expenses = load_expenses(
        user_id=current_user_id
    )

    return {
        "total_expenses": len(expenses),
        "expenses": expenses
    }


@router.get("/expenses/filter")
def filter_expenses_by_category(
    category: str = Query(...),
    current_user_id: int = Depends(get_current_user)
):
    """
    ## Retrieve expenses
    Returns all the expenses matching the given category.
    """

    expenses = load_expenses(
        user_id=current_user_id
    )

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
def calculate_total_expenses(
    current_user_id: int = Depends(get_current_user)
):
    """
    ## Calculate total expenses
    Returns the sum of the amount of all recorded expenses.
    """

    expenses = load_expenses(
        user_id=current_user_id
    )

    total = sum(expense["amount"] for expense in expenses)

    return {
        "total": total
    }


@router.get("/expenses/total/{category}")
def calculate_total_by_category(
    category: str,
    current_user_id: int = Depends(get_current_user)
):
    """
    ## Calculate total expenses by category
    Returns the total amount spent for the specified category.
    """

    expenses = load_expenses(
        user_id=current_user_id
    )

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
def delete_expense(
    expense_id: int,
    current_user_id: int = Depends(get_current_user)
):
    """
    ## Delete an expense
    Removes the expense with the specified ID from the configured storage.
    """

    deleted = remove_expense(
        expense_id=expense_id,
        user_id=current_user_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Expense not found."
        )

    return {
        "message": "Expense deleted successfully."
    }


@router.get("/expenses/monthly-summary")
def get_monthly_summary(
    current_user_id: int = Depends(get_current_user)
):
    """
    ## Generate monthly expense summary
    Returns the total number of expenses and the total amount spent for each month.
    """

    expenses = load_expenses(
        user_id=current_user_id
    )

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


@router.get("/expenses/date-range")
def get_expenses_by_date_range(
    start_date: date = Query(...),
    end_date: date = Query(...),
    current_user_id: int = Depends(get_current_user)
):
    """
    ## Retrieve expenses by date range
    Returns all expenses recorded between the specified start and end dates.
    """

    if start_date > end_date:
        raise HTTPException(
            status_code=400,
            detail="Start date cannot be after end date."
        )

    expenses = load_expenses_by_date_range(
        start_date=start_date,
        end_date=end_date,
        user_id=current_user_id
    )

    return {
        "start_date": start_date,
        "end_date": end_date,
        "total_expenses": len(expenses),
        "expenses": expenses
    }


@router.get("/expenses/statistics")
def get_expense_statistics(
    current_user_id: int = Depends(get_current_user)
):
    """
    ## Get expense statistics
    Returns overall statistics for all recorded expenses.
    """

    expenses = load_expenses(
        user_id=current_user_id
    )

    if not expenses:
        return {
            "total_expenses": 0,
            "total_amount": 0,
            "average_expense": 0,
            "highest_expense": 0,
            "lowest_expense": 0
        }

    amounts = [expense["amount"] for expense in expenses]

    total_amount = sum(amounts)

    return {
        "total_expenses": len(expenses),
        "total_amount": total_amount,
        "average_expense": total_amount / len(expenses),
        "highest_expense": max(amounts),
        "lowest_expense": min(amounts)
    }


@router.get("/expenses/{expense_id}")
def get_expense_by_id(
    expense_id: int,
    current_user_id: int = Depends(get_current_user)
):
    """
    ## Retrieve an expense
    Returns the expense with the specified ID.
    """

    expense = load_expense_by_id(
        expense_id=expense_id,
        user_id=current_user_id
    )

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found."
        )

    return {
        "expense": expense
    }


@router.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    expense: ExpenseRequest,
    current_user_id: int = Depends(get_current_user)
):
    """
    ## Update an expense
    Updates the expense with the specified ID.
    """

    updated_expense = update_expense_storage(
        expense_id=expense_id,
        user_id=current_user_id,
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
        expense_date=expense.date
    )

    if updated_expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found."
        )

    return {
        "message": "Expense updated successfully",
        "expense": updated_expense
    }