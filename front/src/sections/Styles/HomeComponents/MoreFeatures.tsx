import qimg1 from "../../../assets/servcies.jpeg"
import qimg2 from "../../../assets/Vibrant Circus Tent.jpeg"
import qimg3 from "../../../assets/Modern Minimalist Café.jpeg"
import qimg4 from "../../../assets/Young Man with Corded Telephone.jpeg"
import qimg5 from "../../../assets/Hands Holding Pill.jpeg"

function MoreFeatures() {
  return (
    <div className="max-w-7xl mx-auto mt-15">
      <h2 className="text-2xl font-extralight mb-6 text-gray-700">More Features</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="relative rounded-xl overflow-hidden h-40 group cursor-pointer hover:shadow-lg transition-all duration-300">
          <img
            src={qimg1 || "/placeholder.svg"}
            alt="Organic Veggies"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <span className="text-sm font-medium text-center text-white">To Be Announced</span>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden h-40 group cursor-pointer hover:shadow-lg transition-all duration-300">
          <img
            src={qimg2 || "/placeholder.svg"}
            alt="Fresh Fruits"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <span className="text-sm font-medium text-center text-white">To Be Announced</span>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden h-40 group cursor-pointer hover:shadow-lg transition-all duration-300">
          <img
            src={qimg3 || "/placeholder.svg"}
            alt="Cold Drinks"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <span className="text-sm font-medium text-center text-white">To Be Announced</span>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden h-40 group cursor-pointer hover:shadow-lg transition-all duration-300">
          <img
            src={qimg4 || "/placeholder.svg"}
            alt="Instant Food"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <span className="text-sm font-medium text-center text-white">To Be Announced</span>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden h-40 group cursor-pointer hover:shadow-lg transition-all duration-300">
          <img
            src={qimg5 || "/placeholder.svg"}
            alt="Dairy Products"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <span className="text-sm font-medium text-center text-white">To Be Announced</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoreFeatures
