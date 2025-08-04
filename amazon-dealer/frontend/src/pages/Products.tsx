import { useState, useEffect } from 'react'
import { Package, Search, Filter, RefreshCw, Plus, ExternalLink } from 'lucide-react'
import { useQuery } from 'react-query'
import toast from 'react-hot-toast'

interface Product {
  asin: string
  title: string
  description: string
  price: number
  currency: string
  image_urls: string[]
  category: string
  brand: string
}

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { data: products, isLoading, refetch } = useQuery<Product[]>(
    'products',
    async () => {
      const response = await fetch('/api/products/')
      if (!response.ok) throw new Error('Ürünler yüklenemedi')
      return response.json()
    }
  )

  const { data: categories } = useQuery(
    'categories',
    async () => {
      const response = await fetch('/api/products/categories/')
      if (!response.ok) throw new Error('Kategoriler yüklenemedi')
      return response.json()
    }
  )

  const handleSyncProducts = async () => {
    try {
      const response = await fetch('/api/products/sync', {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Senkronizasyon başarısız')
      
      const result = await response.json()
      toast.success(result.message)
      refetch()
    } catch (error) {
      toast.error('Senkronizasyon hatası: ' + (error as Error).message)
    }
  }

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ürünlerim</h1>
          <p className="text-gray-600 mt-2">Amazon mağazanızdaki ürünlerinizi yönetin ve sosyal medyada paylaşın.</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={handleSyncProducts}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Senkronize Et</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Yeni Gönderi</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
              <p className="text-2xl font-bold text-gray-900">{products?.length || 0}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Ürün</p>
              <p className="text-2xl font-bold text-gray-900">{products?.length || 0}</p>
            </div>
            <Package className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paylaşılan</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Package className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Beklemede</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Package className="w-8 h-8 text-orange-500" />
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
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories?.categories?.map((category: string) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtrele</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.asin} className="card hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-12 mb-4">
                <img
                  src={product.image_urls[0] || '/placeholder-product.jpg'}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-product.jpg'
                  }}
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="text-gray-600">ASIN: {product.asin}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {product.price} {product.currency}
                    </span>
                    {product.brand && (
                      <p className="text-sm text-gray-600">{product.brand}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  <button className="btn-primary flex-1 text-sm">
                    AI Gönderi Oluştur
                  </button>
                  <button className="btn-secondary p-2">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Arama kriterlerinize uygun ürün bulunamadı.' 
              : 'Henüz Amazon hesabınızdan ürün çekilmemiş.'}
          </p>
          <button onClick={handleSyncProducts} className="btn-primary">
            Amazon\'dan Ürün Çek
          </button>
        </div>
      )}
    </div>
  )
}

export default Products