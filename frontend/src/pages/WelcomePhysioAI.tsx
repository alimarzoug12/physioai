import React from 'react';
import Onboarding from '../components/Onboarding';
import WhyChoosePhysio from '../components/WhyChoosePhysio';
import LanguageSelector from '../components/LanguageSelector';
import UserReviews from '../components/UserReviews';
import PrivacyMatters from '../components/PrivacyMatters';
import GetStartedScreen from '../components/GetStartedScreen';
import QuickSignUp from '../components/QuickSignUp';
import Footer from './Footer';

//page 1 src/pages/WelcomePhysioAI.tsx
class WelcomePhysioAI extends React.Component {
    render() {
      return (
        <div>
            <Onboarding />
            <WhyChoosePhysio />
            <LanguageSelector />
            <UserReviews />
            <PrivacyMatters />
            <GetStartedScreen />
            <QuickSignUp />
            <Footer />
        </div>
    );
  }
}

export default WelcomePhysioAI;