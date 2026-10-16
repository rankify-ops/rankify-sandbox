/**
 * PLACEHOLDER testimonials for layout only. They are NOT real customer reviews, and the site
 * labels every card "Placeholder testimonial". Replace with genuine, verifiable reviews (with the
 * customer's permission) before launch, then set `sample: false`. Never add review or
 * rating structured data for sample content.
 */
export type Testimonial = { quote: string; name: string; suburb: string; system: string; sample: boolean };

export const testimonials: Testimonial[] = [
  {
    quote: "The form took about a minute. An installer called the next day, explained the rebates and the price didn't change on the day.",
    name: "[Placeholder name]",
    suburb: "Geelong West VIC",
    system: "CO2 split system",
    sample: true,
  },
  {
    quote: "Our old electric tank died on a Sunday. We had a quote within a day and the new heat pump was in that week.",
    name: "[Placeholder name]",
    suburb: "Penrith NSW",
    system: "270 L all-in-one",
    sample: true,
  },
  {
    quote: "Clear pricing up front and the STCs came straight off the invoice. No chasing paperwork.",
    name: "[Placeholder name]",
    suburb: "Chermside QLD",
    system: "220 L all-in-one",
    sample: true,
  },
];
