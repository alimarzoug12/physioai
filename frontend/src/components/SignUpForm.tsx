import React from 'react';
import { TbMailFilled } from "react-icons/tb";
import { FaEye, FaEyeSlash, FaPhone, FaUser } from "react-icons/fa6";

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

interface SignUpFormProps {
  activeTab: 'signup' | 'login';
  onSignupDataChange?: (data: any) => void;
  onLoginDataChange?: (data: any) => void;
}

interface SignUpFormState {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  passwordStrength: 'Weak' | 'Medium' | 'Strong';
  showPassword: boolean;
  // login fields
  loginEmail: string;
  loginPassword: string;
}

class SignUpForm extends React.Component<SignUpFormProps, SignUpFormState> {
  constructor(props: SignUpFormProps) {
    super(props);
    this.state = {
      fullName: '',
      phone: '',
      email: '',
      password: '',
      passwordStrength: 'Weak',
      showPassword: false,
      loginEmail: '',
      loginPassword: '',
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'password') {
      let strength: 'Weak' | 'Medium' | 'Strong' = 'Weak';
      if (value.length >= 18) strength = 'Strong';
      else if (value.length >= 12) strength = 'Medium';
      this.setState({ passwordStrength: strength });
    }

    // send signup data to parent
    setTimeout(() => {
      if (this.props.activeTab === 'signup') {
        this.props.onSignupDataChange?.({
          fullName: name === 'fullName' ? value : this.state.fullName,
          phone: name === 'phone' ? value : this.state.phone,
          email: name === 'email' ? value : this.state.email,
          password: name === 'password' ? value : this.state.password,
        });
      } else {
        this.props.onLoginDataChange?.({
          email: name === 'loginEmail' ? value : this.state.loginEmail,
          password: name === 'loginPassword' ? value : this.state.loginPassword,
        });
      }
    }, 0);
  };

  getStrengthColor(): string {
    const { passwordStrength } = this.state;
    if (passwordStrength === 'Weak') return 'bg-red-500 w-1/4';
    if (passwordStrength === 'Medium') return 'bg-yellow-500 w-2/4';
    return 'bg-green-500 w-full';
  }

  render() {
    const { activeTab } = this.props;
    const { fullName, phone, email, password, passwordStrength, showPassword, loginEmail, loginPassword } = this.state;

    // ── LOGIN FORM ──────────────────────────────────────
    if (activeTab === 'login') {
      return (
        <div className="w-full text-left mb-6">
          <div className="space-y-6">

            <div>
              <label className="block text-xl font-medium text-gray-700 mt-14 mb-3">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="loginEmail"
                  value={loginEmail}
                  onChange={this.handleInputChange}
                  placeholder="your.email@example.com"
                  className="text-xl w-full pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  <IconWrapper icon={TbMailFilled} />
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xl font-medium text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="loginPassword"
                  value={loginPassword}
                  onChange={this.handleInputChange}
                  placeholder="Enter your password"
                  className="text-xl w-full pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl cursor-pointer"
                  onClick={() => this.setState({ showPassword: !showPassword })}
                >
                  <IconWrapper icon={showPassword ? FaEyeSlash : FaEye} />
                </span>
              </div>
            </div>

          </div>
        </div>
      );
    }

    // ── SIGNUP FORM ─────────────────────────────────────
    return (
      <div className="w-full text-left mb-6">        
          <form className="space-y-6">

            {/* Full Name */}
            <div>
              <label className="block text-xl font-medium text-gray-700 mt-14 mb-3">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={this.handleInputChange}
                  placeholder="Enter your full name"
                  className="text-xl w-full pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  <IconWrapper icon={FaUser} />
                </span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-3">
                Phone Number
              </label>
              <div className="relative flex">
                <div className="bg-gray-50 border border-gray-200 border-r-0 rounded-l-lg px-4 flex items-center gap-2">
                  <span className={"fi text-xl fi-qa"} />
                  <span className="text-gray-600 font-semibold text-xl">+974</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={this.handleInputChange}
                  placeholder="5555 5555"
                  className="text-xl flex-1 pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-r-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  <IconWrapper icon={FaPhone} />
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleInputChange}
                  placeholder="your.email@example.com"
                  className="text-xl w-full pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  <IconWrapper icon={TbMailFilled} />
                </span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={this.handleInputChange}
                  placeholder="Create a strong password"
                  className="text-xl w-full pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl cursor-pointer"
                  onClick={() => this.setState({ showPassword: !showPassword })}
                >
                  <IconWrapper icon={showPassword ? FaEye : FaEyeSlash} />
                </span>
              </div>

              {password && (
                <div className="mt-3">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full transition-all rounded-full duration-500 ${this.getStrengthColor()}`} />
                  </div>
                  <p className="text-lg text-gray-500 mt-1 capitalize">{passwordStrength}</p>
                </div>
              )}
            </div>

          </form>        
      </div>
    );
  }
}

export default SignUpForm;