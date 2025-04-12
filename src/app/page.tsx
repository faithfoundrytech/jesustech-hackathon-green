"use client"

import React from 'react';
import Hero from '@/components/app/hero';
import HowItWorks from '@/components/app/how-it-works';
import ConfidentialitySection from '@/components/app/confidentiality-section';
import MatchingForm from '@/components/app/matching-form';
import FaqSection from '@/components/app/faq-section';
import Footer from '@/components/app/footer';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Matching Section with Form */}
      <section className="py-16 md:py-24 bg-accent/20" id="counselor-form">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-merriweather font-bold mb-6 text-foreground">
              Begin Your Healing Journey
            </h2>
            <p className="text-xl text-foreground">
              We're here to listen and support you through life's challenges.
            </p>
          </div>
          
          <MatchingForm />
        </div>
      </section>
      
      {/* Confidentiality Section */}
      <ConfidentialitySection />
      
      {/* Testimonial Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <blockquote className="text-center">
                  <div className="relative text-2xl md:text-3xl text-foreground italic font-merriweather mb-8 px-8">
                    <span className="absolute top-0 left-0 text-5xl text-primary opacity-30">"</span>
                    Finding support through Safe Space Sanctuary gave me hope during my darkest time. My counselor listened without judgment and helped me find strength I didn't know I had.
                    <span className="absolute bottom-0 right-0 text-5xl text-primary opacity-30">"</span>
                  </div>
                  <footer className="text-foreground">
                    <p className="font-semibold">- Anonymous</p>
                    <Badge variant="outline" className="mt-1 font-normal">Community Member</Badge>
                  </footer>
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <FaqSection />
      
      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center border-0 bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-merriweather font-bold text-foreground">
                Ready to Take the First Step?
              </CardTitle>
              <CardDescription className="text-xl text-foreground">
                Your journey toward healing begins with a simple connection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={() => document.getElementById('matching-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                  size="lg"
                >
                  <span>Get Matched Today</span>
                  <Lock className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="flex justify-center items-center gap-2 text-foreground">
                <Lock className="h-4 w-4" />
                <span className="text-sm">100% confidential and secure</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
