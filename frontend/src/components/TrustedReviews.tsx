// src/components/TrustedReviews.tsx
import React from 'react';
import { FaStar, FaUserDoctor, FaUsers } from 'react-icons/fa6';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
class TrustedReviews extends React.Component {
  render() {
    return (
      <div className="py-12 flex flex-col items-center">
        <div className="w-full">
          {/* Titre principal */}
          <h2 className="text-3xl md:text-xl font-semibold text-gray-900 mb-10 text-center">
            Trusted by thousands in Qatar
          </h2>

          {/* Cartes témoignages */}
          <div className="space-y-6">
            {/* Témoignage 1 */}
            <div className="md:p-6 bg-blue-50 rounded-2xl m-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src="/avatars/sarah-al-rashid.jpg"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Sarah Al-Rashid
                    </h3></div>
                    <div className="flex items-center gap-3">
                    {/* 5 Stars */}
                    <span className="text-yellow-400 text-xl flex">
                      <IconWrapper icon={FaStar} />
                      <IconWrapper icon={FaStar} />
                      <IconWrapper icon={FaStar} />
                      <IconWrapper icon={FaStar} />
                      <IconWrapper icon={FaStar} />
                    </span>

                    {/* Location */}
                    <span className="flex items-center gap-2 text-lg text-gray-600">
                      • Doha
                    </span>
                  </div>

                  
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-5">
                    "The AI assistant helped me describe my shoulder pain perfectly. Found an amazing physiotherapist within 10 minutes!"
                  </p>
            </div>

            {/* Témoignage 2 */}
            <div className="md:p-6 bg-cyan-50 rounded-2xl m-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src="/avatars/ahmed-hassan.jpg"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Ahmed Hassan
                    </h3>
                    
                    
                  </div><div className="flex items-center gap-3">
                    {/* 5 Stars */}
                    <span className="text-yellow-400 text-xl flex">
                      <IconWrapper icon={FaStar} />
                      <IconWrapper icon={FaStar} />
                      <IconWrapper icon={FaStar} />
                      <IconWrapper icon={FaStar} />
                      <IconWrapper icon={FaStar} />
                    </span>

                    {/* Location */}
                    <span className="flex items-center gap-2 text-lg text-gray-600">
                      • Al Rayyan
                    </span>
                  </div>
                  
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-5">
                    "Home visits made recovery so convenient. The app's booking system is incredibly user-friendly."
                  </p>
            </div>
          </div>

          {/* Stats globales en bas */}
          <div className="mt-6 flex flex-wrap justify-center gap-8 md:gap-8 text-center">

            {/* Users */}
            <div className="flex items-center gap-2 text-xl">
              <span className="text-blue-500 ">
                <IconWrapper icon={FaUsers} />
              </span>
              <p className="text-gray-600 font-normal">
                15,000+ Users
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 text-xl">
              <span className="text-yellow-400 ">
                <IconWrapper icon={FaStar} />
              </span>
              <p className="text-gray-600 font-normal">
                4.9/5 Rating
              </p>
            </div>

            {/* Specialists */}
            <div className="flex items-center gap-2 text-xl">
              <span className="text-green-500 ">
                <IconWrapper icon={FaUserDoctor} />
              </span>
              <p className="text-gray-600 font-normal">
                200+ Specialists
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default TrustedReviews;