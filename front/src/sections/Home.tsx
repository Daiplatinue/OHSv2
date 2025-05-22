import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, X, ChevronDown, ChevronUp } from 'lucide-react';

import Footer from "../sections/Styles/Footer"

import WorkersModal from "./Styles/WorkersModal"
import SponsorMarquee from "./Styles/SponsorMarquee"
import ServiceShowcase from "./Styles/ServiceShowcase"
import MyFloatingDockCustomer from "./Styles/MyFloatingDock-Customer"
import ServiceCategoriesModal from "./Styles/ServiceCategoriesModal"

import image1 from "../assets/Collaborative Workspace.jpeg"
import image2 from "../assets/Sleek Black Sports Car on Highway.jpeg"
import image3 from "../assets/Professional Construction Supervisor.jpeg"

import PromoBanner from "./Styles/PromoBanner"
import ServiceBanner from "./Styles/ServiceBanner"
import ServicesPromote from "./Styles/ServicesPromote"

import qimg1 from "../assets/servcies.jpeg"
import qimg2 from "../assets/Vibrant Circus Tent.jpeg"
import qimg3 from "../assets/Modern Minimalist Café.jpeg"
import qimg4 from "../assets/Young Man with Corded Telephone.jpeg"
import qimg5 from "../assets/Hands Holding Pill.jpeg"

import LegalText from "./Styles/LegalText"

