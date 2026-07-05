import { useState } from "react";
import { X } from "lucide-react";

const emptyJobForm = {
  title: "",
  company: "",
  location: "",
  salary: "",
  description: "",
  requirements: "",
  category: "",
  experienceLevel: "Junior",
  type: "Remote",
  status: "active",
  jobImage: "",
  companyLogo: "",
  companyWebsite: "",
  companySize: "",
  companyDescription: "",
};

const formatSalary = (job) => {
  if (!job?.salaryMin && !job?.salaryMax) return "";
  if (!job.salaryMax) return String(job.salaryMin);
  return `${job.salaryMin} - ${job.salaryMax}`;
};

const getInitialFormData = (initialData) => {
  if (!initialData) return emptyJobForm;

  return {
    ...emptyJobForm,
    ...initialData,
    salary: initialData.salary || formatSalary(initialData),
    requirements: initialData.skills ? initialData.skills.join("\n") : "",
    type: initialData.workType || initialData.type || "Remote",
    status: initialData.status || (initialData.isActive ? "active" : "expired"),
  };
};

export default function JobFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(() => getInitialFormData(initialData));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        [name]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4">
      <div className="max-h-screen w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-zinc-950">
            {initialData ? "Edit Job" : "Add New Job"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-600 transition hover:bg-zinc-100"
            aria-label="Close job form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">
                Category *
              </label>
              <input
                type="text"
                name="category"
                placeholder="e.g., Engineering, Design, Marketing"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">
                Salary Range
              </label>
              <input
                type="text"
                name="salary"
                placeholder="e.g., $50k - $80k"
                value={formData.salary}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">
                Work Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">
                Experience Level *
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Internship">Internship</option>
                <option value="Entry">Entry</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-zinc-200 pt-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">
                Job Image
              </label>
              <input
                type="file"
                name="jobImage"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-teal-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-teal-800"
              />
              {formData.jobImage && (
                <img
                  src={formData.jobImage}
                  alt="Job preview"
                  className="mt-3 h-28 w-full rounded-md border border-zinc-200 object-cover"
                />
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">
                Company Logo
              </label>
              <input
                type="file"
                name="companyLogo"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-teal-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-teal-800"
              />
              {formData.companyLogo && (
                <img
                  src={formData.companyLogo}
                  alt="Company logo preview"
                  className="mt-3 h-28 w-full rounded-md border border-zinc-200 object-contain p-3"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-zinc-200 pt-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">
                Company Website
              </label>
              <input
                type="url"
                name="companyWebsite"
                placeholder="https://company.com"
                value={formData.companyWebsite}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">
                Company Size
              </label>
              <input
                type="text"
                name="companySize"
                placeholder="e.g., 100-500"
                value={formData.companySize}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-800">
              Company Description
            </label>
            <textarea
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              rows="3"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-800">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-800">
              Requirements *
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="4"
              placeholder="List requirements (one per line)"
              className={inputClass}
              required
            />
          </div>

          <div className="flex gap-3 border-t border-zinc-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-zinc-300 px-4 py-2.5 font-semibold text-zinc-800 transition hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-teal-700 px-4 py-2.5 font-semibold text-white transition hover:bg-teal-800"
            >
              {initialData ? "Update Job" : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
