import { X, AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-zinc-200">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
              <p className="mt-1 text-sm text-zinc-600">{message}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
