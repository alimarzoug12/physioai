// src/components/SignUpForm.tsx
import React from 'react';
import { TbMailFilled } from "react-icons/tb";
import { FaEye, FaPhone, FaUser } from "react-icons/fa6";

// IconWrapper component to handle icon type issues
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

// Définir le type des props (ici vide car pas de props externes)
interface SignUpFormProps {}

// Définir le type de l'état
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

    // État initial
    this.state = {
      fullName: '',
      phone: '',
      email: '',
      password: '',
      passwordStrength: 'Weak',
    };

    // Binding obligatoire des méthodes qui utilisent this.setState
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // Méthode correctement bindée
  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    // Mise à jour de l'état
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }));

    // Calcul de la force du mot de passe uniquement pour le champ password
    if (name === 'password') {
      let strength: 'Weak' | 'Medium' | 'Strong' = 'Weak';
      if (value.length >= 10) strength = 'Strong';
      else if (value.length >= 6) strength = 'Medium';

      this.setState({ passwordStrength: strength });
    }
  }

  // Méthode pour la couleur de la barre de force
  getStrengthColor(): string {
    const { passwordStrength } = this.state;
    if (passwordStrength === 'Weak') return 'bg-red-500 w-1/4';
    if (passwordStrength === 'Medium') return 'bg-yellow-500 w-2/4';
    return 'bg-green-500 w-full';
  }

  render() {
    const { fullName, phone, email, password, passwordStrength } = this.state;

    return (
      <div className="flex items-center justify-center p-6">
        <div className="w-full">          

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
                  className="w-full pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  <IconWrapper icon={FaUser} />
                </span>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-3">
                Phone Number
              </label>
              <div className="relative flex">
                <div className="bg-gray-50 border border-gray-200 border-r-0 rounded-l-lg px-4 flex items-center gap-2">
                  <span className="fi fi-qa text-ms"></span>
                  <span className="text-gray-600 font-semibold">+974</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={this.handleInputChange}
                  placeholder="5555 5555"
                  className="flex-1 pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-r-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  <IconWrapper icon={FaPhone} />
                </span>
              </div>
            </div>

            {/* Email Address */}
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
                  className="w-full pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  placeholder="Create a strong password"
                  className="w-full pl-5 pr-12 py-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl cursor-pointer">
                  <IconWrapper icon={FaEye} />
                </span>
              </div>

              {/* Barre de force du mot de passe */}
              {password && (
                <div className="mt-3">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${this.getStrengthColor()}`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 capitalize">
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