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
    a: "Published prices cover standard supply and installation for each model, and are currently placeholders marked TBC. Non-standard sites, like relocating the unit, extra plumbing or switchboard upgrades, may cost more. Your installer confirms this before any work starts.",
  },
  {
    q: "What rebates can I get?",
    a: "Most Australian homes can access federal Small-scale Technology Certificates (STCs), and some states offer extra programs. Use our rebate checker for a summary by state, then confirm eligibility on the official government page linked for each program.",
  },
  {
    q: "Who actually does the installation?",
    a: "We're a referral service. Your job is completed by an independent, licensed partner installer in your area. Our About page explains exactly how this works and how we're paid.",
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
      q: `What does the ${formatAUD(m.priceFrom)} price include?`,
      a: `It covers supply of the unit, removal and disposal of your old system, standard installation by a licensed plumber, electrical connection by a licensed electrician where required, and compliance certificates. The price is currently a placeholder (TBC).`,
    },
    {
      q: "What could cost extra?",
      a: "Non-standard work such as relocating the system, a new concrete slab, switchboard upgrades, extended pipework or difficult access. Your installer confirms any extras in writing before work starts.",
    },
    {
      q: `Can I get rebates on the ${m.name}?`,
      a: "Federal STCs may apply if the model is on the official register of eligible heat pumps (TBC for this model), and some states offer extra programs. Your installer confirms eligibility and applies what you qualify for on your quote.",
    },
    {
      q: "How long does installation take?",
      a: "A standard like-for-like swap is usually completed in a single visit (TBC). Your installer will confirm timing once they've reviewed your site.",
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
    a: "Sometimes. It depends on each program's rules, which change from time to time. Check the official page for each program, and your installer will confirm what can be combined for your install (TBC).",
  },
  {
    q: "Am I eligible?",
    a: "Eligibility is set by each government program and can depend on things like your property, your current system, the product and the installer's accreditation. The official pages linked above have the current criteria.",
  },
  {
    q: "Are the amounts on this page final?",
    a: "No. Amounts are placeholders marked TBC while we verify current program values. Always confirm on the official government page.",
  },
];