const serviceSubcategories = {
  "Plumbing Services": [
    {
      id: 1,
      name: "Leak Repairs",
      description: "Quick identification and repair of leaks in pipes, faucets, and fixtures to prevent water damage.",
      price: 1500,
      image: "https://cdn.pixabay.com/photo/2018/04/04/15/43/outdoors-3290142_1280.jpg",
      workerCount: 1,
      estimatedTime: "1-2 hours",
    },
    {
      id: 2,
      name: "Pipe Installation",
      description: "Professional installation of new pipes, including PVC, copper, and PEX piping systems.",
      price: 3500,
      image: "https://cdn.pixabay.com/photo/2015/07/11/14/53/plumbing-840835_1280.jpg",
      workerCount: 2,
      estimatedTime: "3-5 hours",
    },
    {
      id: 3,
      name: "Drain Cleaning",
      description: "Removal of clogs and buildup in drains using professional-grade equipment and techniques.",
      price: 1200,
      image: "https://cdn.pixabay.com/photo/2017/06/29/15/47/drain-2454608_1280.jpg",
      workerCount: 1,
      estimatedTime: "1-2 hours",
    },
    {
      id: 4,
      name: "Toilet Repairs",
      description: "Fixing running toilets, replacing flush mechanisms, and addressing leaks at the base.",
      price: 1000,
      image: "https://cdn.pixabay.com/photo/2016/07/26/10/51/toilet-1542514_1280.jpg",
      workerCount: 1,
      estimatedTime: "1 hour",
    }
    
  ],
  "Handyman Services": [
    {
      id: 5,
      name: "Plumbing Fixes",
      description: "Minor plumbing repairs including leaky faucets, running toilets, and clogged drains.",
      price: 1300,
      image: "https://cdn.pixabay.com/photo/2015/07/11/14/53/plumbing-840835_1280.jpg",
      workerCount: 1,
      estimatedTime: "1-2 hours",
    },
    {
      id: 6,
      name: "Door & Window Repairs",
      description: "Fixing stuck doors, broken hinges, window tracks, and hardware replacement.",
      price: 950,
      image: "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg",
      workerCount: 1,
      estimatedTime: "1-2 hours",
    },
  ],
  "Home Cleaning Services": [
    {
      id: 12,
      name: "Regular Cleaning",
      description: "Standard cleaning service including dusting, vacuuming, mopping, and bathroom cleaning.",
      price: 2500,
      image: "https://cdn.pixabay.com/photo/2023/02/11/15/10/glasses-cleaning-7783103_1280.jpg",
      workerCount: 2,
      estimatedTime: "2-3 hours",
    },
    {
      id: 13,
      name: "Deep Cleaning",
      description: "Thorough cleaning of all areas including hard-to-reach places, appliances, and detailed scrubbing.",
      price: 4500,
      image: "https://cdn.pixabay.com/photo/2015/10/25/19/37/auto-1006216_960_720.jpg",
      workerCount: 3,
      estimatedTime: "4-6 hours",
    },
    {
      id: 14,
      name: "Move-In/Move-Out Cleaning",
      description: "Comprehensive cleaning for vacant properties before moving in or after moving out.",
      price: 5000,
      image: "https://cdn.pixabay.com/photo/2018/03/10/12/00/paper-3213924_1280.jpg",
      workerCount: 3,
      estimatedTime: "5-7 hours",
    },
    {
      id: 15,
      name: "Carpet Cleaning",
      description: "Professional deep cleaning of carpets using hot water extraction and specialized equipment.",
      price: 3000,
      image: "https://cdn.pixabay.com/photo/2020/08/25/18/28/workplace-5517744_1280.jpg",
      workerCount: 2,
      estimatedTime: "2-4 hours",
    },
    {
      id: 16,
      name: "Window Cleaning",
      description: "Interior and exterior window cleaning, including screens, tracks, and sills.",
      price: 2800,
      image: "https://cdn.pixabay.com/photo/2014/07/31/00/30/vw-beetle-405876_1280.jpg",
      workerCount: 2,
      estimatedTime: "2-4 hours",
    },
  ],
  "Pest Control Services": [
    {
      id: 19,
      name: "Rodent Control",
      description: "Elimination and prevention of mice, rats, and other rodents using traps and exclusion methods.",
      price: 4000,
      image: "https://cdn.pixabay.com/photo/2016/10/26/22/00/hamster-1772742_960_720.jpg",
      workerCount: 1,
      estimatedTime: "2-3 hours",
    },
    {
      id: 20,
      name: "Bed Bug Treatment",
      description: "Comprehensive treatment to eliminate bed bugs from mattresses, furniture, and living spaces.",
      price: 5500,
      image: "https://cdn.pixabay.com/photo/2019/11/11/17/50/insects-4619045_960_720.jpg",
      workerCount: 2,
      estimatedTime: "3-4 hours",
    },
    {
      id: 21,
      name: "Mosquito Control",
      description: "Yard treatments to reduce mosquito populations and prevent breeding around your home.",
      price: 2800,
      image: "https://cdn.pixabay.com/photo/2015/06/24/17/40/insects-820484_1280.jpg",
      workerCount: 1,
      estimatedTime: "1-2 hours",
    },
  ],
  "Landscaping Services": [
    {
      id: 43,
      name: "Lawn Maintenance",
      description: "Regular lawn care including mowing, edging, and fertilization.",
      price: 2500,
      image: "https://cdn.pixabay.com/photo/2017/09/22/19/05/garden-2776123_1280.jpg",
      workerCount: 2,
      estimatedTime: "2-3 hours",
    },
    {
      id: 44,
      name: "Garden Design",
      description: "Custom garden design and installation with expert plant selection.",
      price: 15000,
      image: "https://cdn.pixabay.com/photo/2020/04/26/10/35/garden-5094801_1280.jpg",
      workerCount: 3,
      estimatedTime: "2-3 days",
    },
    {
      id: 45,
      name: "Tree Services",
      description: "Professional tree trimming, removal, and maintenance services.",
      price: 8000,
      image: "https://cdn.pixabay.com/photo/2017/08/07/23/50/climbing-2609319_1280.jpg",
      workerCount: 3,
      estimatedTime: "4-6 hours",
    },
  ],
  "HVAC Maintenance": [
    {
      id: 46,
      name: "AC Servicing",
      description: "Comprehensive air conditioning maintenance and repair.",
      price: 3500,
      image: "https://cdn.pixabay.com/photo/2018/01/27/23/46/water-heater-3112352_1280.jpg",
      workerCount: 1,
      estimatedTime: "2-3 hours",
    },
    {
      id: 47,
      name: "Heating System Repair",
      description: "Expert heating system diagnostics and repairs.",
      price: 4000,
      image: "https://cdn.pixabay.com/photo/2016/11/29/09/41/construction-1868667_1280.jpg",
      workerCount: 1,
      estimatedTime: "2-4 hours",
    },
    {
      id: 48,
      name: "Duct Cleaning",
      description: "Professional air duct cleaning and sanitization.",
      price: 5000,
      image: "https://cdn.pixabay.com/photo/2017/08/07/19/45/air-conditioning-2607432_1280.jpg",
      workerCount: 2,
      estimatedTime: "4-6 hours",
    },
  ],
  "Roofing Services": [
    {
      id: 49,
      name: "Roof Inspection",
      description: "Thorough roof inspection and maintenance check.",
      price: 2000,
      image: "https://cdn.pixabay.com/photo/2017/12/27/03/41/roof-3041830_1280.jpg",
      workerCount: 1,
      estimatedTime: "1-2 hours",
    },
    {
      id: 50,
      name: "Roof Repair",
      description: "Professional repair of leaks and damaged roofing.",
      price: 8000,
      image: "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg",
      workerCount: 2,
      estimatedTime: "4-8 hours",
    },
    {
      id: 51,
      name: "Roof Replacement",
      description: "Complete roof replacement with quality materials.",
      price: 35000,
      image: "https://cdn.pixabay.com/photo/2018/07/01/13/28/repair-3509295_1280.jpg",
      workerCount: 4,
      estimatedTime: "2-3 days",
    },
  ],
  "Interior Design": [
    {
      id: 52,
      name: "Design Consultation",
      description: "Professional interior design consultation and planning.",
      price: 5000,
      image: "https://cdn.pixabay.com/photo/2017/03/22/17/39/kitchen-2165756_1280.jpg",
      workerCount: 1,
      estimatedTime: "2-3 hours",
    },
    {
      id: 53,
      name: "Room Styling",
      description: "Complete room styling and decoration services.",
      price: 15000,
      image: "https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg",
      workerCount: 2,
      estimatedTime: "1-2 days",
    },
    {
      id: 54,
      name: "Color Consultation",
      description: "Expert color scheme selection and planning.",
      price: 3000,
      image: "https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_1280.jpg",
      workerCount: 1,
      estimatedTime: "1-2 hours",
    },
  ],
}

