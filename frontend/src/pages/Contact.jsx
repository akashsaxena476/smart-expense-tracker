import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Contact Us</h1>
          <p>Have a question or feedback? Get in touch with us.</p>
        </div>
      </div>

      <div className="contact-layout">
        <div className="content-card">
          <h2>Get in Touch</h2>

          <p>
            If you have any questions, suggestions, or feedback
            about Smart Expense Tracker, feel free to contact us.
          </p>

          <div className="contact-info">
            <div>
              <strong>Email</strong>
              <p>support@smartexpensetracker.com</p>
            </div>

            <div>
              <strong>Support</strong>
              <p>We are here to help you.</p>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h2>Send a Message</h2>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>

              <textarea
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                required
              />
            </div>

            {submitted && (
              <p className="auth-success">
                Your message has been submitted.
              </p>
            )}

            <button
              type="submit"
              className="auth-submit"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;