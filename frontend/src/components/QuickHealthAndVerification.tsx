// src/components/QuickHealthAndVerification.tsx
import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF, FaSms } from "react-icons/fa";
import { IoShieldHalfOutline } from "react-icons/io5";
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

// ── OAuth buttons need hooks, so wrap in a functional component ──
interface OAuthButtonsProps {
  onError: (msg: string) => void;
  onLoading: (loading: boolean) => void;
}

function OAuthButtons({ onError, onLoading }: OAuthButtonsProps) {
  const { login } = useAuth();
  const navigate  = useNavigate();

  // ── Google ────────────────────────────────────────────────────
  const handleGoogle = () => {
  console.log('handleGoogle clicked');
  console.log('window.google exists?', !!(window as any).google);

  if (!(window as any).google) {
    console.log('Loading Google script...');
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      console.log('Google script loaded');
      initGoogle();
    };
    script.onerror = () => {
      console.log('Google script FAILED to load');
    };
    document.body.appendChild(script);
  } else {
    console.log('Google already loaded, calling initGoogle');
    initGoogle();
  }
};

  const initGoogle = () => {
  console.log('initGoogle called');

  const client = (window as any).google.accounts.oauth2.initTokenClient({
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
    scope: 'email profile',
    callback: async (tokenResponse: any) => {
      console.log('Google token response:', tokenResponse);
      if (tokenResponse.error) {
        onError('Google login failed');
        return;
      }
      try {
        onLoading(true);
        // get user info with the access token
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();
        console.log('Google user info:', userInfo);

        // send access token to backend
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

  // this opens a real popup — works on localhost
  client.requestAccessToken();
};

  // ── Facebook ──────────────────────────────────────────────────
  const handleFacebook = () => {
    if (!(window as any).FB) {
      (window as any).fbAsyncInit = () => {
        (window as any).FB.init({
          appId:   process.env.REACT_APP_FACEBOOK_APP_ID || '',
          cookie:  true,
          xfbml:   false,
          version: 'v18.0',
        });
        triggerFacebookLogin();
      };
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      document.body.appendChild(script);
    } else {
      triggerFacebookLogin();
    }
  };

  const triggerFacebookLogin = () => {
    // ✅ plain function — NOT async
    (window as any).FB.login(
      function (response: any) {
        if (response.authResponse) {
          // async code inside a plain IIFE
          (async () => {
            try {
              onLoading(true);
              const result = await api.facebookAuth(response.authResponse.accessToken);
              login(result.token, result.user);
              navigate('/dashboard');
            } catch (err: any) {
              onError(err.message || 'Facebook login failed');
            } finally {
              onLoading(false);
            }
          })();
        } else {
          onError('Facebook login was cancelled');
        }
      },
      { scope: 'email,public_profile' }
    );
  };

  // ── Apple ─────────────────────────────────────────────────────
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
    <div className="space-y-4">
      <button
        onClick={handleGoogle}
        className="w-full h-20 flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-4 px-6 text-gray-800 font-medium hover:bg-gray-50 transition"
      >
        <span className="text-2xl font-bold"><IconWrapper icon={FcGoogle} /></span>
        <div className="text-gray-600 text-xl">Continue with Google</div>
      </button>

      <button
        onClick={handleApple}
        className="w-full h-20 flex items-center justify-center gap-3 bg-black text-white rounded-xl py-4 px-6 font-medium hover:bg-gray-900 transition"
      >
        <span className="text-2xl"><IconWrapper icon={FaApple} /></span>
        <div className="text-gray-100 text-xl">Continue with Apple</div>
      </button>

      <button
        onClick={handleFacebook}
        className="w-full h-20 flex items-center justify-center gap-3 bg-blue-600 text-white rounded-xl py-4 px-6 font-medium hover:bg-blue-700 transition"
      >
        <span className="text-2xl font-bold"><IconWrapper icon={FaFacebookF} /></span>
        <div className="text-gray-100 text-xl">Continue with Facebook</div>
      </button>
    </div>
  );
}

// ── Main class component ──────────────────────────────────────────
interface QuickHealthProps {
  onHealthDataChange?: (data: any) => void;
}

class QuickHealthAndVerification extends React.Component<QuickHealthProps> {
  state = {
    age: '',
    gender: '',
    conditions: {
      backPain: false,
      jointPain: false,
      sportsInjury: false,
      neckIssues: false,
    },
    activityLevel: 'Moderate',
    agreeTerms: false,
    agreeMarketing: false,
    oauthError: '',
    oauthLoading: false,
  };

  handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ age: e.target.value }, () => {
      this.props.onHealthDataChange?.(this.getHealthData());
    });
  };

  handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ gender: e.target.value }, () => {
      this.props.onHealthDataChange?.(this.getHealthData());
    });
  };

  handleConditionChange = (condition: keyof typeof this.state.conditions) => {
    this.setState((prev: any) => ({
      conditions: {
        ...prev.conditions,
        [condition]: !prev.conditions[condition],
      },
    }), () => {
      this.props.onHealthDataChange?.(this.getHealthData());
    });
  };

  handleActivityChange = (level: string) => {
    this.setState({ activityLevel: level }, () => {
      this.props.onHealthDataChange?.(this.getHealthData());
    });
  };

  getHealthData = () => ({
    age: this.state.age,
    gender: this.state.gender,
    conditions: this.state.conditions,
    activityLevel: this.state.activityLevel,
  });

  handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ agreeTerms: e.target.checked });
  };

  handleMarketingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ agreeMarketing: e.target.checked });
  };

  render() {
    const { age, gender, conditions, activityLevel, agreeTerms, agreeMarketing, oauthError, oauthLoading } = this.state;

    return (
      <div className="flex flex-col items-center">
        <div className="w-full bg-gray-50 rounded-2xl shadow-lg p-6">
          {/* Quick Health Profile */}
          <h1 className="text-xl font-bold text-gray-900 mb-5 text-left">
            Quick Health Profile (Optional)
          </h1>

          {/* Age & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block text-xl font-semibold text-gray-500 mb-2">Age</label>
              <select
                value={age}
                onChange={this.handleAgeChange}
                className="w-full h-15 px-4 py-3 text-xl text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select age</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46-55">46-55</option>
                <option value="56+">55+</option>
              </select>
            </div>
            <div>
              <label className="block text-xl font-semibold text-gray-500 mb-2">Gender</label>
              <select
                value={gender}
                onChange={this.handleGenderChange}
                className="w-full h-15 px-4 py-3 text-xl text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Conditions */}
          <div className="mb-10">
            <label className="block text-lg font-normal text-gray-600 mb-3">
              Any previous injuries or conditions?
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'backPain',     label: 'Back pain'     },
                { key: 'sportsInjury', label: 'Sports injury' },
                { key: 'jointPain',    label: 'Joint pain'    },
                { key: 'neckIssues',   label: 'Neck issues'   },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={conditions[key as keyof typeof conditions]}
                    onChange={() => this.handleConditionChange(key as keyof typeof conditions)}
                    className="h-5 w-5 text-blue-600 rounded border-gray-300"
                  />
                  <span className="text-gray-600 text-lg">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div className="mb-10">
            <label className="block text-xl font-semibold text-gray-600 mb-3">Activity Level</label>
            <div className="flex gap-3">
              {['Low', 'Moderate', 'High'].map(level => (
                <button
                  key={level}
                  onClick={() => this.handleActivityChange(level)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    activityLevel === level
                      ? 'bg-blue-100 text-blue-600 border border-blue-300 shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Consent checkboxes */}
          <div className="space-y-4 mb-12">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={this.handleTermsChange}
                className="h-6 w-6 mt-1 text-blue-600 rounded border-gray-300"
              />
              <span className="text-gray-700 text-xl">
                I agree to the{' '}
                <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>. I consent to receive health-related communications.
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={agreeMarketing}
                onChange={this.handleMarketingChange}
                className="h-6 w-6 mt-1 text-blue-600 rounded-lg border-gray-600"
              />
              <span className="text-gray-700 text-xl">
                I would like to receive updates about new features, health tips, and promotional offers via email/SMS.
              </span>
            </label>
          </div>

          {/* Or continue with */}
          <div className="flex items-center justify-center gap-4 my-8 p-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="text-center text-gray-500 text-xl font-semibold whitespace-nowrap">
              Or continue with
            </p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* OAuth error message */}
          {oauthError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-red-500 text-center text-lg">{oauthError}</p>
            </div>
          )}

          {/* OAuth loading */}
          {oauthLoading && (
            <div className="text-center text-blue-500 text-lg mb-4">Signing in...</div>
          )}

          {/* ONLY ADDITION: real OAuth buttons via OAuthButtons component */}
          <OAuthButtons
            onError={(msg) => this.setState({ oauthError: msg, oauthLoading: false })}
            onLoading={(loading) => this.setState({ oauthLoading: loading, oauthError: '' })}
          />

          {/* Secure Verification */}
          <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-100 p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 bg-gradient-to-r to-green-400 from-blue-500 text-white font-bold rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">
                  <IconWrapper icon={IoShieldHalfOutline} />
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Secure Verification
                <p className="font-normal text-lg text-gray-700 mb-4">
                  We'll send you a verification code
                </p>
              </h3>
            </div>
            <div className="bg-white h-16 rounded-xl px-5 border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <span className="text-blue-600 text-2xl">
                    <IconWrapper icon={FaSms} />
                  </span>
                </div>
                <h4 className="font-semibold text-xl text-gray-700">SMS Verification</h4>
              </div>
              <div className="flex items-center gap-2 text-ms text-green-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Instant
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QuickHealthAndVerification;