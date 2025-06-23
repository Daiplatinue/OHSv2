import { Award, Sparkles, Users, TrendingUp, ChevronRight } from "lucide-react"

const outstandingCompanies = [
    {
        id: 1,
        name: "Innovate Solutions Inc.",
        description: "Leading the way in sustainable technology and groundbreaking innovations.",
        trophy: "gold",
        badge: "innovation",
        image: "https://cdn.pixabay.com/photo/2023/02/11/15/10/glasses-cleaning-7783103_1280.jpg",
    },
    {
        id: 2,
        name: "CustomerFirst Co.",
        description: "Dedicated to unparalleled customer service and satisfaction.",
        trophy: "silver",
        badge: "customer-satisfaction",
        image: "https://cdn.pixabay.com/photo/2018/05/12/19/00/drechsler-3394311_1280.jpg",
    },
    {
        id: 3,
        name: "Growth Dynamics Ltd.",
        description: "Achieving remarkable market expansion and consistent growth.",
        trophy: "bronze",
        badge: "growth",
        image: "https://cdn.pixabay.com/photo/2017/09/07/08/54/money-2724241_1280.jpg",
    },
]

export default function TopCompanies() {
    const getRankColor = (index: number) => {
        switch (index) {
            case 0:
                return "bg-gradient-to-br from-yellow-400 to-amber-500" 
            case 1:
                return "bg-gradient-to-br from-gray-300 to-gray-400" 
            case 2:
                return "bg-gradient-to-br from-amber-600 to-orange-700" 
            default:
                return "bg-gradient-to-br from-gray-300 to-gray-400"
        }
    }

    const getBadgeIcon = (badge: string) => {
        switch (badge) {
            case "innovation":
                return <Sparkles className="h-5 w-5 text-purple-500" />
            case "customer-satisfaction":
                return <Users className="h-5 w-5 text-blue-500" />
            case "growth":
                return <TrendingUp className="h-5 w-5 text-green-500" />
            default:
                return null
        }
    }

    return (
        <div className="bg-gray-50/50 py-20">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 mb-6">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Top Performers</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Most Outstanding Companies of 2025</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Celebrating the companies that excelled in innovation, customer satisfaction, and growth.
                    </p>
                </div>

                {/* Companies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {outstandingCompanies.map((company, index) => (
                        <div
                            key={company.id}
                            className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:border-gray-300/50 transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1"
                        >
                            {/* Rank Badge */}
                            <div className="absolute -top-3 -left-3 z-20">
                                <div
                                    className={`${getRankColor(
                                        index,
                                    )} text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg`}
                                >
                                    {index + 1}
                                </div>
                            </div>

                            {/* Image */}
                            <div className="relative h-48 overflow-hidden rounded-t-3xl">
                                <img
                                    src={company.image || "/placeholder.svg"}
                                    alt={company.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Company Name & Description */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">{company.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{company.description}</p>
                                </div>

                                {/* Trophy & Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Award
                                            className={`w-5 h-5 ${company.trophy === "gold" ? "fill-yellow-500 text-yellow-500" : company.trophy === "silver" ? "fill-gray-400 text-gray-400" : "fill-amber-700 text-amber-700"}`}
                                        />
                                        <span className="text-sm font-semibold text-gray-900">
                                            {company.trophy.charAt(0).toUpperCase() + company.trophy.slice(1)} Trophy
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500">
                                        {getBadgeIcon(company.badge)}
                                        <span className="text-sm font-medium">
                                            {company.badge
                                                .replace("-", " ")
                                                .split(" ")
                                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(" ")}
                                        </span>
                                    </div>
                                </div>

                                {/* Placeholder for location/other details if needed */}
                                <div className="flex items-center gap-2 mb-4">
                                    {/* You can add more details here if your company data includes them */}
                                </div>

                                {/* Placeholder for description if needed */}
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-2">
                                    {/* This space can be used for a longer description if available */}
                                </p>

                                {/* Call to Action (optional) */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-medium">Recognition</span>
                                        <span className="text-2xl font-bold text-gray-900">Top 3</span>
                                    </div>
                                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2">
                                        Learn More
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Subtle hover glow */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}