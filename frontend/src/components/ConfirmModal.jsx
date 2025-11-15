import { X } from 'lucide-react'

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null

  const typeStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-cyan-600 hover:bg-cyan-700'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-800 animate-scale-in">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="cursor-pointer duration-300 text-gray-400 hover:text-white transition p-1 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <p className="text-gray-300 text-lg mb-6">{message}</p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer duration-300 flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold transition"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={`flex-1 ${typeStyles[type]} cursor-pointer duration-300 text-white px-4 py-3 rounded-xl font-semibold transition shadow-lg`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
