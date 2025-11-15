import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { Home, Image, Upload, LogIn, UserPlus, LogOut, User } from 'lucide-react'
import ConfirmModal from './ConfirmModal'

const Navbar = () => {
  const { token, user, logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  return (
    <nav className="bg-gray-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="cursor-pointer duration-300 flex items-center gap-3 text-2xl font-bold hover:opacity-80 transition">
          <div className="bg-cyan-500/20 p-2 rounded-xl backdrop-blur-sm border border-cyan-500/30">
            <Image className="w-7 h-7 text-cyan-400" />
          </div>
          <span className="drop-shadow-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Bubble</span>
        </Link>
        
        {token && (
          <div className="flex items-center gap-4">
            <Link to="/feed" className="duration-300 flex items-center gap-2 hover:bg-gray-800 px-4 py-2 rounded-xl transition">
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Feed</span>
            </Link>
            <Link to="/upload" className="duration-300 flex items-center gap-2 hover:bg-gray-800 px-4 py-2 rounded-xl transition">
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Upload</span>
            </Link>
            <div className="flex items-center gap-3">
              {user?.email && (
                <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl border border-gray-700">
                  <User className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm hidden sm:inline font-semibold">{user.email}</span>
                </div>
              )}
              <button 
                onClick={() => setShowLogoutModal(true)} 
                className="cursor-pointer duration-300 flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition shadow-lg font-semibold"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        )}
        
        {!token && (
          <div className="flex items-center gap-4">
            <Link to="/login" className="cursor-pointer duration-300 flex items-center gap-2 hover:bg-gray-800 px-4 py-2 rounded-xl transition font-semibold">
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </Link>
            <Link to="/register" className="flex items-center gap-2 cursor-pointer duration-300 bg-cyan-500 text-white px-5 py-2.5 rounded-xl hover:bg-cyan-600 transition font-bold shadow-lg">
              <UserPlus className="w-5 h-5" />
              <span>Sign Up</span>
            </Link>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        type="danger"
      />
    </nav>
  )
}

export default Navbar