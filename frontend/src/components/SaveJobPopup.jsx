import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SaveJobPopup({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
        <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Job Saved Successfully
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          This job has been added to your saved jobs list.
        </p>
        <button
          onClick={() => {
            onClose();
            navigate("/saved-jobs");
          }}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition mb-2"
        >
          Go to Saved Jobs
        </button>
        <button
          onClick={onClose}
          className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition"
        >
          Continue Browsing
        </button>
      </div>
    </div>
  );
}
