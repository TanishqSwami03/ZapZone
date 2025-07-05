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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4"
    >
      <div 
        className="rounded-xl p-6 max-w-sm w-full border border-gray-700"
        style={{
          background: "#000000",
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
          `,
          backgroundSize: "20px 20px, 30px 30px, 25px 25px",
          backgroundPosition: "0 0, 10px 10px, 15px 5px",
        }}
      >
        <div className="flex items-center mb-4 space-x-3">
          {getIcon()}
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <p className="text-gray-300 mb-6 text-md">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onConfirm}
            className={`w-fit px-4 py-2 rounded-md text-md font-medium text-white ${
              confirmColor === "green"
                ? "bg-gradient-to-r via-green-800 hover:scale-110"
                : confirmColor === "blue"
                ? "bg-gradient-to-r via-blue-800 hover:scale-110"
                : "bg-gradient-to-r via-red-800 hover:scale-110"
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
