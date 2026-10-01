# Smart Expense Tracker

A full-stack expense management application built with React, FastAPI, and PostgreSQL. The application provides JWT-based authentication, user-based authorization, expense management, filtering, summaries, statistics, and a responsive dashboard.

## Features

- User registration and login
- JWT-based authentication
- Password hashing and validation
- User-based authorization
- Multi-user expense management
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
- Interactive dashboard
- Recent expenses
- Responsive frontend
- PostgreSQL database
- Docker and Docker Compose support

## Tech Stack

### Frontend

- React
- React Router
- Vite
- JavaScript
- CSS

### Backend

- Python 3.11+
- FastAPI
- Uvicorn
- Pydantic
- SQLAlchemy
- PyJWT
- Pwdlib

### Database

- PostgreSQL

### Testing

- Pytest

### DevOps

- Docker
- Docker Compose
- Nginx

## Project Structure

```text
smart-expense-tracker/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── app.py
│   ├── api.py
│   ├── auth.py
│   ├── schemas.py
│   └── auth_schemas.py
│
├── database/
│   ├── connection.py
│   ├── models.py
│   ├── operations.py
│   ├── user_models.py
│   └── user_operations.py
│
├── security/
│   ├── password.py
│   └── jwt.py
│
├── storage/
│   └── expense_storage.py
│
├── tests/
│   └── test_expense_api.py
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── create_tables.py
├── .env
└── README.md
```

## Installation

### Backend

Create a virtual environment.

#### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

#### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

### Frontend

Open the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
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

## Run the Application Without Docker

To run the application without Docker, PostgreSQL must be running locally and the required environment variables must be configured.

### Start the Backend

From the project root:

```bash
uvicorn src.app:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

### Start the Frontend

Open another terminal and move to the frontend directory:

```bash
cd frontend
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## Run the Application with Docker

Docker is the recommended way to run the complete application because it starts the frontend, backend, and PostgreSQL database together.

Make sure Docker Desktop is installed and running.

From the project root, run:

```bash
docker compose up -d --build
```

This starts:

- React frontend
- FastAPI backend
- PostgreSQL database

Check the running containers:

```bash
docker compose ps
```

The frontend will be available at:

```text
http://localhost:5173
```

The backend will be available at:

```text
http://localhost:8000
```

Swagger API documentation:

```text
http://localhost:8000/docs
```

### View Application Logs

```bash
docker compose logs -f
```

### Stop the Application

```bash
docker compose down
```

### Start Again Without Rebuilding

```bash
docker compose up -d
```

### Rebuild the Containers

If any code, dependency, or Docker configuration changes are made:

```bash
docker compose up -d --build
```

## Testing

The project includes automated tests using Pytest.

Run the tests from the project root:

```bash
pytest
```

The tests cover the expense API functionality and authorization behavior.

## Docker Services

Docker Compose runs the following services.

### Frontend

React application served using Nginx.

```text
http://localhost:5173
```

### Backend

FastAPI application.

```text
http://localhost:8000
```

### Database

PostgreSQL database running inside Docker.

The PostgreSQL data is stored using a Docker volume so that database data is preserved when containers are restarted.

## Application URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| Swagger Documentation | http://localhost:8000/docs |

## Author

**Akash Saxena**

B.Tech Computer Science Engineering with specialization in AI & ML

GitHub:  
https://github.com/akashsaxena476