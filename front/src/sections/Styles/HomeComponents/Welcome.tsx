import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dot } from "lucide-react"

import mainBackground from '../../../assets/Home/Golden Field and Blue Mountain Landscape.jpeg';
import HL1 from '../../../assets/Home/Profile of a Fashionable Woman.jpeg';
import HL2 from '../../../assets/Home/Cheerful Youth Portrait.jpeg';
import HL3 from '../../../assets/Home/Enigmatic Portrait.jpeg';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="relative h-[380px] w-full overflow-hidden">
        <img
          src={mainBackground}
          alt="Home services dashboard background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Gradient Overlay - fades to the background color (gray-100) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-gray-50"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-gray-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white">
          <h1 className="text-3xl font-semibold text-white mb-20">
            Good Afternoon, User
          </h1>
        </div>
      </div>

      {/* Main Content Grid - Pulled up to overlap the header */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 -mt-40 relative z-30">
        {/* Left Column */}
        <div className="space-y-6 flex flex-col">
          {" "}
          {/* Added flex flex-col to make children stretch */}
          {/* Daily Summary Card */}
          <Card className="flex-1">
            {" "}
            {/* Added flex-1 to make card stretch */}
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Daily Summary</CardTitle>
              <p className="text-sm text-gray-500">Here&apos;s your daily summary for managing online home services.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-md font-medium mb-2">Service Request Overview</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>
                    <span className="font-bold">23</span> new service requests, <span className="font-bold">9</span>{" "}
                    require your attention
                  </li>
                  <li>
                    <span className="font-bold">Priority:</span> Urgent plumbing repair request from client #123
                  </li>
                  <li>Client #456 requesting status update on HVAC installation</li>
                  <li>New lead for electrical services needs follow-up by Friday</li>
                </ul>
              </div>

              <div>
                <h3 className="text-md font-medium mb-2">Service Tasks Due Today:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                      <Dot className="w-3 h-3 text-gray-300" />
                    </div>
                    Schedule technician for AC maintenance at 123 Main St.
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                      <Dot className="w-3 h-3 text-gray-300" />
                    </div>
                    Confirm parts delivery for water heater replacement.
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                      <Dot className="w-3 h-3 text-gray-300" />
                    </div>
                    Send service quote to new customer for landscaping.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-md font-medium mb-2">Service Notes</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>Call customer for service feedback</li>
                  <li>Record and upload service completion videos</li>
                  <li>Add new technician training to calendar</li>
                  <li>Renew service vehicle lease</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          {/* Newsletter Highlights Card */}
          <Card className="flex-1">
            {" "}
            {/* Added flex-1 to make card stretch */}
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Industry Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={HL1}
                  alt="Smart home tech"
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Smart Home Tech Trends</h4>
                  <p className="text-xs text-gray-500">Industry Insights</p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    Explore the latest innovations in smart home devices and how they are creating new opportunities for
                    home service providers, from automated repairs to predictive maintenance.
                  </p>
                </div>
                <span className="text-xs text-gray-500 self-start">9:04 AM</span>
              </div>
              <div className="flex items-start gap-4">
                <img
                  src={HL2}
                  alt="Efficient service management"
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Efficient Service Management</h4>
                  <p className="text-xs text-gray-500">Operational Excellence</p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    Discover strategies for optimizing service routes, managing technician teams, and improving overall
                    operational efficiency in your home services business.
                  </p>
                </div>
                <span className="text-xs text-gray-500 self-start">9:04 AM</span>
              </div>
              <div className="flex items-start gap-4">
                <img
                  src={HL3}
                  alt="AI in home services"
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">AI in Home Services</h4>
                  <p className="text-xs text-gray-500">Innovation Spotlight</p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    Artificial intelligence is transforming how home services are delivered, from automated scheduling
                    and diagnostics to enhanced customer support and predictive maintenance.
                  </p>
                </div>
                <span className="text-xs text-gray-500 self-start">8:30 AM</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6 flex flex-col">
          {" "}
          {/* Added flex flex-col to make children stretch */}
          {/* Important Emails Card */}
          <Card className="flex-1">
            {" "}
            {/* Added flex-1 to make card stretch */}
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Important Communications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Emman" />
                  <AvatarFallback>EM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Emman</h4>
                  <p className="text-xs text-gray-500">Service Feedback</p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    Emman praised the recent cleaning service and inquired about recurring maintenance plans.
                  </p>
                </div>
                <span className="text-xs text-gray-500 self-start">Today</span>
              </div>
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Luba Y" />
                  <AvatarFallback>LY</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Luba Y</h4>
                  <p className="text-xs text-gray-500">Client Consultation</p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    Luba requested to reschedule the plumbing consultation due to an unforeseen issue.
                  </p>
                </div>
                <span className="text-xs text-gray-500 self-start">Today</span>
              </div>
            </CardContent>
          </Card>
          {/* Upcoming Meetings Card */}
          <Card className="flex-1">
            {" "}
            {/* Added flex-1 to make card stretch */}
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Upcoming Engagements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-1 h-full bg-purple-500 rounded-full self-stretch"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Client Onboarding: New HVAC Install</h4>
                  <p className="text-xs text-gray-500">
                    Today, 1:30-2:00pm <span className="text-green-500">in 3 mins</span>
                  </p>
                </div>
                <div className="flex -space-x-2 overflow-hidden">
                  <Avatar className="w-6 h-6 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Avatar" />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-6 h-6 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Avatar" />
                    <AvatarFallback>CD</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-6 h-6 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Avatar" />
                    <AvatarFallback>EF</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-1 h-full bg-blue-500 rounded-full self-stretch"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Team Briefing: Daily Service Routes</h4>
                  <p className="text-xs text-gray-500">Today, 2:00-2:30pm</p>
                </div>
                <div className="flex -space-x-2 overflow-hidden">
                  <Avatar className="w-6 h-6 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Avatar" />
                    <AvatarFallback>GH</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-6 h-6 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Avatar" />
                    <AvatarFallback>IJ</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-1 h-full bg-red-500 rounded-full self-stretch"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Supplier Meeting: New Appliance Models</h4>
                  <p className="text-xs text-gray-500">Today, 4-4:30pm</p>
                </div>
                <div className="flex -space-x-2 overflow-hidden">
                  <Avatar className="w-6 h-6 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Avatar" />
                    <AvatarFallback>KL</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-6 h-6 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Avatar" />
                    <AvatarFallback>MN</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-6 h-6 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Avatar" />
                    <AvatarFallback>OP</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* New Connections Card */}
          <Card className="flex-1">
            {" "}
            {/* Added flex-1 to make card stretch */}
            <CardHeader>
              <CardTitle className="text-lg font-semibold">New Connections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="John Arnold" />
                  <AvatarFallback>JA</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">John Arnold (New Client)</h4>
                  <p className="text-xs text-gray-500">jarnold@homeservices.com</p>
                </div>
                <span className="text-xs text-gray-500">7:33pm</span>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Brianna Kim" />
                  <AvatarFallback>BK</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Brianna Kim (New Technician)</h4>
                  <p className="text-xs text-gray-500">bkim@homeservices.com</p>
                </div>
                <span className="text-xs text-gray-500">7:33pm</span>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Nicole Wegner" />
                  <AvatarFallback>NW</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Nicole Wegner (Supplier Rep)</h4>
                  <p className="text-xs text-gray-500">n.wegner@parts.co</p>
                </div>
                <span className="text-xs text-gray-500">Yesterday</span>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Lianna Bass" />
                  <AvatarFallback>LB</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Lianna Bass (Marketing Lead)</h4>
                  <p className="text-xs text-gray-500">lbass@homeservicesmarketing.com</p>
                </div>
                <span className="text-xs text-gray-500">30 Mar &apos;25</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
