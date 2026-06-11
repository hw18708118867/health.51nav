import type { CalculatorConfig } from "../types/calculator";

export const getFaqSchema = (title: string, faqs: CalculatorConfig["faqs"]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: title,
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
});

export const getCalculatorSchema = (calculator: CalculatorConfig, canonicalUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: calculator.title,
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  description: calculator.description,
  url: canonicalUrl
});
