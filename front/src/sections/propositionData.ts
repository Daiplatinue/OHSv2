import { Star, Shield, Zap, Heart, Users, DollarSign, BarChart, Briefcase } from 'lucide-react';

import customer1 from '../assets/proposition/man-1283231_1280.jpg';
import customerbg1 from '../assets/proposition/Contemplative Portrait (1).jpeg';

import customer2 from '../assets/proposition/Cheerful Man in Maroon Turtleneck.jpeg';
import customerbg2 from '../assets/proposition/Aerial View of Lush Green Waterways.jpeg';

import customer3 from '../assets/proposition/Close-Up Dewy Face.jpeg';
import customerbg3 from '../assets/proposition/Happy Small Dog Close-Up.jpeg';

import customer4 from '../assets/proposition/Contemplative Portrait.jpeg';
import customerbg4 from '../assets/proposition/Airplane Wing at Sunset.jpeg';

import customer5 from '../assets/proposition/Dramatic Portrait Duo.jpeg';
import customerbg5 from '../assets/proposition/Majestic Forest Canopy.jpeg';

import customer6 from '../assets/proposition/Elegant Man in Nature.jpeg';
import customerbg6 from '../assets/proposition/Close-up Portrait with Black Turtleneck.jpeg';

import about1 from '../assets/proposition/Man Working in Cozy Van.jpeg';
import about2 from '../assets/proposition/Hand in Spotlight.jpeg';
import about3 from '../assets/proposition/Outdoor Service Counter Interaction.jpeg';
import about4 from '../assets/proposition/Aerial View of Lush Green Waterways.jpeg';

export const benefits = [
    {
        icon: Star,
        title: "Premium Quality",
        description: "Experience excellence with our top-tier service quality and attention to detail."
    },
    {
        icon: Shield,
        title: "Fully Insured",
        description: "Rest easy knowing all our services are backed by comprehensive insurance coverage."
    },
    {
        icon: Zap,
        title: "Fast Response",
        description: "Get quick assistance with our 24/7 rapid response team ready to help."
    },
    {
        icon: Heart,
        title: "Eco-Friendly",
        description: "Our sustainable practices and materials minimize environmental impact without compromising quality."
    },
    {
        icon: Users,
        title: "Expert Team",
        description: "Work with skilled professionals who bring years of specialized experience to every project."
    },
    {
        icon: DollarSign,
        title: "Cost Effective",
        description: "Get exceptional value with competitive pricing and transparent, no-surprise billing."
    },
    {
        icon: BarChart,
        title: "Data-Driven Results",
        description: "Benefit from our analytics-backed methodologies that deliver measurable improvements."
    },
    {
        icon: Briefcase,
        title: "Industry Compliance",
        description: "All services adhere to the latest industry standards and regulatory requirements for your peace of mind."
    }
];

export const tweets = [
    {
        avatar: customer1,
        name: "Dillion",
        handle: "@dillionverma",
        verified: true,
        content: "Companies spend $30000+ and several weeks to build beautiful landing pages like @linear, @wopehq and @reflectnotes 🔨 I built @reactjs + @tailwindcss components for you to do the same in hours, starting at just $29",
        image: customerbg1,
        stats: {
            comments: 12,
            retweets: 24,
            likes: 483,
            views: "1.2M"
        }
    },
    {
        avatar: customer2,
        name: "Sarah Johnson",
        handle: "@sarahcodes",
        verified: true,
        content: "Just tried @HandyGo's services - absolutely blown away by their professionalism and attention to detail! The team went above and beyond. Highly recommend! 🌟",
        image: customerbg2,
        stats: {
            comments: 8,
            retweets: 15,
            likes: 234,
            views: "856K"
        }
    },
    {
        avatar: customer3,
        name: "Alex Rivera",
        handle: "@alexdev",
        verified: true,
        content: "After trying multiple service providers, @HandyGo stands out for their reliability and quality. Their team is responsive, professional, and delivers exceptional results every time! 💯",
        image: customerbg3,
        stats: {
            comments: 15,
            retweets: 42,
            likes: 567,
            views: "1.5M"
        }
    },
    {
        avatar: customer4,
        name: "Michael Chen",
        handle: "@mikedesigns",
        verified: true,
        content: "I'm amazed by the quality and efficiency of @HandyGo's plumbing services! Fixed an emergency leak in under an hour. Their technicians are true professionals. Will definitely be calling them again! 🔧",
        image: customerbg4,
        stats: {
            comments: 18,
            retweets: 31,
            likes: 429,
            views: "952K"
        }
    },
    {
        avatar: customer5,
        name: "Emma Wilson",
        handle: "@emma_homes",
        verified: false,
        content: "The @HandyGo landscaping team transformed our backyard into a paradise! Their attention to detail and creative vision exceeded all expectations. Worth every penny for the incredible results. 🌿",
        image: customerbg5,
        stats: {
            comments: 24,
            retweets: 56,
            likes: 682,
            views: "1.8M"
        }
    },
    {
        avatar: customer6,
        name: "James Rodriguez",
        handle: "@jrod_home",
        verified: true,
        content: "Hired @HandyGo for a complete roof inspection and repair. Their team was thorough, professional, and completed the work ahead of schedule! No more leaks during rainy season. Couldn't be happier with the service! ☔",
        image: customerbg6,
        stats: {
            comments: 11,
            retweets: 19,
            likes: 301,
            views: "783K"
        }
    }
];

