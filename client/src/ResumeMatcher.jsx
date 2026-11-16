import { useState } from "react";

// Skills that our matching system can recognize
const SKILLS = [
  { name: "HTML", terms: ["html", "html5"] },
  { name: "CSS", terms: ["css", "css3"] },
  { name: "JavaScript", terms: ["javascript"] },
  { name: "TypeScript", terms: ["typescript"] },
  { name: "React", terms: ["react", "reactjs", "react.js"] },
  { name: "Next.js", terms: ["next.js", "nextjs"] },
  { name: "Node.js", terms: ["node.js", "nodejs"] },
  { name: "Express", terms: ["express.js", "expressjs", "express"] },
  { name: "MongoDB", terms: ["mongodb"] },
  { name: "MySQL", terms: ["mysql"] },
  { name: "PostgreSQL", terms: ["postgresql", "postgres"] },
  { name: "SQL", terms: ["sql"] },
  { name: "Python", terms: ["python"] },
  { name: "Django", terms: ["django"] },
  { name: "PHP", terms: ["php"] },
  { name: "Laravel", terms: ["laravel"] },
  { name: "Java", terms: ["java"] },
  { name: "C++", terms: ["c++"] },
  { name: "Git", terms: ["git"] },
  { name: "GitHub", terms: ["github"] },
  { name: "Docker", terms: ["docker"] },
  { name: "Kubernetes", terms: ["kubernetes"] },
  { name: "AWS", terms: ["aws", "amazon web services"] },
  { name: "Azure", terms: ["azure"] },
  { name: "REST APIs", terms: ["rest api", "rest apis", "restful api"] },
  { name: "GraphQL", terms: ["graphql"] },
  { name: "Tailwind CSS", terms: ["tailwind", "tailwind css"] },
  { name: "Figma", terms: ["figma"] },
  { name: "CI/CD", terms: ["ci/cd", "continuous integration"] },
  { name: "Cybersecurity", terms: ["cybersecurity"] },
];

// Escape characters that have special meaning in regex
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Detect whole skills/phrases rather than partial words
function containsSkill(text, term) {
  const escaped = escapeRegex(term);

  const pattern = new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i");

  return pattern.test(text);
}

function extractSkills(text) {
  return SKILLS.filter((skill) =>
    skill.terms.some((term) => containsSkill(text, term)),
  ).map((skill) => skill.name);
}

function ResumeMatcher() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleAnalyze() {
    setError("");
    setResult(null);

    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please enter both resume text and job description.");
      return;
    }

    const resumeSkills = extractSkills(resume);
    const requiredSkills = extractSkills(jobDescription);

    if (requiredSkills.length === 0) {
      setError(
        "No supported skills found in the job description. Try including technical requirements.",
      );
      return;
    }

    const matchedSkills = requiredSkills.filter((skill) =>
      resumeSkills.includes(skill),
    );

    const missingSkills = requiredSkills.filter(
      (skill) => !resumeSkills.includes(skill),
    );

    const score = Math.round(
      (matchedSkills.length / requiredSkills.length) * 100,
    );

    const suggestions =
      missingSkills.length > 0
        ? missingSkills.map(
            (skill) =>
              `If you have experience with ${skill}, describe where you used it in your resume. Otherwise, consider learning and practicing it.`,
          )
        : [
            "Your resume mentions all detected job-description skills. Review experience, education and other requirements manually.",
          ];

    setResult({
      score,
      matchedSkills,
      missingSkills,
      requiredSkills,
      suggestions,
    });
  }

  function loadExample() {
    setResume(
      "Junior Developer with experience building React and Node.js applications. Skilled in JavaScript, HTML, CSS, MongoDB, Express, REST APIs and Git. Built full-stack projects.",
    );

    setJobDescription(
      "We are hiring a Junior Full Stack Developer. Required skills: React, JavaScript, Node.js, TypeScript, MongoDB, Docker and REST APIs.",
    );

    setResult(null);
    setError("");
  }

  function clearForm() {
    setResume("");
    setJobDescription("");
    setResult(null);
    setError("");
  }

  return (
    <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Resume & Job Matching
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Compare your resume with a job description and identify matching
          keywords and missing skills.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Resume Input */}
        <div>
          <label
            htmlFor="resume-text"
            className="mb-2 block font-semibold text-slate-800"
          >
            Your Resume
          </label>

          <textarea
            id="resume-text"
            rows={8}
            value={resume}
            onChange={(e) => {
              setResume(e.target.value);
              setResult(null);
            }}
            placeholder="Paste your resume text here..."
            className="w-full rounded-lg border border-slate-300 p-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Job Description Input */}
        <div>
          <label
            htmlFor="job-description"
            className="mb-2 block font-semibold text-slate-800"
          >
            Job Description
          </label>

          <textarea
            id="job-description"
            rows={8}
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              setResult(null);
            }}
            placeholder="Paste the job description here..."
            className="w-full rounded-lg border border-slate-300 p-4 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAnalyze}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Analyze Resume Match
        </button>

        <button
          type="button"
          onClick={loadExample}
          className="rounded-lg bg-slate-100 px-5 py-3 font-medium text-slate-700 hover:bg-slate-200"
        >
          Try Example
        </button>

        <button
          type="button"
          onClick={clearForm}
          className="rounded-lg border border-slate-300 px-5 py-3 font-medium"
        >
          Clear
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Matching Results */}
      {result && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl bg-blue-50 p-6">
            <p className="font-semibold text-slate-800">
              Detected Skill Keyword Coverage
            </p>

            <h3 className="mt-2 text-4xl font-bold text-blue-700">
              {result.score}%
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              {result.matchedSkills.length} of {result.requiredSkills.length}{" "}
              detected job skills were found in your resume text.
            </p>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Matched Skills */}
            <div className="rounded-xl bg-green-50 p-5">
              <h3 className="font-semibold text-green-800">Matched Skills</h3>

              {result.matchedSkills.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {result.matchedSkills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-lg bg-white p-3 text-sm text-green-800"
                    >
                      ✓ {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-600">
                  No matching skills detected.
                </p>
              )}
            </div>

            {/* Missing Skills */}
            <div className="rounded-xl bg-amber-50 p-5">
              <h3 className="font-semibold text-amber-800">
                Skills Not Found in Resume
              </h3>

              {result.missingSkills.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {result.missingSkills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-lg bg-white p-3 text-sm text-amber-800"
                    >
                      • {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-green-700">
                  All detected skills were found!
                </p>
              )}
            </div>
          </div>

          {/* Smart Suggestions */}
          <div className="rounded-xl bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Resume Improvement Suggestions
            </h3>

            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-slate-700">
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>

            <p className="mt-5 text-xs text-slate-500">
              This is a rule-based keyword comparison, not an official ATS score
              or AI assessment. Missing keywords do not necessarily mean you
              lack those skills.
            </p>
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-slate-500">
        This component analyzes text in your browser. It does not upload or save
        resume text.
      </p>
    </section>
  );
}

export default ResumeMatcher;
