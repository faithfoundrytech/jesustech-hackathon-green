import React from 'react';
import { Heart, Lock, Handshake } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Heart className="h-12 w-12 text-primary" />,
      title: "Share Your Needs",
      description: "Complete a brief, confidential survey to help us understand how to best support you."
    },
    {
      icon: <Lock className="h-12 w-12 text-primary" />,
      title: "Get Matched",
      description: "We'll connect you with a licensed counselor from our faith community within 24 hours."
    },
    {
      icon: <Handshake className="h-12 w-12 text-primary" />,
      title: "Begin Your Journey",
      description: "Start your first session in a safe, judgment-free space."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white" id="how-it-works">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-merriweather font-bold text-center mb-16 text-foreground">
          3 Simple Steps to Support
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-accent/20 p-8 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-merriweather font-bold mb-3 text-foreground">
                {step.title}
              </h3>
              <p className="text-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;