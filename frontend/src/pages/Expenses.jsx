import { useEffect, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

const getCurrentIndiaDate = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const [statistics, setStatistics] = useState({
    total_expenses: 0,
    total_amount: 0,
    average_expense: 0,
    highest_expense: 0,
    lowest_expense: 0,
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryTotal, setCategoryTotal] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedExpense, setSelectedExpense] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: getCurrentIndiaDate(),
  });

  const token = sessionStorage.getItem("access_token");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getCategoryIcon = (category) => {
    const value = category?.toLowerCase() || "";

    if (
      value.includes("food") ||
      value.includes("lunch") ||
      value.includes("restaurant")
    ) {
      return "🍴";
    }

    if (
      value.includes("health") ||
      value.includes("medical") ||
      value.includes("gym")
    ) {
      return "💊";
    }

    if (
      value.includes("transport") ||
      value.includes("travel")
    ) {
      return "🚗";
    }

    if (
      value.includes("shopping") ||
      value.includes("shop")
    ) {
      return "🛍️";
    }

    if (
      value.includes("entertainment") ||
      value.includes("movie") ||
      value.includes("cinema") ||
      value.includes("gaming")
    ) {
      return "🎬";
    }

    if (
      value.includes("bill") ||
      value.includes("utility")
    ) {
      return "💡";
    }

    if (
      value.includes("education") ||
      value.includes("study")
    ) {
      return "📚";
    }

    return "💰";
  };

  const getCategoryClass = (category) => {
    const value = category?.toLowerCase() || "";

    if (
      value.includes("food") ||
      value.includes("lunch") ||
      value.includes("restaurant")
    ) {
      return "food";
    }

    if (
      value.includes("health") ||
      value.includes("medical") ||
      value.includes("gym")
    ) {
      return "health";
    }

    if (
      value.includes("transport") ||
      value.includes("travel")
    ) {
      return "transport";
    }

    if (
      value.includes("shopping") ||
      value.includes("shop")
    ) {
      return "shopping";
    }

    if (
      value.includes("entertainment") ||
      value.includes("movie") ||
      value.includes("cinema") ||
      value.includes("gaming")
    ) {
      return "entertainment";
    }

    if (
      value.includes("bill") ||
      value.includes("utility")
    ) {
      return "bills";
    }

    if (
      value.includes("education") ||
      value.includes("study")
    ) {
      return "education";
    }

    return "";
  };

  const handleUnauthorized = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");

    window.location.href = "/login";
  };

  const fetchExpenses = async () => {
    const response = await fetch(
      `${API_BASE_URL}/expenses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to fetch expenses."
      );
    }

    const expenseList = data.expenses || [];

    setExpenses(expenseList);
    setFilteredExpenses(expenseList);
  };

  const fetchStatistics = async () => {
    const response = await fetch(
      `${API_BASE_URL}/expenses/statistics`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to fetch statistics."
      );
    }

    setStatistics(data);
  };

  const fetchTotal = async () => {
    const response = await fetch(
      `${API_BASE_URL}/expenses/total`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to fetch total expenses."
      );
    }

    setStatistics((previous) => ({
      ...previous,
      total_amount: data.total ?? 0,
    }));
  };

  const fetchCategoryTotal = async (category) => {
    if (!category) {
      setCategoryTotal(null);
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/expenses/total/${encodeURIComponent(
        category
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to fetch category total."
      );
    }

    setCategoryTotal(data.total ?? 0);
  };

  const handleFilter = async (category) => {
    setSelectedCategory(category);
    setError("");

    try {
      if (!category) {
        setFilteredExpenses(expenses);
        setCategoryTotal(null);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/expenses/filter?category=${encodeURIComponent(
          category
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to filter expenses."
        );
      }

      setFilteredExpenses(data.expenses || []);

      await fetchCategoryTotal(category);
    } catch (err) {
      setError(err.message);
    }
  };

  const refreshExpenseData = async () => {
    try {
      setRefreshing(true);
      setError("");

      await Promise.all([
        fetchExpenses(),
        fetchStatistics(),
        fetchTotal(),
      ]);

      if (selectedCategory) {
        await fetchCategoryTotal(selectedCategory);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const loadInitialData = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchExpenses(),
        fetchStatistics(),
        fetchTotal(),
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      amount: "",
      category: "",
      date: getCurrentIndiaDate(),
    });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/expenses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date,
          }),
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to add expense."
        );
      }

      setShowAddModal(false);
      resetForm();

      await refreshExpenseData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewExpense = async (expenseId) => {
    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/expenses/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to fetch expense."
        );
      }

      setSelectedExpense(data.expense);
      setShowViewModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (expense) => {
    setSelectedExpense(expense);

    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    });

    setShowEditModal(true);
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();

    if (!selectedExpense) return;

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/expenses/${selectedExpense.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date,
          }),
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update expense."
        );
      }

      setShowEditModal(false);
      setSelectedExpense(null);
      resetForm();

      await refreshExpenseData();

      if (selectedCategory) {
        await handleFilter(selectedCategory);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/expenses/${expenseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete expense."
        );
      }

      await refreshExpenseData();

      if (selectedCategory) {
        await handleFilter(selectedCategory);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const categories = [
    ...new Set(
      expenses
        .map((expense) => expense.category)
        .filter(Boolean)
    ),
  ].sort();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>

        <h2>Loading Expenses...</h2>

        <p>
          Please wait while we load your expense data.
        </p>
      </div>
    );
  }

  return (
    <div className="expenses-page">

      {/* HEADER */}
      <div className="expenses-header">
        <div className="expenses-header-content">
          <div className="expenses-label">
            Expenses
          </div>

          <h1>My Expenses</h1>

          <p>
            View and manage all your expenses in one place.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          + Add Expense
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="dashboard-message error">
          <span>!</span>
          {error}
        </div>
      )}

      {/* STATISTICS */}
      <div className="expense-stats">

        <div className="expense-stat-card">
          <div className="expense-stat-icon blue">
            ₹
          </div>

          <div>
            <p>Total Spending</p>

            <h2>
              {formatCurrency(
                statistics.total_amount
              )}
            </h2>
          </div>
        </div>

        <div className="expense-stat-card">
          <div className="expense-stat-icon purple">
            #
          </div>

          <div>
            <p>Total Transactions</p>

            <h2>
              {statistics.total_expenses}
            </h2>
          </div>
        </div>

        <div className="expense-stat-card">
          <div className="expense-stat-icon green">
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

        <div className="expense-stat-card">
          <div className="expense-stat-icon yellow">
            !
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

      {/* FILTER */}
      <div className="expense-filter-card">

        <div className="expense-filter-left">
          <label htmlFor="category">
            Filter by Category
          </label>

          <select
            id="category"
            value={selectedCategory}
            onChange={(e) =>
              handleFilter(e.target.value)
            }
          >
            <option value="">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory &&
          categoryTotal !== null && (
            <div className="category-total">
              {selectedCategory} Total:{" "}
              <strong>
                {formatCurrency(categoryTotal)}
              </strong>
            </div>
          )}

      </div>

      {/* EXPENSES SECTION */}
      <div className="expenses-section">

        <div className="expenses-section-header">

          <div>
            <h2>
              {selectedCategory
                ? `${selectedCategory} Expenses`
                : "All Expenses"}
            </h2>

            <p>
              {filteredExpenses.length}{" "}
              {filteredExpenses.length === 1
                ? "expense"
                : "expenses"}
            </p>
          </div>

          <button
            className="expenses-refresh"
            onClick={refreshExpenseData}
            disabled={refreshing}
          >
            {refreshing
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

        </div>

        {filteredExpenses.length === 0 ? (
          <div className="empty-state">

            <div className="empty-icon">
              ₹
            </div>

            <h3>No expenses found</h3>

            <p>
              {selectedCategory
                ? "There are no expenses in this category."
                : "Start adding expenses to track your spending."}
            </p>

            {!selectedCategory && (
              <button
                className="btn-primary"
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
              >
                + Add Your First Expense
              </button>
            )}

          </div>
        ) : (
          <div className="expense-list">

            {filteredExpenses.map((expense) => (
              <div
                className="expense-card"
                key={expense.id}
              >

                <div className="expense-main">

                  <div
                    className={`expense-icon ${getCategoryClass(
                      expense.category
                    )}`}
                  >
                    {getCategoryIcon(
                      expense.category
                    )}
                  </div>

                  <div className="expense-details">

                    <h3>
                      {expense.title}
                    </h3>

                    <p>
                      {expense.category}
                      <span>•</span>
                      {formatDate(expense.date)}
                    </p>

                  </div>

                </div>

                <div className="expense-amount">
                  {formatCurrency(expense.amount)}
                </div>

                <div className="expense-actions">

                  <button
                    onClick={() =>
                      handleViewExpense(
                        expense.id
                      )
                    }
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      openEditModal(expense)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteExpense(
                        expense.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* ADD EXPENSE MODAL */}
      {showAddModal && (
        <div
          className="expense-modal-overlay"
          onClick={() =>
            setShowAddModal(false)
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
                <h2>Add Expense</h2>
                <p>
                  Add a new expense to your tracker.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                ×
              </button>
            </div>

            <form
              className="expense-form"
              onSubmit={handleAddExpense}
            >

              <div className="form-group">
                <label>Title</label>

                <input
                  type="text"
                  placeholder="e.g. Grocery"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Amount</label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 500"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>

                  <input
                    type="text"
                    placeholder="e.g. Food or Entertainment"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category:
                          e.target.value,
                      })
                    }
                    required
                  />
                </div>

              </div>

              <div className="form-group">
                <label>Date</label>

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-outline"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  Add Expense
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* EDIT EXPENSE MODAL */}
      {showEditModal && (
        <div
          className="expense-modal-overlay"
          onClick={() =>
            setShowEditModal(false)
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
                <h2>Edit Expense</h2>
                <p>
                  Update your expense details.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                ×
              </button>
            </div>

            <form
              className="expense-form"
              onSubmit={handleUpdateExpense}
            >

              <div className="form-group">
                <label>Title</label>

                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Amount</label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>

                  <input
                    type="text"
                    placeholder="e.g. Food or Entertainment"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category:
                          e.target.value,
                      })
                    }
                    required
                  />
                </div>

              </div>

              <div className="form-group">
                <label>Date</label>

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-outline"
                  onClick={() =>
                    setShowEditModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* VIEW EXPENSE MODAL */}
      {showViewModal &&
        selectedExpense && (
          <div
            className="expense-modal-overlay"
            onClick={() =>
              setShowViewModal(false)
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
                  <h2>Expense Details</h2>
                  <p>
                    View expense information.
                  </p>
                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowViewModal(false)
                  }
                >
                  ×
                </button>
              </div>

              <div className="expense-view-content">

                <div className="expense-view-row">
                  <span>Title</span>
                  <strong>
                    {selectedExpense.title}
                  </strong>
                </div>

                <div className="expense-view-row">
                  <span>Amount</span>
                  <strong>
                    {formatCurrency(
                      selectedExpense.amount
                    )}
                  </strong>
                </div>

                <div className="expense-view-row">
                  <span>Category</span>
                  <strong>
                    {selectedExpense.category}
                  </strong>
                </div>

                <div className="expense-view-row">
                  <span>Date</span>
                  <strong>
                    {formatDate(
                      selectedExpense.date
                    )}
                  </strong>
                </div>

                <div className="expense-view-row">
                  <span>Expense ID</span>
                  <strong>
                    #{selectedExpense.id}
                  </strong>
                </div>

              </div>

              <div className="modal-actions">

                <button
                  className="btn-outline"
                  onClick={() =>
                    setShowViewModal(false)
                  }
                >
                  Close
                </button>

              </div>

            </div>
          </div>
        )}

    </div>
  );
}

export default Expenses;