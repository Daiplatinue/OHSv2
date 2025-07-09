import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Trash, Pencil, ChevronRight, Star, Info } from "lucide-react"
import { useState, useEffect } from "react"
// import ServiceCategoriesModal from "../ServiceCategoriesModal"
// import WorkersModal from "../WorkersModal"
// import { serviceSubcategories, sellers, products } from "../../Home-data"
import { serviceSubcategories, products } from "../../Home-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import mainBackground from "../../../assets/Welcome/Serene Landscape Under a Dramatic Sky.jpeg"
import HL1 from "../../../assets/Home/Profile of a Fashionable Woman.jpeg"
import HL2 from "../../../assets/Home/Cheerful Youth Portrait.jpeg"
import HL3 from "../../../assets/Home/Enigmatic Portrait.jpeg"

import service1 from "../../../assets/Home/s2.jpg"
import service2 from "../../../assets/Home/s3.jpg"
import service3 from "../../../assets/Home/s5.jpg"

import service4 from "../../../assets/Home/Mysterious Fashion Portrait.jpeg"
import service5 from "../../../assets/Home/Warm Sunlit Kitchen Scene.jpeg"
import service6 from "../../../assets/Home/Garden Community.jpeg"

export default function Dashboard() {
  const [dynamicFirstName, setDynamicFirstName] = useState("User")
  const [dynamicUserEmail, setDynamicUserEmail] = useState("email@example.com")
  const [greeting, setGreeting] = useState("Good Day")

  useEffect(() => {
    // Retrieve user data from localStorage
    const userDataString = localStorage.getItem("user")
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString)
        setDynamicFirstName(userData.firstName || "User")
        setDynamicUserEmail(userData.email || "email@example.com")
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error)
      }
    }

    // Determine dynamic greeting
    const currentHour = new Date().getHours()
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Good Morning")
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Good Afternoon")
    } else {
      setGreeting("Good Evening")
    }
  }, [])

  // const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false)
  const [, setIsCategoriesModalOpen] = useState(false)
  // const [isWorkersModalOpen, setIsWorkersModalOpen] = useState(false)
  const [, setIsWorkersModalOpen] = useState(false)
  // const [selectedCategory, setSelectedCategory] = useState("")
  const [, setSelectedCategory] = useState("")
  // const [selectedProduct, setSelectedProduct] = useState("")
  const [, setSelectedProduct] = useState("")
  // const [, setSelectedSubcategory] = useState("")

  const [notes, setNotes] = useState<{ id: number; content: string; completed: boolean }[]>([
    { id: 1, content: "Call customer for service feedback", completed: false },
    { id: 2, content: "Record and upload service completion videos", completed: false },
    { id: 3, content: "Add new technician training to calendar", completed: false },
    { id: 4, content: "Renew service vehicle lease", completed: false },
  ])
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [currentEditContent, setCurrentEditContent] = useState("")

  const handleAddNote = () => {
    if (newNoteContent.trim() !== "") {
      setNotes([...notes, { id: Date.now(), content: newNoteContent.trim(), completed: false }])
      setNewNoteContent("")
    }
  }

  const handleRemoveNote = (idToRemove: number) => {
    setNotes(notes.filter((note) => note.id !== idToRemove))
  }

  const handleEditNote = (id: number, content: string) => {
    setEditingNoteId(id)
    setCurrentEditContent(content)
  }

  const handleSaveNote = () => {
    if (editingNoteId !== null && currentEditContent.trim() !== "") {
      setNotes(
        notes.map((note) => (note.id === editingNoteId ? { ...note, content: currentEditContent.trim() } : note)),
      )
      setEditingNoteId(null)
      setCurrentEditContent("")
    }
  }

  const handleCancelEdit = () => {
    setEditingNoteId(null)
    setCurrentEditContent("")
  }

  const handleToggleDone = (id: number) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, completed: !note.completed } : note)))
  }

  const handleSeeMore = (productName: string) => {
    const product = products.find((p) => p.name === productName)
    if (product && serviceSubcategories[product.name as keyof typeof serviceSubcategories]) {
      setSelectedCategory(product.name)
      setIsCategoriesModalOpen(true)
    } else {
      setSelectedProduct(productName)
      setIsWorkersModalOpen(true)
    }
  }

  // const handleSubcategorySelect = (subcategory: string) => {
  //   setSelectedSubcategory(subcategory)
  //   setIsCategoriesModalOpen(false)
  // }

  const ongoingServices = [
    {
      id: 1,
      name: "Plumbing Services",
      price: 8000,
      category: "Plumbing",
      image: service1,
      description:
        "Keep your water systems running smoothly with expert plumbing services, from leak repairs to pipe installations.",
      status: "Ongoing",
    },
    {
      id: 2,
      name: "Home Cleaning Services",
      price: 12000,
      category: "Cleaning",
      image: service2,
      description: "Enjoy a spotless, sanitized home with deep cleaning, carpet care, and move-in/move-out services.",
      status: "Ongoing",
    },
    {
      id: 3,
      name: "Landscaping Services",
      price: 15000,
      category: "Outdoor",
      image: service3,
      description: "Transform your outdoor space with professional landscaping, lawn care, and garden design services.",
      status: "Ongoing",
    },
  ]

  const completedServices = [
    {
      id: 1,
      customerName: "Alice Johnson",
      customerAvatar: "/placeholder.svg?height=40&width=40",
      serviceName: "Plumbing Services",
      review: "Excellent service! The plumber was very professional and fixed the leak quickly.",
      rating: 5,
      date: "2 days ago",
      total: 1000,
    },
    {
      id: 2,
      customerName: "Bob Williams",
      customerAvatar: "/placeholder.svg?height=40&width=40",
      serviceName: "Home Cleaning Services",
      review: "The house looks spotless. Very thorough and efficient cleaning team.",
      rating: 4,
      date: "1 week ago",
      total: 1500,
    },
    {
      id: 3,
      customerName: "Charlie Davis",
      customerAvatar: "/placeholder.svg?height=40&width=40",
      serviceName: "Landscaping Services",
      review: "Beautiful garden design, exactly what I wanted. Highly recommend!",
      rating: 5,
      date: "2 weeks ago",
      total: 2000,
    },
  ]

  const recentReviews = completedServices
    .filter((s) => s.review && s.rating)
    .map((service) => ({
      id: service.id,
      customerName: service.customerName,
      customerAvatar: "/placeholder.svg?height=40&width=40",
      serviceName: service.serviceName,
      reviewContent: service.review || "",
      rating: service.rating || 0,
      totalPayment: service.total,
      serviceId: service.id,
      date: "Today",
    }))

  const newCompanies = [
    {
      id: 1,
      name: "EcoClean Solutions",
      logo: service4,
      description: "Specializing in eco-friendly cleaning services for homes and offices.",
      dateJoined: "Today",
    },
    {
      id: 2,
      name: "SmartHome Tech Installers",
      logo: service5,
      description: "Certified installers for smart home devices and automation systems.",
      dateJoined: "Yesterday",
    },
    {
      id: 3,
      name: "Urban Gardeners Co.",
      logo: service6,
      description: "Innovative landscaping and vertical garden solutions for urban spaces.",
      dateJoined: "3 days ago",
    },
  ]

  // Create a mutable copy of newServicesToCheckOut to modify the name
  const newServicesToCheckOut = products.slice(6, 10).map((service) => ({ ...service }))

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="relative h-[380px] w-full overflow-hidden">
        <img
          src={mainBackground || "/placeholder.svg"}
          alt="Home services dashboard background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Gradient Overlay - fades to the background color (gray-100) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-gray-50"></div>
        <div className="absolute inset-0 flex flex-col items-center text-center justify-center z-20 text-white">
          <h1 className="text-3xl font-extralight text-gray-100 mb-20">
            {greeting}, {dynamicFirstName} <br />
            <span className="text-[17px]">{dynamicUserEmail}</span>
          </h1>
        </div>
      </div>

      {/* Main Content Grid - Pulled up to overlap the header */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 -mt-40 relative z-30 max-w-[80rem]">
        {/* Left Column */}
        <div className="space-y-6 flex flex-col">
          {" "}
          {/* Daily Summary Card */}
          <Card className="flex-1">
            {" "}
            {/* Added flex-1 to make card stretch */}
            <CardHeader>
              <CardTitle className="text-lg font-extralight text-gray-700">Daily Summary</CardTitle>
              <p className="text-sm text-gray-500">Here&apos;s your daily summary for managing online home services.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-extralight mb-2 text-gray-700">Settle Payments to this Services</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {ongoingServices.map((service) => (
                    <div
                      key={service.id}
                      className="group cursor-pointer bg-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-[25rem]"
                      onClick={() => handleSeeMore(service.name)}
                    >
                      <div className="relative overflow-hidden rounded-md mb-3">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.name}
                          className="w-full h-40 object-cover transform transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="text-lg font-medium mb-2 mt-1 text-gray-700">{service.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-3 flex-grow">{service.description}</p>
                      <div className="mt-auto flex justify-between items-center pt-3">
                        <span className="text-lg font-medium text-gray-900">₱{service.price}</span>
                        <button className="text-sky-500 flex items-center text-sm transition-all duration-300 hover:text-blue-600 hover:translate-x-1">
                          View Details <ChevronRight className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-extralight mb-2 text-gray-700">Your Notes</h3>
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-gray-100 p-3 rounded-md">
                      {editingNoteId === note.id ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={currentEditContent}
                            onChange={(e) => setCurrentEditContent(e.target.value)}
                            className="w-full p-2 border rounded-md text-sm"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={handleSaveNote}>
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`note-${note.id}`}
                              checked={note.completed}
                              onCheckedChange={() => handleToggleDone(note.id)}
                            />
                            <label
                              htmlFor={`note-${note.id}`}
                              className={`text-sm text-gray-700 ${note.completed ? "line-through text-gray-500" : ""}`}
                            >
                              {note.content}
                            </label>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditNote(note.id, note.content)}
                              aria-label="Edit note"
                            >
                              <Pencil className="w-4 h-4 text-gray-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveNote(note.id)}
                              aria-label="Remove note"
                            >
                              <Trash className="w-4 h-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <Input
                      type="text"
                      placeholder="Add a new note"
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddNote()
                        }
                      }}
                    />
                    <Button onClick={handleAddNote}>
                      <Plus className="w-4 h-4 mr-2" /> Add Note
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Newsletter Highlights Card */}
          <Card className="flex-1">
            {" "}
            {/* Added flex-1 to make card stretch */}
            <CardHeader>
              <CardTitle className="text-lg font-extralight text-gray-700">Industry Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={HL1 || "/placeholder.svg"}
                  alt="Rise of Sustainable Home Services"
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">The Rise of Sustainable Home Services</h4>
                  <p className="text-xs text-gray-500">Market Trends</p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    Consumers are increasingly prioritizing eco-friendly options. Learn how integrating sustainable
                    practices can boost your business.
                  </p>
                </div>
                <span className="text-xs text-gray-500 self-start">July 1, 2025</span>
              </div>
              <div className="flex items-start gap-4">
                <img
                  src={HL2 || "/placeholder.svg"}
                  alt="Impact of AI on Customer Support"
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">AI's Impact on Customer Support</h4>
                  <p className="text-xs text-gray-500">Technology Adoption</p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    Artificial intelligence is revolutionizing how home service businesses handle customer inquiries and
                    support, leading to faster resolutions and improved satisfaction.
                  </p>
                </div>
                <span className="text-xs text-gray-500 self-start">June 28, 2025</span>
              </div>
              <div className="flex items-start gap-4">
                <img
                  src={HL3 || "/placeholder.svg"}
                  alt="Growth of On-Demand Services"
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Growth of On-Demand Home Services</h4>
                  <p className="text-xs text-gray-500">Consumer Behavior</p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    The demand for immediate, convenient home services continues to surge. Adapt your offerings to meet
                    the expectations of today's fast-paced consumers.
                  </p>
                </div>
                <span className="text-xs text-gray-500 self-start">June 25, 2025</span>
              </div>
              {/* New "Nothing follows" section */}
              <div className="flex flex-col items-center mt-15 justify-center text-center py-4 text-gray-500">
                <Info className="h-6 w-6 mb-2" />
                <p className="text-sm">
                  No more advertisements follows, <br /> create another service then advertise it
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6 flex flex-col">
          {" "}
          <Card className="flex-1 p-5">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
              <CardTitle className="text-lg font-extralight text-gray-700">Recent Reviews on the provider</CardTitle>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Plus className="h-5 w-5 text-gray-400" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.customerAvatar || "/placeholder.svg"} alt={review.customerName} />
                      <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{review.customerName}</p>
                      <p className="text-sm text-gray-500">{review.serviceName}</p>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="ml-2 text-xs text-gray-600 italic line-clamp-1">"{review.reviewContent}"</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2 sm:space-y-0 sm:ml-auto flex-shrink-0">
                    <p className="text-sm font-semibold text-sky-600 mb-2">₱{review.totalPayment.toLocaleString()}</p>
                    <Button
                      variant="default"
                      className="rounded-full px-4 py-2 text-sm bg-sky-500 text-white hover:bg-sky-600"
                      onClick={() => {
                        const serviceFound = completedServices.find((s) => s.id === review.serviceId)
                        if (serviceFound) {
                          handleSeeMore(serviceFound.serviceName) // Use handleSeeMore to open the modal
                        }
                      }}
                    >
                      View Service
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="default" className="w-full mt-4 rounded-full bg-sky-500 text-white hover:bg-sky-600">
                See All Reviews
              </Button>
            </CardContent>
          </Card>
          {/* Welcoming the new companies Card */}
          <Card className="flex-1 p-5">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
              <CardTitle className="text-lg font-extralight text-gray-700">Welcoming the new companies</CardTitle>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Plus className="h-5 w-5 text-gray-400" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {newCompanies.map((company) => (
                <div
                  key={company.id}
                  className="group cursor-pointer bg-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                  onClick={() => {
                    // Add logic to view company details, e.g., open a modal or navigate
                    console.log(`View company: ${company.name}`)
                  }}
                >
                  <div className="relative overflow-hidden rounded-md mb-3">
                    <img
                      src={company.logo || "/placeholder.svg"}
                      alt={company.name}
                      className="w-full h-40 object-cover transform transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="text-lg font-medium mb-2 mt-1 text-gray-700">{company.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-3 flex-grow">{company.description}</p>
                  <div className="mt-auto flex justify-between items-center pt-3">
                    <span className="text-sm text-gray-600">{company.dateJoined}</span>
                    <button className="text-sky-500 flex items-center text-sm transition-all duration-300 hover:text-blue-600 hover:translate-x-1">
                      View Company <ChevronRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
              <Button
                variant="default"
                className="w-full mt-4 rounded-full bg-sky-500 text-white hover:bg-sky-600 col-span-full"
              >
                See All Companies
              </Button>
            </CardContent>
          </Card>
          {/* New Connections Card */}
          <Card className="flex-1 p-5">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
              <CardTitle className="text-lg font-extralight text-gray-700">New services to check out</CardTitle>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Plus className="h-5 w-5 text-gray-400" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {newServicesToCheckOut.map((service) => (
                <div
                  key={service.id}
                  className="group cursor-pointer bg-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                  onClick={() => handleSeeMore(service.name)}
                >
                  <div className="relative overflow-hidden rounded-md mb-3">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-40 object-cover transform transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="text-lg font-medium mb-2 mt-1 text-gray-700">{service.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-3 flex-grow">{service.description}</p>
                  <div className="mt-auto flex justify-between items-center pt-3">
                    <span className="text-lg font-medium text-gray-900">₱{service.price.toLocaleString()}</span>
                    <button className="text-sky-500 flex items-center text-sm transition-all duration-300 hover:text-blue-600 hover:translate-x-1">
                      View Details <ChevronRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
              <Button
                variant="default"
                className="w-full mt-4 rounded-full bg-sky-500 text-white hover:bg-sky-600 col-span-full"
              >
                See All Services
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <ServiceCategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        categoryName={selectedCategory}
        subcategories={serviceSubcategories[selectedCategory as keyof typeof serviceSubcategories] || []}
        onSelectSubcategory={handleSubcategorySelect}
      />

      <WorkersModal
        isOpen={isWorkersModalOpen}
        onClose={() => setIsWorkersModalOpen(false)}
        productName={selectedProduct}
        sellers={sellers[selectedProduct as keyof typeof sellers] || []}
      /> */}
    </div>
  )
}