import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from src.app import app

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


def test_get_all_expenses():
    response = client.get("/expenses")

    assert response.status_code == 200

    body = response.json()

    assert "expenses" in body
    assert isinstance(body["expenses"], list)


def test_filter_by_category():
    response = client.get("/expenses?category=Utilities")

    assert response.status_code == 200

    body = response.json()

    for expense in body["expenses"]:
        assert expense["category"].lower() == "utilities"


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
    response = client.delete("/expenses/1")

    assert response.status_code in [200, 404]


def test_monthly_summary():
    response = client.get("/expenses/monthly-summary")

    assert response.status_code == 200

    assert isinstance(response.json(), dict)