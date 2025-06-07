import React from 'react';

interface TenthSectionProps {
  navigateToLogin: () => void;
}

const TenthSection: React.FC<TenthSectionProps> = ({ navigateToLogin }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-5xl mx-auto px-8">
        <div className="bg-white rounded-3xl p-16 text-center">
          {/* Main Heading */}
          <h1 className="text-5xl font-semibold text-gray-600 mb-4 tracking-tight">
            Online Home <span className='text-sky-500'>Services</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12 font-normal leading-relaxed max-w-2xl mx-auto">
            Connect with trusted professionals for all your home maintenance and improvement needs
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verified Professionals</h3>
              <p className="text-sm text-gray-600 text-center">Background-checked and certified service providers</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Same-Day Booking</h3>
              <p className="text-sm text-gray-600 text-center">Quick scheduling for urgent home repairs</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Satisfaction Guarantee</h3>
              <p className="text-sm text-gray-600 text-center">100% money-back guarantee on all services</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={navigateToLogin}
              className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white text-lg font-medium rounded-2xl transition-colors duration-200 shadow-sm min-w-[200px]"
            >
              Get Started
            </button>

            <button className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-sky-500 text-lg font-medium rounded-2xl transition-colors duration-200 min-w-[200px]">
              Browse Services
            </button>
          </div>
          {/* Footer */}
          <div className="text-center border-t border-gray-100 pt-8">
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              By continuing, you agree to our{' '}
              <a href="#" className="text-sky-500 hover:text-sky-600 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-sky-500 hover:text-sky-600 transition-colors">
                Privacy Policy
              </a>
            </p>

            <div className="flex items-center justify-center text-xs text-gray-400">
              <span>Powered by HandyGo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TenthSection;