const sellers = {
  "Leak Repairs": [
    {
      id: 1,
      name: "PipeFix Pros",
      rating: 4,
      reviews: 1250,
      location: "New York",
      startingRate: 1500,
      ratePerKm: 25,
      badges: ["hot", "top"],
      description: "Expert leak detection and repair with minimal disruption to your home.",
      workerCount: 1,
    },
    {
      id: 2,
      name: "LeakBusters",
      rating: 5,
      reviews: 2100,
      location: "Los Angeles",
      startingRate: 1600,
      ratePerKm: 30,
      badges: ["in demand"],
      description: "Specialized in finding hidden leaks using advanced technology and fixing them permanently.",
      workerCount: 1,
    },
  ],
  "Pipe Installation": [
    {
      id: 3,
      name: "PipeMasters",
      rating: 5,
      reviews: 1800,
      location: "Chicago",
      startingRate: 3500,
      ratePerKm: 35,
      badges: ["top"],
      description: "Professional pipe installation with quality materials and expert craftsmanship.",
      workerCount: 2,
    },
    {
      id: 4,
      name: "FlowPro Plumbing",
      rating: 4,
      reviews: 1200,
      location: "Houston",
      startingRate: 3200,
      ratePerKm: 30,
      badges: ["hot"],
      description: "Comprehensive pipe installation services for new construction and remodels.",
      workerCount: 2,
    },
  ],
  "Drain Cleaning": [
    {
      id: 5,
      name: "DrainMasters",
      rating: 4,
      reviews: 890,
      location: "Chicago",
      startingRate: 1200,
      ratePerKm: 20,
      badges: [],
      description: "Effective drain cleaning using professional-grade equipment for lasting results.",
      workerCount: 1,
    },
    {
      id: 6,
      name: "FlowFix",
      rating: 5,
      reviews: 1050,
      location: "Philadelphia",
      startingRate: 1300,
      ratePerKm: 22,
      badges: ["top"],
      description: "Specialized in clearing stubborn clogs and preventing future blockages.",
      workerCount: 1,
    },
  ],
  "Toilet Repairs": [
    {
      id: 7,
      name: "ToiletTechs",
      rating: 5,
      reviews: 780,
      location: "Phoenix",
      startingRate: 1000,
      ratePerKm: 18,
      badges: ["hot"],
      description: "Fast and reliable toilet repair services with same-day appointments available.",
      workerCount: 1,
    },
    {
      id: 8,
      name: "FlushMasters",
      rating: 4,
      reviews: 650,
      location: "San Diego",
      startingRate: 950,
      ratePerKm: 15,
      badges: [],
      description: "Toilet repair specialists with expertise in all brands and models.",
      workerCount: 1,
    },
  ],
  "Water Heater Services": [
    {
      id: 9,
      name: "HotWater Pros",
      rating: 5,
      reviews: 920,
      location: "Dallas",
      startingRate: 4500,
      ratePerKm: 40,
      badges: ["top", "in demand"],
      description: "Expert water heater installation, repair, and maintenance for all types and brands.",
      workerCount: 2,
    },
    {
      id: 10,
      name: "HeaterFix",
      rating: 4,
      reviews: 780,
      location: "San Antonio",
      startingRate: 4200,
      ratePerKm: 35,
      badges: [],
      description: "Specialized in tankless water heater installation and traditional water heater repairs.",
      workerCount: 2,
    },
  ],
  "Furniture Assembly": [
    {
      id: 11,
      name: "FixIt All",
      rating: 5,
      reviews: 3200,
      location: "San Francisco",
      startingRate: 800,
      ratePerKm: 15,
      badges: ["hot", "in demand"],
      description:
        "Expert furniture assembly with attention to detail. We assemble all types of furniture quickly and correctly.",
      workerCount: 1,
    },
    {
      id: 12,
      name: "AssembleIt",
      rating: 4,
      reviews: 1200,
      location: "Seattle",
      startingRate: 750,
      ratePerKm: 12,
      badges: ["top"],
      description:
        "Specialized in IKEA and other flat-pack furniture assembly. Fast, efficient, and guaranteed satisfaction.",
      workerCount: 1,
    },
  ],
  "Drywall Repair": [
    {
      id: 13,
      name: "WallFixers",
      rating: 5,
      reviews: 980,
      location: "Portland",
      startingRate: 1200,
      ratePerKm: 18,
      badges: ["top"],
      description: "Professional drywall repair and patching. We make damaged walls look like new again.",
      workerCount: 1,
    },
    {
      id: 14,
      name: "PatchPros",
      rating: 4,
      reviews: 750,
      location: "Denver",
      startingRate: 1100,
      ratePerKm: 20,
      badges: [],
      description: "Specializing in drywall patching, texturing, and finishing. Quality repairs at affordable prices.",
      workerCount: 1,
    },
  ],
  "Painting Services": [
    {
      id: 15,
      name: "ColorMasters",
      rating: 5,
      reviews: 2100,
      location: "Austin",
      startingRate: 1500,
      ratePerKm: 22,
      badges: ["hot", "top"],
      description:
        "Professional painting services for interior and exterior projects. We use premium paints and deliver flawless results.",
      workerCount: 2,
    },
    {
      id: 16,
      name: "BrushStrokes",
      rating: 4,
      reviews: 1800,
      location: "Dallas",
      startingRate: 1400,
      ratePerKm: 20,
      badges: ["in demand"],
      description: "Quality painting services with attention to detail. We prep, paint, and clean up thoroughly.",
      workerCount: 2,
    },
  ],
  "Electrical Repairs": [
    {
      id: 17,
      name: "PowerPros",
      rating: 5,
      reviews: 1600,
      location: "Phoenix",
      startingRate: 1800,
      ratePerKm: 25,
      badges: ["top"],
      description:
        "Licensed electricians for all your electrical repair needs. Safe, reliable, and code-compliant work.",
      workerCount: 1,
    },
    {
      id: 18,
      name: "WireMasters",
      rating: 4,
      reviews: 1200,
      location: "Las Vegas",
      startingRate: 1700,
      ratePerKm: 22,
      badges: [],
      description: "Electrical repair specialists with years of experience. We fix it right the first time.",
      workerCount: 1,
    },
  ],
  "Plumbing Fixes": [
    {
      id: 19,
      name: "QuickFix Plumbing",
      rating: 5,
      reviews: 1400,
      location: "Miami",
      startingRate: 1300,
      ratePerKm: 20,
      badges: ["hot"],
      description: "Fast and reliable minor plumbing repairs. We fix leaks, clogs, and other common issues quickly.",
      workerCount: 1,
    },
    {
      id: 20,
      name: "DrainDoctors",
      rating: 4,
      reviews: 950,
      location: "Atlanta",
      startingRate: 1200,
      ratePerKm: 18,
      badges: [],
      description: "Specializing in drain cleaning and minor plumbing repairs. Affordable rates and quality service.",
      workerCount: 1,
    },
  ],
  "Door & Window Repairs": [
    {
      id: 21,
      name: "DoorDoctors",
      rating: 5,
      reviews: 1100,
      location: "Chicago",
      startingRate: 950,
      ratePerKm: 15,
      badges: ["top"],
      description: "Expert door and window repair services. We fix sticking doors, broken hardware, and more.",
      workerCount: 1,
    },
    {
      id: 22,
      name: "WindowWizards",
      rating: 4,
      reviews: 850,
      location: "Boston",
      startingRate: 900,
      ratePerKm: 16,
      badges: [],
      description: "Specializing in window track repairs, hardware replacement, and weatherstripping installation.",
      workerCount: 1,
    },
  ],
  "Regular Cleaning": [
    {
      id: 23,
      name: "SparkleClean",
      rating: 5,
      reviews: 4200,
      location: "Boston",
      startingRate: 2500,
      ratePerKm: 20,
      badges: ["hot", "top", "in demand"],
      description: "Thorough regular cleaning services using eco-friendly products and professional techniques.",
      workerCount: 2,
    },
    {
      id: 24,
      name: "FreshSpaces",
      rating: 4,
      reviews: 2800,
      location: "Miami",
      startingRate: 2300,
      ratePerKm: 22,
      badges: ["hot"],
      description: "Reliable regular cleaning services customized to your specific needs and preferences.",
      workerCount: 2,
    },
  ],
  "Deep Cleaning": [
    {
      id: 25,
      name: "DeepClean Pros",
      rating: 5,
      reviews: 1900,
      location: "Washington DC",
      startingRate: 4500,
      ratePerKm: 25,
      badges: ["top"],
      description: "Comprehensive deep cleaning that reaches every corner and surface in your home.",
      workerCount: 3,
    },
    {
      id: 26,
      name: "ThoroughClean",
      rating: 4,
      reviews: 1600,
      location: "Atlanta",
      startingRate: 4200,
      ratePerKm: 23,
      badges: ["in demand"],
      description: "Detailed deep cleaning services that eliminate dirt, grime, and allergens from your home.",
      workerCount: 3,
    },
  ],
  "Move-In/Move-Out Cleaning": [
    {
      id: 27,
      name: "FreshStart Cleaning",
      rating: 5,
      reviews: 1500,
      location: "Denver",
      startingRate: 5000,
      ratePerKm: 30,
      badges: ["top"],
      description: "Thorough move-in/move-out cleaning that meets landlord and property management standards.",
      workerCount: 3,
    },
    {
      id: 28,
      name: "CleanSlate",
      rating: 4,
      reviews: 1200,
      location: "Portland",
      startingRate: 4800,
      ratePerKm: 28,
      badges: ["hot"],
      description: "Comprehensive cleaning services for vacant properties, ensuring they're ready for new occupants.",
      workerCount: 3,
    },
  ],
  "Carpet Cleaning": [
    {
      id: 29,
      name: "CarpetRevive",
      rating: 5,
      reviews: 1300,
      location: "Seattle",
      startingRate: 3000,
      ratePerKm: 25,
      badges: ["top"],
      description: "Professional carpet cleaning that removes deep stains, allergens, and odors.",
      workerCount: 2,
    },
    {
      id: 30,
      name: "FreshFibers",
      rating: 4,
      reviews: 950,
      location: "San Diego",
      startingRate: 2800,
      ratePerKm: 22,
      badges: [],
      description: "Specialized carpet cleaning using hot water extraction and eco-friendly solutions.",
      workerCount: 2,
    },
  ],
  "Window Cleaning": [
    {
      id: 31,
      name: "ClearView",
      rating: 5,
      reviews: 1100,
      location: "Chicago",
      startingRate: 2800,
      ratePerKm: 20,
      badges: ["top"],
      description: "Professional window cleaning for crystal clear results, inside and out.",
      workerCount: 2,
    },
    {
      id: 32,
      name: "ShineTime",
      rating: 4,
      reviews: 850,
      location: "Philadelphia",
      startingRate: 2600,
      ratePerKm: 18,
      badges: [],
      description: "Detailed window cleaning services that leave your windows spotless and streak-free.",
      workerCount: 2,
    },
  ],
  "General Pest Control": [
    {
      id: 33,
      name: "PestAway",
      rating: 5,
      reviews: 1800,
      location: "Austin",
      startingRate: 3500,
      ratePerKm: 30,
      badges: ["hot"],
      description: "Comprehensive pest control for common household pests with eco-friendly options available.",
      workerCount: 1,
    },
    {
      id: 34,
      name: "BugBusters",
      rating: 4,
      reviews: 1500,
      location: "San Antonio",
      startingRate: 3300,
      ratePerKm: 28,
      badges: ["top"],
      description: "Effective pest control treatments that eliminate current infestations and prevent future ones.",
      workerCount: 1,
    },
  ],
  "Termite Treatment": [
    {
      id: 35,
      name: "TermiteTerminators",
      rating: 5,
      reviews: 1200,
      location: "Phoenix",
      startingRate: 6000,
      ratePerKm: 40,
      badges: ["top", "in demand"],
      description: "Specialized termite treatment and prevention services to protect your home from damage.",
      workerCount: 2,
    },
    {
      id: 36,
      name: "WoodDefenders",
      rating: 4,
      reviews: 950,
      location: "Las Vegas",
      startingRate: 5800,
      ratePerKm: 38,
      badges: [],
      description: "Comprehensive termite control with inspection, treatment, and preventive measures.",
      workerCount: 2,
    },
  ],
  "Rodent Control": [
    {
      id: 37,
      name: "RodentRid",
      rating: 5,
      reviews: 1100,
      location: "Seattle",
      startingRate: 4000,
      ratePerKm: 35,
      badges: ["top"],
      description: "Effective rodent control using humane trapping and exclusion methods.",
      workerCount: 1,
    },
    {
      id: 38,
      name: "MouseMasters",
      rating: 4,
      reviews: 850,
      location: "Portland",
      startingRate: 3800,
      ratePerKm: 32,
      badges: [],
      description: "Comprehensive rodent control services that eliminate current infestations and prevent future ones.",
      workerCount: 1,
    },
  ],
  "Bed Bug Treatment": [
    {
      id: 39,
      name: "BedBugBanishers",
      rating: 5,
      reviews: 980,
      location: "New York",
      startingRate: 5500,
      ratePerKm: 35,
      badges: ["top", "in demand"],
      description: "Specialized bed bug treatment using heat treatment and targeted applications.",
      workerCount: 2,
    },
    {
      id: 40,
      name: "NightmareNoMore",
      rating: 4,
      reviews: 820,
      location: "Chicago",
      startingRate: 5200,
      ratePerKm: 32,
      badges: ["hot"],
      description: "Effective bed bug elimination with follow-up inspections to ensure complete removal.",
      workerCount: 2,
    },
  ],
  "Mosquito Control": [
    {
      id: 41,
      name: "MosquitoMasters",
      rating: 5,
      reviews: 750,
      location: "Miami",
      startingRate: 2800,
      ratePerKm: 25,
      badges: ["top"],
      description: "Yard treatments that significantly reduce mosquito populations around your home.",
      workerCount: 1,
    },
    {
      id: 42,
      name: "BuzzOff",
      rating: 4,
      reviews: 620,
      location: "Houston",
      startingRate: 2600,
      ratePerKm: 22,
      badges: [],
      description: "Effective mosquito control services that target breeding sites and adult mosquitoes.",
      workerCount: 1,
    },
  ],
  "Lawn Maintenance": [
    {
      id: 43,
      name: "GreenThumb Pro",
      rating: 5,
      reviews: 890,
      location: "Portland",
      startingRate: 2500,
      ratePerKm: 20,
      badges: ["top"],
      description: "Expert lawn care services with attention to detail.",
      workerCount: 2,
    },
    {
      id: 44,
      name: "LawnMasters",
      rating: 4,
      reviews: 750,
      location: "Seattle",
      startingRate: 2300,
      ratePerKm: 18,
      badges: ["hot"],
      description: "Professional lawn maintenance with eco-friendly practices.",
      workerCount: 2,
    },
  ],
  "Garden Design": [
    {
      id: 45,
      name: "Garden Artistry",
      rating: 5,
      reviews: 680,
      location: "San Francisco",
      startingRate: 15000,
      ratePerKm: 30,
      badges: ["top", "in demand"],
      description: "Creative garden design solutions for any space.",
      workerCount: 3,
    },
    {
      id: 46,
      name: "EdenCreators",
      rating: 4,
      reviews: 520,
      location: "Los Angeles",
      startingRate: 14000,
      ratePerKm: 28,
      badges: [],
      description: "Transforming outdoor spaces into beautiful gardens.",
      workerCount: 3,
    },
  ],
  "Tree Services": [
    {
      id: 47,
      name: "TreeCare Experts",
      rating: 5,
      reviews: 450,
      location: "Denver",
      startingRate: 8000,
      ratePerKm: 35,
      badges: ["top"],
      description: "Professional tree care and maintenance services.",
      workerCount: 3,
    },
    {
      id: 48,
      name: "Arbor Masters",
      rating: 4,
      reviews: 380,
      location: "Phoenix",
      startingRate: 7500,
      ratePerKm: 32,
      badges: ["hot"],
      description: "Expert tree trimming and removal services.",
      workerCount: 3,
    },
  ],
  "AC Servicing": [
    {
      id: 49,
      name: "CoolAir Pro",
      rating: 5,
      reviews: 920,
      location: "Houston",
      startingRate: 3500,
      ratePerKm: 25,
      badges: ["top", "in demand"],
      description: "Expert AC maintenance and repair services.",
      workerCount: 1,
    },
    {
      id: 50,
      name: "AirCare Solutions",
      rating: 4,
      reviews: 780,
      location: "Dallas",
      startingRate: 3300,
      ratePerKm: 22,
      badges: ["hot"],
      description: "Professional AC servicing and troubleshooting.",
      workerCount: 1,
    },
  ],
  "Heating System Repair": [
    {
      id: 51,
      name: "HeatPro Services",
      rating: 5,
      reviews: 850,
      location: "Chicago",
      startingRate: 4000,
      ratePerKm: 28,
      badges: ["top"],
      description: "Expert heating system repairs and maintenance.",
      workerCount: 1,
    },
    {
      id: 52,
      name: "WarmthTech",
      rating: 4,
      reviews: 680,
      location: "Boston",
      startingRate: 3800,
      ratePerKm: 25,
      badges: [],
      description: "Professional heating system diagnostics and repairs.",
      workerCount: 1,
    },
  ],
  "Duct Cleaning": [
    {
      id: 53,
      name: "AirFlow Masters",
      rating: 5,
      reviews: 720,
      location: "Atlanta",
      startingRate: 5000,
      ratePerKm: 30,
      badges: ["top"],
      description: "Thorough duct cleaning and sanitization services.",
      workerCount: 2,
    },
    {
      id: 54,
      name: "DuctPro Clean",
      rating: 4,
      reviews: 580,
      location: "Miami",
      startingRate: 4800,
      ratePerKm: 28,
      badges: ["hot"],
      description: "Professional air duct cleaning and maintenance.",
      workerCount: 2,
    },
  ],
  "Roof Inspection": [
    {
      id: 55,
      name: "RoofCheck Pro",
      rating: 5,
      reviews: 620,
      location: "Denver",
      startingRate: 2000,
      ratePerKm: 20,
      badges: ["top"],
      description: "Detailed roof inspections and assessments.",
      workerCount: 1,
    },
    {
      id: 56,
      name: "InspectTech Roofing",
      rating: 4,
      reviews: 480,
      location: "Seattle",
      startingRate: 1800,
      ratePerKm: 18,
      badges: [],
      description: "Professional roof inspection services.",
      workerCount: 1,
    },
  ],
  "Roof Repair": [
    {
      id: 57,
      name: "RoofFix Masters",
      rating: 5,
      reviews: 780,
      location: "Portland",
      startingRate: 8000,
      ratePerKm: 35,
      badges: ["top", "in demand"],
      description: "Expert roof repair and maintenance services.",
      workerCount: 2,
    },
    {
      id: 58,
      name: "LeakStop Pro",
      rating: 4,
      reviews: 650,
      location: "Phoenix",
      startingRate: 7500,
      ratePerKm: 32,
      badges: ["hot"],
      description: "Professional roof leak repair services.",
      workerCount: 2,
    },
  ],
  "Roof Replacement": [
    {
      id: 59,
      name: "RoofRenew Elite",
      rating: 5,
      reviews: 890,
      location: "Las Vegas",
      startingRate: 35000,
      ratePerKm: 45,
      badges: ["top"],
      description: "Complete roof replacement and installation services.",
      workerCount: 4,
    },
    {
      id: 60,
      name: "TopTier Roofing",
      rating: 4,
      reviews: 720,
      location: "San Diego",
      startingRate: 33000,
      ratePerKm: 42,
      badges: ["in demand"],
      description: "Professional roof replacement with quality materials.",
      workerCount: 4,
    },
  ],
  "Design Consultation": [
    {
      id: 61,
      name: "DesignVision Pro",
      rating: 5,
      reviews: 580,
      location: "New York",
      startingRate: 5000,
      ratePerKm: 25,
      badges: ["top"],
      description: "Expert interior design consultation services.",
      workerCount: 1,
    },
    {
      id: 62,
      name: "StyleSense Design",
      rating: 4,
      reviews: 420,
      location: "Los Angeles",
      startingRate: 4800,
      ratePerKm: 22,
      badges: ["hot"],
      description: "Professional interior design planning and consultation.",
      workerCount: 1,
    },
  ],
  "Room Styling": [
    {
      id: 63,
      name: "SpaceStyle Masters",
      rating: 5,
      reviews: 680,
      location: "Miami",
      startingRate: 15000,
      ratePerKm: 35,
      badges: ["top", "in demand"],
      description: "Complete room styling and decoration services.",
      workerCount: 2,
    },
    {
      id: 64,
      name: "RoomRevive Pro",
      rating: 4,
      reviews: 520,
      location: "Chicago",
      startingRate: 14000,
      ratePerKm: 32,
      badges: [],
      description: "Professional room styling and interior decoration.",
      workerCount: 2,
    },
  ],
  "Color Consultation": [
    {
      id: 65,
      name: "ColorHarmony Pro",
      rating: 5,
      reviews: 420,
      location: "San Francisco",
      startingRate: 3000,
      ratePerKm: 20,
      badges: ["top"],
      description: "Expert color scheme selection and planning.",
      workerCount: 1,
    },
    {
      id: 66,
      name: "ChromaStyle Design",
      rating: 4,
      reviews: 380,
      location: "Boston",
      startingRate: 2800,
      ratePerKm: 18,
      badges: ["hot"],
      description: "Professional color consultation services.",
      workerCount: 1,
    },
  ],
}

