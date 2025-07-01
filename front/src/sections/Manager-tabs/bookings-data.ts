export interface Service {
  id: number
  name: string
  price: number
  description: string
  hasNotification: boolean
  notificationCount?: number
  image: string
  chargePerKm: number
}

export interface Booking {
  id: number
  serviceId: number
  serviceName: string
  customerName: string
  date: string
  time: string
  location: string
  distanceCharge: number
  total: number
  modeOfPayment: string
  status: "ongoing" | "pending" | "completed"
  price: number
  image: string
}

export interface ExpenseItem {
  name: string
  estimatedCost: number
  required: boolean
}

export interface PersonalInfo {
  id: number
  type: string
  title: string
  description: string
  startDate?: string
  endDate?: string
  location?: string
  organization?: string
  hasNotification?: boolean
  notificationCount?: number
  image?: string
}

export type SubscriptionTier = "free" | "mid" | "premium" | "unlimited"

export interface SubscriptionInfo {
  tier: SubscriptionTier
  maxServices: number
  name: string
  color: string
  price: number
  billingCycle: string
  nextBillingDate: string
}

export const services: Service[] = [
  {
    id: 1,
    name: "Cleaning Services",
    price: 4000,
    description: "Comprehensive cleaning solutions for residential and commercial spaces.",
    hasNotification: true,
    notificationCount: 1,
    image: "https://cdn.pixabay.com/photo/2014/02/17/14/28/vacuum-cleaner-268179_1280.jpg",
    chargePerKm: 30,
  },
  {
    id: 2,
    name: "Home Renovation",
    price: 15000,
    description: "Transform your living space with our expert renovation services.",
    hasNotification: false,
    image: "https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg",
    chargePerKm: 60,
  },
]

export const companyDetails = {
  name: "Servina CasaSwift",
  location: "United States",
  description:
    "Professional home services and repairs with guaranteed satisfaction. Available 24/7 for all your maintenance needs.",
  logo: "https://cdn.pixabay.com/photo/2025/04/13/21/14/woman-9532283_1280.jpg",
  coverPhoto: "https://cdn.pixabay.com/photo/2017/02/20/19/29/architecture-2083687_1280.jpg",
  followers: 34.5,
}

export const userDetails = {
  name: "John Doe",
  location: "San Francisco, CA",
  description:
    "Professional software developer with 5+ years of experience in web and mobile application development. Passionate about creating intuitive user experiences.",
  avatar: "https://uploads.dailydot.com/2024/07/side-eye-cat.jpg?q=65&auto=format&w=1200&ar=2:1&fit=crop",
  coverPhoto: "https://cdn.pixabay.com/photo/2016/12/05/21/08/cologne-1884931_1280.jpg",
  followers: 1.2,
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  birthday: "1990-05-15",
  gender: "Male",
}

