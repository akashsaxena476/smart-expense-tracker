from datetime import date as Date, datetime
from zoneinfo import ZoneInfo

from pydantic import BaseModel, Field


INDIA_TIMEZONE = ZoneInfo("Asia/Kolkata")


def get_current_india_date() -> Date:
    return datetime.now(INDIA_TIMEZONE).date()


class ExpenseRequest(BaseModel):
    title: str = Field(..., min_length=1)
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1)
    date: Date = Field(
        default_factory=get_current_india_date,
        examples=[get_current_india_date()]
    )


class ExpenseResponse(ExpenseRequest):
    id: int