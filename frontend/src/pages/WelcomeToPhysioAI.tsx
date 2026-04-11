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
  state = {
    activeTab: 'signup' as 'signup' | 'login',
  };

  setActiveTab = (tab: 'signup' | 'login') => {
    this.setState({ activeTab: tab });
  };
    render() {
      return (
        <div>
            <div className="pb-64">
            <WelcomeGetStarted
            activeTab={this.state.activeTab}
            setActiveTab={this.setActiveTab}
          />
            <QuickHealthAndVerification />
            <SecurityAndLanguage />
            <SupportHelpSection />
            <TrustedReviews />
            </div>
            <CreateAccountFooter activeTab={this.state.activeTab} />
        </div>  
    );
  }
}

export default WelcomeToPhysioAI;