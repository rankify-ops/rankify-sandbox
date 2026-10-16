import { formatAUD, type HeatPumpModel } from "./models";
import { siteUrl } from "./seo";
import { site } from "./site";

/*
 * Structured data builders. Rules while testimonials are samples: never emit Review or
 * AggregateRating. Product offers use the guide price and say so.
 */

const abs = (path: string) => `${siteUrl}${path}`;

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function productSchema(m: HeatPumpModel) {
  const prop = (name: string, value: string | number, unit?: { unitCode?: string; unitText?: string }) => ({
    "@type": "PropertyValue",
    name,
    value,
    ...unit,
  });
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": abs(`/models/${m.slug}#product`),
    name: m.name,
    brand: { "@type": "Brand", name: m.brand },
    manufacturer: { "@type": "Organization", name: m.brand },
    // The model code as listed on the Clean Energy Regulator's register of heat pumps.
    model: m.stc.registerModel,
    mpn: m.stc.registerModel,
    category: "Heat pump hot water system",
    description: `${m.summary} ${m.capacityLitres} L ${m.type.toLowerCase()} heat pump (${m.refrigerant}) for ${m.households}.`,
    url: abs(`/models/${m.slug}`),
    image: abs("/opengraph-image"),
    additionalProperty: [
      prop("Tank capacity", m.capacityLitres, { unitCode: "LTR", unitText: "L" }),
      prop("Configuration", m.type === "Split" ? "Split system" : "Integrated (all-in-one)"),
      prop("Refrigerant", m.refrigerant),
      prop("Rated noise", m.noiseDb, { unitText: "dB at 1 m (manufacturer)" }),
      prop("Minimum rated operating temperature", m.minOperatingC, { unitCode: "CEL", unitText: "°C" }),
      prop("Suits", m.households),
      ...m.specs.map((sp) => prop(sp.label, sp.value)),
    ],
    subjectOf: { "@type": "DigitalDocument", name: m.specSheet.label, url: m.specSheet.url },
    offers: {
      "@type": "Offer",
      url: abs(`/models/${m.slug}`),
      price: m.priceFrom.toFixed(2),
      priceCurrency: "AUD",
      itemCondition: "https://schema.org/NewCondition",
      description: `${m.priceConfirmed ? "Supply and standard installation" : "Guide price for supply and standard installation"}, from ${formatAUD(m.priceFrom)} before rebates. Fixed price confirmed by a licensed partner installer.`,
      eligibleRegion: { "@type": "Country", name: "Australia" },
      areaServed: { "@type": "Country", name: "Australia" },
      offeredBy: { "@id": `${siteUrl}/#organization` },
      seller: { "@id": `${siteUrl}/#organization` },
    },
    // No review or aggregateRating: the testimonials on the site are placeholders, not real reviews.
  };
}

export function productList(models: HeatPumpModel[], name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: models.map((m, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/models/${m.slug}`), name: m.name })),
  };
}

/** Service offered in a city: the referral-to-installer service, with the city as area served. */
export function cityServiceSchema(c: { name: string; state: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": abs(`/heat-pump-hot-water/${c.slug}#service`),
    name: `Heat pump hot water quotes in ${c.name}`,
    serviceType: "Heat pump hot water supply and installation (referral to licensed partner installers)",
    url: abs(`/heat-pump-hot-water/${c.slug}`),
    areaServed: { "@type": "City", name: c.name, containedInPlace: { "@type": "State", name: c.state } },
    provider: { "@type": "Organization", name: site.name, url: siteUrl },
  };
}
