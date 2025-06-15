import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react"

const ConfirmModal = ({
  isOpen,
  // onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmColor = "red",
  type = "error",
}) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-green-500" />
      case "info":
        return <Info className="w-6 h-6 text-blue-500" />
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case "error":
      default:
        return <AlertCircle className="w-6 h-6 text-red-500" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-gray-900 rounded-xl p-6 max-w-sm w-full border border-gray-700">
        <div className="flex items-center mb-4 space-x-3">
          {getIcon()}
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <p className="text-gray-300 mb-6 text-sm">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              confirmColor === "green"
                ? "bg-green-500 hover:bg-green-600"
                : confirmColor === "blue"
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
