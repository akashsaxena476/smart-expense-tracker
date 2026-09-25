# Smart Expense Tracker API

A REST API built with FastAPI to manage personal expenses. The project uses PostgreSQL for data storage and provides JWT-based authentication, authorization, and endpoints to add, view, filter, calculate, update, and delete expenses.

## Features

- User registration and login
- JWT-based authentication
- Password hashing and validation
- User-based authorization
- Add a new expense
- View all expenses
- View an expense by ID
- Update an expense
- Delete an expense
- Filter expenses by category
- Calculate total expenses
- Calculate total expenses by category
- Monthly expense summary
- Filter expenses by date range
- Expense statistics
- Multi-user expense management

## Tech Stack

- Python 3.11+
- FastAPI
- Uvicorn
- Pydantic
- PostgreSQL
- SQLAlchemy
- PyJWT
- Pwdlib
- Pytest
- Docker
- Docker Compose

## Install Dependencies

### Option 1: Using a virtual environment (Recommended)

#### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

#### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Option 2: Without a virtual environment

```bash
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file in the project root:

```env
POSTGRES_DB=smart_expense_tracker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
JWT_SECRET_KEY=your_secret_key
```

Do not commit the `.env` file to GitHub.

## Run with Docker (Recommended)

Make sure Docker Desktop is installed and running.

```bash
docker compose up --build
```

This starts both:

- FastAPI application
- PostgreSQL database

The API will be available at:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

To stop the containers:

```bash
docker compose down
```

## Run the Server Without Docker

If you want to run the application locally, make sure PostgreSQL is running and the required environment variables are configured.

```bash
uvicorn src.app:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

## Authentication

The API uses JWT-based authentication.

### Register

```text
POST /auth/register
```

### Login

```text
POST /auth/login
```

After login, use the returned JWT access token as a Bearer token to access protected expense endpoints.

## Expense Endpoints

```text
POST   /expenses
GET    /expenses
GET    /expenses/{expense_id}
PUT    /expenses/{expense_id}
DELETE /expenses/{expense_id}

GET    /expenses/filter
GET    /expenses/total
GET    /expenses/total/{category}
GET    /expenses/monthly-summary
GET    /expenses/date-range
GET    /expenses/statistics
```

## Database

The project uses PostgreSQL with SQLAlchemy ORM.

The database contains:

- `users` table
- `expenses` table

Each expense is associated with its owner using `user_id`.

Users can only access and manage their own expenses.

## Testing

The project includes automated tests using Pytest.

Run the tests with:

```bash
pytest
```

All current tests are passing.

## Docker

Docker Compose runs the FastAPI application and PostgreSQL database together.

PostgreSQL data is stored using a Docker volume for persistence.