import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Upload as UploadIcon, Image as ImageIcon, Video, X, Loader2, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const Upload = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    // Validate file type
    if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
      toast.error('Please select an image or video file')
      return
    }

    // Validate file size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB')
      return
    }

    setFile(selectedFile)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(selectedFile)
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select a file')
      return
    }

    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('caption', caption)
    
    try {
      await api.post('/upload', form)
      toast.success('Posted successfully!')
      setFile(null)
      setPreview(null)
      setCaption('')
      setTimeout(() => navigate('/feed'), 1000)
    } catch (error) {
      toast.error('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-gray-900 rounded-3xl shadow-2xl p-10 border border-gray-800">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl float-animation">
              <UploadIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Upload Content</h1>
            <p className="text-gray-400 mt-2 text-lg">Share your photos and videos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!preview ? (
              <div className="border-2 border-dashed border-gray-700 rounded-2xl p-16 text-center hover:border-cyan-500 hover:bg-gray-800/50 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-gray-800 p-6 rounded-full">
                      <ImageIcon className="w-16 h-16 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white mb-2">Click to upload</p>
                      <p className="text-gray-400">Images and videos up to 50MB</p>
                    </div>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-3 right-3 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition z-10 shadow-lg"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="rounded-2xl overflow-hidden bg-black">
                  {file?.type.startsWith('image/') ? (
                    <img src={preview} alt="Preview" className="w-full max-h-96 object-contain" />
                  ) : (
                    <video src={preview} controls className="w-full max-h-96" />
                  )}
                </div>
                <div className="mt-4 flex items-center gap-3 text-sm text-white bg-gray-800 p-4 rounded-xl border border-gray-700">
                  {file?.type.startsWith('image/') ? (
                    <ImageIcon className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Video className="w-5 h-5 text-cyan-400" />
                  )}
                  <span className="font-semibold truncate">{file?.name}</span>
                  <span className="text-gray-400">({(file?.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-white mb-3">
                <FileText className="w-5 h-5 inline mr-2" />
                Caption (optional)
              </label>
              <textarea
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none text-white placeholder-gray-500"
                placeholder="Write a caption..."
                rows="3"
                value={caption}
                onChange={e => setCaption(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className="cursor-pointer duration-300 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-ripple transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5" />
                  Post
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Upload