import { Twitter, MessageCircle, Repeat, Share, Heart } from 'lucide-react';
import { tweets } from '../propositionData';

function FourthSection() {
  return (
    <section data-section="reviews" className="bg-white min-h-screen relative py-24">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Tweet Cards */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          {/* Left Tweet */}
          <div className="transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-w-sm">
              <div className="p-4">
                <div className="flex items-center">
                  <img
                    src={tweets[0].avatar}
                    alt={tweets[0].name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <span className="font-bold text-gray-900 text-sm">{tweets[0].name}</span>
                      {tweets[0].verified && (
                        <svg className="w-4 h-4 ml-1 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                        </svg>
                      )}
                      <span className="ml-1 text-gray-500 text-sm">{tweets[0].handle}</span>
                    </div>
                  </div>
                  <Twitter className="w-5 h-5 text-gray-400" />
                </div>
                <p className="mt-3 text-gray-800 text-sm leading-relaxed">
                  {tweets[0].content}
                </p>
                <img
                  src={tweets[0].image}
                  alt="Tweet attachment"
                  className="mt-3 rounded-xl w-full h-48 object-cover"
                />
                <div className="mt-3 flex items-center justify-between text-gray-500 text-xs">
                  <button className="flex items-center hover:text-sky-500 transition-colors">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span>{tweets[0].stats.comments}</span>
                  </button>
                  <button className="flex items-center hover:text-green-500 transition-colors">
                    <Repeat className="w-4 h-4 mr-1" />
                    <span>{tweets[0].stats.retweets}</span>
                  </button>
                  <button className="flex items-center hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4 mr-1" />
                    <span>{tweets[0].stats.likes}</span>
                  </button>
                  <button className="flex items-center hover:text-sky-500 transition-colors">
                    <Share className="w-4 h-4 mr-1" />
                    <span>{tweets[0].stats.views}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Center Tweet */}
          <div className="transform translate-y-12 hover:translate-y-10 transition-transform duration-300">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-w-sm">
              <div className="p-4">
                <div className="flex items-center">
                  <img
                    src={tweets[1].avatar}
                    alt={tweets[1].name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <span className="font-bold text-gray-900 text-sm">{tweets[1].name}</span>
                      {tweets[1].verified && (
                        <svg className="w-4 h-4 ml-1 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                        </svg>
                      )}
                      <span className="ml-1 text-gray-500 text-sm">{tweets[1].handle}</span>
                    </div>
                  </div>
                  <Twitter className="w-5 h-5 text-gray-400" />
                </div>
                <p className="mt-3 text-gray-800 text-sm leading-relaxed">
                  {tweets[1].content}
                </p>
                <img
                  src={tweets[1].image}
                  alt="Tweet attachment"
                  className="mt-3 rounded-xl w-full h-48 object-cover"
                />
                <div className="mt-3 flex items-center justify-between text-gray-500 text-xs">
                  <button className="flex items-center hover:text-sky-500 transition-colors">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span>{tweets[1].stats.comments}</span>
                  </button>
                  <button className="flex items-center hover:text-green-500 transition-colors">
                    <Repeat className="w-4 h-4 mr-1" />
                    <span>{tweets[1].stats.retweets}</span>
                  </button>
                  <button className="flex items-center hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4 mr-1" />
                    <span>{tweets[1].stats.likes}</span>
                  </button>
                  <button className="flex items-center hover:text-sky-500 transition-colors">
                    <Share className="w-4 h-4 mr-1" />
                    <span>{tweets[1].stats.views}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Tweet */}
          <div className="transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-w-sm">
              <div className="p-4">
                <div className="flex items-center">
                  <img
                    src={tweets[2].avatar}
                    alt={tweets[2].name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <span className="font-bold text-gray-900 text-sm">{tweets[2].name}</span>
                      {tweets[2].verified && (
                        <svg className="w-4 h-4 ml-1 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                        </svg>
                      )}
                      <span className="ml-1 text-gray-500 text-sm">{tweets[2].handle}</span>
                    </div>
                  </div>
                  <Twitter className="w-5 h-5 text-gray-400" />
                </div>
                <p className="mt-3 text-gray-800 text-sm leading-relaxed">
                  {tweets[2].content}
                </p>
                <img
                  src={tweets[2].image}
                  alt="Tweet attachment"
                  className="mt-3 rounded-xl w-full h-48 object-cover"
                />
                <div className="mt-3 flex items-center justify-between text-gray-500 text-xs">
                  <button className="flex items-center hover:text-sky-500 transition-colors">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span>{tweets[2].stats.comments}</span>
                  </button>
                  <button className="flex items-center hover:text-green-500 transition-colors">
                    <Repeat className="w-4 h-4 mr-1" />
                    <span>{tweets[2].stats.retweets}</span>
                  </button>
                  <button className="flex items-center hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4 mr-1" />
                    <span>{tweets[2].stats.likes}</span>
                  </button>
                  <button className="flex items-center hover:text-sky-500 transition-colors">
                    <Share className="w-4 h-4 mr-1" />
                    <span>{tweets[2].stats.views}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Section */}
        <div className="text-center max-w-3xl mx-auto mt-[8rem]">
          <span className="text-sky-500 text-sm tracking-wide font-extralight uppercase">Customer Reviews</span>
          <h2 className="mt-4 text-5xl font-medium text-gray-700 leading-tight">
            Our Clients Feedback
          </h2>
          <p className="mt-6 text-lg text-gray-600">
            Join thousands of satisfied customers who trust our services for their needs. Our commitment to excellence, attention to detail, and customer satisfaction sets us apart.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-4xl font-sembold text-sky-500">98%</div>
              <div className="mt-2 text-sm text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-sembold text-sky-500">100M+</div>
              <div className="mt-2 text-sm text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-sembold text-sky-500">24/7</div>
              <div className="mt-2 text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>

        {/* Additional Tweet Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Additional tweets rendering */}
          {tweets.slice(3).map((tweet, index) => (
            <div key={index + 3} className={`transform ${index === 0 ? 'hover:scale-105' : index === 1 ? 'translate-y-6 hover:translate-y-3' : '-rotate-2 hover:rotate-0'} transition-transform duration-300`}>
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center">
                    <img
                      src={tweet.avatar}
                      alt={tweet.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span className="font-bold text-gray-900 text-sm">{tweet.name}</span>
                        {tweet.verified && (
                          <svg className="w-4 h-4 ml-1 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                          </svg>
                        )}
                        <span className="ml-1 text-gray-500 text-sm">{tweet.handle}</span>
                      </div>
                    </div>
                    <Twitter className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="mt-3 text-gray-800 text-sm leading-relaxed">
                    {tweet.content}
                  </p>
                  <img
                    src={tweet.image}
                    alt="Tweet attachment"
                    className="mt-3 rounded-xl w-full h-48 object-cover"
                  />
                  <div className="mt-3 flex items-center justify-between text-gray-500 text-xs">
                    <button className="flex items-center hover:text-sky-500 transition-colors">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span>{tweet.stats.comments}</span>
                    </button>
                    <button className="flex items-center hover:text-green-500 transition-colors">
                      <Repeat className="w-4 h-4 mr-1" />
                      <span>{tweet.stats.retweets}</span>
                    </button>
                    <button className="flex items-center hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4 mr-1" />
                      <span>{tweet.stats.likes}</span>
                    </button>
                    <button className="flex items-center hover:text-sky-500 transition-colors">
                      <Share className="w-4 h-4 mr-1" />
                      <span>{tweet.stats.views}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FourthSection;