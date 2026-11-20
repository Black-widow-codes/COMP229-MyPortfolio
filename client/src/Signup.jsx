
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create account.");
      }

      navigate("/signin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section page-section">
      <div className="section-intro">
        <h1 className="page-title">Sign up</h1>
        <p>Create your portfolio account.</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email address
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </label>

        <button
          className="primary-button"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>

        {error && <p role="alert">{error}</p>}

        <p>
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </section>
  );
}

export default Signup;
