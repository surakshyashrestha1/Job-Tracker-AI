import { useEffect, useState } from "react";
import AuthScreen from "./AuthScreen.jsx";
import JobBoard from "./JobBoard.jsx";
import ResumeMatcher from "./ResumeMatcher.jsx";

const emptyForm = {
  company: "",
  role: "",
  status: "Saved",
};

const statuses = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Get applications from MongoDB through Express
  async function loadJobs() {
    try {
      setLoading(true);
      const response = await fetch("/api/jobs");

      if (!response.ok) {
        throw new Error("Could not fetch applications");
      }

      const data = await response.json();
      setJobs(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  // Handle form input changes
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Add or update a job
  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const isEditing = Boolean(editingId);

      const url = isEditing ? `/api/jobs/${editingId}` : "/api/jobs";

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to save job");
      }

      setMessage(
        isEditing ? "Job updated successfully!" : "Job added successfully!",
      );

      setForm({ ...emptyForm });
      setEditingId(null);
      await loadJobs();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Start editing a selected application
  function editJob(job) {
    setEditingId(job._id);

    setForm({
      company: job.company,
      role: job.role,
      status: job.status,
    });

    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Delete application
  async function deleteJob(job) {
    const confirmed = window.confirm(`Delete application from ${job.company}?`);

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/jobs/${job._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      if (editingId === job._id) {
        setEditingId(null);
        setForm({ ...emptyForm });
      }

      setMessage("Job deleted successfully!");
      await loadJobs();
    } catch (err) {
      setError(err.message);
    }
  }

  async function changeStatus(job, newStatus) {
    if (job.status === newStatus) return;

    try {
      setError("");

      const response = await fetch(`/api/jobs/${job._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not update status");
      }

      await loadJobs();
      setMessage("Job status updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  }

  const stats = [
    {
      title: "Total Applications",
      count: jobs.length,
    },
    {
      title: "Interviews",
      count: jobs.filter((job) => job.status === "Interview").length,
    },
    {
      title: "Offers",
      count: jobs.filter((job) => job.status === "Offer").length,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <main className="mx-auto max-w-6xl">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">JobTracker AI</h1>
          <p className="mt-2 text-slate-500">
            Track, manage and improve your job search.
          </p>
        </header>

        {/* Dashboard */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.title} className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">{stat.title}</p>
              <h2 className="mt-3 text-3xl font-bold">{stat.count}</h2>
            </div>
          ))}
        </div>

        {/* Add / Edit form */}
        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Job" : "Add New Job"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium">
                Company Name
              </label>

              <input
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Example Tech"
                required
                minLength={2}
                maxLength={100}
                className="mt-2 w-full rounded-lg border border-slate-300 p-3"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium">
                Job Role
              </label>

              <input
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="e.g. React Developer"
                required
                minLength={2}
                maxLength={100}
                className="mt-2 w-full rounded-lg border border-slate-300 p-3"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium">
                Application Status
              </label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 p-3"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Job" : "Add Job"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ ...emptyForm });
                  }}
                  className="rounded-lg border border-slate-300 px-6 py-3"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {error && <p className="mt-4 text-red-600">{error}</p>}

          {message && <p className="mt-4 text-green-600">{message}</p>}
        </section>

        {/* Job board: search, filters, list/board, edit and delete */}
        {loading && (
          <p className="mt-8 text-slate-500">Loading applications...</p>
        )}
        <JobBoard
          jobs={jobs}
          onEdit={editJob}
          onDelete={deleteJob}
          onStatusChange={changeStatus}
        />
        <ResumeMatcher />
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check whether user is already logged in
  useEffect(() => {
    let active = true;

    async function checkLogin() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "same-origin",
        });

        if (!response.ok) {
          if (active) setUser(null);
          return;
        }

        const data = await response.json();

        if (active) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Session check failed:", error);

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setCheckingAuth(false);
        }
      }
    }

    checkLogin();

    return () => {
      active = false;
    };
  }, []);

  // Log out current user
  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
    } catch (error) {
      alert(error.message);
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking login session...
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthenticated={setUser} />;
  }

  return (
    <>
      <div className="bg-slate-100 px-6 pt-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="text-sm text-slate-600">Welcome, {user.name}</p>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>

      <Dashboard />
    </>
  );
}

export default App;
