import { useState } from 'react'
import { Share2, Plus, Filter, Search, Eye, Edit, Trash2, ExternalLink } from 'lucide-react'
import { useQuery } from 'react-query'
import toast from 'react-hot-toast'

interface Post {
  id: string
  content: string
  platform: string
  ai_generated: boolean
  posted: boolean
}

const Posts = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: posts, isLoading, refetch } = useQuery<Post[]>(
    'posts',
    async () => {
      const response = await fetch('/api/posts/')
      if (!response.ok) throw new Error('Gönderiler yüklenemedi')
      return response.json()
    }
  )

  const handlePublishPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/publish`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Yayınlama başarısız')
      
      const result = await response.json()
      toast.success(result.message)
      refetch()
    } catch (error) {
      toast.error('Yayınlama hatası: ' + (error as Error).message)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Bu gönderiyi silmek istediğinizden emin misiniz?')) return
    
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Silme başarısız')
      
      toast.success('Gönderi silindi')
      refetch()
    } catch (error) {
      toast.error('Silme hatası: ' + (error as Error).message)
    }
  }

  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform
    return matchesSearch && matchesPlatform
  }) || []

  const stats = {
    total: posts?.length || 0,
    published: posts?.filter(p => p.posted).length || 0,
    draft: posts?.filter(p => !p.posted).length || 0,
    ai_generated: posts?.filter(p => p.ai_generated).length || 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sosyal Medya Gönderilerim</h1>
          <p className="text-gray-600 mt-2">AI ile oluşturduğunuz gönderileri yönetin ve paylaşın.</p>
        </div>
        <button className="btn-primary flex items-center space-x-2 mt-4 md:mt-0">
          <Plus className="w-4 h-4" />
          <span>Yeni Gönderi Oluştur</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Gönderi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Share2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yayınlanan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
            </div>
            <Share2 className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taslak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
            </div>
            <Share2 className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Üretimi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ai_generated}</p>
            </div>
            <Share2 className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Gönderi ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="input-field"
            >
              <option value="all">Tüm Platformlar</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtrele</span>
          </button>
        </div>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="card">
              <div className="flex space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  post.platform === 'twitter' ? 'bg-blue-500' :
                  post.platform === 'instagram' ? 'bg-pink-500' :
                  post.platform === 'tiktok' ? 'bg-black' : 'bg-gray-500'
                }`}>
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.platform === 'twitter' ? 'bg-blue-100 text-blue-800' :
                          post.platform === 'instagram' ? 'bg-pink-100 text-pink-800' :
                          post.platform === 'tiktok' ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {post.platform === 'twitter' ? 'Twitter' :
                           post.platform === 'instagram' ? 'Instagram' :
                           post.platform === 'tiktok' ? 'TikTok' : post.platform}
                        </span>
                        {post.ai_generated && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            AI Üretimi
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.posted ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {post.posted ? 'Yayınlandı' : 'Taslak'}
                        </span>
                      </div>
                      
                      <p className="text-gray-900 mb-3 line-clamp-3">
                        {post.content}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      {post.posted ? 'Yayınlandı' : 'Taslak olarak kaydedildi'}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      {!post.posted && (
                        <button
                          onClick={() => handlePublishPost(post.id)}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-lg"
                        >
                          Yayınla
                        </button>
                      )}
                      {post.posted && (
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredPosts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Share2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz gönderi yok</h3>
          <p className="text-gray-600 mb-6">
            İlk sosyal medya gönderinizi oluşturmak için AI asistanımızı kullanın.
          </p>
          <button className="btn-primary">
            İlk Gönderimi Oluştur
          </button>
        </div>
      )}
    </div>
  )
}

export default Posts