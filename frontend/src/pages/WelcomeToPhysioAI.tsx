import React from 'react';
import WelcomeGetStarted          from '../components/WelcomeGetStarted';
import QuickHealthAndVerification from '../components/QuickHealthAndVerification';
import SecurityAndLanguage        from '../components/SecurityAndLanguage';
import SupportHelpSection         from '../components/SupportHelpSection';
import TrustedReviews             from '../components/TrustedReviews';
import CreateAccountFooter        from '../components/CreateAccountFooter';

interface State {
  activeTab:  'signup' | 'login';
  signupData: { fullName: string; phone: string; email: string; password: string };
  loginData:  { email: string; password: string };
  healthData: {
    age: string; gender: string;
    conditions: { backPain: boolean; jointPain: boolean; sportsInjury: boolean; neckIssues: boolean };
    activityLevel: string;
  };
}

class WelcomeToPhysioAI extends React.Component<{}, State> {
  state: State = {
    activeTab: 'signup',
    signupData: { fullName: '', phone: '', email: '', password: '' },
    loginData:  { email: '', password: '' },
    healthData: {
      age: '', gender: '',
      conditions: { backPain: false, jointPain: false, sportsInjury: false, neckIssues: false },
      activityLevel: 'Moderate',
    },
  };

  componentDidMount() {
    // Listen for tab-switch events fired from CreateAccountFooter links
    window.addEventListener('auth:switch-tab', this.handleTabSwitch as EventListener);
  }

  componentWillUnmount() {
    window.removeEventListener('auth:switch-tab', this.handleTabSwitch as EventListener);
  }

  handleTabSwitch = (e: CustomEvent) => {
    this.setState({ activeTab: e.detail as 'signup' | 'login' });
    // Scroll to top so user sees the tab toggle
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  render() {
    const { activeTab, signupData, loginData, healthData } = this.state;

    return (
      <div>
        {/* Scrollable content — pb-64 leaves room for fixed footer */}
        <div className="pb-64">
          <WelcomeGetStarted
            activeTab={activeTab}
            setActiveTab={tab => this.setState({ activeTab: tab })}
            onSignupDataChange={data => this.setState({ signupData: data })}
            onLoginDataChange={data  => this.setState({ loginData:  data })}
          />

          {/* Health profile only shown on signup */}
          {activeTab === 'signup' && (
            <QuickHealthAndVerification
              onHealthDataChange={data => this.setState({ healthData: data })}
            />
          )}

          <SecurityAndLanguage />
          <SupportHelpSection />
          <TrustedReviews />
        </div>

        {/* Fixed footer — always visible */}
        <CreateAccountFooter
          activeTab={activeTab}
          signupData={signupData}
          loginData={loginData}
          healthData={healthData}
        />
      </div>
    );
  }
}

export default WelcomeToPhysioAI;