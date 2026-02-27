// SEO and Search Engine Optimization Components
import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

// SEO metadata interface
interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'video' | 'music';
  siteName?: string;
  locale?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
  tags?: string[];
  jsonLd?: Record<string, any>;
}

// SEO Component
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  siteName = 'Smart English Grade 4',
  locale = 'ar',
  canonical,
  noindex = false,
  nofollow = false,
  author,
  publishedTime,
  modifiedTime,
  articleSection,
  tags = [],
  jsonLd
}) => {
  const location = useLocation();
  
  const currentUrl = url || `${window.location.origin}${location.pathname}${location.search}`;
  const currentTitle = title ? `${title} | ${siteName}` : siteName;
  
  const structuredData = useMemo(() => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebPage',
      name: title || siteName,
      description: description || 'منصة تعلم ذكاء اصطناعي متكاملة للصف الرابع الابتدائي',
      url: currentUrl,
      image: image || `${window.location.origin}/images/og-default.jpg`,
      publisher: {
        '@type': 'Organization',
        name: siteName,
        url: window.location.origin,
        logo: {
          '@type': 'ImageObject',
          url: `${window.location.origin}/images/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentUrl
      }
    };

    if (type === 'article') {
      return {
        ...baseData,
        '@type': 'Article',
        headline: title,
        author: {
          '@type': 'Person',
          name: author || 'Smart English Team'
        },
        datePublished: publishedTime,
        dateModified: modifiedTime,
        articleSection: articleSection,
        keywords: keywords.join(', '),
        about: 'تعليم اللغة الإنجليزية للصف الرابع الابتدائي'
      };
    }

    return baseData;
  }, [title, description, currentUrl, image, type, author, publishedTime, modifiedTime, articleSection, keywords, siteName]);

  const metaTags = useMemo(() => {
    const tags = [
      // Basic meta tags
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'author', content: author || 'Smart English Team' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'robots', content: `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}` },
      
      // Open Graph tags
      { property: 'og:title', content: currentTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image || `${window.location.origin}/images/og-default.jpg` },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName },
      { property: 'og:locale', content: locale },
      
      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: currentTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image || `${window.location.origin}/images/og-default.jpg` },
      { name: 'twitter:site', content: '@smartenglish' },
      { name: 'twitter:creator', content: '@smartenglish' },
      
      // Additional meta tags
      { name: 'theme-color', content: '#1976d2' },
      { name: 'msapplication-TileColor', content: '#1976d2' },
      { name: 'application-name', content: siteName },
      { name: 'apple-mobile-web-app-title', content: siteName },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-touch-fullscreen', content: 'yes' },
      
      // Education-specific meta tags
      { name: 'education-level', content: 'Grade 4' },
      { name: 'subject', content: 'English Language' },
      { name: 'learning-resource-type', content: 'Interactive Learning Platform' },
      { name: 'audience', content: 'Students, Teachers, Parents' },
      { name: 'language', content: 'English, Arabic' },
      { name: 'curriculum', content: 'Elementary Education' },
      { name: 'teaching-method', content: 'AI-Powered Learning' },
      { name: 'interactivity-type', content: 'Interactive Exercises' },
      { name: 'educational-use', content: 'instruction, assessment, practice' },
      { name: 'skill-level', content: 'Beginner to Intermediate' },
      { name: 'age-range', content: '9-10 years' },
      
      // Technical meta tags
      { name: 'generator', content: 'Smart English Grade 4' },
      { name: 'referrer', content: 'no-referrer-when-downgrade' },
      { name: 'csrf-token', content: 'auto' },
      { name: 'x-ua-compatible', content: 'ie=edge' },
      
      // Performance meta tags
      { name: 'preconnect', content: 'https://fonts.googleapis.com' },
      { name: 'preconnect', content: 'https://fonts.gstatic.com' },
      { name: 'dns-prefetch', content: 'https://www.googletagmanager.com' },
      { name: 'dns-prefetch', content: 'https://www.google-analytics.com' },
      { name: 'dns-prefetch', content: 'https://www.google.com' },
      
      // Security meta tags
      { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
      { 'http-equiv': 'X-Frame-Options', content: 'DENY' },
      { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' },
      { 'http-equiv': 'Strict-Transport-Security', content: 'max-age=31536000; includeSubDomains' },
      { 'http-equiv': 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { 'http-equiv': 'Permissions-Policy', content: 'geolocation=(), microphone=(), camera=()' },
      
      // Cache control
      { 'http-equiv': 'Cache-Control', content: 'public, max-age=31536000, immutable' },
      { name: 'expires', content: '31536000' },
      { name: 'last-modified', content: new Date().toISOString() },
      { name: 'etag', content: 'W/"123456789"' }
    ];

    // Add canonical URL if provided
    if (canonical) {
      tags.push({ rel: 'canonical', href: canonical });
    } else {
      tags.push({ rel: 'canonical', href: currentUrl });
    }

    // Add alternate language versions
    tags.push({ rel: 'alternate', hreflang: 'en', href: currentUrl.replace('/ar', '/en') });
    tags.push({ rel: 'alternate', hreflang: 'ar', href: currentUrl });
    tags.push({ rel: 'alternate', hreflang: 'x-default', href: currentUrl });

    // Add favicon and app icons
    tags.push({ rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' });
    tags.push({ rel: 'icon', href: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' });
    tags.push({ rel: 'icon', href: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' });
    tags.push({ rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' });
    tags.push({ rel: 'apple-touch-icon', href: '/apple-touch-icon-120x120.png', sizes: '120x120' });
    tags.push({ rel: 'apple-touch-icon', href: '/apple-touch-icon-152x152.png', sizes: '152x152' });
    tags.push({ rel: 'apple-touch-icon', href: '/apple-touch-icon-167x167.png', sizes: '167x167' });
    tags.push({ rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png', sizes: '180x180' });
    tags.push({ rel: 'icon', href: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' });
    tags.push({ rel: 'icon', href: '/icon-192x192.png', sizes: '192x192', type: 'image/png' });
    tags.push({ rel: 'icon', href: '/icon-512x512.png', sizes: '512x512', type: 'image/png' });
    tags.push({ rel: 'manifest', href: '/manifest.json' });

    // Add Open Graph image dimensions
    tags.push({ property: 'og:image:width', content: '1200' });
    tags.push({ property: 'og:image:height', content: '630' });
    tags.push({ property: 'og:image:alt', content: title || siteName });

    // Add Twitter image dimensions
    tags.push({ name: 'twitter:image:width', content: '1200' });
    tags.push({ name: 'twitter:image:height', content: '630' });
    tags.push({ name: 'twitter:image:alt', content: title || siteName });

    return tags;
  }, [title, description, keywords, author, noindex, nofollow, canonical, currentUrl, image, siteName, locale, currentTitle, type]);

  return (
    <Helmet>
      <title>{currentTitle}</title>
      {metaTags.map((tag, index) => {
        if ('rel' in tag) {
          return <link key={index} {...tag} />;
        } else if ('property' in tag) {
          return <meta key={index} property={tag.property} content={tag.content} />;
        } else if ('http-equiv' in tag) {
          return <meta key={index} httpEquiv={tag['http-equiv']} content={tag.content} />;
        } else {
          return <meta key={index} name={tag.name} content={tag.content} />;
        }
      })}
      
      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || structuredData)}
      </script>
    </Helmet>
  );
};

// Breadcrumb Schema Component
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(breadcrumbList)}
    </script>
  );
};

// Organization Schema Component
export const OrganizationSchema: React.FC = () => {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Smart English Grade 4',
    url: window.location.origin,
    logo: {
      '@type': 'ImageObject',
      url: `${window.location.origin}/images/logo.png`,
      width: 200,
      height: 200
    },
    description: 'منصة تعلم ذكاء اصطناعي متكاملة للصف الرابع الابتدائي',
    sameAs: [
      'https://www.facebook.com/smartenglish',
      'https://twitter.com/smartenglish',
      'https://www.instagram.com/smartenglish',
      'https://www.youtube.com/c/smartenglish'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+966-50-000-0000',
      contactType: 'customer service',
      areaServed: 'SA',
      availableLanguage: ['Arabic', 'English']
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SA',
      addressLocality: 'Riyadh',
      addressRegion: 'Riyadh Province',
      postalCode: '12345',
      streetAddress: '123 Education Street'
    },
    foundingDate: '2024-01-01',
    numberOfEmployees: '10-50',
    slogan: 'تعلم اللغة الإنجليزية بذكاء اصطناعي',
    knowsAbout: [
      'Education',
      'English Language Learning',
      'Artificial Intelligence',
      'Elementary Education',
      'Interactive Learning',
      'Educational Technology'
    ]
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(organizationData)}
    </script>
  );
};

// Website Schema Component
export const WebsiteSchema: React.FC = () => {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Smart English Grade 4',
    url: window.location.origin,
    description: 'منصة تعلم ذكاء اصطناعي متكاملة للصف الرابع الابتدائي',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${window.location.origin}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Smart English Grade 4',
      url: window.location.origin
    },
    inLanguage: ['ar', 'en'],
    isAccessibleForFree: true,
    isFamilyFriendly: true,
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student'
    },
    teaches: [
      'English Language',
      'Reading Comprehension',
      'Writing Skills',
      'Speaking Practice',
      'Listening Skills',
      'Grammar',
      'Vocabulary',
      'Pronunciation'
    ],
    learningResourceType: 'Interactive Learning Platform',
    typicalAgeRange: '9-10',
    educationalLevel: 'Elementary School',
    about: 'English Language Learning for Grade 4 Students'
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(websiteData)}
    </script>
  );
};

// Course Schema Component
interface CourseSchemaProps {
  name: string;
  description: string;
  image?: string;
  url: string;
  provider?: string;
  hasCourseInstance?: {
    courseMode: 'online' | 'offline' | 'blended';
  };
}

export const CourseSchema: React.FC<CourseSchemaProps> = ({
  name,
  description,
  image,
  url,
  provider = 'Smart English Grade 4',
  hasCourseInstance
}) => {
  const courseData = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    image: image || `${window.location.origin}/images/course-default.jpg`,
    url,
    provider: {
      '@type': 'Organization',
      name: provider,
      url: window.location.origin
    },
    hasCourseInstance: hasCourseInstance || {
      '@type': 'CourseInstance',
      courseMode: 'online',
      instructor: {
        '@type': 'Person',
        name: 'AI Tutor',
        description: 'Intelligent English Language Tutor'
      }
    },
    educationalLevel: 'Elementary School',
    inLanguage: ['ar', 'en'],
    about: 'English Language Learning',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student'
    },
    typicalAgeRange: '9-10',
    timeRequired: 'PT30M',
    teaches: [
      'English Language',
      'Reading Comprehension',
      'Writing Skills',
      'Speaking Practice',
      'Listening Skills',
      'Grammar',
      'Vocabulary'
    ],
    learningResourceType: 'Interactive Learning Module',
    interactivityType: 'active',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'SAR',
      availability: 'InStock',
      validFrom: new Date().toISOString()
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(courseData)}
    </script>
  );
};

// FAQ Schema Component
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs }) => {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(faqData)}
    </script>
  );
};

// Video Schema Component
interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl?: string;
  embedUrl?: string;
}

export const VideoSchema: React.FC<VideoSchemaProps> = ({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  embedUrl
}) => {
  const videoData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    contentUrl: contentUrl || `${window.location.origin}/videos/${name}`,
    embedUrl: embedUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Smart English Grade 4',
      url: window.location.origin
    },
    inLanguage: ['ar', 'en'],
    isAccessibleForFree: true,
    isFamilyFriendly: true,
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student'
    },
    educationalUse: 'instruction',
    learningResourceType: 'Video Tutorial'
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(videoData)}
    </script>
  );
};

// Product Schema Component (for premium features)
interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: string;
  currency: string;
  availability: string;
  brand: string;
  sku: string;
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({
  name,
  description,
  image,
  price,
  currency = 'SAR',
  availability = 'InStock',
  brand = 'Smart English Grade 4',
  sku
}) => {
  const productData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    sku,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability,
      seller: {
        '@type': 'Organization',
        name: brand,
        url: window.location.origin
      },
      validFrom: new Date().toISOString()
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student'
    },
    educationalUse: 'instruction',
    learningResourceType: 'Premium Learning Content'
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(productData)}
    </script>
  );
};

// SEO Hook for dynamic metadata
export const useSEO = (props: SEOProps) => {
  const location = useLocation();
  
  const seoProps = useMemo(() => ({
    ...props,
    url: props.url || `${window.location.origin}${location.pathname}${location.search}`,
    canonical: props.canonical || `${window.location.origin}${location.pathname}${location.search}`
  }), [props, location]);

  return seoProps;
};

// Default SEO export
export default SEO;
