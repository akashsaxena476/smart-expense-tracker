import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

const getCurrentIndiaDate = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  const [expenses, setExpenses] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [addingExpense, setAddingExpense] = useState(false);

 const [form, setForm] = useState({
   title: "",
   amount: "",
   category: "",
   date: getCurrentIndiaDate(),
 });
  const currentYear = new Date().getFullYear();

  const months = [
    { key: "01", label: "Jan" },
    { key: "02", label: "Feb" },
    { key: "03", label: "Mar" },
    { key: "04", label: "Apr" },
    { key: "05", label: "May" },
    { key: "06", label: "Jun" },
    { key: "07", label: "Jul" },
    { key: "08", label: "Aug" },
    { key: "09", label: "Sep" },
    { key: "10", label: "Oct" },
    { key: "11", label: "Nov" },
    { key: "12", label: "Dec" },
  ];

  const getToken = () => {
    return sessionStorage.getItem("access_token");
  };

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [expensesResponse, monthlyResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/expenses`, {
            headers,
          }),

          fetch(`${API_BASE_URL}/expenses/monthly-summary`, {
            headers,
          }),
        ]);

      if (
        expensesResponse.status === 401 ||
        monthlyResponse.status === 401
      ) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!expensesResponse.ok) {
        throw new Error("Failed to fetch expenses.");
      }

      if (!monthlyResponse.ok) {
        throw new Error("Failed to fetch monthly summary.");
      }

      const expensesData = await expensesResponse.json();
      const monthlyData = await monthlyResponse.json();

      /*
       * Backend response:
       *
       * {
       *   "total_expenses": 2,
       *   "expenses": [...]
       * }
       *
       * So we need expensesData.expenses
       */
      setExpenses(
        Array.isArray(expensesData?.expenses)
          ? expensesData.expenses
          : []
      );

      /*
       * Backend monthly response:
       *
       * {
       *   "2026-09": {
       *     "total_expenses": 2,
       *     "total_amount": 500
       *   },
       *   "2026-10": {
       *     "total_expenses": 3,
       *     "total_amount": 1200
       *   }
       * }
       */
      setMonthlySummary(
        monthlyData &&
          typeof monthlyData === "object"
          ? monthlyData
          : {}
      );
    } catch (err) {
      setError(
        err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (total, expense) =>
        total + Number(expense.amount || 0),
      0
    );
  }, [expenses]);

  const currentMonthAmount = useMemo(() => {
    const now = new Date();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);

        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce(
        (total, expense) =>
          total + Number(expense.amount || 0),
        0
      );
  }, [expenses]);

  const averageExpense = useMemo(() => {
    if (expenses.length === 0) {
      return 0;
    }

    return totalExpenses / expenses.length;
  }, [expenses, totalExpenses]);

  /*
   * Convert backend monthly summary into chart data.
   *
   * Backend:
   * monthlySummary["2026-10"].total_amount
   */
  const monthlyChartData = useMemo(() => {
    return months.map((month) => {
      const monthKey = `${currentYear}-${month.key}`;

      return {
        ...month,
        amount: Number(
          monthlySummary?.[monthKey]?.total_amount || 0
        ),
      };
    });
  }, [monthlySummary, currentYear]);

  const highestMonthlyAmount = useMemo(() => {
    return Math.max(
      ...monthlyChartData.map(
        (month) => month.amount
      ),
      0
    );
  }, [monthlyChartData]);

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 5);
  }, [expenses]);

  const categorySummary = useMemo(() => {
    const categories = {};

    expenses.forEach((expense) => {
      const category =
        expense.category || "Other";

      categories[category] =
        (categories[category] || 0) +
        Number(expense.amount || 0);
    });

    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [expenses]);

  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getCategoryIcon = (category) => {
    const normalizedCategory = String(
      category || ""
    ).toLowerCase();

    if (
      normalizedCategory.includes("food") ||
      normalizedCategory.includes("restaurant")
    ) {
      return "🍴";
    }

    if (
      normalizedCategory.includes("transport") ||
      normalizedCategory.includes("travel")
    ) {
      return "🚗";
    }

    if (
      normalizedCategory.includes("shopping")
    ) {
      return "🛍";
    }

    if (
      normalizedCategory.includes("bill") ||
      normalizedCategory.includes("utility")
    ) {
      return "📄";
    }

    if (
      normalizedCategory.includes("health") ||
      normalizedCategory.includes("medical")
    ) {
      return "💊";
    }

    if (
  normalizedCategory.includes("education") ||
  normalizedCategory.includes("study")
) {
  return "📚";
}

if (
  normalizedCategory.includes("entertainment") ||
  normalizedCategory.includes("movie") ||
  normalizedCategory.includes("cinema") ||
  normalizedCategory.includes("gaming")
) {
  return "🎬";
}

return "₹";
};

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    setAddingExpense(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/expenses`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: form.title,
            amount: Number(form.amount),
            category: form.category,
            date: form.date,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to add expense."
        );
      }

     setForm({
       title: "",
       amount: "",
       category: "",
       date: getCurrentIndiaDate(),
     });

      setShowAddExpense(false);

      setSuccess(
        "Expense added successfully."
      );

      /*
       * Re-fetch dashboard data after adding
       * an expense so all cards and charts
       * immediately update.
       */
      await fetchDashboardData(true);

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingExpense(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>

          <h2>Loading Dashboard</h2>

          <p>
            Fetching your expense data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* Header */}
      <div className="dashboard-header">

        <div>
          <p className="dashboard-label">
            Dashboard
          </p>

          <h1>
            Welcome Back
            {user?.username
              ? `, ${user.username}`
              : ""}{" "}
            <span>👋</span>
          </h1>

          <p>
            Here's an overview of your expenses.
          </p>
        </div>

        <div className="dashboard-header-actions">

          <button
            className="btn-outline"
            onClick={() =>
              fetchDashboardData(true)
            }
            disabled={refreshing}
          >
            {refreshing
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

          <button
            className="btn-primary"
            onClick={() =>
              setShowAddExpense(true)
            }
          >
            + Add Expense
          </button>

        </div>

      </div>

      {/* Messages */}
      {error && (
        <div className="dashboard-message error">
          <span>!</span>
          {error}
        </div>
      )}

      {success && (
        <div className="dashboard-message success">
          <span>✓</span>
          {success}
        </div>
      )}

      {/* Statistics */}
      <div className="dashboard-stats">

        <div className="stat-card">

          <div className="stat-icon blue">
            ₹
          </div>

          <div>
            <p>Total Expenses</p>

            <h2>
              {formatCurrency(
                totalExpenses
              )}
            </h2>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon green">
            ↗
          </div>

          <div>
            <p>This Month</p>

            <h2>
              {formatCurrency(
                currentMonthAmount
              )}
            </h2>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon purple">
            #
          </div>

          <div>
            <p>Total Transactions</p>

            <h2>
              {expenses.length}
            </h2>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon yellow">
            !
          </div>

          <div>
            <p>Average Expense</p>

            <h2>
              {formatCurrency(
                averageExpense
              )}
            </h2>
          </div>

        </div>

      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">

        {/* Recent Expenses */}
        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>Recent Expenses</h2>

              <p>
                Your latest transactions
              </p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                navigate("/expenses")
              }
            >
              View All →
            </button>

          </div>

          {recentExpenses.length === 0 ? (

            <div className="dashboard-empty">

              <div className="empty-icon">
                ₹
              </div>

              <h3>
                No expenses yet
              </h3>

              <p>
                Start tracking your spending by
                adding your first expense.
              </p>

              <button
                className="btn-primary"
                onClick={() =>
                  setShowAddExpense(true)
                }
              >
                + Add Your First Expense
              </button>

            </div>

          ) : (

            <div className="expense-list">

              {recentExpenses.map(
                (expense) => (

                  <div
                    className="dashboard-expense"
                    key={expense.id}
                  >

                    <div
                      className={`expense-category ${String(
                        expense.category || ""
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {getCategoryIcon(
                        expense.category
                      )}
                    </div>

                    <div className="expense-info">

                      <h3>
                        {expense.title}
                      </h3>

                      <p>
                        {expense.category ||
                          "Other"}{" "}
                        <span>•</span>{" "}
                        {formatDate(
                          expense.date
                        )}
                      </p>

                    </div>

                    <strong>
                      -{" "}
                      {formatCurrency(
                        expense.amount
                      )}
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* Expense Overview */}
        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Expense Overview
              </h2>

              <p>
                Monthly spending for{" "}
                {currentYear}
              </p>

            </div>

          </div>

          <div className="chart-total">

            <span>
              Yearly spending
            </span>

            <strong>
              {formatCurrency(
                monthlyChartData.reduce(
                  (sum, month) =>
                    sum + month.amount,
                  0
                )
              )}
            </strong>

          </div>

          <div className="dashboard-chart">

            <div className="chart-bars">

              {monthlyChartData.map(
                (month) => {

                  const height =
                    highestMonthlyAmount === 0
                      ? 4
                      : Math.max(
                          (month.amount /
                            highestMonthlyAmount) *
                            100,
                          4
                        );

                  return (
                    <div
                      className="chart-bar-wrapper"
                      key={month.key}
                    >

                      <div className="chart-value">
                        {month.amount > 0
                          ? `₹${Math.round(
                              month.amount
                            )}`
                          : ""}
                      </div>

                      <span
                        className={`chart-bar ${
                          month.amount ===
                            highestMonthlyAmount &&
                          month.amount > 0
                            ? "highest"
                            : ""
                        }`}
                        style={{
                          height: `${height}%`,
                        }}
                        title={`${month.label}: ${formatCurrency(
                          month.amount
                        )}`}
                      ></span>

                    </div>
                  );
                }
              )}

            </div>

            <div className="chart-labels">

              {monthlyChartData.map(
                (month) => (
                  <span key={month.key}>
                    {month.label}
                  </span>
                )
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Category Overview */}
      {categorySummary.length > 0 && (

        <div className="dashboard-panel category-panel">

          <div className="panel-header">

            <div>

              <h2>
                Spending by Category
              </h2>

              <p>
                See where your money is going
              </p>

            </div>

          </div>

          <div className="category-grid">

            {categorySummary.map(
              ([category, amount]) => {

                const percentage =
                  totalExpenses > 0
                    ? (amount /
                        totalExpenses) *
                      100
                    : 0;

                return (
                  <div
                    className="category-item"
                    key={category}
                  >

                    <div className="category-item-top">

                      <div>

                        <span className="category-small-icon">
                          {getCategoryIcon(
                            category
                          )}
                        </span>

                        <strong>
                          {category}
                        </strong>

                      </div>

                      <strong>
                        {formatCurrency(
                          amount
                        )}
                      </strong>

                    </div>

                    <div className="category-progress">

                      <div
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>

                    </div>

                    <small>
                      {percentage.toFixed(1)}%
                      of total spending
                    </small>

                  </div>
                );
              }
            )}

          </div>

        </div>

      )}

      {/* Add Expense Modal */}
      {showAddExpense && (

        <div
          className="expense-modal-overlay"
          onClick={() =>
            !addingExpense &&
            setShowAddExpense(false)
          }
        >

          <div
            className="expense-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  Add Expense
                </h2>

                <p>
                  Record a new expense.
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  !addingExpense &&
                  setShowAddExpense(false)
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleAddExpense}
              className="expense-form"
            >

              <div className="form-group">

                <label>
                  Expense Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Grocery Shopping"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                />

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Amount
                  </label>

                  <input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={handleFormChange}
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    required
                  >

                    <option value="">
                      Select category
                    </option>

                    <option value="Food">
                      Food
                    </option>

                    <option value="Transport">
                      Transport
                    </option>

                    <option value="Shopping">
                      Shopping
                    </option>

                    <option value="Bills">
                      Bills
                    </option>

                    <option value="Health">
                      Health
                    </option>

                    <option value="Education">
                      Education
                    </option>

                    <option value="Entertainment">
                      Entertainment
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>

              <div className="form-group">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  required
                />

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-outline"
                  onClick={() =>
                    setShowAddExpense(false)
                  }
                  disabled={addingExpense}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={addingExpense}
                >
                  {addingExpense
                    ? "Adding..."
                    : "Add Expense"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;