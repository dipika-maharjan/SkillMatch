import { LogOut, X } from "lucide-react";

export default function LogoutModal({
  showConfirmLogout,
  showSuccessLogout,
  onConfirm,
  onCancel,
  onReturnToLogin,
  onGoToHomepage,
}) {
  if (!showConfirmLogout && !showSuccessLogout) return null;

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <LogOut className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-8">
              Are you sure you want to logout?
            </h3>
            <div className="flex gap-4">
              <button
                onClick={onConfirm}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={onCancel}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logged Out Success Modal */}
      {showSuccessLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl relative">
            <button
              onClick={onGoToHomepage}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mx-auto w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2 relative">
              <LogOut className="w-8 h-8 translate-x-1" />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center border-2 border-white">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="py-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                You've been Logged Out
              </h3>
              <p className="text-gray-500 text-sm mb-8">
                You have been successfully logged out of your account. We'll see
                you again soon!
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={onReturnToLogin}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Return to Login
              </button>
              <button
                onClick={onGoToHomepage}
                className="w-full border border-gray-300 hover:bg-gray-50 text-indigo-600 font-semibold py-3 rounded-xl transition"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
