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
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": abs(`/models/${m.slug}#product`),
    name: m.name,
    brand: { "@type": "Brand", name: m.brand },
    category: "Heat pump hot water system",
    description: `${m.summary} ${m.capacityLitres} L ${m.type.toLowerCase()} heat pump (${m.refrigerant}) for ${m.households}.`,
    url: abs(`/models/${m.slug}`),
    image: abs("/opengraph-image"),
    additionalProperty: m.specs.map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
    offers: {
      "@type": "Offer",
      url: abs(`/models/${m.slug}`),
      price: m.priceFrom.toFixed(2),
      priceCurrency: "AUD",
      description: `${m.priceConfirmed ? "Supply and standard installation" : "Guide price for supply and standard installation"}, from ${formatAUD(m.priceFrom)} before rebates. Fixed price confirmed by a licensed partner installer.`,
      areaServed: { "@type": "Country", name: "Australia" },
      offeredBy: { "@type": "Organization", name: site.name, url: siteUrl },
    },
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
