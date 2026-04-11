import { Component, createRef } from "react";
import { FaRobot, FaBrain } from "react-icons/fa";

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

interface Props {
  onFinish: () => void;
}

class SplashScreen extends Component<Props> {
  private splashRef = createRef<HTMLDivElement>();
  private timer: ReturnType<typeof setTimeout> | null = null;

  componentDidMount() {
    this.timer = setTimeout(() => {
      if (this.splashRef.current) {
        this.splashRef.current.classList.add("opacity-0");
        this.splashRef.current.classList.remove("opacity-100");
        setTimeout(() => this.props.onFinish(), 500);
      }
    }, 3000);
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  render() {
    return (
      <div
        ref={this.splashRef}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-blue-500 to-transparent opacity-100 transition-opacity duration-500"
      >
        <style>{`
          @keyframes bounceDot {
            0%, 100% { transform: translateY(0px); opacity: 0.5; }
            50%       { transform: translateY(-10px); opacity: 1; }
          }
          .dot-1 { animation: bounceDot 1.2s ease-in-out infinite; animation-delay: 0s; }
          .dot-2 { animation: bounceDot 1.2s ease-in-out infinite; animation-delay: 0.2s; }
          .dot-3 { animation: bounceDot 1.2s ease-in-out infinite; animation-delay: 0.4s; }
        `}</style>

        {/* Icon */}
        <div className="relative w-[180px] h-[180px] flex items-center justify-center mb-6">
          <div className="w-[180px] h-[180px] rounded-full bg-white/20 flex items-center justify-center">
            <div className="w-[130px] h-[130px] rounded-full bg-white flex items-center justify-center">
              <IconWrapper icon={FaRobot} className="text-6xl text-blue-500" />
            </div>
          </div>
          <div className="absolute -top-7 -right-14 w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-xl">
            <IconWrapper icon={FaBrain} className="text-3xl text-white" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-5xl font-bold text-white mb-2 tracking-wide">Physio AI</h1>
        <p className="text-2xl text-white/80 mb-8">Your AI Health Assistant</p>

        {/* Bouncing dots */}
        <div className="flex items-center gap-2">
          <span className="dot-1 w-4 h-4 rounded-full bg-white/60" />
          <span className="dot-2 w-4 h-4 rounded-full bg-white/60" />
          <span className="dot-3 w-4 h-4 rounded-full bg-white/60" />
        </div>
      </div>
    );
  }
}

export default SplashScreen;