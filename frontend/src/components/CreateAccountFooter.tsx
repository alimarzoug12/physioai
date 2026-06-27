// src/components/CreateAccountFooter.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/auth';
import EmailVerificationModal from './EmailVerificationModal';
import ForgotPasswordModal from './ForgotPasswordModal';

interface SignupData { fullName: string; phone: string; email: string; password: string }
interface LoginData { email: string; password: string }
interface HealthData {
  age: string; gender: string;
  conditions: { backPain: boolean; jointPain: boolean; sportsInjury: boolean; neckIssues: boolean };
  activityLevel: string;
}

interface Props {
  activeTab: 'signup' | 'login';
  signupData: SignupData;
  loginData: LoginData;
  healthData: HealthData;
}

function parseServerError(message: string): string {
  if (Array.isArray(message)) return message.join('. ');
  if (message.includes('ThrottlerException') || message.toLowerCase().includes('too many'))
    return 'Too many attempts. Please wait a moment and try again.';
  if (message.toLowerCase().includes('already exists'))
    return 'An account with this email already exists. Please log in instead.';
  if (message.toLowerCase().includes('invalid email or password'))
    return 'Incorrect email or password. Please try again.';
  return message || 'Something went wrong. Please try again.';
}

const CreateAccountFooter: React.FC<Props> = ({
  activeTab, signupData, loginData, healthData,
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ── UI state ───────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ── Modal state ────────────────────────────────────────────────
  const [pendingEmail, setPendingEmail] = useState('');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // ── Client-side validation ─────────────────────────────────────
  const validateBeforeSubmit = (): string => {
    if (activeTab === 'signup') {
      if (!signupData.fullName.trim()) return 'Please enter your full name';
      if (signupData.fullName.trim().length < 2) return 'Name must be at least 2 characters';
      if (!signupData.email) return 'Please enter your email address';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email))
        return 'Please enter a valid email address';
      if (!signupData.password) return 'Please enter a password';
      if (signupData.password.length < 8) return 'Password must be at least 8 characters';
    } else {
      if (!loginData.email) return 'Please enter your email address';
      if (!loginData.password) return 'Please enter your password';
    }
    return '';
  };

  // ── Main submit ────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError('');
    setSuccessMsg('');

    const validationError = validateBeforeSubmit();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {

      // ── SIGN UP ──────────────────────────────────────────────
      // ── SIGN UP ──────────────────────────────────────────────
      if (activeTab === 'signup') {
        try {
          const result = await authApi.register({
            email: signupData.email.trim().toLowerCase(),
            password: signupData.password,
            fullName: signupData.fullName.trim(),
            phone: signupData.phone
              ? `+974${signupData.phone.replace(/\D/g, '')}`
              : undefined,
            healthProfile: {
              age: healthData.age,
              gender: healthData.gender,
              backPain: healthData.conditions.backPain,
              jointPain: healthData.conditions.jointPain,
              sportsInjury: healthData.conditions.sportsInjury,
              neckIssues: healthData.conditions.neckIssues,
              activityLevel: healthData.activityLevel,
            },
          });

          // Check if this is a pending verification response
          // Using type assertion because TypeScript doesn't know about 'pending'
          const pending = (result as any).pending;
          const email = (result as any).email;

          if (pending) {
            setPendingEmail(email || signupData.email);
            setShowVerifyModal(true);
            return;
          }

          // Normal flow
          if (result.accessToken) {
            login(result.accessToken, result.user);
            sessionStorage.setItem('justRegistered', 'true');
            navigate('/dashboard');
          }
        } catch (err: any) {
          // Check if error contains EMAIL_NOT_VERIFIED or similar
          try {
            const parsed = JSON.parse(err.message);
            if (parsed?.code === 'EMAIL_NOT_VERIFIED') {
              setPendingEmail(parsed.email || signupData.email);
              setShowVerifyModal(true);
              return;
            }
          } catch {
            // Not JSON - handle normally
          }
          setError(parseServerError(err.message));
          return; // Don't proceed to setLoading(false) yet? Actually handle properly
        }
      } else {
        try {
          const result = await authApi.login({
            email: loginData.email.trim().toLowerCase(),
            password: loginData.password,
          });

          login(result.accessToken, result.user);

          if (result.user.role === 'DOCTOR') {
            navigate('/provider-dashboard');
          } else if (result.user.role === 'ADMIN') {
            navigate('/admin-dashboard');
          } else {
            navigate('/dashboard');
          }

        } catch (err: any) {
          // ── Handle EMAIL_NOT_VERIFIED from login ──────────────
          // Server throws a 401 with JSON body: { code: 'EMAIL_NOT_VERIFIED', email }
          try {
            const parsed = JSON.parse(err.message);
            if (parsed?.code === 'EMAIL_NOT_VERIFIED') {
              setPendingEmail(parsed.email || loginData.email);
              setShowVerifyModal(true);
              return;
            }
          } catch {
            // Not JSON — fall through to normal error handling
          }
          throw err; // re-throw so outer catch handles it
        }
      }

    } catch (err: any) {
      setError(parseServerError(err.message));
    } finally {
      setLoading(false);
    }
  };

  // ── Called when verification modal confirms success ────────────
  const handleVerified = () => {
    setShowVerifyModal(false);
    setPendingEmail('');
    // Switch to login tab so user can log in with their new credentials
    window.dispatchEvent(new CustomEvent('auth:switch-tab', { detail: 'login' }));
    setSuccessMsg('Email verified! Please log in to continue.');
  };

  return (
    <>
      {/* ── Email Verification Modal ─────────────────────────── */}
      {showVerifyModal && (
        <EmailVerificationModal
          email={pendingEmail}
          onVerified={handleVerified}
          onClose={() => setShowVerifyModal(false)}
        />
      )}

      {/* ── Forgot Password Modal ────────────────────────────── */}
      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}

      {/* ── Footer bar ──────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl z-40">
        <div className="mx-auto px-4 py-5 space-y-4">

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <span className="text-red-500 text-xl mt-0.5 flex-shrink-0">⚠</span>
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          )}

          {/* Success */}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
              <span className="text-green-500 text-xl mt-0.5 flex-shrink-0">✓</span>
              <p className="text-green-600 text-lg">{successMsg}</p>
            </div>
          )}

          {/* Main CTA button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-semibold text-xl shadow-lg active:scale-[0.97] transition-transform disabled:opacity-60 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {activeTab === 'signup' ? 'Creating account...' : 'Signing in...'}
              </>
            ) : (
              activeTab === 'signup' ? 'Create Account' : 'Log In'
            )}
          </button>

          {/* Forgot password — shown only on login tab */}
          {activeTab === 'login' && (
            <button
              onClick={() => { setError(''); setShowForgotModal(true); }}
              className="w-full text-center text-blue-500 text-lg font-medium hover:underline py-1"
            >
              Forgot Password?
            </button>
          )}

          {/* Guest */}
          <button
            onClick={() => navigate('/patient-home')}
            className="w-full h-14 rounded-2xl bg-gray-100 text-gray-600 border border-gray-200 font-medium text-xl hover:bg-gray-200 transition"
          >
            Continue as Guest
          </button>

          {/* Switch tab */}
          <p className="text-center text-lg text-gray-500 pb-1">
            {activeTab === 'signup' ? (
              <>Already have an account?{' '}
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('auth:switch-tab', { detail: 'login' }))}
                  className="text-blue-500 font-medium hover:underline"
                >
                  Log In
                </button>
              </>
            ) : (
              <>Don't have an account?{' '}
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('auth:switch-tab', { detail: 'signup' }))}
                  className="text-blue-500 font-medium hover:underline"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>

        </div>
      </div>
    </>
  );
};

export default CreateAccountFooter;