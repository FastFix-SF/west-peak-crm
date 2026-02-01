
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from './ui/accordion';
import { companyConfig } from '@/config/company';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How long does a metal roof installation take?",
    answer: "Most residential metal roof installations take 3-7 days, depending on the size and complexity of your roof. Weather conditions and material availability can also affect the timeline. We provide a detailed schedule during your consultation."
  },
  {
    question: "What is the lifespan of a metal roof?",
    answer: `Premium metal roofs typically last 40-70 years with proper maintenance, significantly longer than traditional asphalt shingles (15-20 years). Our systems come with ${companyConfig.warranty.years}-year warranties and are designed to withstand Bay Area weather conditions.`
  },
  {
    question: "Is metal roofing noisy during rain or hail?",
    answer: "Modern metal roofing systems with proper insulation and underlayment are actually quieter than you might expect. The sound level is comparable to other roofing materials when installed correctly with adequate attic insulation."
  },
  {
    question: "How much does a metal roof cost compared to traditional roofing?",
    answer: "While metal roofing has a higher upfront cost, it offers superior value over time due to its longevity, energy efficiency, and low maintenance requirements. We provide detailed cost comparisons and financing options during consultation."
  },
  {
    question: "Can metal roofing be installed over existing shingles?",
    answer: "In many cases, yes. Metal roofing can often be installed over one layer of existing shingles, which can save on removal costs. However, this depends on the condition of your existing roof and local building codes."
  },
  {
    question: "Do you offer warranties and what do they cover?",
    answer: `Yes, we provide comprehensive ${companyConfig.warranty.years}-year warranties covering materials and workmanship. This includes protection against leaks, material defects, and installation issues. Extended warranties are also available for premium systems.`
  },
  {
    question: "What metal roofing materials do you offer?",
    answer: "We offer a complete range including Standing Seam, R-Panel, Multi-V, and Corrugated systems in various gauges (24, 26, 29). Materials include steel, aluminum, and specialty alloys with multiple color options and finishes."
  },
  {
    question: "How energy efficient are metal roofs?",
    answer: "Metal roofs can reduce cooling costs by 10-25% through superior heat reflection and ventilation. Many of our systems qualify for Energy Star ratings and may be eligible for tax credits and utility rebates."
  },
  {
    question: "Do you provide emergency roof repair services?",
    answer: `Yes, we offer ${companyConfig.hours.emergency.toLowerCase()} throughout the Bay Area. Our rapid response team can provide temporary protection and permanent repairs for storm damage, leaks, and other urgent roofing issues.`
  },
  {
    question: "What areas do you serve?",
    answer: `We proudly serve ${companyConfig.serviceAreas.length}+ locations across the ${companyConfig.address.region} including ${companyConfig.serviceAreas.slice(0, 5).join(', ')}, and surrounding communities. Contact us to confirm service in your specific area.`
  }
];

const FAQSection = () => {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about metal roofing, installation, and our services.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 py-2 hover:shadow-sm transition-shadow"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                <span className="font-medium text-foreground pr-4">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`tel:${companyConfig.phoneRaw}`}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Call {companyConfig.phone}
            </a>
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
