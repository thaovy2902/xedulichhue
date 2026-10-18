import { siteConfig, MAP_REVIEWS_URL } from '@/lib/site'

interface JsonLdProps {
  locale: string
}

// ─── LocalBusiness Schema ──────────────────────────────────────────────────

function buildLocalBusiness(locale: string) {
  const isVi = locale === 'vi'
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TravelAgency'],
    '@id': `${siteConfig.url}/#business`,
    name: siteConfig.name,
    alternateName: isVi ? 'Xe du lịch Huế' : 'Hue Tourism Transport',
    description: isVi
      ? 'Dịch vụ xe du lịch Huế chuyên nghiệp - đưa đón sân bay Phú Bài, tour tham quan Cố đô Huế, xe đi Đà Nẵng – Hội An và các tỉnh miền Trung.'
      : 'Professional Hue tourism transport - Phu Bai airport transfers, Hue city tours, and inter-provincial trips to Da Nang, Hoi An and beyond.',
    url: `${siteConfig.url}/${locale}`,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address,
      addressLocality: 'Huế',
      addressRegion: 'Thừa Thiên Huế',
      postalCode: '530000',
      addressCountry: 'VN',
    },
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    logo: `${siteConfig.url}/favicon.ico`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 16.4599502,
      longitude: 107.5869156,
    },
    hasMap: MAP_REVIEWS_URL,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday', 'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: '$$',
    currenciesAccepted: 'VND',
    paymentAccepted: 'Cash, Bank Transfer',
    areaServed: [
      { '@type': 'City', name: 'Huế' },
      { '@type': 'City', name: 'Đà Nẵng' },
      { '@type': 'City', name: 'Hội An' },
      { '@type': 'State', name: 'Thừa Thiên Huế' },
    ],
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.zalo,
    ].filter(Boolean),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: isVi ? 'Dịch vụ xe du lịch Huế' : 'Hue Tourism Transport Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isVi ? 'Đưa đón sân bay Phú Bài' : 'Phu Bai Airport Transfer',
            description: isVi
              ? 'Đưa đón sân bay Phú Bài – Trung tâm Huế với xe 4, 7, 16 chỗ. Giá cố định, hỗ trợ 24/7.'
              : 'Phu Bai Airport to Hue City Centre transfers with 4, 7, 16-seat vehicles. Fixed price, 24/7 service.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isVi ? 'Tour tham quan Cố đô Huế' : 'Hue Imperial City Tour',
            description: isVi
              ? 'Tour tham quan Đại Nội, Lăng Tẩm, Chùa Thiên Mụ và các danh thắng Huế.'
              : 'Sightseeing tour of Hue Imperial Citadel, Royal Tombs, Thien Mu Pagoda and more.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isVi ? 'Xe Tour Huế – Đà Nẵng – Hội An' : 'Hue – Da Nang – Hoi An Tour',
            description: isVi
              ? 'Xe đưa đón tour Huế – Đà Nẵng – Hội An. Lịch trình linh hoạt, giá trọn gói.'
              : 'Hue – Da Nang – Hoi An tour transfer. Flexible itinerary, all-inclusive price.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isVi ? 'Cho thuê xe theo ngày' : 'Daily Vehicle Rental',
            description: isVi
              ? 'Cho thuê xe 4, 7, 16 chỗ theo ngày với tài xế chuyên nghiệp.'
              : 'Daily rental of 4, 7, 16-seat vehicles with professional driver.',
          },
        },
      ],
    },
  }
}

// ─── WebSite Schema ────────────────────────────────────────────────────────

function buildWebSite(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: `${siteConfig.url}/${locale}`,
    name: siteConfig.name,
    inLanguage: locale === 'vi' ? 'vi-VN' : 'en-US',
    publisher: { '@id': `${siteConfig.url}/#business` },
  }
}

// ─── Component ─────────────────────────────────────────────────────────────

export function JsonLd({ locale }: JsonLdProps) {
  const schemas = [buildWebSite(locale), buildLocalBusiness(locale)]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
