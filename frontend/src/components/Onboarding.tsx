import React from 'react';

// ==================== IMPORTS CORRECTS ====================
import { PiMapPinFill } from 'react-icons/pi';
import { 
  FaCalendarCheck, 
  FaRocket, 
  FaMicrophone, 
  FaLanguage, 
  FaBrain, 
  FaStar, 
  FaChartLine,
  FaLock,
  FaRoute
} from 'react-icons/fa6';
import { LiaCertificateSolid } from 'react-icons/lia';
import { HiHome, HiMiniCreditCard } from 'react-icons/hi2';
import { IoChatbubbles } from 'react-icons/io5';
import { HiArrowLeft } from "react-icons/hi";
import { FaShieldAlt, } from 'react-icons/fa';

// ========================================================

type IconComponent = React.ComponentType<{ className?: string }>;
const BackArrow = HiArrowLeft  as IconComponent;
// Helper to render icons safely
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

interface Feature {
  icon: IconComponent;
  text: string;
  iconColor: string;
}

interface Slide {
  step: number;
  title: string;
  description: string;
  icon: IconComponent;
  // Specific gradient classes for the circles
  gradient: string; 
  accentColor: string; 
  features?: Feature[];
}

const slides: Slide[] = [
  {
    step: 1,
    title: "Talk to AI Assistant",
    description: "Describe your pain or symptoms naturally using voice or text. Our AI understands you in both English and Arabic.",
    icon: IoChatbubbles as IconComponent,
    gradient: "from-blue-500 via-blue-300 to-white", // Blue to White degree
    accentColor: "bg-blue-500",
    features: [
      { icon: FaMicrophone as IconComponent, text: "Voice Recognition", iconColor: "text-blue-500" },
      { icon: FaLanguage as IconComponent, text: "Bilingual Support", iconColor: "text-gray-700" },
      { icon: FaBrain as IconComponent, text: "Smart Analysis", iconColor: "text-purple-500" },
    ]
  },
  {
    step: 2,
    title: "Find Best Physiotherapist",
    description: "AI matches you with licensed physiotherapists and rehabilitation specialists near you in Qatar and GCC.",
    icon: PiMapPinFill as IconComponent,
    gradient: "from-orange-400 to-yellow-400", // Maps/Location degree
    accentColor: "bg-yellow-500",
    features: [
      { icon: LiaCertificateSolid as IconComponent, text: "Licensed Professionals", iconColor: "text-yellow-500" },
      { icon: FaStar as IconComponent, text: "Verified Reviews", iconColor: "text-orange-400" },
      { icon: FaRoute as IconComponent, text: "Distance & Availability", iconColor: "text-blue-400" },
    ]
  },
  {
    step: 3,
    title: "Book & Track Sessions",
    description: "Schedule appointments, choose home visits or clinic sessions, and track your recovery progress easily.",
    icon: FaCalendarCheck as IconComponent,
    gradient: "from-purple-600 to-pink-400", // Purple to Pink degree
    accentColor: "bg-purple-600",
    features: [
      { icon: HiHome as IconComponent, text: "Home & Clinic Visits", iconColor: "text-green-500" },
      { icon: HiMiniCreditCard as IconComponent, text: "Secure Payments", iconColor: "text-blue-600" },
      { icon: FaChartLine as IconComponent, text: "Progress Tracking", iconColor: "text-purple-500" },
    ]
  },
  {
    step: 4,
    title: "Ready to Get Started?",
    description: "Join thousands of users who trust Physio AI for their physiotherapy and rehabilitation needs across Qatar and GCC.",
    icon: FaRocket as IconComponent,
    gradient: "from-green-500 to-cyan-400", // Yellow to Green degree
    accentColor: "bg-green-500",
  }
];

