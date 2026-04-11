import React from 'react';
import { TbMailFilled } from "react-icons/tb";
import { FaEye, FaPhone, FaUser } from "react-icons/fa6";

// IconWrapper
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

// ✅ PROPS UPDATED
interface SignUpFormProps {
  activeTab: 'signup' | 'login';
}

// STATE
interface SignUpFormState {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  passwordStrength: 'Weak' | 'Medium' | 'Strong';
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
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    } as Pick<SignUpFormState, keyof SignUpFormState>);

    if (name === 'password') {
      let strength: 'Weak' | 'Medium' | 'Strong' = 'Weak';
      if (value.length >= 10) strength = 'Strong';
      else if (value.length >= 6) strength = 'Medium';

      this.setState({ passwordStrength: strength });
    }
  }

  getStrengthColor(): string {
    const { passwordStrength } = this.state;
    if (passwordStrength === 'Weak') return 'bg-red-500 w-1/4';
    if (passwordStrength === 'Medium') return 'bg-yellow-500 w-2/4';
    return 'bg-green-500 w-full';
  }

  render() {
    const { fullName, phone, email, password, passwordStrength } = this.state;
    const { activeTab } = this.props;

    return (
      <div className="w-full text-left mb-6">
        <div className="">
          <form className="space-y-6">

            {/* SIGN UP ONLY */}
            {activeTab === 'signup' && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xl font-medium text-gray-700 mt-6 mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={fullName}
                      onChange={this.handleInputChange}
                      placeholder="Enter your full name"
                      className="text-2xl w-full pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div className="text-xl bg-gray-50 border border-gray-200 border-r-0 rounded-l-lg px-4 flex items-center gap-2">
                      <span className="fi fi-qa text-ms"></span>
                      <span className="text-gray-600 font-semibold">+974</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={this.handleInputChange}
                      placeholder="5555 5555"
                      className="text-2xl flex-1 pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-r-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                      <IconWrapper icon={FaPhone} />
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-3 mt-6">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleInputChange}
                  placeholder="your.email@example.com"
                  className="text-2xl w-full pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handleInputChange}
                  placeholder="Enter your password"
                  className="text-2xl w-full pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl cursor-pointer">
                  <IconWrapper icon={FaEye} />
                </span>
              </div>

              {/* Strength ONLY for signup */}
              {activeTab === 'signup' && password && (
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full transition-all rounded-full duration-500 ${this.getStrengthColor()}`} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1 capitalize">
                    {passwordStrength}
                  </p>
                </div>
              )}
            </div>

          </form>
        </div>
      </div>
    );
  }
}

export default SignUpForm;