import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface Props {
  activeTab: 'signup' | 'login';
  signupData: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
  };
  loginData: {
    email: string;
    password: string;
  };
  healthData: {
    age: string;
    gender: string;
    conditions: {
      backPain: boolean;
      jointPain: boolean;
      sportsInjury: boolean;
      neckIssues: boolean;
    };
    activityLevel: string;
  };
}

const CreateAccountFooter = ({ activeTab, signupData, loginData, healthData }: Props) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      let result;

      if (activeTab === 'signup') {
        // validate
        if (!signupData.email || !signupData.password || !signupData.fullName) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        result = await api.register({
          email: signupData.email,
          password: signupData.password,
          fullName: signupData.fullName,
          phone: signupData.phone ? `+974${signupData.phone}` : undefined,
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

      } else {
        // login
        if (!loginData.email || !loginData.password) {
          setError('Please enter your email and password');
          setLoading(false);
          return;
        }

        result = await api.login({
          email: loginData.email,
          password: loginData.password,
        });
      }

      // save token and user
      login(result.token, result.user);

      // go to dashboard
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50">
      <div className="mx-auto px-4 py-6 space-y-4">

        {/* error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-500 text-center text-lg">{error}</p>
          </div>
        )}

        {/* Main button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-300 text-white font-semibold text-xl shadow-lg active:scale-[0.97] transition-transform disabled:opacity-70"
        >
          {loading
            ? 'Please wait...'
            : activeTab === 'signup' ? 'Create Account' : 'Log In'
          }
        </button>

        {/* Continue as Guest */}
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full h-16 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 font-medium text-xl transition-colors"
        >
          Continue as Guest
        </button>

        {/* Log In Link */}
        <div className="text-center pt-2">
          <p className="font-normal text-lg text-gray-500">
            Already have an account?{' '}
            <span className="text-blue-600 font-normal hover:underline cursor-pointer">
              Log In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountFooter;