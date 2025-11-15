import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { Image, Upload, Users, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import api from '../utils/api'

const Home = () => {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchHealth = async () => {
      try {
        await api.get('/health')
      } catch (e) {
        console.error(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchHealth()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full filter blur-xl"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500/10 rounded-full filter blur-xl"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-500/10 rounded-full filter blur-xl"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="mb-8 flex justify-center float-animation">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-6 rounded-full shadow-2xl">
                  <Image className="w-16 h-16 text-white" />
                </div>
              </div>
              
              <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6 drop-shadow-lg">
                Welcome to Bubble
              </h1>
              
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Share your moments with the world. Upload photos and videos, connect with friends, and discover amazing content.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl card-hover border border-gray-800">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white">Easy Upload</h3>
                  <p className="text-gray-400 text-sm">Share photos and videos instantly</p>
                </div>
                
                <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl card-hover border border-gray-800">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white">Connect</h3>
                  <p className="text-gray-400 text-sm">Follow and interact with others</p>
                </div>
                
                <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl card-hover border border-gray-800">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white">Discover</h3>
                  <p className="text-gray-400 text-sm">Explore trending content</p>
                </div>
              </div>

              {!token ? (
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link 
                    to="/register" 
                    className="bg-gradient-to-r cursor-pointer duration-300 from-cyan-500 to-blue-500 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-2xl transition flex items-center gap-2 text-lg btn-ripple transform hover:scale-105"
                  >
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="cursor-pointer duration-300 bg-gray-800 text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-700 transition border border-gray-700 text-lg btn-ripple transform hover:scale-105"
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <Link 
                  to="/feed" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-2xl transition text-lg btn-ripple transform hover:scale-105"
                >
                  Go to Feed <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
