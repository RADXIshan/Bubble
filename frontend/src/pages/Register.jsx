import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router'
import { UserPlus, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    setLoading(true)
    try {
      await register({ email, password })
    } catch (e) {
      toast.error('Registration failed. Email may already be in use.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-gray-900 rounded-3xl shadow-2xl p-10 border border-gray-800">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl float-animation">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Create Account</h1>
            <p className="text-gray-400 mt-2">Join MyGram today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-white placeholder-gray-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-white placeholder-gray-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition"
                >
                  {showPassword ? <Eye className="cursor-pointer duration-300 w-5 h-5" /> : <EyeOff className="cursor-pointer duration-300 w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-white placeholder-gray-500"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition"
                >
                  {showConfirmPassword ? <Eye className="cursor-pointer duration-300 w-5 h-5" /> : <EyeOff className="cursor-pointer duration-300 w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer duration-300 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-ripple transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="cursor-pointer duration-300 text-cyan-400 hover:text-cyan-300 font-bold underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register