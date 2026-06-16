import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Imo Crafts';
const SITE_URL = 'https://imo-crafts.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/favicon.svg`;
const DEFAULT_DESC = 'Discover beautifully handmade crafts, personalized gifts, and custom decorations for every special occasion. Made with love, delivered island-wide across Sri Lanka.';

const SEO = ({
  title,
  description = DEFAULT_DESC,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  product = null,
  breadcrumbs = null,
  noIndex = false,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Handmade Crafts & Gifts`;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  // Product structured data (JSON-LD)
  const productSchema = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0] || DEFAULT_IMAGE,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'LKR',
      availability: product.status === 'active'
        ? 'https://schema.org/InStock'
        : product.status === 'made_to_order'
        ? 'https://schema.org/MadeToOrder'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: SITE_NAME },
    },
    brand: { '@type': 'Brand', name: SITE_NAME },
  } : null;

  // Breadcrumb structured data (JSON-LD)
  const breadcrumbSchema = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  } : null;

  // Organization schema (always present)
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    description: DEFAULT_DESC,
    url: SITE_URL,
    image: DEFAULT_IMAGE,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'LK',
    },
    priceRange: 'Rs.Rs.',
    servesCuisine: undefined,
  };

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_LK" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Extra */}
      <meta name="keywords" content="handmade crafts Sri Lanka, resin art, personalized gifts, custom orders, Imo Crafts" />
      <meta name="author" content={SITE_NAME} />
      <meta name="geo.region" content="LK" />
      <meta name="geo.country" content="Sri Lanka" />

      {/* Structured Data */}
      {!product && (
        <script type="application/ld+json">
          {JSON.stringify(orgSchema)}
        </script>
      )}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
