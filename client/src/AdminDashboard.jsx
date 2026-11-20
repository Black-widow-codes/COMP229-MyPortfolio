
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const emptyProject = {
  title: "",
  type: "",
  description: "",
  outcome: "",
  image: "",
  url: "",
  completion: ""
};

const emptyQualification = {
  title: "",
  period: "",
  institution: "",
  description: ""
};

function AdminDashboard() {
  const [auth] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("jwt"));
    } catch {
      return null;
    }
  });

  const isAdmin =
    Boolean(auth?.token) &&
    auth?.user?.role === "admin";

  // Projects state
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [projectSuccess, setProjectSuccess] = useState("");
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectDeletingId, setProjectDeletingId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    ...emptyProject
  });
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Qualifications state
  const [qualifications, setQualifications] = useState([]);
  const [qualificationsLoading, setQualificationsLoading] =
    useState(true);
  const [qualificationError, setQualificationError] = useState("");
  const [qualificationSuccess, setQualificationSuccess] =
    useState("");
  const [qualificationSaving, setQualificationSaving] =
    useState(false);
  const [qualificationDeletingId, setQualificationDeletingId] =
    useState(null);
  const [qualificationForm, setQualificationForm] = useState({
    ...emptyQualification
  });
  const [editingQualificationId, setEditingQualificationId] =
    useState(null);

  // Load projects and qualifications
  useEffect(() => {
    if (!isAdmin) {
      setProjectsLoading(false);
      setQualificationsLoading(false);
      return;
    }

    async function loadProjects() {
      try {
        const response = await fetch("/api/projects");

        if (!response.ok) {
          throw new Error("Could not load projects.");
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setProjectError(err.message);
      } finally {
        setProjectsLoading(false);
      }
    }

    async function loadQualifications() {
      try {
        const response = await fetch("/api/qualifications");

        if (!response.ok) {
          throw new Error("Could not load qualifications.");
        }

        const data = await response.json();
        setQualifications(data);
      } catch (err) {
        setQualificationError(err.message);
      } finally {
        setQualificationsLoading(false);
      }
    }

    loadProjects();
    loadQualifications();
  }, [isAdmin]);

  // PROJECTS CRUD

  function handleProjectChange(event) {
    const { name, value } = event.target;

    setProjectForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function handleEditProject(project) {
    setEditingProjectId(project._id);
    setProjectForm({
      title: project.title || "",
      type: project.type || "",
      description: project.description || "",
      outcome: project.outcome || "",
      image: project.image || "",
      url: project.url || "",
      completion: project.completion
        ? project.completion.slice(0, 10)
        : ""
    });

    setProjectError("");
    setProjectSuccess("");
  }

  function handleCancelProjectEdit() {
    setEditingProjectId(null);
    setProjectForm({ ...emptyProject });
    setProjectError("");
    setProjectSuccess("");
  }

  async function handleProjectSubmit(event) {
    event.preventDefault();

    if (projectSaving || projectDeletingId) return;

    setProjectSaving(true);
    setProjectError("");
    setProjectSuccess("");

    try {
      const data = {
        title: projectForm.title.trim(),
        type: projectForm.type.trim(),
        description: projectForm.description.trim(),
        outcome: projectForm.outcome.trim(),
        image: projectForm.image.trim(),
        url: projectForm.url.trim(),
        completion: projectForm.completion || null
      };

      const isEditing = Boolean(editingProjectId);
      const endpoint = isEditing
        ? `/api/projects/${editingProjectId}`
        : "/api/projects";

      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Could not save project."
        );
      }

      if (isEditing) {
        setProjects((previous) =>
          previous.map((project) =>
            project._id === result._id ? result : project
          )
        );
        setProjectSuccess(
          `Project "${result.title}" updated successfully.`
        );
      } else {
        setProjects((previous) => [...previous, result]);
        setProjectSuccess(
          `Project "${result.title}" saved successfully.`
        );
      }

      setEditingProjectId(null);
      setProjectForm({ ...emptyProject });
    } catch (err) {
      setProjectError(err.message);
    } finally {
      setProjectSaving(false);
    }
  }

  async function handleDeleteProject(project) {
    if (projectSaving || projectDeletingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setProjectDeletingId(project._id);
    setProjectError("");
    setProjectSuccess("");

    try {
      const response = await fetch(
        `/api/projects/${project._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Could not delete project."
        );
      }

      setProjects((previous) =>
        previous.filter((item) => item._id !== project._id)
      );

      if (editingProjectId === project._id) {
        setEditingProjectId(null);
        setProjectForm({ ...emptyProject });
      }

      setProjectSuccess(
        `Project "${project.title}" deleted successfully.`
      );
    } catch (err) {
      setProjectError(err.message);
    } finally {
      setProjectDeletingId(null);
    }
  }

  // QUALIFICATIONS CRUD

  function handleQualificationChange(event) {
    const { name, value } = event.target;

    setQualificationForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function handleEditQualification(qualification) {
    setEditingQualificationId(qualification._id);

    setQualificationForm({
      title: qualification.title || "",
      period: qualification.period || "",
      institution: qualification.institution || "",
      description: qualification.description || ""
    });

    setQualificationError("");
    setQualificationSuccess("");
  }

  function handleCancelQualificationEdit() {
    setEditingQualificationId(null);
    setQualificationForm({ ...emptyQualification });
    setQualificationError("");
    setQualificationSuccess("");
  }

  async function handleQualificationSubmit(event) {
    event.preventDefault();

    if (qualificationSaving || qualificationDeletingId) return;

    setQualificationSaving(true);
    setQualificationError("");
    setQualificationSuccess("");

    try {
      const data = {
        title: qualificationForm.title.trim(),
        period: qualificationForm.period.trim(),
        institution: qualificationForm.institution.trim(),
        description: qualificationForm.description.trim()
      };

      const isEditing = Boolean(editingQualificationId);
      const endpoint = isEditing
        ? `/api/qualifications/${editingQualificationId}`
        : "/api/qualifications";

      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Could not save qualification."
        );
      }

      if (isEditing) {
        setQualifications((previous) =>
          previous.map((qualification) =>
            qualification._id === result._id
              ? result
              : qualification
          )
        );

        setQualificationSuccess(
          `Qualification "${result.title}" updated successfully.`
        );
      } else {
        setQualifications((previous) => [...previous, result]);

        setQualificationSuccess(
          `Qualification "${result.title}" saved successfully.`
        );
      }

      setEditingQualificationId(null);
      setQualificationForm({ ...emptyQualification });
    } catch (err) {
      setQualificationError(err.message);
    } finally {
      setQualificationSaving(false);
    }
  }

  async function handleDeleteQualification(qualification) {
    if (qualificationSaving || qualificationDeletingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${qualification.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setQualificationDeletingId(qualification._id);
    setQualificationError("");
    setQualificationSuccess("");

    try {
      const response = await fetch(
        `/api/qualifications/${qualification._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Could not delete qualification."
        );
      }

      setQualifications((previous) =>
        previous.filter(
          (item) => item._id !== qualification._id
        )
      );

      if (editingQualificationId === qualification._id) {
        setEditingQualificationId(null);
        setQualificationForm({ ...emptyQualification });
      }

      setQualificationSuccess(
        `Qualification "${qualification.title}" deleted successfully.`
      );
    } catch (err) {
      setQualificationError(err.message);
    } finally {
      setQualificationDeletingId(null);
    }
  }

  if (!isAdmin) {
    return (
      <section className="section page-section">
        <h1 className="page-title">Access denied</h1>
        <p>Administrator access is required.</p>
        <Link to="/signin">Sign in</Link>
      </section>
    );
  }

  return (
    <section className="section page-section">
      <div className="section-intro">
        <h1 className="page-title">
          Administrator Dashboard
        </h1>
        <p>Manage portfolio projects and qualifications.</p>
      </div>

      {/* PROJECTS SECTION */}
      <h2>Projects Management</h2>

      {projectsLoading && <p>Loading projects...</p>}

      {projectError && (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {projectError}
        </p>
      )}

      {projectSuccess && (
        <p role="status" style={{ color: "#166534" }}>
          {projectSuccess}
        </p>
      )}

      {!projectsLoading && (
        <div>
          {projects.map((project) => (
            <div className="timeline-item" key={project._id}>
              <div>
                <h3>{project.title}</h3>
                <p>{project.type}</p>

                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginTop: "0.5rem"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleEditProject(project)}
                    disabled={
                      projectSaving ||
                      Boolean(projectDeletingId)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteProject(project)}
                    disabled={
                      projectSaving ||
                      Boolean(projectDeletingId)
                    }
                  >
                    {projectDeletingId === project._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h2>
          {editingProjectId
            ? "Edit Project"
            : "Add New Project"}
        </h2>

        <form
          onSubmit={handleProjectSubmit}
          style={{
            display: "grid",
            gap: "1rem",
            maxWidth: "650px",
            marginTop: "1rem"
          }}
        >
          <label>
            Project Title *
            <input
              type="text"
              name="title"
              value={projectForm.title}
              onChange={handleProjectChange}
              required
            />
          </label>

          <label>
            Project Type *
            <input
              type="text"
              name="type"
              value={projectForm.type}
              onChange={handleProjectChange}
              required
            />
          </label>

          <label>
            Description *
            <textarea
              name="description"
              value={projectForm.description}
              onChange={handleProjectChange}
              required
              rows="4"
            />
          </label>

          <label>
            Outcome
            <textarea
              name="outcome"
              value={projectForm.outcome}
              onChange={handleProjectChange}
              rows="3"
            />
          </label>

          <label>
            Image Path
            <input
              type="text"
              name="image"
              value={projectForm.image}
              onChange={handleProjectChange}
              placeholder="/projects/example.png"
            />
          </label>

          <label>
            Project URL
            <input
              type="url"
              name="url"
              value={projectForm.url}
              onChange={handleProjectChange}
              placeholder="https://github.com/..."
            />
          </label>

          <label>
            Completion Date
            <input
              type="date"
              name="completion"
              value={projectForm.completion}
              onChange={handleProjectChange}
            />
          </label>

          <button
            type="submit"
            disabled={
              projectSaving ||
              Boolean(projectDeletingId)
            }
          >
            {projectSaving
              ? "Saving..."
              : editingProjectId
                ? "Update Project"
                : "Save Project"}
          </button>

          {editingProjectId && (
            <button
              type="button"
              onClick={handleCancelProjectEdit}
              disabled={projectSaving}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* QUALIFICATIONS SECTION */}
      <div style={{ marginTop: "3rem" }}>
        <h2>Qualifications Management</h2>

        {qualificationsLoading && (
          <p>Loading qualifications...</p>
        )}

        {qualificationError && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {qualificationError}
          </p>
        )}

        {qualificationSuccess && (
          <p role="status" style={{ color: "#166534" }}>
            {qualificationSuccess}
          </p>
        )}

        {!qualificationsLoading && (
          <div>
            {qualifications.map((qualification) => (
              <div
                className="timeline-item"
                key={qualification._id}
              >
                <div>
                  <h3>{qualification.title}</h3>
                  <p>{qualification.period}</p>
                  <p>{qualification.institution}</p>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      marginTop: "0.5rem"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleEditQualification(qualification)
                      }
                      disabled={
                        qualificationSaving ||
                        Boolean(qualificationDeletingId)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteQualification(qualification)
                      }
                      disabled={
                        qualificationSaving ||
                        Boolean(qualificationDeletingId)
                      }
                    >
                      {qualificationDeletingId === qualification._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "2rem" }}>
          <h2>
            {editingQualificationId
              ? "Edit Qualification"
              : "Add New Qualification"}
          </h2>

          <form
            onSubmit={handleQualificationSubmit}
            style={{
              display: "grid",
              gap: "1rem",
              maxWidth: "650px",
              marginTop: "1rem"
            }}
          >
            <label>
              Qualification Title *
              <input
                type="text"
                name="title"
                value={qualificationForm.title}
                onChange={handleQualificationChange}
                required
              />
            </label>

            <label>
              Period *
              <input
                type="text"
                name="period"
                value={qualificationForm.period}
                onChange={handleQualificationChange}
                placeholder="2026 or Expected 2028"
                required
              />
            </label>

            <label>
              Institution *
              <input
                type="text"
                name="institution"
                value={qualificationForm.institution}
                onChange={handleQualificationChange}
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={qualificationForm.description}
                onChange={handleQualificationChange}
                rows="3"
              />
            </label>

            <button
              type="submit"
              disabled={
                qualificationSaving ||
                Boolean(qualificationDeletingId)
              }
            >
              {qualificationSaving
                ? "Saving..."
                : editingQualificationId
                  ? "Update Qualification"
                  : "Save Qualification"}
            </button>

            {editingQualificationId && (
              <button
                type="button"
                onClick={handleCancelQualificationEdit}
                disabled={qualificationSaving}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
