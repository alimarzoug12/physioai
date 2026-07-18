import React from 'react';
import { BsTwitterX } from 'react-icons/bs';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

// IconWrapper component to handle icon type issues (if needed)
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

class Footer extends React.Component {
  render() {
    return (
      <footer className="w-full bg-gray-50 border-t border-gray-200 py-8 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center text-gray-400 text-sm">
          {/* Liens principaux */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-6">
            <a 
              href="/privacy-policy" 
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms-of-service" 
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a 
              href="/support" 
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Support
            </a>
          </div>

          {/* Mention copyright */}
          <p className="mb-4 leading-relaxed">
            © 2026 Physio AI. Licensed healthcare platform for Qatar & GCC
          </p>

          {/* Icônes réseaux sociaux */}
          <div className="flex justify-center gap-8 md:gap-10">
            {/* Twitter / X */}
            <a 
              href="https://x.com/physioai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-black transition-colors duration-200"
              aria-label="X (Twitter)"
            >
              <IconWrapper icon={BsTwitterX} className="w-4 h-6" />
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com/physioai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-pink-600 transition-colors duration-200"
              aria-label="Instagram"
            >
              <IconWrapper icon={FaInstagram} className="w-4 h-6" />
            </a>

            {/* LinkedIn */}
            <a 
              href="https://linkedin.com/company/physioai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-blue-700 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <IconWrapper icon={FaLinkedin} className="w-4 h-6" />
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;