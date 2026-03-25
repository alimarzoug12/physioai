import React from 'react';
import WelcomeGetStarted from '../components/WelcomeGetStarted';
import SignUpForm from '../components/SignUpForm';
import QuickHealthAndVerification from '../components/QuickHealthAndVerification';
import SecurityAndLanguage from '../components/SecurityAndLanguage';
import SupportHelpSection from '../components/SupportHelpSection';
import TrustedReviews from '../components/TrustedReviews';
import CreateAccountFooter from '../components/CreateAccountFooter';
//page 2 src/pages/WelcomeToPhysioAI.tsx
class WelcomeToPhysioAI extends React.Component {
    render() {
      return (
        <div>
            <div className="pb-64">
            <WelcomeGetStarted />
            <SignUpForm />
            <QuickHealthAndVerification />
            <SecurityAndLanguage />
            <SupportHelpSection />
            <TrustedReviews />
            </div>
            <CreateAccountFooter />
        </div>  
    );
  }
}

export default WelcomeToPhysioAI;