import { Package, Share2, BarChart3, TrendingUp, Clock, Target } from 'lucide-react'

const Dashboard = () => {
  const stats = [
    {
      name: 'Toplam Ürün',
      value: '24',
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Yayınlanan Gönderi',
      value: '18',
      icon: Share2,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      name: 'Toplam Etkileşim',
      value: '1.2K',
      icon: BarChart3,
      color: 'bg-purple-500',
      change: '+23%',
      changeType: 'increase'
    },
    {
      name: 'Erişim',
      value: '5.4K',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'increase'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'post',
      message: 'Yeni iPhone 15 gönderisi Twitter\'da yayınlandı',
      time: '2 saat önce',
      status: 'success'
    },
    {
      id: 2,
      type: 'product',
      message: 'Amazon\'dan 5 yeni ürün senkronize edildi',
      time: '4 saat önce',
      status: 'info'
    },
    {
      id: 3,
      type: 'analytics',
      message: 'Laptop gönderiniz 150 beğeni aldı',
      time: '6 saat önce',
      status: 'success'
    }
  ]

  const quickActions = [
    {
      title: 'Yeni Gönderi Oluştur',
      description: 'AI ile otomatik içerik oluşturun',
      icon: Share2,
      color: 'bg-blue-500',
      action: 'create-post'
    },
    {
      title: 'Ürünleri Senkronize Et',
      description: 'Amazon\'dan ürünlerinizi güncelleyin',
      icon: Package,
      color: 'bg-green-500',
      action: 'sync-products'
    },
    {
      title: 'Analitik Raporu',
      description: 'Performans raporunuzu görüntüleyin',
      icon: BarChart3,
      color: 'bg-purple-500',
      action: 'view-analytics'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hoş Geldiniz! 👋</h1>
        <p className="text-gray-600 mt-2">Amazon satış performansınızı ve sosyal medya etkileşimlerinizi takip edin.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">önceki aya göre</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <div key={action.action} className="card hover:shadow-md transition-shadow cursor-pointer">
                  <div className={`${action.color} p-3 rounded-lg w-fit mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
          <div className="card">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <div className="flex items-center mt-1">
                      <Clock className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Performans Özeti</h2>
          <button className="btn-secondary">Detayları Gör</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Etkileşim Oranı</h3>
            <p className="text-2xl font-bold text-blue-600 mt-1">6.8%</p>
            <p className="text-sm text-gray-500">Sektör ortalaması: 4.2%</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Büyüme Oranı</h3>
            <p className="text-2xl font-bold text-green-600 mt-1">+23%</p>
            <p className="text-sm text-gray-500">Geçen aya göre</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Ortalama Erişim</h3>
            <p className="text-2xl font-bold text-purple-600 mt-1">245</p>
            <p className="text-sm text-gray-500">Gönderi başına</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard