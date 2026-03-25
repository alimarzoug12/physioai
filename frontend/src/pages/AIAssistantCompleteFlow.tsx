import React, { useState } from 'react';
import { FaCheckDouble, FaDumbbell, FaRobot } from "react-icons/fa6";
import { FiCheck } from 'react-icons/fi';
import { HiArrowLeft, HiHome } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbCircleDotted } from "react-icons/tb";
import { FaRunning } from "react-icons/fa";
//page 3 src/components/AIAssistantCompleteFlow.tsx
interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

interface AppState {
  step: number;
  messages: Message[];
  inputText: string;
  isRecording: boolean;
  painLevel: string;
  legPain: string;
  numbness: string;
  selectedArea: string;
  painIntensity: string;
  isTyping: boolean;
  dynamicMessages: Message[];
}
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

class AIAssistantCompleteFlow extends React.Component<{}, AppState> {
  state: AppState = {
    step: 4, // 1: Accueil, 2: Follow-up, 3: Chat, 4: Pain selector, 5: Analysis, 6: Emergency
    messages: [
      {
        id: 1,
        sender: 'ai',
        text: "Hello! I'm here to help you with your physiotherapy needs. Could you tell me what's bothering you today? Feel free to describe your pain, discomfort, or any symptoms you're experiencing.",
        time: 'Just now',
      },
    ],
    inputText: '',
    isRecording: false,
    painLevel: '6/10',
    legPain: 'No leg pain',
    numbness: 'No numbness',
    selectedArea: 'Lower Back',
    painIntensity: 'Moderate',
    isTyping: true,
    dynamicMessages: [],
  };

