"use client"

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FaqSection = () => {
  const faqs = [
    {
      question: "Is this service free?",
      answer: "Yes, our counselors volunteer their time as part of our ministry to serve the community."
    },
    {
      question: "What if I need urgent help?",
      answer: "If you're in crisis, please call our emergency hotline at (555) 123-4567 immediately, or 911 if it's a life-threatening emergency."
    },
    {
      question: "How are counselors vetted?",
      answer: "All counselors are licensed professionals and aligned with our faith community's values. They undergo a thorough background check and interview process."
    },
    {
      question: "How long do sessions typically last?",
      answer: "Most counseling sessions are scheduled for 50 minutes, though initial consultations may be shorter."
    },
    {
      question: "Can I request a different counselor if needed?",
      answer: "Yes, we understand the importance of a good fit. If you feel you'd benefit from working with a different counselor, please let us know."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white" id="faq">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-merriweather font-bold text-center mb-12 text-foreground">
          Frequently Asked Questions
        </h2>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-primary border-opacity-20">
                <AccordionTrigger className="text-lg font-merriweather text-foreground hover:no-underline hover:text-primary py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground py-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;