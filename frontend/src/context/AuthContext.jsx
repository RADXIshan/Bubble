import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import api from '../utils/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!token)

  // Attach auth header
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  // Fetch current user if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await api.get('/users/me')
        setUser(res.data)
      } catch (e) {
        console.error('Failed to fetch user:', e)
        logout()
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [token])

  const login = async ({ email, password }) => {
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)

    const res = await api.post('/auth/jwt/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    const access = res.data?.access_token
    if (access) {
      localStorage.setItem('token', access)
      setToken(access)
      toast.success('Welcome back!')
      navigate('/feed')
    }
  }

  const register = async ({ email, password }) => {
    await api.post('/auth/register', { email, password })
    toast.success('Account created successfully!')
    await login({ email, password })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const value = { token, user, loading, login, register, logout }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)