import React from 'react';
import { Shield, Heart, Cross, Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Cross className="h-8 w-8 text-primary-foreground opacity-70" />
          </div>
          
          <div className="text-center">
            <h3 className="font-merriweather text-2xl mb-4">Safe Space  </h3>
            {/* <p className="opacity-90 mb-8">
              A ministry of Grace Community Church. All conversations are confidential and protected.
            </p> */}
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>Licensed Professionals</span>
              </div>
              <div className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                <span>100+ lives supported since 2023</span>
              </div>
            </div>
            
            <div className="border-t border-primary-foreground border-opacity-20 pt-6 mt-6">
              <p className="text-sm opacity-70">
                &copy; {new Date().getFullYear()} Safe Space Sanctuary. All rights reserved.
              </p>
              <div className="flex justify-center mt-4 space-x-4">
                <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">
                  Privacy Policy
                </a>
                <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">
                  Terms of Service
                </a>
                <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;