import React from 'react';
import {
  FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaPhone,
} from 'react-icons/fa6';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => (
  <Icon className={className} />
);

// Field-level validation
function validateEmail(email: string): string {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
  return '';
}

function validatePassword(password: string): string {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 72) return 'Password must not exceed 72 characters';
  return '';
}

function validateFullName(name: string): string {
  if (!name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
}

interface SignUpFormProps {
  activeTab: 'signup' | 'login';
  onSignupDataChange?: (data: SignupData) => void;
  onLoginDataChange?:  (data: LoginData)  => void;
}

interface SignupData {
  fullName: string;
  phone:    string;
  email:    string;
  password: string;
}

interface LoginData {
  email:    string;
  password: string;
}

interface SignUpFormState {
  signupData: SignupData;
  loginData:  LoginData;
  showPassword: boolean;
  // Field-level errors
  signupErrors: Partial<Record<keyof SignupData, string>>;
  loginErrors:  Partial<Record<keyof LoginData,  string>>;
  // Track which fields have been touched (show error only after blur)
  signupTouched: Partial<Record<keyof SignupData, boolean>>;
  loginTouched:  Partial<Record<keyof LoginData,  boolean>>;
}

class SignUpForm extends React.Component<SignUpFormProps, SignUpFormState> {
  state: SignUpFormState = {
    signupData: { fullName: '', phone: '', email: '', password: '' },
    loginData:  { email: '', password: '' },
    showPassword:  false,
    signupErrors:  {},
    loginErrors:   {},
    signupTouched: {},
    loginTouched:  {},
  };

  // ── Signup handlers ─────────────────────────────────────────────
  handleSignupChange = (field: keyof SignupData, value: string) => {
    const next = { ...this.state.signupData, [field]: value };
    this.setState({ signupData: next }, () => {
      this.props.onSignupDataChange?.(next);
      // Re-validate touched field live
      if (this.state.signupTouched[field]) {
        this.validateSignupField(field, value);
      }
    });
  };

  handleSignupBlur = (field: keyof SignupData) => {
    this.setState(prev => ({
      signupTouched: { ...prev.signupTouched, [field]: true },
    }), () => {
      this.validateSignupField(field, this.state.signupData[field]);
    });
  };

  validateSignupField = (field: keyof SignupData, value: string) => {
    let error = '';
    if (field === 'email')    error = validateEmail(value);
    if (field === 'password') error = validatePassword(value);
    if (field === 'fullName') error = validateFullName(value);
    this.setState(prev => ({
      signupErrors: { ...prev.signupErrors, [field]: error },
    }));
  };

  // ── Login handlers ──────────────────────────────────────────────
  handleLoginChange = (field: keyof LoginData, value: string) => {
    const next = { ...this.state.loginData, [field]: value };
    this.setState({ loginData: next }, () => {
      this.props.onLoginDataChange?.(next);
      if (this.state.loginTouched[field]) {
        this.validateLoginField(field, value);
      }
    });
  };

  handleLoginBlur = (field: keyof LoginData) => {
    this.setState(prev => ({
      loginTouched: { ...prev.loginTouched, [field]: true },
    }), () => {
      this.validateLoginField(field, this.state.loginData[field]);
    });
  };

  validateLoginField = (field: keyof LoginData, value: string) => {
    let error = '';
    if (field === 'email')    error = validateEmail(value);
    if (field === 'password') error = value ? '' : 'Password is required';
    this.setState(prev => ({
      loginErrors: { ...prev.loginErrors, [field]: error },
    }));
  };

  // ── Reusable field renderer ─────────────────────────────────────
  renderField({
    icon, type, placeholder, value, error, touched,
    onChange, onBlur, rightSlot,
  }: {
    icon: any; type: string; placeholder: string;
    value: string; error?: string; touched?: boolean;
    onChange: (v: string) => void;
    onBlur: () => void;
    rightSlot?: React.ReactNode;
  }) {
    const showError = touched && error;
    return (
      <div className="mb-5">
        <div className={`flex items-center gap-3 border rounded-2xl px-4 py-4 bg-white transition ${
          showError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-blue-500'
        }`}>
          <span className={`text-2xl flex-shrink-0 ${showError ? 'text-red-400' : 'text-gray-400'}`}>
            <IconWrapper icon={icon} />
          </span>
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            onBlur={onBlur}
            className="flex-1 text-xl text-gray-800 placeholder-gray-400 outline-none bg-transparent"
          />
          {rightSlot}
        </div>
        {showError && (
          <p className="text-red-500 text-lg mt-1 ml-2">{error}</p>
        )}
      </div>
    );
  }

  render() {
    const { activeTab } = this.props;
    const {
      signupData, loginData, showPassword,
      signupErrors, loginErrors, signupTouched, loginTouched,
    } = this.state;

    const eyeButton = (
      <button
        type="button"
        onClick={() => this.setState(p => ({ showPassword: !p.showPassword }))}
        className="text-gray-400 hover:text-gray-600 text-2xl flex-shrink-0"
      >
        <IconWrapper icon={showPassword ? FaEyeSlash : FaEye} />
      </button>
    );

    if (activeTab === 'signup') {
      return (
        <div className="w-full mt-6">
          {this.renderField({
            icon:        FaUser,
            type:        'text',
            placeholder: 'Full Name *',
            value:       signupData.fullName,
            error:       signupErrors.fullName,
            touched:     signupTouched.fullName,
            onChange:    v => this.handleSignupChange('fullName', v),
            onBlur:      () => this.handleSignupBlur('fullName'),
          })}
          {this.renderField({
            icon:        FaEnvelope,
            type:        'email',
            placeholder: 'Email Address *',
            value:       signupData.email,
            error:       signupErrors.email,
            touched:     signupTouched.email,
            onChange:    v => this.handleSignupChange('email', v),
            onBlur:      () => this.handleSignupBlur('email'),
          })}
          {this.renderField({
            icon:        FaPhone,
            type:        'tel',
            placeholder: 'Phone Number (optional)',
            value:       signupData.phone,
            onChange:    v => this.handleSignupChange('phone', v),
            onBlur:      () => this.handleSignupBlur('phone'),
          })}
          {this.renderField({
            icon:        FaLock,
            type:        showPassword ? 'text' : 'password',
            placeholder: 'Password * (min 8 characters)',
            value:       signupData.password,
            error:       signupErrors.password,
            touched:     signupTouched.password,
            onChange:    v => this.handleSignupChange('password', v),
            onBlur:      () => this.handleSignupBlur('password'),
            rightSlot:   eyeButton,
          })}

          {/* Password strength indicator */}
          {signupData.password && (
            <div className="mb-4">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= getPasswordStrength(signupData.password)
                        ? ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'][getPasswordStrength(signupData.password)]
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-lg ${
                ['', 'text-red-400', 'text-orange-400', 'text-yellow-500', 'text-green-500'][getPasswordStrength(signupData.password)]
              }`}>
                {['', 'Weak', 'Fair', 'Good', 'Strong'][getPasswordStrength(signupData.password)]}
              </p>
            </div>
          )}
        </div>
      );
    }

    // Login form
    return (
      <div className="w-full mt-6">
        {this.renderField({
          icon:        FaEnvelope,
          type:        'email',
          placeholder: 'Email Address',
          value:       loginData.email,
          error:       loginErrors.email,
          touched:     loginTouched.email,
          onChange:    v => this.handleLoginChange('email', v),
          onBlur:      () => this.handleLoginBlur('email'),
        })}
        {this.renderField({
          icon:        FaLock,
          type:        showPassword ? 'text' : 'password',
          placeholder: 'Password',
          value:       loginData.password,
          error:       loginErrors.password,
          touched:     loginTouched.password,
          onChange:    v => this.handleLoginChange('password', v),
          onBlur:      () => this.handleLoginBlur('password'),
          rightSlot:   eyeButton,
        })}
        <div className="text-right mb-4">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('auth:forgot-password'))}
            className="text-blue-500 text-xl hover:underline"
          >
            Forgot password?
          </button>
        </div>
      </div>
    );
  }
}

function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8)                     score++;
  if (/[A-Z]/.test(password))                  score++;
  if (/[0-9]/.test(password))                  score++;
  if (/[^A-Za-z0-9]/.test(password))           score++;
  return score;
}

export default SignUpForm;