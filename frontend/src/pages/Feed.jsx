import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Trash2, User, Loader2, Image as ImageIcon, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import ConfirmModal from '../components/ConfirmModal'

const Feed = () => {
  const { logout } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)

  const fetchPosts = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    
    try {
      const res = await api.get('/feed')
      setPosts(res.data.posts || [])
      if (isRefresh) toast.success('Feed refreshed!')
    } catch (error) {
      toast.error('Failed to load feed')
      logout()
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDeleteClick = (post) => {
    setPostToDelete(post)
    setDeleteModalOpen(true)
  }

  const deletePost = async () => {
    if (!postToDelete) return
    
    try {
      await api.delete(`/post/${postToDelete.id}`)
      setPosts(prev => prev.filter(p => p.id !== postToDelete.id))
      toast.success('Post deleted successfully')
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg font-semibold">Loading feed...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Feed</h1>
          <button
            onClick={() => fetchPosts(true)}
            disabled={refreshing}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-5 py-3 rounded-xl shadow-lg transition disabled:opacity-50 border border-gray-700"
          >
            <RefreshCw className={`cursor-pointer duration-300 w-5 h-5 text-cyan-400 ${refreshing ? 'cursor-pointer duration-300 animate-spin' : 'cursor-pointer duration-300'}`} />
            <span className="cursor-pointer duration-300 font-semibold text-white">Refresh</span>
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="bg-gray-900 rounded-3xl shadow-2xl p-16 text-center border border-gray-800">
            <div className="bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-12 h-12 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No posts yet</h2>
            <p className="text-gray-400 text-lg">Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden card-hover border border-gray-800">
                <div className="p-5 flex items-center justify-between bg-gray-800/50">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{post.email}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {post.is_owner && (
                    <button
                      onClick={() => handleDeleteClick(post)}
                      className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/20 p-3 rounded-xl transition"
                      title="Delete post"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="bg-black">
                  {post.file_type === 'photo' ? (
                    <img
                      src={post.url}
                      alt={post.file_name}
                      className="w-full max-h-[600px] object-contain"
                    />
                  ) : (
                    <video
                      src={post.url}
                      controls
                      className="w-full max-h-[600px]"
                    />
                  )}
                </div>

                {post.caption && (
                  <div className="p-5 bg-gray-800/50">
                    <p className="text-gray-200 text-lg">{post.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setPostToDelete(null)
        }}
        onConfirm={deletePost}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

export default Feed