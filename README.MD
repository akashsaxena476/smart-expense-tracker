# Smart Expense Tracker API

A REST API built with FastAPI to manage personal expenses. The project stores data in a local JSON file and provides endpoints to add, view, filter, calculate, and delete expenses.

## Features

- Add a new expense
- View all expenses
- Filter expenses by category
- Calculate total expenses
- Calculate total expenses by category
- Delete an expense
- Monthly expense summary (Bonus)

## Tech Stack

- Python 3.11+
- FastAPI
- Uvicorn
- Pydantic
- Pytest

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Start the Server

```bash
uvicorn src.app:app --reload
```

The API will be available at:

```
http://127.0.0.1:8000
```

Swagger Documentation:

```
http://127.0.0.1:8000/docs
```

## Run the Tests

```bash
pytest
```