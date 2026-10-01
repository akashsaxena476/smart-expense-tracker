import { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

function AddExpense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!title.trim()) {
      setError("Please enter an expense title.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Please login before adding an expense.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          amount: Number(amount),
          category,
          date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to add expense."
        );
      }

      setMessage("Expense added successfully.");

      setTitle("");
      setAmount("");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expense-page">

      <div className="add-expense-header">
        <div>
          <p className="dashboard-label">Expenses</p>

          <h1>Add Expense</h1>

          <p>
            Add a new expense to keep your spending organized.
          </p>
        </div>
      </div>

      <div className="add-expense-container">

        <div className="add-expense-card">

          <div className="add-expense-card-header">
            <div className="add-expense-icon">₹</div>

            <div>
              <h2>Expense Details</h2>
              <p>Enter the details of your expense.</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="add-expense-form"
          >

            <div className="form-group">
              <label htmlFor="title">
                Expense Title
              </label>

              <input
                id="title"
                type="text"
                placeholder="e.g. Grocery Shopping"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="amount">
                  Amount
                </label>

                <div className="amount-input">
                  <span>₹</span>

                  <input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
              <label htmlFor="date">
                Expense Date
              </label>

              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {message && (
              <div className="form-success">
                {message}
              </div>
            )}

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <div className="add-expense-actions">

              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  setTitle("");
                  setAmount("");
                  setCategory("");
                  setDate(
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  );
                  setMessage("");
                  setError("");
                }}
              >
                Clear
              </button>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Expense"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AddExpense;