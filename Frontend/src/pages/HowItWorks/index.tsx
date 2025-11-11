// kidscycle/pages/HowItWorks.tsx
import React from "react";
import { Link } from "react-router-dom";
import { processSteps, qualityCards, faqs } from "../../data/howItWorksData";
import ProcessStep from "../../components/HowItWorks/ProcessStep";
import QualityCard from "../../components/HowItWorks/QualityCard";
import FAQItem from "../../components/HowItWorks/FAQItem";

const HowItWorks = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">How KidsCycle Works</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Our simple process makes it easy to give children's items a new life
            while helping families save money and reduce environmental impact.
          </p>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Our Process</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            From selling your items to shopping for quality refurbished products
          </p>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-200"></div>
          {processSteps.map((step, index) => (
            <ProcessStep key={index} {...step} />
          ))}
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Quality Standards
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We ensure every item meets our strict quality guidelines
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {qualityCards.map((item, index) => (
              <QualityCard key={index} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our process
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of families who are already making a difference by
            giving children's items a second life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/sell"
              className="bg-white text-emerald-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
            >
              Sell Your Items
            </Link>
            <Link
              to="/shop"
              className="bg-emerald-700 text-white px-6 py-3 rounded-md font-medium hover:bg-emerald-800 border border-white transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
