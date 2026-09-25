import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient

from src.app import app
from src.auth import get_current_user


# Use User ID 1 for testing protected expense endpoints.
def override_get_current_user():
    return 1


app.dependency_overrides[get_current_user] = override_get_current_user

client = TestClient(app)


def test_add_expense():
    response = client.post(
        "/expenses",
        json={
            "title": "Electricity Bill",
            "amount": 2500,
            "category": "Utilities",
            "date": "2026-07-31"
        }
    )

    assert response.status_code == 201

    body = response.json()

    assert body["expense"]["title"] == "Electricity Bill"
    assert body["expense"]["category"] == "Utilities"
    assert body["expense"]["user_id"] == 1

    expense_id = body["expense"]["id"]

    delete_response = client.delete(
        f"/expenses/{expense_id}"
    )

    assert delete_response.status_code == 200


def test_get_all_expenses():
    response = client.get("/expenses")

    assert response.status_code == 200

    body = response.json()

    assert "expenses" in body
    assert isinstance(body["expenses"], list)

    for expense in body["expenses"]:
        assert expense["user_id"] == 1


def test_filter_by_category():
    response = client.get(
        "/expenses/filter?category=Utilities"
    )

    assert response.status_code == 200

    body = response.json()

    for expense in body["expenses"]:
        assert expense["category"].lower() == "utilities"
        assert expense["user_id"] == 1


def test_total_expenses():
    response = client.get("/expenses/total")

    assert response.status_code == 200

    body = response.json()

    assert "total" in body


def test_total_by_category():
    response = client.get("/expenses/total/Utilities")

    assert response.status_code == 200

    body = response.json()

    assert body["category"] == "Utilities"
    assert "total" in body


def test_delete_expense():
    create_response = client.post(
        "/expenses",
        json={
            "title": "Test Delete Expense",
            "amount": 100,
            "category": "Testing",
            "date": "2026-07-31"
        }
    )

    assert create_response.status_code == 201

    expense_id = create_response.json()["expense"]["id"]

    delete_response = client.delete(
        f"/expenses/{expense_id}"
    )

    assert delete_response.status_code == 200


def test_monthly_summary():
    response = client.get("/expenses/monthly-summary")

    assert response.status_code == 200

    assert isinstance(response.json(), dict)

def test_get_expenses_by_date_range():
    response = client.get(
        "/expenses/date-range"
        "?start_date=2026-07-01&end_date=2026-07-31"
    )

    assert response.status_code == 200

    body = response.json()

    assert body["start_date"] == "2026-07-01"
    assert body["end_date"] == "2026-07-31"
    assert "expenses" in body
    assert isinstance(body["expenses"], list)


def test_get_expense_statistics():
    response = client.get("/expenses/statistics")

    assert response.status_code == 200

    body = response.json()

    assert "total_expenses" in body
    assert "total_amount" in body
    assert "average_expense" in body
    assert "highest_expense" in body
    assert "lowest_expense" in body


def test_get_expense_by_id():
    create_response = client.post(
        "/expenses",
        json={
            "title": "Test Get Expense",
            "amount": 500,
            "category": "Testing",
            "date": "2026-07-31"
        }
    )

    assert create_response.status_code == 201

    expense_id = create_response.json()["expense"]["id"]

    response = client.get(
        f"/expenses/{expense_id}"
    )

    assert response.status_code == 200

    body = response.json()

    assert body["expense"]["id"] == expense_id
    assert body["expense"]["title"] == "Test Get Expense"
    assert body["expense"]["user_id"] == 1

    delete_response = client.delete(
        f"/expenses/{expense_id}"
    )

    assert delete_response.status_code == 200


def test_update_expense():
    create_response = client.post(
        "/expenses",
        json={
            "title": "Test Update Expense",
            "amount": 300,
            "category": "Testing",
            "date": "2026-07-31"
        }
    )

    assert create_response.status_code == 201

    expense_id = create_response.json()["expense"]["id"]

    update_response = client.put(
        f"/expenses/{expense_id}",
        json={
            "title": "Updated Expense",
            "amount": 600,
            "category": "Updated",
            "date": "2026-08-01"
        }
    )

    assert update_response.status_code == 200

    body = update_response.json()

    assert body["expense"]["id"] == expense_id
    assert body["expense"]["title"] == "Updated Expense"
    assert body["expense"]["amount"] == 600
    assert body["expense"]["category"] == "Updated"
    assert body["expense"]["user_id"] == 1

    delete_response = client.delete(
        f"/expenses/{expense_id}"
    )

    assert delete_response.status_code == 200

# Clear dependency overrides after tests.
def teardown_module():
    app.dependency_overrides.clear()