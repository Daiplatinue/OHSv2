import React from 'react';
import { benefits } from '../propositionData';

const ThirdSection: React.FC = () => {
  return (
    <section>
      <div className="w-full py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sky-500 text-sm font-semibold tracking-wide">BENEFITS</span>
            <h2 className="mt-4 text-5xl font-semibold text-gray-600">
              HandyGo Prime
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group p-6 rounded-3xl bg-[#FBFBFD] hover:bg-sky-50 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center mb-6 group-hover:bg-sky-200 transition-colors duration-300">
                  <benefit.icon className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThirdSection;