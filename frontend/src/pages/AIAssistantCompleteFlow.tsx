import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBrain, FaCheckDouble, FaDumbbell, FaRobot, FaCheck, FaClock, FaUserDoctor, FaTriangleExclamation, FaPlus } from "react-icons/fa6";
import { FiCheck, FiPlus } from 'react-icons/fi';
import { HiArrowLeft, HiHome } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbCircleDotted } from "react-icons/tb";
import { FaRunning, FaSmile } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { FaMicrophone, FaCamera, FaVideo, FaFileMedical } from 'react-icons/fa6';

//page 3 src/pages/AIAssistantCompleteFlow.tsx
interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

interface AppState {
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
interface AIAssistantCompleteFlowProps {
  navigate?: (path: string) => void;
}

class AIAssistantCompleteFlow extends React.Component<AIAssistantCompleteFlowProps, AppState> {
  state: AppState = {
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

    this.setState(prev => ({
      messages: [...prev.messages, newMessage],
      inputText: '',
    }));
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

  render() {
    const { messages, inputText, dynamicMessages, isTyping, selectedArea, painIntensity } = this.state;

    // Welcome section
    const welcomeSection = (
      <div className="mb-8">
        {/* Top section with blue background */}
        <div className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-50 to-gray-50 px-6 py-2 pt-8">
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
        </div>

        {/* Bottom section with white background */}
        <div className="w-full bg-white px-6 pb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-6 text-left pt-6">
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
                className={`flex items-center gap-4 p-4 rounded-2xl hover:shadow-md transition-all cursor-pointer ${item.bgColor} ${item.borderColor}`}
              >
                <span className={`text-3xl flex-shrink-0 ${item.iconColor}`}>
                  <IconWrapper icon={item.icon} />
                </span>
                <p className={`text-xl font-medium text-gray-600`}>
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // Chat messages section
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

    const chatSection = (
      <div className="bg-gray-50 p-6">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`flex mb-6 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'robot' && (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <IconWrapper icon={FaRobot} className="text-white text-2xl" />
              </div>
            )}

            <div className="max-w-[80%] flex flex-col">
              <div className={`p-5 rounded-3xl shadow-sm ${msg.type === 'user'
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

            {msg.type === 'user' && (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                <span className="text-2xl">👤</span>
              </div>
            )}
          </div>
        ))}

        {dynamicMessages.map((msg) => (
          <div key={msg.id} className={`flex mb-6 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <IconWrapper icon={FaRobot} className="text-white text-2xl" />
              </div>
            )}

            <div className="max-w-[80%] flex flex-col">
              <div className={`p-5 rounded-3xl shadow-sm ${msg.sender === 'user'
                ? 'rounded-tr-none bg-blue-600 text-white'
                : 'rounded-tl-none bg-white border border-gray-100'
                }`}>
                <p>{msg.text}</p>
              </div>
              <p className="text-xs mt-2 text-gray-400">{msg.time}</p>
            </div>

            {msg.sender === 'user' && (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center ml-3">
                <span className="text-2xl">👤</span>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <IconWrapper icon={FaRobot} className="text-white text-2xl" />
            </div>
            <div className="max-w-[80%] p-5 rounded-3xl rounded-tl-none bg-white border border-gray-100 shadow-sm flex items-center">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => this.handleQuickAnswer("Pain level: 6/10")}
            className="px-5 py-3 bg-white rounded-full text-xl text-gray-800 border border-gray-200 hover:bg-gray-200 transition"
          >
            Pain level: 6/10
          </button>
          <button
            onClick={() => this.handleQuickAnswer("No leg pain")}
            className="px-5 py-3 bg-white rounded-full text-xl text-gray-800 border border-gray-200 hover:bg-gray-200 transition"
          >
            No leg pain
          </button>
          <button
            onClick={() => this.handleQuickAnswer("No numbness")}
            className="px-5 py-3 bg-white rounded-full text-xl text-gray-800 border border-gray-200 hover:bg-gray-200 transition"
          >
            No numbness
          </button>
          <button
            onClick={() => this.handleQuickAnswer("Upload photo")}
            className="px-5 py-3 bg-white rounded-full text-xl text-gray-800 border border-gray-200 hover:bg-gray-200 transition"
          >
            Upload photo
          </button>
        </div>
      </div>
    );

    // Pain location section
    const painLocationSection = (
      <div className="p-6">
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
          <div className="mt-4">
            <span className="w-full inline-flex items-center gap-2 bg-white text-gray-500 px-5 py-2 rounded-xl text-xl font-normal shadow-[0_0_3px_rgba(0,0,0,0.1)]">
              <span className="w-4 h-4 bg-red-400 rounded-full"></span>
              {selectedArea} - {painIntensity} Pain
            </span>
          </div>
        </div>
      </div>
    );

    const voiceInputScreen = (
      <div className="bg-gradient-to-b from-gray-50 to-white flex flex-col">


        {/* Top Content */}
        <div className="flex-1 flex flex-col items-left justify-center bg-blue-50 px-6 py-5">

          <p className="text-center text-gray-600 text-xl leading-relaxed mb-3">
            Prefer to speak? Hold the button and describe your symptoms
          </p>
          {/* Big Microphone Button */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-100 rounded-full flex items-center justify-center shadow-xl ml-2">
            <span className="text-white text-3xl"><IconWrapper icon={FaMicrophone} /></span>
          </div>

          {/* Instruction Text */}


          {/* Animated 3 Dots */}
          <div className="flex justify-center gap-1.5 mt-2 h-6">

            <div className="w-1.5 bg-blue-400 rounded animate-wave" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 bg-blue-400 rounded animate-wave" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 bg-blue-400 rounded animate-wave" style={{ animationDelay: '300ms' }}></div>
            <div className="w-1.5 bg-blue-400 rounded animate-wave" style={{ animationDelay: '450ms' }}></div>
            <div className="w-1.5 bg-blue-400 rounded animate-wave" style={{ animationDelay: '600ms' }}></div>

          </div>

        </div>

        {/* Bottom Section */}
        <div className="px-5 pb-10">
          <p className="text-xl font-medium text-gray-500 my-5 px-2">Share additional information</p>

          <div className="grid grid-cols-3 gap-4">

            {/* Take Photo */}
            <button className="bg-gray-50 rounded-3xl py-5 flex justify-center items-center border border-gray-150 shadow-sm hover:shadow-md transition">
              <span className="text-3xl text-gray-500 px-2 mb-1"><IconWrapper icon={FaCamera} /></span>
              <span className="text-xl font-normal text-gray-600">Take Photo</span>
            </button>

            {/* Record Video */}
            <button className="bg-gray-50 rounded-3xl py-5 flex justify-center items-center border border-gray-150 shadow-sm hover:shadow-md transition">
              <span className="text-3xl text-gray-500 px-2"><IconWrapper icon={FaVideo} /></span>
              <span className="text-xl font-normal text-gray-600">Record Video</span>
            </button>

            {/* Medical Files */}
            <button className="bg-gray-50 rounded-3xl py-5 flex justify-center items-center border border-gray-150 shadow-sm hover:shadow-md transition">
              <span className="text-3xl text-gray-500 px-2 mb-1"><IconWrapper icon={FaFileMedical} /></span>
              <span className="text-xl font-normal text-gray-600">Medical Files</span>
            </button>

          </div>
        </div>
      </div>
    );

    // AI Analysis section
    const aiAnalysisSection = (
      <div className='bg-gradient-to-br from-blue-50 to-white p-5'>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-50 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl"><IconWrapper icon={FaBrain} /></span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              AI Analysis Complete
              <p className="text-lg font-normal text-gray-500 mb-6">
                Based on your symptoms
              </p>
            </h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm"><IconWrapper icon={FaCheck} /></span>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-700">Likely Condition</h4>
                <p className="text-lg text-gray-500">
                  Acute lower back strain from lifting
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-2xl"><IconWrapper icon={FaClock} /></span>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-700">Recommended Timeline</h4>
                <p className="text-lg text-gray-500">
                  2-3 sessions over 2 weeks
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center flex-shrink-0">
                <span className="text-black text-2xl"><IconWrapper icon={FaUserDoctor} /></span>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-700">Specialist Type</h4>
                <p className="text-lg text-gray-500">
                  Musculoskeletal Physiotherapist
                </p>
              </div>
            </div>
          </div>

          <button onClick={() => this.props.navigate?.('/specialists')} className="w-full mt-8 bg-gradient-to-r from-blue-500 to-blue-50 text-2xl text-white font-normal py-4 rounded-2xl shadow-lg hover:from-blue-600 hover:to-cyan-600 transition">
            Find Specialists Near You
          </button>
        </div>
      </div>
    );

    // Emergency section
    const emergencySection = (
      <div className="bg-red-50 border-t border-red-100 p-2">
        <div className="flex justify-left mb-2">
          <span className="text-red-500 text-2xl p-4">
            <IconWrapper icon={FaTriangleExclamation} />
          </span>
          <div>
            <h2 className="text-lg text-red-800">
              Severe pain or numbness?
            </h2>
            <a href="tel:911" className="text-red-600 text-lg underline hover:text-red-900">
              Contact emergency services
            </a>
          </div>
        </div>
      </div>
    );

    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header fixe */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => this.props.navigate?.(-1 as any)} className="text-gray-600 text-3xl hover:text-gray-900"><IconWrapper icon={HiArrowLeft} /></button>
          <div className="text-center">
            <h1 className="text-3xl font-medium text-cyan-500">AI Assistant</h1>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              Online & Ready
            </div>
          </div>
          <button onClick={() => this.props.navigate?.('/settings')} className="text-3xl font-medium text-gray-600 hover:text-gray-900">
            <IconWrapper icon={BsThreeDotsVertical} />
          </button>
        </header>

        {/* Zone messages (scrollable) */}
        <div className="">
          {welcomeSection}
          {chatSection}
          {painLocationSection}
          {voiceInputScreen}
          {aiAnalysisSection}
          {emergencySection}
          <div ref={this.messagesEndRef} />
        </div>

        {/* Barre de saisie fixe EN BAS */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-2xl z-10">
          <div className="mx-auto flex items-center gap-3">
            <button className="text-gray-500 p-3 rounded-full transition">
              <span className="text-3xl font-bold hover:text-gray-700 text-gray-400"><IconWrapper icon={FiPlus} /> </span>
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={this.handleInputChange}
                placeholder="Describe your symptoms or ask a question..."
                className="w-full px-5 py-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-14 text-2xl"
                onKeyPress={e => e.key === 'Enter' && this.handleSend()}
              />

              <button
                onClick={this.toggleRecording}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <IconWrapper icon={FaSmile} className="text-2xl" />
              </button>
            </div>

            <button
              onClick={this.handleSend}
              className="bg-gradient-to-br from-blue-600 to-blue-50 text-white p-3 rounded-full hover:bg-blue-600 transition"
              disabled={!inputText.trim()}
            >
              <span className="text-3xl"><IconWrapper icon={IoIosSend} /> </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function AIAssistantCompleteFlowWithRouter() {
  const navigate = useNavigate();
  return <AIAssistantCompleteFlow navigate={navigate} />;
}

export default AIAssistantCompleteFlowWithRouter;