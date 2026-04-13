import React from 'react';
import WelcomeGetStarted from '../components/WelcomeGetStarted';
import QuickHealthAndVerification from '../components/QuickHealthAndVerification';
import SecurityAndLanguage from '../components/SecurityAndLanguage';
import SupportHelpSection from '../components/SupportHelpSection';
import TrustedReviews from '../components/TrustedReviews';
import CreateAccountFooter from '../components/CreateAccountFooter';

class WelcomeToPhysioAI extends React.Component {
  state = {
    activeTab: 'signup' as 'signup' | 'login',

    // signup form data
    signupData: {
      fullName: '',
      phone: '',
      email: '',
      password: '',
    },

    // login form data
    loginData: {
      email: '',
      password: '',
    },

    // health profile data
    healthData: {
      age: '',
      gender: '',
      conditions: {
        backPain: false,
        jointPain: false,
        sportsInjury: false,
        neckIssues: false,
      },
      activityLevel: 'Moderate',
    },
  };

  setActiveTab = (tab: 'signup' | 'login') => {
    this.setState({ activeTab: tab });
  };

  setSignupData = (data: any) => {
    this.setState({ signupData: data });
  };

  setLoginData = (data: any) => {
    this.setState({ loginData: data });
  };

  setHealthData = (data: any) => {
    this.setState({ healthData: data });
  };

  render() {
    return (
      <div>
        <div className="pb-64">
          <WelcomeGetStarted
            activeTab={this.state.activeTab}
            setActiveTab={this.setActiveTab}
            onSignupDataChange={this.setSignupData}
            onLoginDataChange={this.setLoginData}
          />
          <QuickHealthAndVerification
            onHealthDataChange={this.setHealthData}
          />
          <SecurityAndLanguage />
          <SupportHelpSection />
          <TrustedReviews />
        </div>
        <CreateAccountFooter
          activeTab={this.state.activeTab}
          signupData={this.state.signupData}
          loginData={this.state.loginData}
          healthData={this.state.healthData}
        />
      </div>
    );
  }
}

export default WelcomeToPhysioAI;