export const services = [
    { title: "PLUMBLING", section: "01", action: "DISCOVER" },
    { title: "HANDYMAN", section: "02", action: "EXPLORE" },
    { title: "LANDSCAPING", section: "03", action: "EXPERIENCE" },
    { title: "ROOFING", section: "04", action: "LEARN" },
    { title: "PEST CONTROL", section: "05", action: "JOIN" },
    { title: "CLEANING", section: "06", action: "VISIT" }
];

export const aboutHandyGo = [
    {
        id: 1,
        title: "CONVENIENCE AT YOUR FINGERTIPS",
        subtitle: "INSTANT ACCESS",
        description: "The name 'HandyGo' embodies our core mission: to provide production services that are both accessible and mobile. We're always ready to spring into action, bringing convenience to your fingertips.",
        image: about1,
        bgColor: "bg-amber-50",
        accentColor: "text-amber-600"
    },
    {
        id: 2,
        title: "EFFICIENCY IN MOTION",
        subtitle: "SWIFT SERVICE",
        description: "HandyGo represents our commitment to efficiency. Just like our name suggests, we're quick, agile, and always on the move to ensure your production runs smoothly from start to finish.",
        image: about2,
        bgColor: "bg-gray-200",
        accentColor: "text-emerald-600"
    },
    {
        id: 3,
        title: "READY WHEN YOU ARE",
        subtitle: "24/7 AVAILABILITY",
        description: "The 'Go' in HandyGo signifies our readiness. We're prepared to mobilize at a moment's notice, adapting to your production needs regardless of timeline or complexity.",
        image: about3,
        bgColor: "bg-sky-50",
        accentColor: "text-sky-500"
    },
    {
        id: 4,
        title: "SIMPLICITY IN COMPLEXITY",
        subtitle: "SEAMLESS SOLUTIONS",
        description: "Our name reflects our approach to production challenges. We take complex production requirements and make them handy – simple, manageable, and achievable.",
        image: about4,
        bgColor: "bg-purple-50",
        accentColor: "text-purple-700"
    }
];

export const sponsorLogos = [
    {
        name: "Amazon",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
    },
    {
        name: "DeebSeek",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/ec/DeepSeek_logo.svg"
    },
    {
        name: "Lazada",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Lazada_%282019%29.svg"
    },
    {
        name: "Google",
        image: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Google_logo_%282013-2015%29.svg"
    },
    {
        name: "Youtube",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Logo_of_YouTube_%282015-2017%29.svg"
    },
    {
        name: "Facebook",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Facebook_logo_%282023%29.svg"
    },
    {
        name: "GitHub",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/29/GitHub_logo_2013.svg"
    },
    {
        name: "CloudBees",
        image: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Cloudbees-logo-black.png"
    },
    {
        name: "Yes Bank",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RIT_2018_logo_Image_Permanence_Institute_hor_k.svg"
    },
    {
        name: "Polyga",
        image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Polyga-logo-color-small.png"
    },
    {
        name: "LinkedIn",
        image: "https://upload.wikimedia.org/wikipedia/commons/b/b1/LinkedIn_Logo_2013_%282%29.svg"
    },
    {
        name: "ZAP by Checkmarx",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/87/Logo_of_ZAP_by_Checkmarx.svg"
    },
    {
        name: "Microsoft",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg"
    },
    {
        name: "WildBrain",
        image: "https://upload.wikimedia.org/wikipedia/commons/b/be/WildBrain_logo.svg"
    },
    {
        name: "New Relic",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/New_Relic_logo.png"
    }
];