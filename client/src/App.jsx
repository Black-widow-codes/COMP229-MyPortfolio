// Main application component
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import "./App.css";

// Portfolio project data displayed on the Projects page
const projects = [
  { title: "Cybersecurity Planet", type: "Cybersecurity education", description: "A cybersecurity learning platform that presents security concepts through a focused, accessible web experience.", outcome: "Built the platform with Next.js and TypeScript. Outcome: Created and deployed an accessible cybersecurity learning website for exploring digital security concepts.", image: "/projects/cybersecurity-planet.png", url: "https://github.com/Black-widow-codes/Cybersecurity-Planet" },
  { title: "CareGuardian", type: "Digital health platform", description: "A Patient Safety Intelligence Platform that helps healthcare teams identify discharge risks before patients leave hospital.", outcome: "Developed the platform with Next.js, React, TypeScript, PostgreSQL, Prisma, and Docker. Outcome: Produced a working patient-safety prototype for identifying potential discharge risks.", image: "/projects/careguardian.png", url: "https://github.com/Black-widow-codes/CareGuardian" },
  { title: "Brightwell Children's Clinic", type: "HTML / CSS / JavaScript", description: "A hospital website created as a college project with pages for services, telemedicine, remote monitoring, and parent resources.", outcome: "Created the structured, responsive healthcare information experience. Outcome: Delivered a responsive hospital website that organizes services, telemedicine, remote monitoring, and parent resources.", image: "/projects/brightwell-clinic.png", url: "https://github.com/Black-widow-codes/My_html_project" },
];

// Services offered and displayed on the Services page
const services = ["Technical support and troubleshooting", "Web design and development", "Digital security and privacy awareness", "Plain-language technology writing", "Digital health workflow analysis", ];

// Shared site header containing the portfolio branding and navigation