const carouselItems = [
  {
    brand: "Rapid Response Team",
    title: "Dedicated Professionals, Ready to Serve",
    image: image1,
    buttonText: "Explore More",
  },
  {
    brand: "Speed, Precision, Excellence",
    title: "Luxury Service, Fast Solutions",
    image: image2,
    buttonText: "Explore More",
  },
  {
    brand: "Reliable & Fast Service",
    title: "Passionate Experts, Committed to Quality",
    image: image3,
    buttonText: "Explore More",
  },
]

const products = [
  {
    id: 1,
    name: "Plumbing Services",
    price: 8000,
    category: "Plumbing",
    image: "https://cdn.pixabay.com/photo/2015/01/01/13/32/plumbing-585658_1280.jpg",
    description:
      "Keep your water systems running smoothly with expert plumbing services, from leak repairs to pipe installations.",
  },
  {
    id: 2,
    name: "Handyman Services",
    price: 5499,
    category: "Handyman",
    image: "https://cdn.pixabay.com/photo/2018/05/12/19/00/drechsler-3394311_1280.jpg",
    description:
      "Get quality home repairs and improvements at HandyGo's discounted rates—fast, affordable, and hassle-free.",
  },
  {
    id: 3,
    name: "Home Cleaning Services",
    price: 12000,
    category: "Cleaning",
    image: "https://cdn.pixabay.com/photo/2024/04/17/17/10/ai-generated-8702547_1280.jpg",
    description: "Enjoy a spotless, sanitized home with deep cleaning, carpet care, and move-in/move-out services.",
  },
  {
    id: 4,
    name: "Pest Control Services",
    price: 29000,
    category: "Pest Control",
    image: "https://cdn.pixabay.com/photo/2018/10/13/03/15/mosquito-3743404_1280.jpg",
    description: "Keep your space pest-free with expert extermination for termites, rodents, bed bugs, and more.",
  },
  {
    id: 5,
    name: "Landscaping Services",
    price: 15000,
    category: "Outdoor",
    image: "https://cdn.pixabay.com/photo/2022/12/17/14/17/winter-7661769_1280.jpg",
    description: "Transform your outdoor space with professional landscaping, lawn care, and garden design services.",
  },
  {
    id: 6,
    name: "HVAC Maintenance",
    price: 10000,
    category: "Appliances",
    image: "https://cdn.pixabay.com/photo/2022/11/07/14/21/labor-7576514_1280.jpg",
    description: "Keep your heating and cooling systems running efficiently with professional maintenance and repairs.",
  },
  {
    id: 7,
    name: "Roofing Services",
    price: 35000,
    category: "Construction",
    image: "https://cdn.pixabay.com/photo/2015/05/15/16/15/cottage-768889_1280.jpg",
    description: "Protect your home with expert roof repairs, replacements, and inspections by certified professionals.",
  },
  {
    id: 8,
    name: "Interior Design",
    price: 25000,
    category: "Design",
    image: "https://cdn.pixabay.com/photo/2017/03/22/17/39/kitchen-2165756_1280.jpg",
    description: "Transform your living spaces with customized interior design solutions tailored to your style and budget.",
  }
]

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

