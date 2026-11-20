
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
      const response = await fetch("/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to sign in.");
      }

      sessionStorage.setItem("jwt", JSON.stringify(data));
      window.dispatchEvent(new Event("auth-change"));

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section page-section">
      <div className="section-intro">
        <h1 className="page-title">Sign in</h1>
        <p>Access your portfolio account.</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
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
            required
          />
        </label>

        <button
          className="primary-button"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        {error && <p role="alert">{error}</p>}

        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </section>
  );
}

export default Signin;
