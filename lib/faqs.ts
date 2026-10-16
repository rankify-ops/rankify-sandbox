import type { FaqItem } from "@/components/Faq";
import { formatAUD, type HeatPumpModel } from "./models";
import { responseTime } from "./site";

/*
 * FAQ copy. Keep answers general and hedged: anything not yet confirmed with partner
 * installers or the official programs is marked TBC.
 */

export const homeFaqs: FaqItem[] = [
  {
    q: "Is the quote really free?",
    a: "Yes. Requesting a quote is free and there's no obligation to go ahead. A licensed partner installer confirms your site details and fixed price, and you decide from there.",
  },
  {
    q: "How quickly will I hear back?",
    a: `${responseTime}. If you'd rather talk now, call us or use the callback form and pick a time that suits.`,
  },
  {
    q: "How much can a heat pump save on my hot water bill?",
    a: "Heat pumps move heat from the air into your water instead of generating it directly, so they typically use far less electricity than a conventional electric storage tank. Your actual saving depends on your current system, tariff, climate and usage. Your installer can estimate it for your home.",
  },
  {
    q: "Are the prices on this site final?",
    a: "Our prices are guide prices for standard supply and installation of each model, before rebates. Your installer confirms the fixed price after checking your site. Non-standard work, like relocating the unit, extra plumbing or switchboard upgrades, may cost more, and you'll know before any work starts.",
  },
  {
    q: "What rebates can I get?",
    a: "Most Australian homes can access federal Small-scale Technology Certificates (STCs), and some states offer extra programs. Use our rebate checker for a summary by state, then confirm eligibility on the official government page linked for each program.",
  },
  {
    q: "Who actually does the installation?",
    a: "We're a free referral service. Your enquiry goes to one independent, licensed partner installer in your area, and if they can't take it, we offer it to the next one. That installer quotes and does the work. Partner installers may pay us a referral fee, which never changes your price. Our How it works page explains the details.",
  },
  {
    q: "Will a heat pump work in a cold climate?",
    a: "Modern heat pumps are designed to work across most Australian climates. For frosty areas we recommend a cold-climate rated model. Check the operating range on each model page.",
  },
];

export function modelFaqs(m: HeatPumpModel): FaqItem[] {
  return [
    {
      q: `Is the ${m.name} the right size for my household?`,
      a: `The ${m.name} (${m.capacityLitres} L) generally suits ${m.households}. Usage habits matter too, like long showers or several bathrooms in use at once, so your installer will confirm the right size before you commit.`,
    },
    {
      q: `What does the ${formatAUD(m.priceFrom)} guide price include?`,
      a: `It's a guide price covering supply of the unit, removal and disposal of your old system, standard installation by a licensed plumber, electrical connection by a licensed electrician where required, and compliance certificates. Your installer confirms the fixed price after checking your site.`,
    },
    {
      q: "What could cost extra?",
      a: "Non-standard work such as relocating the system, a new concrete slab, switchboard upgrades, extended pipework or difficult access. Your installer confirms any extras in writing before work starts.",
    },
    {
      q: `Can I get rebates on the ${m.name}?`,
      a: "Federal STCs may apply if the model is on the official register of eligible heat pumps (your installer checks this for your exact model), and some states offer extra programs. Your installer confirms eligibility and applies what you qualify for on your quote.",
    },
    {
      q: "How long does installation take?",
      a: "A straightforward like-for-like swap is typically done in a single visit of around half a day to a day. Switching from gas, moving the unit or electrical upgrades can add time, and your installer confirms timing after the site check. Our install guide walks through each step.",
    },
    {
      q: m.type === "Split" ? "Why choose a split system?" : "Where can an integrated unit go?",
      a:
        m.type === "Split"
          ? "A split system separates the compressor from the tank, so the part that makes noise can sit away from bedrooms and the tank can fit tighter spaces."
          : "Integrated units have the compressor on top of the tank, so they need one outdoor spot with good airflow. Your installer will check clearances and placement.",
    },
  ];
}

export const rebateFaqs: FaqItem[] = [
  {
    q: "What are STCs?",
    a: "Small-scale Technology Certificates are created under the federal Small-scale Renewable Energy Scheme when an eligible heat pump is installed. Their value depends on the model, your climate zone and the market price at the time.",
  },
  {
    q: "How do I claim my rebates?",
    a: "In most cases you don't claim them yourself. Installers typically apply the STC value as an upfront discount on your quote. Some state programs have their own application steps, which your installer can walk you through.",
  },
  {
    q: "Can I combine federal and state rebates?",
    a: "Sometimes. It depends on each program's rules, which change from time to time, and the official pages don't always say. Your installer will confirm what can be combined for your install.",
  },
  {
    q: "Am I eligible?",
    a: "Eligibility is set by each government program and can depend on things like your property, your current system, the product and the installer's accreditation. The official pages linked above have the current criteria.",
  },
  {
    q: "Where do these figures come from?",
    a: "Only from the official government pages linked on each program, and we show the date we last checked them. If a page doesn't give a figure, we mark the amount 'Not confirmed' rather than guess. Programs change, so always confirm on the official page.",
  },
  {
    q: "How is the STC estimate worked out?",
    a: "There's no fixed amount, but you can estimate it from official CER data: take the model's certificate count for your postcode zone from the CER register and multiply by 0.5 for a 2026 install, rounding down. For the six models in our range that's about 12–18 STCs, worth up to $480–$720 at the $40 Clearing House cap (excluding GST). Installers usually sell at the lower open-market price.",
  },
];

export const compareFaqs: FaqItem[] = [
  {
    q: "What is the best heat pump hot water system in Australia?",
    a: "There isn't one best system for every home. The right choice depends on your household size, climate, where the unit will sit and your budget. A 270 L all-in-one suits most families of 3–4, while CO2 split systems suit cold climates and noise-sensitive spots. Your installer will recommend one for your home.",
  },
  {
    q: "CO2 or R290: which refrigerant is better?",
    a: "Both are natural refrigerants with very low global warming potential. CO2 (R744) systems like the Sanden and Reclaim Energy units are known for performing well in cold weather and running quietly, but cost more. R290 (propane) all-in-ones like the iStore and Emerald units are compact and good value.",
  },
  {
    q: "Can I compare the COP figures directly?",
    a: "Only roughly. Manufacturers and testers measure COP under different conditions (air temperature, target water temperature, seasonal vs point ratings), so treat the figures as a guide and ask your installer how each model performs in your climate.",
  },
  {
    q: "Are these prices fixed?",
    a: "They're guide prices for supply and standard installation, before rebates. Your installer confirms the fixed price after checking your site, and eligible rebates such as STCs come off on top.",
  },
  {
    q: "How did you choose these six?",
    a: "They're the six systems in our range, compared on published specs from manufacturer data sheets and CHOICE listings. We're a referral service: partner installers may pay us a referral fee, which never changes the price you're quoted. See our About page for how this works.",
  },
];