  messagesEndRef = React.createRef<HTMLDivElement>();

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    if (this.messagesEndRef.current) {
      this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  handleNextStep = () => {
    this.setState(prev => ({ step: prev.step + 1 }));
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputText: e.target.value });
  };

  handleSend = () => {
    if (!this.state.inputText.trim()) return;

    const newMessage: Message = {
      id: this.state.messages.length + 1,
      sender: 'user',
      text: this.state.inputText,
      time: 'Just now',
    };
    const [isTyping, setIsTyping] = useState(false);

    this.setState(prev => ({
      messages: [...prev.messages, newMessage],
      inputText: '',
    }));

    // Simulation : après envoi → passage à l'analyse
    setTimeout(() => {
      this.setState({ step: 5 });
    }, 1500);
  };

  handleQuickAnswer = (text: string) => {
  const userMessage: Message = {
    id: Date.now(),
    sender: "user",
    text,
    time: "Now",
  };

  this.setState((prev: AppState) => ({
    dynamicMessages: [...prev.dynamicMessages, userMessage],
    isTyping: true
  }));

  setTimeout(() => {
    const botMessage: Message = {
      id: Date.now() + 1,
      sender: "ai",
      text: "Thank you for that information. Let me analyze your symptoms and find the best physiotherapist for your needs.",
      time: "Now",
    };

    this.setState((prev: AppState) => ({
      dynamicMessages: [...prev.dynamicMessages, botMessage],
      isTyping: false
    }));
  }, 2000);
};

  toggleRecording = () => {
    this.setState(prev => ({ isRecording: !prev.isRecording }));
  };

  renderStep() {
    const { step, messages, inputText, painLevel, legPain, numbness, selectedArea, painIntensity, isRecording } = this.state;

    if (step === 1) {
      return (
        <div className="flex flex-col items-center justify-center text-center px-6 py-2">
          <div className="relative mb-10">
            <div className="w-32 h-32 md:w-25 md:h-25 bg-gradient-to-br from-blue-500 to-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.2)]">
              <span className="text-white text-5xl"><IconWrapper icon={FaRobot} /></span>
            </div>
            <div className="absolute -top-2 -right-1 w-9 h-9 bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl"><IconWrapper icon={FiCheck} /></span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4">
            Hi! I'm your AI Health Assistant
          </h2>

          <p className="text-gray-600 text-base md:text-lg mb-12">
            I'm here to help you describe your symptoms and find the perfect physiotherapist. Let's get you feeling better!
          </p>

          <div className="w-full">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 text-left">
              Common Issues
            </h3>

              <div className="grid grid-cols-2 gap-4">
              {[
                {
                  name: "Neck Pain",
                  icon: TbCircleDotted,
                  bgColor: "bg-blue-100",
                  iconColor: "text-blue-600",
                  borderColor: "border border-blue-200"
                },
                {
                  name: "Sports Injury",
                  icon: FaRunning,
                  bgColor: "bg-gray-50",
                  iconColor: "text-gray-800",
                  borderColor: "border border-gray-200"
                },
                {
                  name: "Home Visit",
                  icon: HiHome,
                  bgColor: "bg-purple-100",
                  iconColor: "text-purple-500",
                  borderColor: "border border-purple-200"
                },
                {
                  name: "Rehabilitation",
                  icon: FaDumbbell,
                  bgColor: "bg-orange-50",
                  iconColor: "text-orange-500",
                  borderColor: "border border-orange-200"
                }
              ].map((item) => (
                <div
                  key={item.name}
                  onClick={() => this.setState({ step: 2 })}
                  className={`flex items-center gap-4 p-4 rounded-2xl hover:shadow-md transition-all cursor-pointer ${item.bgColor} ${item.borderColor}`}
                >
                  {/* Icon with its own color */}
                  <span className={`text-3xl flex-shrink-0 ${item.iconColor}`}>
                    <IconWrapper icon={item.icon} />
                  </span>

                  {/* Text with its own color */}
                  <p className={`text-xl font-medium text-gray-600`}>
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (step === 2) {
  const chatMessages = [
    {
      type: 'robot',
      text: "Hello! I'm here to help you with your physiotherapy needs. Could you tell me what's bothering you today? Feel free to describe your pain, discomfort, or any symptoms you're experiencing.",
      time: "Just now"
    },
    {
      type: 'user',
      text: "I've been having lower back pain for about a week now. It started after I lifted some heavy boxes at work. The pain gets worse when I sit for long periods.",
      time: "2 min ago"
    },
    {
      type: 'robot',
      text: "I understand you're experiencing lower back pain after lifting heavy boxes. This sounds like it could be a muscle strain or sprain. Let me ask a few more questions to better help you:",
      time: "1 min ago",
      isQuestion: true
    }
  ];

  return (
    <>
  {chatMessages.map((msg, index) => (
    <div key={index} className={`flex mb-6 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>

      {/* Robot Icon */}
      {msg.type === 'robot' && (
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <IconWrapper icon={FaRobot} className="text-white text-2xl" />
        </div>
      )}

      {/* Message Bubble */}
      <div className="max-w-[80%] flex flex-col">
        <div className={`p-5 rounded-3xl shadow-sm ${
          msg.type === 'user' 
            ? 'rounded-tr-none bg-blue-600 text-white' 
            : 'rounded-tl-none bg-white border border-gray-100'
        }`}>
          <p className="leading-relaxed break-all">
            {msg.text}
          </p>

          {msg.isQuestion && (
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3"><span className="text-blue-600 text-xl mt-px">•</span><span>On a scale of 1-10, how would you rate your pain?</span></li>
              <li className="flex items-start gap-3"><span className="text-blue-600 text-xl mt-px">•</span><span>Does the pain radiate to your legs?</span></li>
              <li className="flex items-start gap-3"><span className="text-blue-600 text-xl mt-px">•</span><span>Any numbness or tingling?</span></li>
            </ul>
          )}
        </div>

        {/* Timestamp */}
        <p className={`text-xs mt-2 flex items-center gap-1 ${msg.type === 'user' ? 'text-right justify-end' : 'text-left'}`}>
          {msg.type === 'robot' && (
            <>
              <span className="text-gray-400 text-lg">AI Assistant</span>
              <span className="text-gray-400 text-lg">•</span>
            </>
          )}
          <span className='text-gray-400 text-lg'>
            {msg.time}
          </span>
          {msg.type === 'user' && (
            <>
              <span className="text-gray-400 text-lg">•</span>
              <span className="text-blue-400 text-lg leading-none"><IconWrapper icon={FaCheckDouble} /></span>
            </>
          )}
        </p>
      </div>

      {/* User Avatar */}
      {msg.type === 'user' && (
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
          <span className="text-2xl">👤</span>
        </div>
      )}
    </div>
  ))}
  {this.state.dynamicMessages.map((msg) => (
  <div key={msg.id} className={`flex mb-6 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>

    {msg.sender === 'ai' && (
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
        <IconWrapper icon={FaRobot} className="text-white text-2xl" />
      </div>
    )}

    <div className="max-w-[80%] flex flex-col">
      <div className={`p-5 rounded-3xl shadow-sm ${
        msg.sender === 'user'
          ? 'rounded-tr-none bg-blue-600 text-white'
          : 'rounded-tl-none bg-white border border-gray-100'
      }`}>
        <p>{msg.text}</p>
      </div>

      <p className="text-xs mt-2 text-gray-400">
        {msg.time}
      </p>
    </div>

    {msg.sender === 'user' && (
      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center ml-3">
        <span className="text-2xl">👤</span>
      </div>
    )}

  </div>
))}

  {/* ==================== TYPING INDICATOR (Three moving dots) ==================== */}
  {this.state.isTyping && (
    <div className="flex justify-start mb-6">
      {/* Robot Icon */}
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
        <IconWrapper icon={FaRobot} className="text-white text-2xl" />
      </div>

      {/* Typing Bubble */}
      <div className="max-w-[80%] p-5 rounded-3xl rounded-tl-none bg-white border border-gray-100 shadow-sm flex items-center">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  )}
  {/* ==================== QUICK ANSWERS ==================== */}
<div className="flex flex-wrap gap-3 mt-4">

  <button
    onClick={() => this.handleQuickAnswer("Pain level: 6/10")}
    className="px-4 py-2 bg-white rounded-full text-xl text-gray-800 border border-gray-200 hover:bg-gray-200 transition"
  >
    Pain level: 6/10
  </button>

  <button
    onClick={() => this.handleQuickAnswer("No leg pain")}
    className="px-4 py-2 bg-white rounded-full text-xl text-gray-800 border border-gray-200 hover:bg-gray-200 transition"
  >
    No leg pain
  </button>

  <button
    onClick={() => this.handleQuickAnswer("No numbness")}
    className="px-4 py-2 bg-white rounded-full text-xl text-gray-800 border border-gray-200 hover:bg-gray-200 transition"
  >
    No numbness
  </button>

  <button
    onClick={() => this.handleQuickAnswer("Upload photo")}
    className="px-4 py-2 bg-white rounded-full text-xl text-gray-800 border border-gray-200 hover:bg-gray-200 transition"
  >
    Upload photo
  </button>

</div>
</>
  );
}

    if (step === 3) {
      return (
        <>
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
                  msg.sender === 'ai'
                    ? 'bg-white border border-gray-200 text-gray-800'
                    : 'bg-blue-500 text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <p className="text-xs mt-2 opacity-70 text-right">{msg.time}</p>
              </div>
            </div>
          ))}

          <div ref={this.messagesEndRef} />
        </>
      );
    }

    if (step === 4) {
      return (
        <>          
          <div className="relative mb-4">
  
            <h2 className="text-xl font-medium text-gray-700 text-left">
              Point to your pain area
            </h2>

            <button className="absolute top-0 right-0 text-blue-500 hover:text-gray-700 text-xl font-normal">
              Reset
            </button>

          </div>

          <div className="bg-gradient-to-b to-white from-blue-50 rounded-xl p-6 mb-6 relative">
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Human body diagram"
                className="w-60 h-auto"
              />
            </div>

            {/* <div className="absolute bottom-[25%] left-[50%] transform -translate-x-1/2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                ●
              </div>
            </div> */}

            <div className="mt-4">
              <span className="w-full inline-flex items-center gap-2 bg-white text-gray-500 px-5 py-2 rounded-xl text-xl font-normal shadow-[0_0_3px_rgba(0,0,0,0.1)]">
                <span className="w-4 h-4 bg-red-400 rounded-full"></span>
                {selectedArea} - {painIntensity} Pain
              </span>
            </div>

            
          </div>

          <button
            onClick={() => this.setState({ step: 5 })}
            className="w-full mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-5 rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-600 transition"
          >
            Submit Pain Location
          </button>
        </>
      );
    }

    if (step === 5) {
      return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-3xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold text-blue-900">
              AI Analysis Complete
            </h3>
          </div>

          <p className="text-gray-700 mb-6">
            Based on your symptoms
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Likely Condition</h4>
                <p className="text-gray-700">
                  Acute lower back strain from lifting
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xl">⏰</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Recommended Timeline</h4>
                <p className="text-gray-700">
                  2-3 sessions over 2 weeks
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 text-xl">👨‍⚕️</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Specialist Type</h4>
                <p className="text-gray-700">
                  Musculoskeletal Physiotherapist
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => this.setState({ step: 6 })}
            className="w-full mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-5 rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-600 transition"
          >
            Find Specialists Near You
          </button>
        </div>
      );
    }

    if (step === 6) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-5xl">⚠️</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-red-800 mb-4">
            Severe pain or numbness?
          </h2>

          <p className="text-red-700 text-xl mb-8 font-medium">
            Contact emergency services
          </p>

          <button className="w-full bg-red-600 text-white font-bold text-xl py-5 px-8 rounded-xl hover:bg-red-700 transition shadow-lg">
            Call 999
          </button>

          <p className="mt-6 text-red-700 text-sm">
            For urgent care, call emergency services immediately.
          </p>
        </div>
      );
    }

    return null;
  }

  render() {
    const { inputText, isRecording } = this.state;

    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header fixe */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <button className="text-gray-600 text-3xl hover:text-gray-900"><IconWrapper icon={HiArrowLeft} /></button>
          <div className="text-center">
            <h1 className="text-3xl font-medium text-cyan-500">AI Assistant</h1>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              Online & Ready
            </div>
          </div>
          <button className="text-3xl font-medium text-gray-600 hover:text-gray-900">
            <IconWrapper icon={BsThreeDotsVertical} />
          </button>
        </header>

        {/* Zone messages (scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-32">
          {this.renderStep()}
        </div>

        {/* Barre de saisie fixe EN BAS */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-10">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <button className="text-gray-500 hover:text-gray-700 p-3 rounded-full hover:bg-gray-100 transition">
              <span className="text-2xl">+</span>
            </button>

            <input
              type="text"
              value={inputText}
              onChange={this.handleInputChange}
              placeholder="Describe your symptoms or ask a question..."
              className="flex-1 px-5 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={e => e.key === 'Enter' && this.handleSend()}
            />

            <button
              onClick={this.toggleRecording}
              className={`p-4 rounded-full transition-all duration-300 ${
                isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl">🎤</span>
            </button>

            <button
              onClick={this.handleSend}
              className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition"
              disabled={!inputText.trim()}
            >
              <span className="text-xl">➤</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AIAssistantCompleteFlow;