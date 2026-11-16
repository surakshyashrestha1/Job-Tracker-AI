import { useMemo, useState } from "react";

const statuses = [
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

function JobBoard({
  jobs,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("board");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const text =
        `${job.company} ${job.role}`.toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase().trim()
      );

      const matchesStatus =
        filter === "All" || job.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, filter]);

  function renderJob(job) {
    return (
      <div
        key={job._id}
        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <h3 className="font-semibold text-slate-900">
          {job.company}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {job.role}
        </p>

        <select
          value={job.status}
          onChange={(e) =>
            onStatusChange(job, e.target.value)
          }
          className="mt-3 w-full rounded-lg border border-slate-300 p-2 text-sm"
          aria-label={`Status for ${job.company}`}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(job)}
            className="rounded-lg bg-amber-100 px-3 py-2 text-sm text-amber-800"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(job)}
            className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">
          Job Applications Board
        </h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("board")}
            className={`rounded-lg px-4 py-2 text-sm ${
              view === "board"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            Board
          </button>

          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-lg px-4 py-2 text-sm ${
              view === "list"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            List
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input
          type="search"
          placeholder="Search company or job role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 p-3"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded-lg border border-slate-300 p-3"
        >
          <option value="All">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </p>

      {view === "board" ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {statuses.map((status) => {
            const columnJobs = filteredJobs.filter(
              (job) => job.status === status
            );

            return (
              <div
                key={status}
                className="min-w-0 rounded-xl bg-slate-100 p-3"
              >
                <h3 className="mb-4 font-semibold">
                  {status} ({columnJobs.length})
                </h3>

                <div className="space-y-3">
                  {columnJobs.map(renderJob)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {filteredJobs.map(renderJob)}
        </div>
      )}

      {filteredJobs.length === 0 && (
        <p className="mt-5 text-center text-slate-500">
          No matching job applications.
        </p>
      )}
    </section>
  );
}

export default JobBoard;