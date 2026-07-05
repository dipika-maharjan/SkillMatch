import { X } from "lucide-react";

export default function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
  onStatusChange,
}) {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4">
      <div className="max-h-screen w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-zinc-950">Application Details</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-600 transition hover:bg-zinc-100"
            aria-label="Close application details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-teal-800">
                  Current Status
                </p>
                <p className="mt-1 text-lg font-semibold capitalize text-zinc-950">
                  {application.status}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onStatusChange(application._id, "pending")}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    application.status === "pending"
                      ? "bg-amber-600 text-white"
                      : "bg-white text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => onStatusChange(application._id, "accepted")}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    application.status === "accepted"
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  Accept
                </button>
                <button
                  onClick={() => onStatusChange(application._id, "rejected")}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    application.status === "rejected"
                      ? "bg-rose-600 text-white"
                      : "bg-white text-rose-800 ring-1 ring-rose-200 hover:bg-rose-100"
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-zinc-950">
              Candidate Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-500">Full Name</p>
                <p className="font-semibold text-zinc-950">
                  {application.candidateName}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Email</p>
                <p className="font-semibold text-zinc-950">
                  {application.candidateEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Phone</p>
                <p className="font-semibold text-zinc-950">
                  {application.candidatePhone || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Location</p>
                <p className="font-semibold text-zinc-950">
                  {application.candidateLocation || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-6">
            <h3 className="mb-4 text-base font-semibold text-zinc-950">
              Job Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="text-sm text-zinc-500">Position</p>
                <p className="font-semibold text-zinc-950">
                  {application.jobTitle}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Company</p>
                <p className="font-semibold text-zinc-950">
                  {application.company}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Location</p>
                <p className="font-semibold text-zinc-950">
                  {application.jobLocation}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-6">
            <h3 className="mb-4 text-base font-semibold text-zinc-950">
              Cover Letter
            </h3>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
              {application.coverLetter || "No cover letter provided"}
            </div>
          </div>

          {application.resume && (
            <div className="border-t border-zinc-200 pt-6">
              <h3 className="mb-4 text-base font-semibold text-zinc-950">
                Resume
              </h3>
              <a
                href={application.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-teal-700 hover:text-teal-800"
              >
                View Resume
              </a>
            </div>
          )}

          <div className="border-t border-zinc-200 pt-6">
            <p className="text-sm text-zinc-500">Applied on</p>
            <p className="font-semibold text-zinc-950">
              {new Date(application.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="border-t border-zinc-200 pt-6">
            <button
              onClick={onClose}
              className="w-full rounded-md bg-zinc-200 px-6 py-2.5 font-semibold text-zinc-900 transition hover:bg-zinc-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
