import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../services/auth';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa6';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => (
  <Icon className={className} />
);

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const token          = searchParams.get('token') || '';

  const [password,     setPassword]     = useState('');
  const [confirm,      setConfirm]      = useState('');
  const [showPass,     setShowPass]     = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new one from the login page.');
    }
  }, [token]);

  const validate = (): string => {
    if (!password)           return 'Please enter a new password';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password !== confirm) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      const result = await authApi.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('expired')) {
        setError('This reset link has expired. Please request a new one from the login page.');
      } else if (err.message?.toLowerCase().includes('already been used')) {
        setError('This reset link has already been used. Please request a new one.');
      } else {
        setError(err.message || 'Reset failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-green-500 text-4xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Password Reset!</h2>
          <p className="text-gray-500 text-xl mb-2">
            Your password has been changed successfully.
          </p>
          <p className="text-gray-400 text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <IconWrapper icon={FaLock} className="text-blue-500 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Set New Password</h2>
        <p className="text-gray-500 text-xl text-center mb-8">
          Choose a strong password for your account.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-red-600 text-lg text-center">
            {error}
          </div>
        )}

        {/* New password */}
        <div className="flex items-center border border-gray-200 rounded-2xl px-4 py-4 mb-4 focus-within:border-blue-500">
          <IconWrapper icon={FaLock} className="text-gray-400 text-2xl mr-3" />
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="New password (min 8 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="flex-1 text-xl text-gray-800 outline-none"
          />
          <button onClick={() => setShowPass(v => !v)} className="text-gray-400 text-2xl ml-2">
            <IconWrapper icon={showPass ? FaEyeSlash : FaEye} />
          </button>
        </div>

        {/* Confirm password */}
        <div className="flex items-center border border-gray-200 rounded-2xl px-4 py-4 mb-6 focus-within:border-blue-500">
          <IconWrapper icon={FaLock} className="text-gray-400 text-2xl mr-3" />
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="Confirm new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="flex-1 text-xl text-gray-800 outline-none"
          />
        </div>

        {/* Strength bar */}
        {password && (
          <div className="flex gap-1 mb-6">
            {[1,2,3,4].map(i => {
              const strength = getStrength(password);
              return (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${
                  i <= strength
                    ? ['','bg-red-400','bg-orange-400','bg-yellow-400','bg-green-500'][strength]
                    : 'bg-gray-200'
                }`} />
              );
            })}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !token}
          className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold text-xl disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Resetting...
            </>
          ) : 'Reset Password'}
        </button>

        <button
          onClick={() => navigate('/')}
          className="w-full h-14 mt-3 rounded-2xl bg-gray-100 text-gray-600 font-medium text-xl"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

function getStrength(password: string): number {
  let score = 0;
  if (password.length >= 8)          score++;
  if (/[A-Z]/.test(password))        score++;
  if (/[0-9]/.test(password))        score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default ResetPassword;