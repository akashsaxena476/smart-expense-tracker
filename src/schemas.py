from datetime import date
from pydantic import BaseModel, Field

class ExpenseRequest(BaseModel):
    title: str = Field(..., min_length=1)
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1)
    date: date

class ExpenseResponse(ExpenseRequest):
    id: int