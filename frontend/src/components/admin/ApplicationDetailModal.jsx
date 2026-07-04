import { X, FileText, Mail, Phone, MapPin } from "lucide-react";

export default function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
  onStatusChange,
}) {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            Application Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Candidate Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Candidate Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="text-gray-900 font-semibold">
                  {application.candidateName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900 font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {application.candidateEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-gray-900 font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {application.candidatePhone || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="text-gray-900 font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {application.candidateLocation || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Job Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Job Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Position</p>
                <p className="text-gray-900 font-semibold">
                  {application.jobTitle}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Company</p>
                <p className="text-gray-900 font-semibold">
                  {application.company}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="text-gray-900 font-semibold">
                  {application.jobLocation}
                </p>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Cover Letter
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
              {application.coverLetter || "No cover letter provided"}
            </div>
          </div>

          {/* Resume */}
          {application.resume && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resume</h3>
              <a
                href={application.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                <FileText className="w-5 h-5" />
                View Resume
              </a>
            </div>
          )}

          {/* Application Date */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">Applied on</p>
            <p className="text-gray-900 font-semibold">
              {new Date(application.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Status Change */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Update Status
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => onStatusChange(application._id, "pending")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  application.status === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => onStatusChange(application._id, "accepted")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  application.status === "accepted"
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                Accept
              </button>
              <button
                onClick={() => onStatusChange(application._id, "rejected")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  application.status === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                Reject
              </button>
            </div>
          </div>

          {/* Close Button */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={onClose}
              className="w-full px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
