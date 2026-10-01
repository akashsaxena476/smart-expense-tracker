import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

function Statistics() {
  const [statistics, setStatistics] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please login to view your statistics.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [statisticsResponse, expensesResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/expenses/statistics`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/expenses`, {
            headers,
          }),
        ]);

      const statisticsData = await statisticsResponse.json();
      const expensesData = await expensesResponse.json();

      if (!statisticsResponse.ok) {
        throw new Error(
          statisticsData.detail || "Failed to fetch statistics."
        );
      }

      if (!expensesResponse.ok) {
        throw new Error(
          expensesData.detail || "Failed to fetch expenses."
        );
      }

      setStatistics(statisticsData);
      setExpenses(
        Array.isArray(expensesData) ? expensesData : []
      );
    } catch (err) {
      setError(
        err.message || "Failed to load statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const categoryData = useMemo(() => {
    const categoryTotals = {};

    expenses.forEach((expense) => {
      const category = expense.category || "Other";
      const amount = Number(expense.amount || 0);

      categoryTotals[category] =
        (categoryTotals[category] || 0) + amount;
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const highestCategoryAmount = Math.max(
    ...categoryData.map((item) => item.amount),
    0
  );

  const getCategoryWidth = (amount) => {
    if (highestCategoryAmount === 0) {
      return 0;
    }

    return (amount / highestCategoryAmount) * 100;
  };

  const getCategoryIcon = (category) => {
    const value = category.toLowerCase();

    if (value.includes("food")) return "🍴";
    if (value.includes("transport")) return "🚗";
    if (value.includes("shopping")) return "🛍";
    if (value.includes("bill")) return "📄";
    if (value.includes("health")) return "💊";
    if (value.includes("education")) return "📚";
    if (value.includes("entertainment")) return "🎬";

    return "₹";
  };

  if (loading) {
    return (
      <div className="statistics-page">
        <div className="statistics-header">
          <p className="dashboard-label">Analytics</p>
          <h1>Loading Statistics...</h1>
          <p>Fetching your expense statistics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-page">

      <div className="statistics-header">
        <div>
          <p className="dashboard-label">Analytics</p>

          <h1>Expense Statistics</h1>

          <p>
            Understand your spending patterns and
            manage your expenses better.
          </p>
        </div>
      </div>

      {error && (
        <div className="statistics-error">
          {error}
        </div>
      )}

      {statistics && (
        <>
          <div className="statistics-cards">

            <div className="statistics-card">
              <div className="statistics-icon blue">
                #
              </div>

              <div>
                <p>Total Expenses</p>
                <h2>
                  {statistics.total_expenses ?? 0}
                </h2>
              </div>
            </div>

            <div className="statistics-card">
              <div className="statistics-icon green">
                ₹
              </div>

              <div>
                <p>Total Amount</p>
                <h2>
                  {formatCurrency(
                    statistics.total_amount
                  )}
                </h2>
              </div>
            </div>

            <div className="statistics-card">
              <div className="statistics-icon purple">
                ↗
              </div>

              <div>
                <p>Average Expense</p>
                <h2>
                  {formatCurrency(
                    statistics.average_expense
                  )}
                </h2>
              </div>
            </div>

            <div className="statistics-card">
              <div className="statistics-icon yellow">
                ↑
              </div>

              <div>
                <p>Highest Expense</p>
                <h2>
                  {formatCurrency(
                    statistics.highest_expense
                  )}
                </h2>
              </div>
            </div>

          </div>

          <div className="statistics-grid">

            <div className="statistics-panel">

              <div className="panel-header">
                <div>
                  <h2>Expense Range</h2>
                  <p>
                    Compare your highest and lowest
                    expenses
                  </p>
                </div>
              </div>

              <div className="expense-range">

                <div className="range-item">
                  <div className="range-icon highest">
                    ↑
                  </div>

                  <div>
                    <span>Highest Expense</span>
                    <strong>
                      {formatCurrency(
                        statistics.highest_expense
                      )}
                    </strong>
                  </div>
                </div>

                <div className="range-item">
                  <div className="range-icon lowest">
                    ↓
                  </div>

                  <div>
                    <span>Lowest Expense</span>
                    <strong>
                      {formatCurrency(
                        statistics.lowest_expense
                      )}
                    </strong>
                  </div>
                </div>

              </div>

            </div>

            <div className="statistics-panel">

              <div className="panel-header">
                <div>
                  <h2>Category Breakdown</h2>
                  <p>
                    Your spending by category
                  </p>
                </div>
              </div>

              {categoryData.length === 0 ? (
                <div className="statistics-empty">
                  <p>No expense data available.</p>
                </div>
              ) : (
                <div className="category-breakdown">

                  {categoryData.map((item) => (
                    <div
                      className="category-stat"
                      key={item.category}
                    >

                      <div className="category-stat-header">

                        <div className="category-stat-name">
                          <span className="category-stat-icon">
                            {getCategoryIcon(
                              item.category
                            )}
                          </span>

                          <span>
                            {item.category}
                          </span>
                        </div>

                        <strong>
                          {formatCurrency(item.amount)}
                        </strong>

                      </div>

                      <div className="category-progress">
                        <div
                          className="category-progress-fill"
                          style={{
                            width: `${getCategoryWidth(
                              item.amount
                            )}%`,
                          }}
                        />
                      </div>

                    </div>
                  ))}

                </div>
              )}

            </div>

          </div>
        </>
      )}

    </div>
  );
}

export default Statistics;