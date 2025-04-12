"use client"

import React from 'react';
import { ArrowRight, Heart, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Hero = () => {
  return (
    <section className="w-full min-h-screen relative overflow-hidden gradient-background flex items-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3')] bg-cover bg-center opacity-5"></div>
      
      <div className="container mx-auto px-4 py-16 animate-fade-in">
        <Card className="max-w-3xl mx-auto text-center border-0 bg-transparent shadow-none">
          <CardContent className="pt-6">
            <div className="mb-4 flex justify-center">
              <Heart className="text-primary h-12 w-12" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-merriweather font-bold mb-6 text-primary">
              Find Healing in a Safe, Confidential Space
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-foreground">
              Share your story, and we&apos;ll match you with a licensed counselor from our faith-based community. Begin your journey toward peace today.
            </p>

            <div className="flex justify-center mb-8">
              <Button 
                // variant="outline"
                // className="group relative border-primary text-primary hover:bg-primary hover:text-primary-foreground"
               className='bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
                size="lg"
                onClick={() => document.getElementById('counselor-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span>Talk to a Counselor Now</span>
                <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">
                  <ArrowRight className="h-4 w-4 inline" />
                </span>
                <span className="block text-xs mt-1 opacity-70">Availability may vary</span>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-primary opacity-80">
              <Lock className="h-4 w-4" />
              <span className="text-sm">All information is kept private, secure, and encrypted.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Hero;