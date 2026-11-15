export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // "danger" | "warning" | "info"
  loading = false,
}) {
  if (!isOpen) return null;

  const variantColors = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
    info: "bg-blue-600 hover:bg-blue-700 text-white",
  };

  const iconBg = {
    danger: "bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400",
    warning: "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
    info: "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
  };

  const icons = {
    danger: "⚠️",
    warning: "❓",
    info: "ℹ️",
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl transition-all">
        <div className={`w-12 h-12 rounded-full ${iconBg[variant] || iconBg.danger} flex items-center justify-center text-2xl mb-4`}>
          {icons[variant] || "⚠️"}
        </div>
        <h3 className="text-xl font-bold font-['Syne'] text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border-none cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-colors border-none cursor-pointer flex items-center gap-2 ${variantColors[variant] || variantColors.danger} disabled:opacity-50`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
