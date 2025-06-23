import { Trophy, Gem, Radio } from "lucide-react"

import img1 from '../../../assets/Home/Cheerful Youth Portrait.jpeg';
import img2 from '../../../assets/Home/Cheerful Youth Portrait.jpeg';
import img3 from '../../../assets/Home/Cheerful Youth Portrait.jpeg';

const topServices = [
  {
    id: 1,
    providerName: "SparkleClean",
    serviceName: "Regular Cleaning",
    image: img1,
    completedJobs: "10,000+",
    startingPrice: "100",
    isFirst: true,
  },
  {
    id: 2,
    providerName: "FixIt All",
    serviceName: "Furniture Assembly",
    image: img2,
    completedJobs: "5,000+",
    startingPrice: "50",
    isFirst: false,
  },
  {
    id: 3,
    providerName: "ColorMasters",
    serviceName: "Painting Services",
    image: img3,
    completedJobs: "3,000+",
    startingPrice: "150",
    isFirst: false,
  },
]

const serviceLeaderboardData = [
  {
    rank: 4,
    providerName: "GreenThumb",
    serviceName: "Gardening & Landscaping",
    tag: "@greenthumb",
    image: img1,
    reviews: "8,500",
    rating: "4.9",
    avgPrice: "75,200",
    location: "Boston",
  },
  {
    rank: 5,
    providerName: "TechFix",
    serviceName: "Electronics Repair",
    tag: "@techfix",
    image: img1,
    reviews: "7,200",
    rating: "4.8",
    avgPrice: "60,000",
    location: "San Francisco",
  },
  {
    rank: 6,
    providerName: "PlumbPerfect",
    serviceName: "Plumbing Services",
    tag: "@plumbperfect",
    image: img1,
    reviews: "6,000",
    rating: "4.7",
    avgPrice: "89,999",
    location: "Austin",
  },
]

