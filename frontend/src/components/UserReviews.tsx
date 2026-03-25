// src/components/UserReviews.tsx
import React from 'react';
import { FaStar } from "react-icons/fa6";   // ← Changed to fa6

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
class UserReviews extends React.Component {
  render() {
    return (
      <div className="bg-gray-50 py-10 px-4 md:px-8 flex flex-col items-center">
        <h1 className="text-3xl md:text-2xl font-semibold text-gray-900 mb-10 text-center">
          What Users Say
        </h1>

        <div className="w-full space-y-8">
          {/* Témoignage 1 */}
          <div className="bg-blue-50 rounded-2xl p-6 md:p-8 shadow-sm border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <img 
                    src="/avatars/sarah.jpg" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sarah Al-Mansouri
                  </h3>
                  <span className="text-yellow-500 text-xl flex gap-0.5">
                    <IconWrapper icon={FaStar} />
                    <IconWrapper icon={FaStar} />
                    <IconWrapper icon={FaStar} />
                    <IconWrapper icon={FaStar} />
                    <IconWrapper icon={FaStar} />
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "The AI perfectly understood my back pain and connected me with an amazing physiotherapist. Recovery was faster than expected!"
                </p>
              </div>
            </div>
          </div>

          {/* Témoignage 2 */}
          <div className="bg-pink-50 rounded-2xl p-6 md:p-8 shadow-sm border border-pink-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <img 
                    src="/avatars/ahmed.jpg" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ahmed Hassan
                  </h3>
                  <span className="text-yellow-500 text-xl flex gap-0.5">
                    <IconWrapper icon={FaStar} />
                    <IconWrapper icon={FaStar} />
                    <IconWrapper icon={FaStar} />
                    <IconWrapper icon={FaStar} />
                    <IconWrapper icon={FaStar} />
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "Home visits made my treatment so convenient. The app's Arabic support was perfect for my elderly parents too."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserReviews;