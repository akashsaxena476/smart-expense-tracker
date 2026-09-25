from fastapi import FastAPI
from .api import router
from .auth import router as auth_router

app = FastAPI(
    title="Smart Expense Tracker API",
    version="1.0.0"
)

app.include_router(router)
app.include_router(auth_router)