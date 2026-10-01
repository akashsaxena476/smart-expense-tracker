import { useEffect, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

function MonthlySummary() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMonthlySummary = async () => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("access_token");

      if (!token) {
        throw new Error("Please login to view your monthly summary.");
      }

      const response = await fetch(
        `${API_BASE_URL}/expenses/monthly-summary`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to fetch monthly summary."
        );
      }

      const formattedSummary = Object.entries(data)
        .sort(([monthA], [monthB]) =>
          monthB.localeCompare(monthA)
        )
        .map(([month, values]) => ({
          month,
          totalExpenses: values.total_expenses,
          totalAmount: values.total_amount,
        }));

      setSummary(formattedSummary);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlySummary();
  }, []);

  const formatMonth = (month) => {
    const [year, monthNumber] = month.split("-");

    const date = new Date(
      Number(year),
      Number(monthNumber) - 1
    );

    return date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Monthly Summary</h1>

          <p>
            View your expenses month by month.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={fetchMonthlySummary}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading && (
        <div className="empty-state">
          <h3>Loading monthly summary...</h3>

          <p>
            Please wait while we fetch your expense data.
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="error-state">
          <h3>Unable to load summary</h3>

          <p>{error}</p>

          <button
            className="btn-primary"
            onClick={fetchMonthlySummary}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && summary.length === 0 && (
        <div className="empty-state">
          <h3>No monthly data available</h3>

          <p>
            Add some expenses to see your monthly summary.
          </p>
        </div>
      )}

      {!loading && !error && summary.length > 0 && (
        <div className="summary-list">

          {summary.map((item) => (
            <div
              className="summary-card"
              key={item.month}
            >

              <div>
                <h3>
                  {formatMonth(item.month)}
                </h3>

                <p>
                  {item.totalExpenses} expense
                  {item.totalExpenses !== 1 ? "s" : ""}
                </p>
              </div>

              <strong>
                ₹
                {Number(
                  item.totalAmount
                ).toLocaleString("en-IN")}
              </strong>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MonthlySummary;