export default function Popular() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Header for Online Home Services */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-medium text-gray-700 mb-4 tracking-tight">Top Rated Online Home Services</h2>
          <p className="text-md text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the most popular and highly-rated services in your area
          </p>
        </div>

        {/* Top 3 Services Section */}
        <div className="relative flex flex-col md:flex-row justify-center items-end gap-6 mb-12 mt-30">
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-gray-200 to-transparent opacity-50 rounded-t-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gray-100 opacity-70 rounded-t-3xl" />

          {/* FixIt All (2nd Place) */}
          <div className="relative z-10 flex flex-col items-center p-6 bg-gradient-to-b from-white to-transparent rounded-2xl border border-sky-200  shadow-lg w-full max-w-xs md:max-w-[200px] lg:max-w-[240px] pb-10 pt-16 -mb-8 md:mb-0">
            <div className="absolute -top-12">
              <img
                src={topServices[1].image || "/placeholder.svg"}
                alt={topServices[1].serviceName}
                width={80}
                height={80}
                className="rounded-full border-2 border-sky-500 shadow-md object-cover"
              />
            </div>
            {/* Badge moved here */}
            <div className="bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md mb-2">TOP 2</div>
            <h3 className="text-2xl">{topServices[1].providerName}</h3>
            <p className="text-sm text-gray-600">{topServices[1].serviceName}</p>
            <div className="mt-6 text-center">
              <div className="flex flex-col items-center gap-2 bg-gray-100 p-3 rounded-xl border border-gray-200">
                <Trophy className="w-6 h-6 text-gray-400" /> {/* Silver trophy */}
                <span className="text-sm text-gray-600">{topServices[1].completedJobs} Completed Jobs</span>
              </div>
              <div className="flex flex-col items-center gap-2 mt-4">
                <Gem className="w-6 h-6 text-sky-500" />
                <span className="text-2xl text-sky-500">₱{topServices[1].startingPrice}</span>
                <span className="text-sm text-gray-600">Starting Price</span>
              </div>
            </div>
          </div>

          {/* SparkleClean (1st Place) */}
          <div className="relative z-20 flex flex-col items-center p-6 bg-gradient-to-b from-white to-transparent rounded-2xl border border-sky-200 shadow-xl w-full max-w-xs md:max-w-[240px] lg:max-w-[280px] pb-10 pt-20 -mt-8 md:mt-0">
            <div className="absolute -top-16">
              <img
                src={topServices[0].image || "/placeholder.svg"}
                alt={topServices[0].serviceName}
                width={100}
                height={100}
                className="rounded-full border-2 border-sky-500 shadow-lg object-cover"
              />
            </div>
            {/* Badge moved here */}
            <div className="bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md mb-2">TOP 1</div>
            <h3 className="text-2xl">{topServices[0].providerName}</h3>
            <p className="text-sm text-gray-600">{topServices[0].serviceName}</p>
            <div className="mt-8 text-center">
              <div className="flex flex-col items-center gap-2 bg-gray-100 p-3 rounded-xl border border-gray-200">
                <Trophy className="w-7 h-7 text-amber-500" /> {/* Gold trophy */}
                <span className="text-base text-gray-600">{topServices[0].completedJobs} Completed Jobs</span>
              </div>
              <div className="flex flex-col items-center gap-2 mt-4">
                <Gem className="w-7 h-7 text-sky-500" />
                <span className="text-3xl text-sky-500">₱{topServices[0].startingPrice}</span>
                <span className="text-base text-gray-600">Starting Price</span>
              </div>
            </div>
          </div>

          {/* ColorMasters (3rd Place) */}
          <div className="relative z-10 flex flex-col items-center p-6 bg-gradient-to-b from-white to-transparent rounded-2xl border border-sky-200  shadow-lg w-full max-w-xs md:max-w-[200px] lg:max-w-[240px] pb-10 pt-16 -mb-8 md:mb-0">
            <div className="absolute -top-12">
              <img
                src={topServices[2].image || "/placeholder.svg"}
                alt={topServices[2].serviceName}
                width={80}
                height={80}
                className="rounded-full border-2 border-sky-500 shadow-md object-cover"
              />
            </div>
            {/* Badge moved here */}
            <div className="bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md mb-2">TOP 3</div>
            <h3 className="text-2xl">{topServices[2].providerName}</h3>
            <p className="text-sm text-gray-600">{topServices[2].serviceName}</p>
            <div className="mt-6 text-center">
              <div className="flex flex-col items-center gap-2 bg-gray-100 p-3 rounded-xl border border-gray-200">
                <Trophy className="w-6 h-6 text-orange-500" /> {/* Bronze trophy */}
                <span className="text-sm text-gray-600">{topServices[2].completedJobs} Completed Jobs</span>
              </div>
              <div className="flex flex-col items-center gap-2 mt-4">
                <Gem className="w-6 h-6 text-sky-500" />
                <span className="text-2xl text-sky-500">₱{topServices[2].startingPrice}</span>
                <span className="text-sm text-gray-600">Starting Price</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="flex justify-center mb-12">
          <div className="px-6 py-3 text-sm text-gray-600 flex items-center gap-2 flex-col">
            <div className="flex flex-col items-center gap-1 mt-6 text-gray-600">
              <Radio className="w-6 h-6" />
              <span className="text-xs">Live Leaderboard as of</span>
              <span className="text-sm font-medium text-sky-500">Today, 2 PM : 2025</span>
            </div>
            <div className="mt-2">
              Discover top-rated services with over <span className="text-sm font-medium text-sky-500">23,141</span> satisfied
              customers
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white/70 rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {" "}
            {/* Added for responsiveness */}
            <table className="w-full text-left table-auto min-w-[700px]">
              {" "}
              {/* min-w to ensure table doesn't shrink too much */}
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-gray-600 font-medium text-sm">Rank</th>
                  <th className="px-6 py-4 text-gray-600 font-medium text-sm">Service Provider</th>
                  <th className="px-6 py-4 text-gray-600 font-medium text-sm text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span>Reviews</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-gray-600 font-medium text-sm text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span>Rating</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-gray-600 font-medium text-sm text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span>Location</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-gray-600 font-medium text-sm">Avg. Price</th>
                </tr>
              </thead>
              <tbody>
                {serviceLeaderboardData.slice(0, 5).map((service) => (
                  <tr
                    key={service.rank}
                    className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700 font-medium">{service.rank}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.providerName}
                          width={40}
                          height={40}
                          className="rounded-full border border-gray-200 object-cover"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{service.providerName}</div>
                          <div className="text-xs text-gray-500">{service.tag}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-center">{service.reviews}</td>
                    <td className="px-6 py-4 text-gray-700 text-center">{service.rating}</td>
                    <td className="px-6 py-4 text-gray-700 text-center">{service.location}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sky-500 font-semibold">
                        ₱{service.avgPrice}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}