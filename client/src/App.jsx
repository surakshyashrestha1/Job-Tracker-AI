import { useEffect, useState } from "react";

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get jobs from Express backend
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs");

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();

        setJobs(data);
      } catch (err) {
        setError("Unable to connect to backend.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  // Calculate dashboard statistics
  const stats = [
    {
      title: "Total Applications",
      count: jobs.length,
    },
    {
      title: "Interviews",
      count: jobs.filter(
        (job) => job.status === "Interview"
      ).length,
    },
    {
      title: "Offers",
      count: jobs.filter(
        (job) => job.status === "Offer"
      ).length,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            JobTracker AI
          </h1>

          <p className="mt-2 text-slate-500">
            Track, manage and improve your job search.
          </p>
        </header>

        {/* Dashboard cards */}
        <div className="grid gap-5 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-slate-500">
                {stat.title}
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {stat.count}
              </h2>
            </div>
          ))}
        </div>

        {/* Applications list */}
        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            My Job Applications
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            Demo data from Express API
          </p>

          {loading && (
            <p className="mt-4 text-slate-500">
              Loading applications...
            </p>
          )}

          {error && (
            <p className="mt-4 text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && jobs.length === 0 && (
            <p className="mt-4 text-slate-500">
              No job applications yet.
            </p>
          )}

          <div className="mt-5 space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <h3 className="font-semibold text-slate-900">
                  {job.company}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {job.role}
                </p>

                <p className="mt-2 text-sm font-medium text-blue-600">
                  {job.status}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default App;