export const personalInfo: PersonalInfo[] = [
  {
    id: 1,
    type: "education",
    title: "Computer Science",
    description: "Bachelor's degree in Computer Science with focus on software engineering and data structures.",
    startDate: "2010-09-01",
    endDate: "2014-06-30",
    organization: "Stanford University",
    location: "Stanford, CA",
    image: "https://cdn.pixabay.com/photo/2017/01/24/03/53/plant-2004483_1280.jpg",
  },
  {
    id: 2,
    type: "education",
    title: "Machine Learning",
    description: "Master's degree in Machine Learning and Artificial Intelligence.",
    startDate: "2014-09-01",
    endDate: "2016-06-30",
    organization: "MIT",
    location: "Cambridge, MA",
    image: "https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg",
  },
  {
    id: 3,
    type: "experience",
    title: "Senior Developer",
    description: "Led a team of 5 developers to build and maintain enterprise-level web applications.",
    startDate: "2020-01-15",
    endDate: "Present",
    organization: "Tech Solutions Inc.",
    location: "San Francisco, CA",
    hasNotification: true,
    notificationCount: 2,
    image: "https://cdn.pixabay.com/photo/2024/07/23/09/14/ai-generated-8914595_1280.jpg",
  },
  {
    id: 4,
    type: "experience",
    title: "Web Developer",
    description: "Developed and maintained client websites using React, Node.js, and MongoDB.",
    startDate: "2016-08-01",
    endDate: "2019-12-31",
    organization: "Digital Creations",
    location: "Los Angeles, CA",
    image: "https://cdn.pixabay.com/photo/2014/02/17/14/28/vacuum-cleaner-268179_1280.jpg",
  },
  {
    id: 5,
    type: "skills",
    title: "Frontend Development",
    description:
      "Proficient in React, Vue.js, HTML5, CSS3, and JavaScript. Experienced in building responsive and accessible web applications.",
    image: "https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg",
  },
  {
    id: 6,
    type: "skills",
    title: "Backend Development",
    description:
      "Experienced with Node.js, Express, Python, Django, and RESTful API design. Familiar with database design and optimization.",
    hasNotification: true,
    notificationCount: 1,
    image: "https://cdn.pixabay.com/photo/2024/07/23/09/14/ai-generated-8914595_1280.jpg",
  },
]

export const bookings: Booking[] = [
  {
    id: 101,
    serviceId: 1,
    serviceName: "Plumbing Services",
    customerName: "John Smith",
    date: "2025-03-15",
    time: "10:00 AM",
    location: "123 Main St, Anytown",
    distanceCharge: 500,
    total: 8500,
    modeOfPayment: "Credit Card",
    status: "ongoing",
    price: 8000,
    image: "https://cdn.pixabay.com/photo/2024/07/23/09/14/ai-generated-8914595_1280.jpg",
  },
  {
    id: 102,
    serviceId: 2,
    serviceName: "Electrical Repairs",
    customerName: "Sarah Johnson",
    date: "2025-03-16",
    time: "2:30 PM",
    location: "456 Oak Ave, Somewhere",
    distanceCharge: 300,
    total: 6800,
    modeOfPayment: "Cash",
    status: "pending",
    price: 6500,
    image: "https://cdn.pixabay.com/photo/2017/01/24/03/53/plant-2004483_1280.jpg",
  },
  {
    id: 103,
    serviceId: 3,
    serviceName: "Cleaning Services",
    customerName: "Michael Brown",
    date: "2025-03-10",
    time: "9:00 AM",
    location: "789 Pine St, Elsewhere",
    distanceCharge: 200,
    total: 4200,
    modeOfPayment: "Digital Wallet",
    status: "completed",
    price: 4000,
    image: "https://cdn.pixabay.com/photo/2014/02/17/14/28/vacuum-cleaner-268179_1280.jpg",
  },
  {
    id: 104,
    serviceId: 1,
    serviceName: "Plumbing Services",
    customerName: "Emily Davis",
    date: "2025-03-18",
    time: "11:30 AM",
    location: "321 Elm St, Nowhere",
    distanceCharge: 450,
    total: 8450,
    modeOfPayment: "Credit Card",
    status: "pending",
    price: 8000,
    image: "https://cdn.pixabay.com/photo/2024/07/23/09/14/ai-generated-8914595_1280.jpg",
  },
  {
    id: 105,
    serviceId: 4,
    serviceName: "Home Renovation",
    customerName: "Robert Wilson",
    date: "2025-03-05",
    time: "8:00 AM",
    location: "654 Maple Dr, Anywhere",
    distanceCharge: 800,
    total: 15800,
    modeOfPayment: "Bank Transfer",
    status: "completed",
    price: 15000,
    image: "https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg",
  },
  {
    id: 106,
    serviceId: 3,
    serviceName: "Cleaning Services",
    customerName: "Jennifer Taylor",
    date: "2025-03-14",
    time: "1:00 PM",
    location: "987 Cedar Ln, Someplace",
    distanceCharge: 350,
    total: 4350,
    modeOfPayment: "Digital Wallet",
    status: "ongoing",
    price: 4000,
    image: "https://cdn.pixabay.com/photo/2014/02/17/14/28/vacuum-cleaner-268179_1280.jpg",
  },
]

