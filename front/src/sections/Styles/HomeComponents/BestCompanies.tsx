import { Gem, Star, MapPin, Award, ClipboardList } from "lucide-react"

import img1 from "../../../assets/Home/Cheerful Youth Portrait.jpeg"

const topCompanies = [
    {
        id: 1,
        companyName: "ReviewStars Inc.",
        category: "Most Positive Reviews",
        image: img1,
        metricValue: "Most Positive Reviews",
        count: "3.2M+",
        rating: "5.0",
        location: "New York",
        secondaryMetric: "150K+",
        awards: "10 Major Awards",
    },
    {
        id: 2,
        companyName: "ServiceFlow Co.",
        category: "Most Completed Services",
        image: img1,
        metricValue: "Most Completed Services",
        count: "2.9M+",
        rating: "4.9",
        location: "Los Angeles",
        secondaryMetric: "95%",
        awards: "5 Industry Awards",
    },
    {
        id: 3,
        companyName: "AwardWinners Ltd.",
        category: "Most Awarded",
        image: img1,
        metricValue: "Recognized Globally",
        count: "1.2M+",
        rating: "4.8",
        location: "Chicago",
        secondaryMetric: "90%",
        awards: "100+ Awards Won",
    },
    {
        id: 4,
        companyName: "HandyHome Experts",
        category: "Most Trusted Service Provider",
        image: img1,
        metricValue: "10 Years Experience",
        count: "12,000+",
        rating: "4.8",
        location: "Quezon City",
        secondaryMetric: "1,200+",
        awards: "Best Customer Care 2025",
    },
    {
        id: 5,
        companyName: "FixIt All Co.",
        category: "Leading Home Repair Experts",
        image: img1,
        metricValue: "Gold Standard",
        count: "9,500+",
        rating: "4.9",
        location: "Cebu City",
        secondaryMetric: "1,000+",
        awards: "Gold Standard Service Award",
    },
    {
        id: 6,
        companyName: "QuickServe Solutions",
        category: "Fastest Response Time",
        image: img1,
        metricValue: "Rapid Response Award",
        count: "15,000+",
        rating: "4.7",
        location: "Davao City",
        secondaryMetric: "300+",
        awards: "Rapid Response Award 2025",
    }
]

export default function BestCompanies() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans mt-10">
            <div className="max-w-7xl mx-auto">
                {/* Header for Top Rated Companies */}
                <div className="text-center mb-[-50px]">
                    <h2 className="text-4xl font-medium text-gray-700 mb-4 tracking-tight">
                        Top Industry Awardees – 2025
                    </h2>
                    <p className="text-md text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Explore the top-performing companies recognized for exceptional customer satisfaction, outstanding service delivery, and industry excellence
                    </p>
                </div>

                {/* Top 6 Companies Section - Responsive Grid */}
                <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 pt-20 p-15">
                    {topCompanies.map((company) => (
                        <div
                            key={company.id}
                            className="relative z-10 flex flex-col items-center p-6 bg-gradient-to-b from-white to-transparent rounded-2xl border border-sky-200 pb-10 pt-16 w-full mt-15"
                        >
                            <div className="absolute -top-12">
                                <img
                                    src={company.image || "/placeholder.svg"}
                                    alt={company.companyName}
                                    width={80} // Uniform image size
                                    height={80} // Uniform image size
                                    className="rounded-full border-2 border-sky-500 object-cover"
                                />
                            </div>
                            <h3 className="text-2xl">{company.companyName}</h3>
                            <p className="text-sm text-gray-600">{company.category}</p>
                            <div className="mt-6 text-center">
                                <div className="flex flex-col gap-y-2 gap-x-4 mt-1 mb-8 text-sm text-gray-700 w-full text-center items-center">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        {company.rating} ({company.count} reviews)
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span>{company.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ClipboardList className="w-4 h-4 text-green-600" />
                                        <span>
                                            {company.category.includes("Reviews") ? "Completed Services" : "Positive Reviews"}:{" "}
                                            {company.secondaryMetric}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Award className="w-4 h-4 text-purple-600" />
                                        <span>Awards: {company.awards}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2 mt-4">
                                    <Gem className="w-6 h-6 text-sky-500" />
                                    <span className="text-2xl text-sky-500">{company.metricValue}</span>
                                    <span className="text-sm text-gray-600">
                                        {company.category.includes("Reviews")
                                            ? "Positive Reviews"
                                            : company.category.includes("Services")
                                                ? "Completed Services"
                                                : "Awards Won"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}