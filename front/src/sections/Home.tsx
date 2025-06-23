"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Search, X, ChevronDown, ChevronUp } from "lucide-react"

import Footer from "../sections/Styles/Footer"

import WorkersModal from "../sections/Styles/WorkersModal"
import MyFloatingDockCustomer from "../sections/Styles/MyFloatingDock-Customer"
import ServiceCategoriesModal from "../sections/Styles/ServiceCategoriesModal"

import ServiceBanner from "./Styles/ServiceBanner"

import LegalText from "../sections/Styles/LegalText"
import MoreFeatures from "../sections/Styles/HomeComponents/MoreFeatures"
import Welcome from "../sections/Styles/HomeComponents/Welcome"
import Popular from "../sections/Styles/HomeComponents/Popular"
import BestCompanies from "./Styles/HomeComponents/BestCompanies"

import { serviceSubcategories, sellers, carouselItems, products } from "../sections/Home-data"

function useScrollReveal() {
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: "0px",
    })

    document.querySelectorAll(".scroll-reveal").forEach((element) => {
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])
}

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [, setSelectedSubcategory] = useState<string>("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showAllServices, setShowAllServices] = useState(false)

  useScrollReveal()

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
    <div className="min-h-screen bg-white/90">
      <div className="z-40 flex">
        <MyFloatingDockCustomer />
      </div>
      <Welcome />

      <div className="relative">
        {/* Carousel */}
        <div className="relative aspect-video max-h-[600px] overflow-hidden mx-auto max-w-7xl mt-10 rounded-2xl group">
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-lime-400">
                <img src={item.image || "/placeholder.svg"} className="w-full h-full object-cover object-center" />
              </div>
            </div>
          ))}

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white bg-black/20 rounded-full hover:bg-black/30 transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white bg-black/20 rounded-full hover:bg-black/30 transition-all z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mt-8 sm:px-6 lg:px-8">
        <MoreFeatures />
      </div>

      <Popular />

      <ServiceBanner />

      <BestCompanies />

      <div className="bg-white/90 text-black py-16">
        {" "}
        {/* Removed mt-[-6rem] */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-3xl font-semibold scroll-reveal text-gray-700">List of all Services</h2>
              <p className="text-sm text-gray-500">
                Showing {displayedProducts.length} of {filteredProducts.length} services
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center bg-gray-200/70 p-4 rounded-lg">
              <div className="relative flex-grow w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-full text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
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

              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center">
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
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all w-full sm:w-auto justify-center"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer bg-gray-200/70 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 scroll-reveal hover-scale flex flex-col h-full"
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-64 object-cover transform transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-black">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 flex-grow">{product.description}</p>{" "}
                  {/* Removed mb-16, added flex-grow */}
                  <div className="mt-auto flex justify-between items-center pt-4">
                    {" "}
                    {/* Added mt-auto, pt-4 */}
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
      </div>

      <ServiceCategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        categoryName={selectedCategory}
        subcategories={serviceSubcategories[selectedCategory as keyof typeof serviceSubcategories] || []}
        onSelectSubcategory={handleSubcategorySelect}
      />

      <WorkersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={selectedProduct}
        sellers={sellers[selectedProduct as keyof typeof sellers] || []}
      />

      <LegalText />

      <Footer />
    </div>
  )
}

export default Home