class Onboarding extends React.Component {
  state = { currentStep: 0 };
  private interval: NodeJS.Timeout | null = null;

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState((prev: { currentStep: number }) => ({
        currentStep: (prev.currentStep + 1) % slides.length
      }));
    }, 3500);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  render() {
    const { currentStep } = this.state;
    const slide = slides[currentStep];
    const progress = ((currentStep + 1) / slides.length) * 100;

    const isLastSlide = currentStep === slides.length - 1;

    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center p-8 relative">
        
        {/* Header - WIDER WIDTH */}
      <div className="w-full flex justify-between items-center mb-8">
        <button className="text-slate-500 text-3xl">
          <BackArrow className="text-2xl" />   {/* ← Utilise le nom casté */}
        </button>

        <span className="text-sm font-semibold text-slate-500 tracking-tighter">
          {currentStep + 1} OF {slides.length}
        </span>

        <button className="text-blue-500 font-normal text-xl">Skip</button>
      </div>

        {/* Progress Bar - WIDER */}
        <div className="w-full bg-slate-100 h-2 rounded-full s">
          <div 
            className={`h-full ${slide.accentColor} rounded-full transition-all duration-1000 ease-in-out`} 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {/* Main Content Area - MUCH LARGER WIDTH */}
        <div className="w-full flex flex-col items-center">
          
          {/* Gradient Circle Icon */}
          <div className={`w-40 h-40 bg-gradient-to-br ${slide.gradient} rounded-full flex items-center justify-center mb-8 mt-8 shadow-2xl transform transition-transform duration-500 hover:scale-105`}>
            <slide.icon className="text-5xl text-white drop-shadow-md" />
          </div>

          {/* Title - Larger and Styled */}
          <h1 className="text-3xl md:text-4xl font-semibold text-center mb-4 text-cyan-500 tracking-tight">
            {slide.title}
          </h1>

          {/* Description */}
          <p className="text-center text-gray-600 text-base md:text-lg mx-auto mb-10 leading-relaxed">
            {slide.description}
          </p>

          {/* Features - Uniform Sizes */}
          {isLastSlide ? (
          <div className="w-full space-y-8 sm:space-y-10">

            {/* Stats cards - 2×2 grid */}
            <div className="grid grid-cols-2 gap-5 sm:gap-6 w-full">
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-100 text-center flex flex-col justify-center min-h-[140px]">
                <div className="text-4xl sm:text-5xl font-bold text-blue-600">500+</div>
                <div className="text-sm sm:text-base text-slate-500 font-semibold mt-2 uppercase tracking-wide">
                  Licensed Therapists
                </div>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-100 text-center flex flex-col justify-center min-h-[140px]">
                <div className="text-4xl sm:text-5xl font-bold text-slate-800">10k+</div>
                <div className="text-sm sm:text-base text-slate-500 font-semibold mt-2 uppercase tracking-wide">
                  Happy Patients
                </div>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-100 text-center flex flex-col justify-center min-h-[140px]">
                <div className="text-4xl sm:text-5xl font-bold text-purple-600">4.9★</div>
                <div className="text-sm sm:text-base text-slate-500 font-semibold mt-2 uppercase tracking-wide">
                  App Rating
                </div>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-100 text-center flex flex-col justify-center min-h-[140px]">
                <div className="text-4xl sm:text-5xl font-bold text-orange-500">24/7</div>
                <div className="text-sm sm:text-base text-slate-500 font-semibold mt-2 uppercase tracking-wide">
                  AI Support
                </div>
              </div>
            </div>

            {/* HIPAA + Security line */}
            <div className="border-2 border-slate-100 rounded-2xl p-6 bg-white/50 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <IconWrapper icon={FaShieldAlt} className="text-green-600 text-xl" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="hidden sm:block text-slate-400">|</div>
                <div className="flex items-center gap-2">
                  <IconWrapper icon={FaLock} className="text-blue-600 text-xl" />
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Normal features for steps 1-3 */
          <div className="w-full grid grid-cols-1 gap-4 sm:gap-5">
            {slide.features?.map((f, i) => (
              <div 
                key={i} 
                className="flex items-center gap-5 sm:gap-6 bg-white border border-slate-100 p-4 sm:p-5 rounded-2xl shadow-sm hover:border-blue-200 transition-colors"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                  <f.icon className={f.iconColor} />
                </div>
                <span className="text-lg sm:text-xl font-medium text-slate-800">{f.text}</span>
              </div>
            ))}
          </div>
        )}
        </div>

        {/* Bottom Dot Indicators */}
        <div className="flex gap-3 mt-auto py-10">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-3 w-3 rounded-full transition-all duration-500 ${
                i === currentStep 
                  ? `${slides[i].accentColor} scale-125 shadow-md`   // ← Use slide's accentColor
                  : 'bg-slate-200'                                    // ← Points gris ronds
              }`} 
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Onboarding;