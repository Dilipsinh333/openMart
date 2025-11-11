import { DollarSign, ShieldCheck, Recycle, Package, Truck } from "lucide-react";

export const processSteps = [
  {
    title: "1. List Your Items",
    description:
      "Create an account and list your gently used children's clothing, toys, books, and gear...",
    icon: Package,
  },
  {
    title: "2. Ship or Drop Off",
    description:
      "Once your listing is approved, you can either ship your items to us...",
    icon: Truck,
    reverse: true,
  },
  {
    title: "3. Quality Check & Refurbishment",
    description:
      "Our expert team carefully inspects each item, cleans, repairs if needed...",
    icon: ShieldCheck,
  },
  {
    title: "4. Get Paid",
    description:
      "You'll receive payment based on condition and market value...",
    icon: DollarSign,
    reverse: true,
  },
  {
    title: "5. Shop Quality Items",
    description:
      "Browse our selection of high-quality, affordable refurbished items...",
    icon: Recycle,
  },
];

export const qualityCards = [
  {
    title: "Thorough Inspection",
    description: "Every item undergoes a detailed multi-point inspection...",
    icon: ShieldCheck,
  },
  {
    title: "Professional Cleaning",
    description:
      "All items are professionally cleaned using eco-friendly products...",
    icon: ShieldCheck,
  },
  {
    title: "Expert Repairs",
    description: "Our skilled team restores items to excellent condition...",
    icon: ShieldCheck,
  },
  {
    title: "Safety Verification",
    description: "We verify all items meet current safety standards...",
    icon: ShieldCheck,
  },
  {
    title: "Accurate Descriptions",
    description: "We provide honest descriptions of every item's condition...",
    icon: ShieldCheck,
  },
  {
    title: "Satisfaction Guarantee",
    description: "30-day return policy for full refund or exchange...",
    icon: ShieldCheck,
  },
];

export const faqs = [
  {
    question: "What items do you accept?",
    answer:
      "We accept gently used children's clothing (sizes 0-14), toys, books, shoes, accessories, and baby gear...",
  },
  {
    question: "How much will I get paid for my items?",
    answer:
      "Payment depends on brand, condition, age, and demand. Generally, 30–50% of resale value...",
  },
  {
    question: "How long does the process take?",
    answer:
      "Inspection typically takes 7–10 business days. Payment follows in 2–3 days...",
  },
  {
    question: "What happens if my items don't meet your standards?",
    answer:
      "We recycle them or offer to return (fees may apply). You'll be notified beforehand.",
  },
  {
    question: "Do you offer free shipping?",
    answer:
      "Yes. We offer prepaid labels for sellers and free shipping over ₹35 for buyers.",
  },
  {
    question: "What is your return policy?",
    answer:
      "30-day return policy. Items must be in original condition for refund or exchange.",
  },
];