export const expenses: ExpenseItem[] = [
  { name: "Tools and Equipment", estimatedCost: 5000, required: true },
  { name: "Transportation", estimatedCost: 2000, required: true },
  { name: "Materials", estimatedCost: 3000, required: false },
  { name: "Labor", estimatedCost: 4000, required: true },
  { name: "Insurance", estimatedCost: 1500, required: true },
]

export const subscriptionPlans = [
  {
    tier: "free",
    name: "Freebie",
    description: "Ideal for individuals who need quick access to basic features.",
    maxServices: 3,
    price: 0,
    yearlyPrice: 0, // Still free
    color: "bg-white", // Changed to white
    textColor: "text-gray-900", // Changed to dark text
    features: [
      { text: "20,000+ of PNG & SVG graphics", included: true },
      { text: "Access to 100 million stock images", included: true },
      { text: "Upload custom icons and fonts", included: false },
      { text: "Unlimited Sharing", included: false },
      { text: "Upload graphics & video in up to 4k", included: false },
      { text: "Unlimited Projects", included: false },
      { text: "Instant Access to our design system", included: false },
      { text: "Create teams to collaborate on designs", included: false },
    ],
  },
  {
    tier: "mid",
    name: "Professional",
    description: "Ideal for individuals who need advanced features and tools for client work.",
    maxServices: 10,
    price: 25, // Assuming this is monthly in USD
    yearlyPrice: Math.round(25 * 12 * 0.75), // 25% off for yearly
    color: "bg-blue-600",
    textColor: "text-white",
    features: [
      { text: "20,000+ of PNG & SVG graphics", included: true },
      { text: "Access to 100 million stock images", included: true },
      { text: "Upload custom icons and fonts", included: true },
      { text: "Unlimited Sharing", included: true },
      { text: "Upload graphics & video in up to 4k", included: true },
      { text: "Unlimited Projects", included: true },
      { text: "Instant Access to our design system", included: false }, // Changed to false as per image
      { text: "Create teams to collaborate on designs", included: false }, // Changed to false as per image
    ],
  },
  {
    tier: "premium",
    name: "Enterprise",
    description: "Ideal for businesses who need personalized services and security for large teams.",
    maxServices: 20,
    price: 100, // Assuming this is monthly in USD
    yearlyPrice: Math.round(100 * 12 * 0.75), // 25% off for yearly
    color: "bg-white", // Changed to white
    textColor: "text-gray-900", // Changed to dark text
    features: [
      { text: "20,000+ of PNG & SVG graphics", included: true },
      { text: "Access to 100 million stock images", included: true },
      { text: "Upload custom icons and fonts", included: true },
      { text: "Unlimited Sharing", included: true },
      { text: "Upload graphics & video in up to 4k", included: true },
      { text: "Unlimited Projects", included: true },
      { text: "Instant Access to our design system", included: true },
      { text: "Create teams to collaborate on designs", included: true },
    ],
  },
  {
    tier: "unlimited",
    name: "Ultimate",
    description: "For large organizations requiring comprehensive features and dedicated support.",
    maxServices: Number.POSITIVE_INFINITY,
    price: 200,
    yearlyPrice: Math.round(200 * 12 * 0.75),
    color: "bg-amber-100",
    textColor: "text-amber-600",
    features: [
      { text: "Unlimited services", included: true },
      { text: "Enterprise analytics", included: true },
      { text: "Dedicated support", included: true },
      { text: "Custom branding", included: true },
      { text: "Team accounts", included: true },
      { text: "API access", included: true },
    ],
  },
]