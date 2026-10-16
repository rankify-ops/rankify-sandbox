import { siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * Organization + LocalBusiness structured data for every page.
 * Phone and email come from lib/site.ts and are placeholders until launch.
 */
export function SiteJsonLd() {
  const { street, locality, region, postcode, country } = site.address;
  const address = Object.fromEntries(
    Object.entries({
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: locality,
      addressRegion: region,
      postalCode: postcode,
      addressCountry: country,
    }).filter(([, v]) => v),
  );
  const phone = `+61 ${site.phone}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: site.name,
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        email: site.email,
        telephone: phone,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: phone,
          email: site.email,
          areaServed: "AU",
          availableLanguage: "en-AU",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
        name: site.name,
        description: site.description,
        url: siteUrl,
        image: `${siteUrl}/opengraph-image`,
        telephone: phone,
        email: site.email,
        address,
        areaServed: site.areaServed.map((name) => ({ "@type": "State", name })),
        parentOrganization: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
