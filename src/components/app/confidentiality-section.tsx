import React from 'react';
import { Lock, Shield, Check } from 'lucide-react';

const ConfidentialitySection = () => {
  const assurances = [
    "End-to-end encrypted conversations.",
    "Licensed counselors adhere to strict ethical guidelines.",
    "No data shared with third parties."
  ];

  return (
    <section className="py-16 md:py-24 bg-accent/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-4 mb-6">
            <Lock className="h-8 w-8 text-primary" />
            <Shield className="h-8 w-8 text-primary" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-merriweather font-bold mb-8 text-foreground">
            Your Privacy is Sacred
          </h2>
          
          <div className="space-y-4">
            {assurances.map((assurance, index) => (
              <div 
                key={index}
                className="flex items-center bg-white p-4 rounded-lg shadow-sm"
              >
                <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <p className="text-left text-lg text-foreground">{assurance}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-10 py-6 px-8 bg-primary/10 rounded-lg inline-block shadow-sm hover:shadow-md transition-shadow border border-primary/20">
            <p className="text-primary font-merriweather text-lg italic">
              "In this sacred space, your story is honored and protected."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfidentialitySection;