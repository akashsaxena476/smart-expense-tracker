from fastapi import FastAPI
from .api import router

app = FastAPI(
    title="Smart Expense Tracker API",
    version="1.0.0"
)

app.include_router(router)