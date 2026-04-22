// import React, { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { authApi } from '../services/auth';
// import { useAuth } from '../context/AuthContext';

// const VerifyEmail: React.FC = () => {
//   const [searchParams]  = useSearchParams();
//   const navigate        = useNavigate();
//   const { user }        = useAuth();

//   const [status,  setStatus]  = useState<'verifying' | 'success' | 'error'>('verifying');
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const token = searchParams.get('token');
//     if (!token) {
//       setStatus('error');
//       setMessage('Invalid verification link. Please request a new one.');
//       return;
//     }

//     authApi.verifyEmail(token)
//       .then(result => {
//         setStatus('success');
//         setMessage(result.message);
//         // Redirect after 3 seconds
//         setTimeout(() => navigate(user ? '/patient-home' : '/'), 3000);
//       })
//       .catch(err => {
//         setStatus('error');
//         setMessage(err.message || 'Verification failed. The link may have expired.');
//       });
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
//       <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
//         {status === 'verifying' && (
//           <>
//             <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
//             <h2 className="text-2xl font-bold text-gray-800">Verifying your email...</h2>
//           </>
//         )}
//         {status === 'success' && (
//           <>
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <span className="text-green-500 text-4xl">✓</span>
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-3">Email Verified!</h2>
//             <p className="text-gray-500 text-xl mb-6">{message}</p>
//             <p className="text-gray-400 text-lg">Redirecting you automatically...</p>
//           </>
//         )}
//         {status === 'error' && (
//           <>
//             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <span className="text-red-500 text-4xl">✕</span>
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-3">Verification Failed</h2>
//             <p className="text-gray-500 text-xl mb-6">{message}</p>
//             <button
//               onClick={() => navigate('/')}
//               className="w-full h-14 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-2xl font-semibold text-xl"
//             >
//               Go to Login
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This page is no longer used — verification is done via modal with 6-digit code
const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate('/'); }, []);
  return null;
};

export default VerifyEmail;