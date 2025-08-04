import { useState } from 'react'
import { BarChart3, TrendingUp, Users, Heart, Share, Eye, Calendar, Filter } from 'lucide-react'
import { useQuery } from 'react-query'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  const { data: analytics, isLoading } = useQuery(
    ['analytics', timeRange, selectedPlatform],
    async () => {
      const response = await fetch('/api/analytics/dashboard')
      if (!response.ok) throw new Error('Analitik verileri yüklenemedi')
      return response.json()
    }
  )

  const { data: trends } = useQuery(
    'trends',
    async () => {
      const response = await fetch('/api/analytics/trends')
      if (!response.ok) throw new Error('Trend verileri yüklenemedi')
      return response.json()
    }
  )

  const performanceData = analytics || {
    total_posts: 0,
    published_posts: 0,
    engagement_rate: 0,
    total_impressions: 0,
    total_engagement: 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analitik Dashboard</h1>
          <p className="text-gray-600 mt-2">Sosyal medya performansınızı detaylı olarak takip edin.</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field"
          >
            <option value="7d">Son 7 gün</option>
            <option value="30d">Son 30 gün</option>
            <option value="90d">Son 90 gün</option>
            <option value="1y">Son 1 yıl</option>
          </select>
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
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Gönderi</p>
              <p className="text-3xl font-bold text-gray-900">{performanceData.total_posts}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+12%</span>
                <span className="text-sm text-gray-500 ml-1">bu ay</span>
              </div>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Erişim</p>
              <p className="text-3xl font-bold text-gray-900">{performanceData.total_impressions?.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+15%</span>
                <span className="text-sm text-gray-500 ml-1">bu ay</span>
              </div>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Etkileşim</p>
              <p className="text-3xl font-bold text-gray-900">{performanceData.total_engagement?.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+23%</span>
                <span className="text-sm text-gray-500 ml-1">bu ay</span>
              </div>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Etkileşim Oranı</p>
              <p className="text-3xl font-bold text-gray-900">{performanceData.engagement_rate?.toFixed(1)}%</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+0.8%</span>
                <span className="text-sm text-gray-500 ml-1">bu ay</span>
              </div>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Performance */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Performansı</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Share className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Twitter</h3>
                  <p className="text-sm text-gray-600">25 gönderi</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">6.8%</p>
                <p className="text-sm text-gray-600">etkileşim oranı</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                  <Share className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Instagram</h3>
                  <p className="text-sm text-gray-600">12 gönderi</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">8.2%</p>
                <p className="text-sm text-gray-600">etkileşim oranı</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <Share className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">TikTok</h3>
                  <p className="text-sm text-gray-600">5 gönderi</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">12.5%</p>
                <p className="text-sm text-gray-600">etkileşim oranı</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">En İyi Performans Gösteren Gönderiler</h2>
          <div className="space-y-4">
            {analytics?.top_performing_posts?.map((post: any, index: number) => (
              <div key={post.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 line-clamp-2 mb-2">
                    {post.content}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {post.likes}
                    </span>
                    <span className="flex items-center">
                      <Share className="w-3 h-3 mr-1" />
                      {post.shares}
                    </span>
                    <span>{post.engagement_rate}% etkileşim</span>
                  </div>
                </div>
              </div>
            )) || [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    Örnek performanslı gönderi içeriği...
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>45 beğeni</span>
                    <span>12 paylaşım</span>
                    <span>8.5% etkileşim</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trends and Hashtags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Trend Hashtag'ler</h2>
          <div className="space-y-3">
            {trends?.trending_hashtags?.slice(0, 8).map((tag: any, index: number) => (
              <div key={tag.hashtag} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">
                    #{tag.hashtag}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${tag.trend_score}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  {tag.tweet_count?.toLocaleString()} tweet
                </span>
              </div>
            )) || [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">
                    #örnek{i + 1}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${Math.random() * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  {Math.floor(Math.random() * 50000).toLocaleString()} tweet
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Aktivite Takvimi</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-600">
              <div>Pt</div>
              <div>Sa</div>
              <div>Ça</div>
              <div>Pe</div>
              <div>Cu</div>
              <div>Ct</div>
              <div>Pa</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(35)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded ${
                    Math.random() > 0.7 ? 'bg-green-500' :
                    Math.random() > 0.5 ? 'bg-green-300' :
                    Math.random() > 0.3 ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Az</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <div className="w-3 h-3 bg-green-300 rounded"></div>
                <div className="w-3 h-3 bg-green-500 rounded"></div>
              </div>
              <span>Çok</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Önerileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">En İyi Yayınlama Saati</h3>
            <p className="text-sm text-blue-700">
              Kullanıcılarınız en çok 15:00-16:00 arası aktif. Bu saatlerde gönderi paylaşmayı deneyin.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">İçerik Önerisi</h3>
            <p className="text-sm text-green-700">
              Görsel içerikleriniz %40 daha fazla etkileşim alıyor. Daha fazla resim ve video paylaşın.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-2">Hashtag Stratejisi</h3>
            <p className="text-sm text-purple-700">
              #İndirim ve #Amazon hashtag'leri en iyi performansı gösteriyor. Bunları daha sık kullanın.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics