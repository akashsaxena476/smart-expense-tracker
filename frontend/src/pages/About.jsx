function About() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>About Smart Expense Tracker</h1>
          <p>Manage your expenses simply and efficiently.</p>
        </div>
      </div>

      <div className="content-card">
        <h2>Smart Expense Tracker</h2>

        <p>
          Smart Expense Tracker is a personal expense management
          application designed to help users record, manage, and
          understand their spending.
        </p>

        <p>
          Users can add expenses, view their expense history,
          filter expenses, check statistics, and analyse their
          spending over different periods.
        </p>

        <div className="about-features">
          <div>
            <h3>Expense Management</h3>
            <p>
              Add and manage your daily expenses in one place.
            </p>
          </div>

          <div>
            <h3>Expense Analysis</h3>
            <p>
              Understand your spending through statistics and
              summaries.
            </p>
          </div>

          <div>
            <h3>Secure Access</h3>
            <p>
              Your expense data is associated with your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;