function App() {
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
    setShowAllServices(prev => !prev)
  }

  return (
    <div className="min-h-screen bg-white/90">
      <div className="z-40 flex">
        <MyFloatingDockCustomer />
      </div>

      <div className="relative">
        <div className="relative h-[600px] overflow-hidden mx-auto max-w-7xl mt-10 rounded-2xl">
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-lime-400">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute top-70 inset-0 flex items-center">
                <div className="ml-16 max-w-md">
                  <h3 className="text-white text-xl mb-2">{item.brand}</h3>
                  <h1 className="text-white text-4xl font-bold mb-8">{item.title}</h1>
                  <button className="bg-gradient-to-r from-gray-400 to-white text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all">
                    {item.buttonText}
                  </button>
                </div>
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
        </div>
      </div>

      <SponsorMarquee />

      <div className="px-4 mt-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">More Features</h2>
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
      </div>

      <ServiceShowcase />
      <PromoBanner />
      <ServiceBanner />
      <ServicesPromote />

      <div className="bg-white/90 text-black py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold scroll-reveal">Featured Services</h2>
              <p className="text-sm text-gray-500">Showing {displayedProducts.length} of {filteredProducts.length} services</p>
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
                  className="group cursor-pointer bg-gray-200/70 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 scroll-reveal hover-scale"
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

export default App