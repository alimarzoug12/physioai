import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBrain, FaCheckDouble, FaDumbbell, FaRobot, FaCheck, FaClock,
  FaUserDoctor, FaTriangleExclamation, FaCamera, FaVideo, FaFileMedical,
  FaMicrophone,
} from 'react-icons/fa6';
import { FiCheck, FiPlus } from 'react-icons/fi';
import { HiArrowLeft, HiHome } from 'react-icons/hi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { TbCircleDotted } from 'react-icons/tb';
import { FaRunning, FaSmile } from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => (
  <Icon className={className} />
);

interface Message {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  time: string;
}

interface Props { navigate?: (path: string | number) => void }

interface State {
  messages: Message[];
  inputText: string;
  isTyping: boolean;
  selectedArea: string;
  painIntensity: string;
}

class AIAssistantCompleteFlow extends React.Component<Props, State> {
  state: State = {
    messages: [
      {
        id: '1',
        role: 'ASSISTANT',
        content: "Hello! I'm here to help you with your physiotherapy needs. Could you tell me what's bothering you today? Feel free to describe your pain, discomfort, or any symptoms you're experiencing.",
        time: 'Just now',
      },
    ],
    inputText: '',
    isTyping: false,
    selectedArea: 'Lower Back',
    painIntensity: 'Moderate',
  };

  messagesEndRef = React.createRef<HTMLDivElement>();

