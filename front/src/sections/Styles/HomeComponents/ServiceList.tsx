import { useState, lazy, Suspense } from "react"
import { ChevronDown, ChevronUp, Search, X, ChevronRight } from "lucide-react"
import { serviceSubcategories, sellers, products } from "../../Home-data"

const WorkersModal = lazy(() => import("../../../sections/Styles/WorkersModal"))
const ServiceCategoriesModal = lazy(() => import("../../../sections/Styles/ServiceCategoriesModal"))

export default function ServiceListSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [, setSelectedSubcategory] = useState<string>("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showAllServices, setShowAllServices] = useState(false)

  const categories = Array.from(new Set(products.map((product) => product.category)))

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
    return matchesSearch && matchesPrice && matchesCategory
  })

  const displayedProducts = showAllServices ? filteredProducts : filteredProducts.slice(0, 8)

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const handlePriceChange = (value: number, index: number) => {
    setPriceRange((prev) => {
      const newRange = [...prev]
      newRange[index] = value
      return newRange as [number, number]
    })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setPriceRange([0, 50000])
    setSelectedCategories([])
  }

  const handleSeeMore = (productName: string) => {
    if (serviceSubcategories[productName as keyof typeof serviceSubcategories]) {
      setSelectedCategory(productName)
      setIsCategoriesModalOpen(true)
    } else {
      setSelectedProduct(productName)
      setIsModalOpen(true)
    }
  }

  const handleSubcategorySelect = (subcategoryName: string) => {
    setSelectedSubcategory(subcategoryName)
    setIsCategoriesModalOpen(false)
    setSelectedProduct(subcategoryName)
    setIsModalOpen(true)
  }

  const toggleShowAllServices = () => {
    setShowAllServices((prev) => !prev)
  }

  return (
    <div className="bg-white/90 text-black py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-gray-700">List of all Services</h2>
            <p className="text-sm text-gray-500">
              Showing {displayedProducts.length} of {filteredProducts.length} services
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center bg-gray-200/70 p-4 rounded-lg">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-full text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(Number(e.target.value), 0)}
                className="w-24 px-3 py-2 bg-white rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(Number(e.target.value), 1)}
                className="w-24 px-3 py-2 bg-white rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>

            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedCategories.includes(category)
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black hover:bg-gray-300 cursor-pointer"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {(searchQuery || priceRange[0] > 0 || priceRange[1] < 50000 || selectedCategories.length > 0) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer bg-gray-200/70 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover-scale"
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover transform transition duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2 text-black">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-16 line-clamp-3">{product.description}</p>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                  <span className="text-lg font-medium text-black">₱{product.price}</span>
                  <button
                    onClick={() => handleSeeMore(product.name)}
                    className="text-sky-500 flex items-center transition-all duration-300 hover:text-blue-600 hover:translate-x-1"
                  >
                    See More <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length > 8 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={toggleShowAllServices}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-sky-400 text-white hover:from-blue-600 hover:to-sky-500 transition-all transform hover:scale-105 shadow-md"
              >
                {showAllServices ? (
                  <>
                    <ChevronUp className="h-5 w-5" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-5 w-5" />
                    Show More Services
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <Suspense fallback={<div className="p-4 text-center">Loading categories modal...</div>}>
        {isCategoriesModalOpen && (
          <ServiceCategoriesModal
            isOpen={isCategoriesModalOpen}
            onClose={() => setIsCategoriesModalOpen(false)}
            categoryName={selectedCategory}
            subcategories={serviceSubcategories[selectedCategory as keyof typeof serviceSubcategories] || []}
            onSelectSubcategory={handleSubcategorySelect}
          />
        )}
      </Suspense>

      <Suspense fallback={<div className="p-4 text-center">Loading workers modal...</div>}>
        {isModalOpen && (
          <WorkersModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            productName={selectedProduct}
            sellers={sellers[selectedProduct as keyof typeof sellers] || []}
          />
        )}
      </Suspense>
    </div>
  )
}