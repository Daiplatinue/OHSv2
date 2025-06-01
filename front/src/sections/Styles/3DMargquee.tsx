import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { Star, Shield, Zap, Heart, Users, DollarSign, BarChart, Briefcase } from 'lucide-react';

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
];

const benefits = [
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

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);
const thirdRow = reviews.slice(0, reviews.length / 2);
const fourthRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure className={cn(
      "relative h-full w-32 cursor-pointer overflow-hidden rounded-2xl border p-4",
      "border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300",
      "text-gray-700"
    )}>
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="28" height="28" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-gray-900">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-gray-500">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-xs text-gray-600">{body}</blockquote>
    </figure>
  );
};

function Marquee3D() {
  return (
    <div className="w-full bg-[#FBFBFD]">
      {/* Reviews Section */}
      <div className="flex min-h-[70vh] h-[80vh] w-full">
        {/* Left Side - Typography */}
        <div className="w-1/2 flex flex-col ml-10 justify-center px-8 lg:px-16">
          <div className="space-y-6">
            <span className="text-sky-500 text-sm font-semibold tracking-wide">TESTIMONIALS</span>
            <h2 className="text-4xl lg:text-7xl font-bold text-gray-700 leading-tight">
              What Our
              <span className="block text-sky-500">Clients Say</span>
            </h2>
            <p className="text-base text-gray-500 max-w-md">
              Don't just take our word for it. Here's what our satisfied customers have to say about our services.
            </p>
          </div>
        </div>

        {/* Right Side - 3D Marquee */}
        <div className="w-1/2 relative flex items-center justify-center overflow-hidden [perspective:300px]">
          <div
            className="flex flex-row items-center gap-4"
            style={{
              transform:
                "translateX(-50px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
            }}
          >
            <Marquee pauseOnHover vertical className="[--duration:20s]">
              {firstRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
              {secondRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
              {thirdRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <Marquee pauseOnHover className="[--duration:20s]" vertical>
              {fourthRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default Marquee3D;