function Header() {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("jwt"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const refreshAuth = () => {
      try {
        setAuth(JSON.parse(sessionStorage.getItem("jwt")));
      } catch {
        setAuth(null);
      }
    };

    window.addEventListener("auth-change", refreshAuth);

    return () => {
      window.removeEventListener("auth-change", refreshAuth);
    };
  }, []);

  async function handleSignout() {
    try {
      await fetch("/auth/signout", {
        method: "GET"
      });
    } catch (error) {
      console.error("Signout request failed:", error);
    } finally {
      sessionStorage.removeItem("jwt");
      setAuth(null);
      navigate("/signin");
    }
  }

  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="Return to home">
        <span className="brand-mark">BS</span>
        <span>
          Bryan Senfuma<span className="brand-dot">.</span>
        </span>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/about">About</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/education">Education</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        {auth?.token && auth?.user?.role === "admin" && (
  <NavLink to="/admin">Admin</NavLink>
)}

        {auth?.token ? (
          <button type="button" onClick={handleSignout}>
            Sign out
          </button>
        ) : (
          <>
            <NavLink to="/signin">Sign in</NavLink>
            <NavLink to="/signup">Sign up</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}


// Shared footer displayed across all portfolio pages
function Footer() {
  return <footer className="footer"><span>© 2026 Bryan Senfuma</span></footer>;
}

// Main layout that keeps the header and footer consistent across routes
function Layout() {
  return <><a className="skip-link" href="#main-content">Skip to main content</a><Header /><main id="main-content" tabIndex="-1"><Outlet /></main><Footer /></>;
}

// Reusable heading component for the main portfolio sections
function PageIntro({ number, label, title }) {
  return <div className="section-heading"><p className="eyebrow">{number} / {label}</p><h1 className="page-title">{title}</h1></div>;
}

// Home page introduction and link to the About page
function Home() {
  return <section className="hero"><div><h1>Secure systems. Human design. <em>Digital empowerment.</em></h1><p className="hero-text">I am Bryan Senfuma, a Digital Health Engineering Technology student and IT support practitioner focused on building secure, accessible, and human-centered technology that helps people confidently navigate the digital world.</p><Link className="primary-button" to="/about">Meet Bryan <span></span></Link></div><div className="hero-orbit" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-core">BS</div><span className="orbit-label label-one">secure</span><span className="orbit-label label-two">simplify</span><span className="orbit-label label-three">empower</span></div></section>;
}

// About page with professional background, photo, and resume link
function About() {
  return <section className="section foundations page-section"><div className="section-intro"><PageIntro number="01" label="About me" title="Making complex technology easier to trust." /><p>I am a Digital Health Engineering Technology student at Centennial College with experience in IT support, network troubleshooting, cybersecurity awareness, and digital literacy training.</p><a className="text-link" href="/Bryan_Senfuma_resume.pdf" target="_blank" rel="noreferrer">Download my resume <span></span></a></div><div className="about-panel"><div className="profile-placeholder"><img src="/bryan-avatar.jpg" alt="Professional avatar of Bryan Senfuma" /></div><div><h3>Bryan Senfuma</h3><p>I have supported NGOs and community groups through technical assistance, digital security guidance, training materials, and public education. My long-term goal is to contribute to secure, accessible digital health systems while growing in healthcare technology and cybersecurity.</p><p className="about-feature">I also write <em>Digital Citizen Corner</em> for Learning Curves, where I break down digital identity, misinformation, online safety, and emerging technologies in accessible, human-centred language. <a href="https://learningcurves.org/category/digital-citizen-corner/" target="_blank" rel="noreferrer">Read the column <span></span></a></p></div></div></section>;
}

// Projects page showcasing selected work, contributions, and outcomes

function Projects() {
  const [databaseProjects, setDatabaseProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects");

        if (!response.ok) {
          throw new Error("Could not load projects.");
        }

        const data = await response.json();
        setDatabaseProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <section className="section page-section">
      <PageIntro
        number="02"
        label="Projects"
        title="A practical body of work in progress."
      />

      <p className="page-lead">
        These projects reflect the questions I keep returning to:
        how can technology improve safety, build digital confidence,
        and make essential services easier to access?
      </p>

      {loading && <p>Loading projects...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <div className="project-grid">
          {databaseProjects.map((project, index) => (
            <article className="project-card" key={project._id}>
              <img
                className={`project-image project-image-${index + 1}`}
                src={project.image}
                alt={`Screenshot of ${project.title}`}
              />

              <p className="eyebrow">{project.type}</p>

              <h3>{project.title}</h3>

              <p>{project.description}</p>

              <p className="project-outcome">
                <strong>My contribution:</strong> {project.outcome}
              </p>

              <a
                className="project-link"
                href={project.url}
                target="_blank"
                rel="noreferrer"
              >
                View {project.title}
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}


// Education page listing academic qualifications and professional certifications

function Education() {
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQualifications() {
      try {
        const response = await fetch("/api/qualifications");

        if (!response.ok) {
          throw new Error("Could not load qualifications.");
        }

        const data = await response.json();
        setQualifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadQualifications();
  }, []);

  return (
    <section className="section split-section page-section">
      <div className="section-intro">
        <PageIntro
          number="03"
          label="Education"
          title="A technical foundation with a public-interest focus."
        />

        <p>
          My education combines healthcare technology, systems support,
          cybersecurity, cloud security, and digital health innovation.
        </p>

        <p className="education-skills">
          <strong>Focus areas:</strong> Healthcare information systems,
          workflow analysis, software development with Python, C#, and
          JavaScript, web technologies including HTML, CSS, React, and Vite,
          networking, cybersecurity awareness, Linux/Unix environments,
          databases, and technical support.
        </p>
      </div>

      <div className="timeline">
        {loading && <p>Loading qualifications...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error &&
          qualifications.map((qualification) => (
            <div
              className="timeline-item"
              key={qualification._id}
            >
              <span>{qualification.period}</span>

              <div>
                <h3>{qualification.title}</h3>
                <p>{qualification.institution}</p>
              </div>
            </div>
          ))
        }
      </div>
    </section>
  );
}


// Services page presenting technical and digital services offered
function Services() {
  return <section className="section service-section page-section"><div className="section-intro"><PageIntro number="04" label="Services" title="Technical work grounded in people." /><p>My strongest work sits where systems, safety, and communication meet: helping people use technology with more confidence and less risk.</p></div><div className="service-list">{services.map((service, index) => <div className="service-item" key={service}><span>0{index + 1}</span><h3>{service}</h3><span></span></div>)}</div></section>;
}

// Contact page with contact information and an interactive message form

function Contact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
    setSubmitted(false);
    setError("");

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstname: form.firstName.trim(),
          lastname: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim()
        })
      });

      if (!response.ok) {
        throw new Error("Could not send your message.");
      }

      setSubmitted(true);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section contact-section page-section">
      <div className="section-intro">
        <PageIntro
          number="05"
          label="Contact me"
          title="Start with a practical question."
        />

        <p>
          Email:{" "}
          <a href="mailto:bsenfuma@my.centennialcollege.ca">
            bsenfuma@my.centennialcollege.ca
          </a>
          <br />
          Phone: <a href="tel:+14373282640">437 328 2640</a>
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            First name
            <input
              name="firstName"
              autoComplete="given-name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Last name
            <input
              name="lastName"
              autoComplete="family-name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Email address
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Contact number
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange}
            />
          </label>
        </div>

        <label>
          Message
          <textarea
            name="message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          />
        </label>

        <button
          className="primary-button"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Send Bryan a message"}
        </button>

        {submitted && (
          <p className="form-success" role="status">
            Thank you. Your message has been sent successfully.
          </p>
        )}

        {error && (
          <p role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}

  // Export components for use in the application's route configuration
  export { Layout, Home, About, Projects, Education, Services, Contact };