  componentDidUpdate(_: Props, prevState: State) {
    if (
      prevState.messages.length !== this.state.messages.length ||
      prevState.isTyping !== this.state.isTyping
    ) {
      this.messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleSend = () => {
    const content = this.state.inputText.trim();
    if (!content || this.state.isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'USER',
      content,
      time: 'Just now',
    };

    this.setState(prev => ({
      messages: [...prev.messages, userMsg],
      inputText: '',
      isTyping: true,
    }));

    // Show typing dots for 3 seconds then reply "Coming soon"
    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'ASSISTANT',
        content: 'Coming soon... 🚀 Full AI responses will be available shortly.',
        time: 'Just now',
      };
      this.setState(prev => ({
        messages: [...prev.messages, botMsg],
        isTyping: false,
      }));
    }, 3000);
  };

  handleQuickAnswer = (text: string) => {
    this.setState({ inputText: text }, this.handleSend);
  };

  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') this.handleSend();
  };

  renderMessage(msg: Message) {
    const isUser = msg.role === 'USER';
    return (
      <div key={msg.id} className={`flex mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>

        {/* AI avatar */}
        {!isUser && (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <IconWrapper icon={FaRobot} className="text-white text-2xl" />
          </div>
        )}

        <div className="max-w-[80%] flex flex-col">
          <div className={`p-5 rounded-3xl shadow-sm ${isUser
              ? 'rounded-tr-none bg-blue-600 text-white'
              : 'rounded-tl-none bg-white border border-gray-100 text-gray-800'
            }`}>
            <p className="text-xl leading-relaxed">{msg.content}</p>
          </div>
          <p className={`text-lg mt-2 flex items-center gap-1 text-gray-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && <span>AI Assistant •</span>}
            <span>{msg.time}</span>
            {isUser && (
              <>
                <span>•</span>
                <IconWrapper icon={FaCheckDouble} className="text-blue-400 text-lg" />
              </>
            )}
          </p>
        </div>

        {/* User avatar */}
        {isUser && (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-200 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <span className="text-white text-lg font-bold">U</span>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { messages, inputText, isTyping, selectedArea, painIntensity } = this.state;

    return (
      <div className="flex flex-col h-screen bg-gray-50">

        {/* ── Header ───────────────────────────────────────── */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <button
            onClick={() => this.props.navigate?.(-1)}
            className="text-gray-600 text-3xl hover:text-gray-900"
          >
            <IconWrapper icon={HiArrowLeft} />
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-medium text-cyan-500">AI Assistant</h1>
            <div className="flex items-center justify-center gap-2 text-lg text-gray-500">
              <span className="w-3 h-3 bg-green-400 rounded-full" />
              Online & Ready
            </div>
          </div>
          <button className="text-3xl font-medium text-gray-600 hover:text-gray-900">
            <IconWrapper icon={BsThreeDotsVertical} />
          </button>
        </header>

        {/* ── Scrollable page content ───────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* 1. Welcome hero — always visible */}
          <div className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-50 to-gray-50 px-6 py-8">
            <div className="relative mb-10">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                <IconWrapper icon={FaRobot} className="text-white text-5xl" />
              </div>
              <div className="absolute -top-2 -right-1 w-9 h-9 bg-green-400 rounded-full flex items-center justify-center">
                <IconWrapper icon={FiCheck} className="text-white text-2xl" />
              </div>
            </div>
            <h2 className="text-3xl font-medium text-gray-800 mb-4">
              Hi! I'm your AI Health Assistant
            </h2>
            <p className="text-gray-600 text-xl mb-8">
              I'm here to help you describe your symptoms and find the perfect physiotherapist. Let's get you feeling better!
            </p>
          </div>

          {/* 2. Common Issues — always visible */}
          <div className="bg-white px-6 pb-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 pt-6">Common Issues</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Neck Pain', icon: TbCircleDotted, bg: 'bg-blue-100', clr: 'text-blue-600', border: 'border border-blue-200' },
                { name: 'Sports Injury', icon: FaRunning, bg: 'bg-gray-50', clr: 'text-gray-800', border: 'border border-gray-200' },
                { name: 'Home Visit', icon: HiHome, bg: 'bg-purple-100', clr: 'text-purple-500', border: 'border border-purple-200' },
                { name: 'Rehabilitation', icon: FaDumbbell, bg: 'bg-orange-50', clr: 'text-orange-500', border: 'border border-orange-200' },
              ].map(item => (
                <button
                  key={item.name}
                  onClick={() => this.handleQuickAnswer(`I need help with: ${item.name}`)}
                  className={`flex items-center gap-4 p-4 rounded-2xl hover:shadow-md transition-all cursor-pointer ${item.bg} ${item.border}`}
                >
                  <IconWrapper icon={item.icon} className={`text-3xl flex-shrink-0 ${item.clr}`} />
                  <p className="text-xl font-medium text-gray-600">{item.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Chat section — always visible, max height + internal scroll */}
          <div className="bg-gray-50 border-b border-gray-100">

            {/* Chat messages — scrollable container with max height */}
            <div
              className="overflow-y-auto px-6 pt-6"
              style={{ maxHeight: '420px' }}
            >
              {messages.map(msg => this.renderMessage(msg))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <IconWrapper icon={FaRobot} className="text-white text-2xl" />
                  </div>
                  <div className="p-5 rounded-3xl rounded-tl-none bg-white border border-gray-100 shadow-sm flex items-center">
                    <div className="flex gap-1 items-end h-6">
                      {[0, 150, 300].map(delay => (
                        <div
                          key={delay}
                          className="w-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}ms`, height: '8px' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={this.messagesEndRef} />
            </div>

            {/* Quick reply chips */}
            <div className="flex flex-wrap gap-3 px-6 py-4">
              {['Pain level: 6/10', 'No leg pain', 'No numbness', 'Upload photo'].map(chip => (
                <button
                  key={chip}
                  onClick={() => this.handleQuickAnswer(chip)}
                  disabled={isTyping}
                  className="px-5 py-3 bg-white rounded-full text-xl text-gray-800 border border-gray-200 hover:bg-gray-100 transition disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Pain location — always visible */}
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

          {/* 5. Voice / media input — always visible */}
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

          {/* 6. AI Analysis — always visible */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-5 border-b border-gray-100">
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-50 rounded-full flex items-center justify-center">
                  <IconWrapper icon={FaBrain} className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">AI Analysis Complete</h3>
                  <p className="text-lg font-normal text-gray-500">Based on your symptoms</p>
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { icon: FaCheck, bg: 'bg-green-500 text-white', title: 'Likely Condition', sub: 'Acute lower back strain from lifting' },
                  { icon: FaClock, bg: 'text-blue-600', title: 'Recommended Timeline', sub: '2–3 sessions over 2 weeks' },
                  { icon: FaUserDoctor, bg: 'text-gray-800', title: 'Specialist Type', sub: 'Musculoskeletal Physiotherapist' },
                ].map(({ icon, bg, title, sub }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
                      <IconWrapper icon={icon} className="text-lg" />
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-700">{title}</h4>
                      <p className="text-lg text-gray-500">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => this.props.navigate?.('/specialists')}
                className="w-full mt-8 bg-gradient-to-r from-blue-500 to-blue-200 text-2xl text-white font-normal py-4 rounded-2xl shadow-lg hover:opacity-90 transition"
              >
                Find Specialists Near You
              </button>
            </div>
          </div>

          {/* 7. Emergency — always visible */}
          <div className="bg-red-50 border-t border-red-100 p-4">
            <div className="flex items-center gap-3">
              <IconWrapper icon={FaTriangleExclamation} className="text-red-500 text-2xl flex-shrink-0" />
              <div>
                <h2 className="text-lg text-red-800 font-medium">Severe pain or numbness?</h2>
                <a href="tel:999" className="text-red-600 text-lg underline hover:text-red-900">
                  Contact emergency services — 999
                </a>
              </div>
            </div>
          </div>

        </div>
        {/* end scrollable page */}

        {/* ── Fixed input bar at bottom ─────────────────────── */}
        <div className="bg-white border-t border-gray-200 p-4 shadow-2xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="text-gray-400 p-3 rounded-full hover:text-gray-600 transition">
              <IconWrapper icon={FiPlus} className="text-3xl" />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={e => this.setState({ inputText: e.target.value })}
                onKeyPress={this.handleKeyPress}
                placeholder="Describe your symptoms or ask a question..."
                className="w-full px-5 py-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-14 text-xl"
                disabled={isTyping}
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                <IconWrapper icon={FaSmile} className="text-2xl" />
              </button>
            </div>
            <button
              onClick={this.handleSend}
              disabled={!inputText.trim() || isTyping}
              className="bg-gradient-to-br from-blue-600 to-blue-300 text-white p-3 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              <IconWrapper icon={IoIosSend} className="text-3xl" />
            </button>
          </div>
        </div>

      </div>
    );
  }
}

function AIAssistantCompleteFlowWithRouter() {
  const navigate = useNavigate();
  return <AIAssistantCompleteFlow navigate={navigate as any} />;
}

export default AIAssistantCompleteFlowWithRouter;