// src/components/QuickSignUp.tsx
import React from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaApple, FaPhone } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { TbMailFilled } from "react-icons/tb";

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

// ── OAuth buttons — functional component (hooks work here) ──
interface OAuthButtonsProps {
  onError: (msg: string) => void;
  onLoading: (loading: boolean) => void;
}

function OAuthButtons({ onError, onLoading }: OAuthButtonsProps) {
  const { login } = useAuth();
  const navigate  = useNavigate();

  // ── Google ──────────────────────────────────────────────
  const handleGoogle = () => {
    if (!(window as any).google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => initGoogle();
      document.body.appendChild(script);
    } else {
      initGoogle();
    }
  };

  const initGoogle = () => {
    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
      scope: 'email profile',
      callback: async (tokenResponse: any) => {
        if (tokenResponse.error) {
          onError('Google login failed');
          return;
        }
        try {
          onLoading(true);
          const result = await api.googleAuth(tokenResponse.access_token);
          login(result.token, result.user);
          navigate('/dashboard');
        } catch (err: any) {
          onError(err.message || 'Google login failed');
        } finally {
          onLoading(false);
        }
      },
    });
    client.requestAccessToken();
  };

  // ── Apple ────────────────────────────────────────────────
  const handleApple = () => {
    if (!(window as any).AppleID) {
      const script = document.createElement('script');
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      script.onload = () => triggerAppleLogin();
      document.body.appendChild(script);
    } else {
      triggerAppleLogin();
    }
  };

  const triggerAppleLogin = async () => {
    try {
      (window as any).AppleID.auth.init({
        clientId:    process.env.REACT_APP_APPLE_CLIENT_ID || '',
        scope:       'name email',
        redirectURI: window.location.origin,
        usePopup:    true,
      });
      const response      = await (window as any).AppleID.auth.signIn();
      const identityToken = response.authorization.id_token;
      const fullName      = response.user
        ? `${response.user.name?.firstName || ''} ${response.user.name?.lastName || ''}`.trim()
        : undefined;
      onLoading(true);
      const result = await api.appleAuth(identityToken, fullName);
      login(result.token, result.user);
      navigate('/dashboard');
    } catch (err: any) {
      if (err?.error !== 'popup_closed_by_user') {
        onError(err.message || 'Apple login failed');
      }
    } finally {
      onLoading(false);
    }
  };

  return (
    <>
      {/* Google */}
      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-4 px-6 text-gray-800 font-medium hover:bg-gray-50 transition"
      >
        <IconWrapper icon={FcGoogle} className="text-2xl" />
        Continue with Google
      </button>

      {/* Apple */}
      <button
        onClick={handleApple}
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-4 px-6 text-gray-800 font-medium hover:bg-gray-50 transition"
      >
        <IconWrapper icon={FaApple} className="text-black text-2xl" />
        Continue with Apple
      </button>
    </>
  );
}

// ── Main class component ─────────────────────────────────────────
interface QuickSignUpState {
  oauthError: string;
  oauthLoading: boolean;
}

class QuickSignUp extends React.Component<{}, QuickSignUpState> {
  state: QuickSignUpState = {
    oauthError: '',
    oauthLoading: false,
  };

  render() {
    const { oauthError, oauthLoading } = this.state;

    return (
      <div className="bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full flex flex-col items-center text-center">

          <h1 className="text-3xl md:text-2xl font-semibold text-gray-900 mb-3">
            Quick Sign Up Options
          </h1>
          <p className="text-gray-600 text-lg mb-10">
            Choose your preferred method to get started
          </p>

          {/* error message */}
          {oauthError && (
            <div className="w-full bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-red-500 text-center text-lg">{oauthError}</p>
            </div>
          )}

          {/* loading message */}
          {oauthLoading && (
            <div className="text-center text-blue-500 text-lg mb-4">
              Signing in...
            </div>
          )}

          <div className="w-full space-y-4">

            {/* ── OAuth buttons (Google + Apple) ── */}
            <OAuthButtons
              onError={(msg) => this.setState({ oauthError: msg, oauthLoading: false })}
              onLoading={(loading) => this.setState({ oauthLoading: loading, oauthError: '' })}
            />

            {/* Phone */}
            <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-4 px-6 text-gray-800 font-medium hover:bg-gray-50 transition">
              <IconWrapper icon={FaPhone} className="text-green-500 text-2xl" />
              Continue with Phone
            </button>

            {/* Separator */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Email */}
            <button className="w-full bg-gradient-to-br from-blue-600 to-blue-100 text-white font-bold py-5 px-8 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition flex items-center justify-center gap-3 text-lg">
              <IconWrapper icon={TbMailFilled} className="text-xl" />
              Sign up with Email
            </button>
          </div>

          <p className="mt-8 text-gray-600">
            Already have an account?{' '}
            <a href="/welcome" className="text-blue-400 font-medium hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default QuickSignUp;