import { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

function DateRange() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    if (startDate > endDate) {
      setError("Start date cannot be after end date.");
      return;
    }

    setLoading(true);
    setError("");
    setExpenses([]);

    try {
      const token = sessionStorage.getItem("access_token");

      if (!token) {
        throw new Error("Please login to view your expenses.");
      }

      const url =
        `${API_BASE_URL}/expenses/date-range` +
        `?start_date=${startDate}&end_date=${endDate}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to fetch expenses."
        );
      }

      setExpenses(data.expenses || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Date Range</h1>
          <p>
            View expenses between two selected dates.
          </p>
        </div>
      </div>

      <form
        className="date-range-form"
        onSubmit={handleSearch}
      >

        <div className="form-group">
          <label>Start Date</label>

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>End Date</label>

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>

      </form>

      {error && (
        <div className="error-state">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && expenses.length === 0 && (
        <div className="empty-state">
          <h3>No expenses found</h3>

          <p>
            Select a date range to view your expenses.
          </p>
        </div>
      )}

      {!loading && expenses.length > 0 && (
        <div className="expense-list">

          {expenses.map((expense) => (
            <div
              className="expense-card"
              key={expense.id}
            >

              <div>
                <h3>{expense.title}</h3>

                <p>
                  {expense.category} • {expense.date}
                </p>
              </div>

              <strong>
                ₹
                {Number(expense.amount).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default DateRange;