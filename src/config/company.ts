/**
 * Centralized Company Configuration
 * 
 * This file imports from business.json for personalized tenant data.
 * All branding, contact info, and company details come from the JSON config.
 */

import business from './business.json';

// Type for the business.json structure
interface BusinessData {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  phoneRaw: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    full: string;
  };
  owner?: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  hours: string;
  certifications: string[];
  uniqueSellingPoints: string[];
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    yelp?: string;
    youtube?: string;
    tiktok?: string;
    google?: string;
  };
  seo: {
    siteUrl: string;
    defaultTitle: string;
    titleTemplate: string;
    description: string;
    keywords: string[];
  };
  hero?: {
    headline: string;
    headlineHighlight: string;
    subheadline: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
  };
  trustIndicators?: Array<{
    icon: string;
    text: string;
  }>;
  statistics?: Array<{
    icon: string;
    number: string;
    label: string;
    description: string;
  }>;
  certificationLogos?: Array<{
    src: string;
    alt: string;
  }>;
  ratings?: {
    average: string;
    count: string;
    platform?: string;
  };
}

const businessData = business as unknown as BusinessData;

export const companyConfig = {
  // Company Identity - loaded from business.json
  name: businessData.name,
  legalName: businessData.name,
  shortName: businessData.name,
  tagline: businessData.tagline || "",
  description: businessData.description || "",
  
  // Website URL (for payment links, sharing, etc.)
  websiteUrl: businessData.seo?.siteUrl || "",
  
  // Contact Information
  phone: businessData.phone || "",
  phoneRaw: businessData.phoneRaw || "",
  email: businessData.email || "",
  
  // Business Details
  licenseNumber: "",
  address: businessData.address || {
    street: "",
    city: "",
    state: "",
    zip: "",
    full: "",
  },
  
  // Hours of Operation
  hours: {
    weekdays: businessData.hours || "Mon - Fri: 8AM - 5PM",
    weekends: "Weekends: By Appointment",
    emergency: "",
    schema: "Mo-Fr 08:00-17:00",
  },
  
  // Service Areas - loaded from areas.json via hooks
  serviceAreas: [] as string[],
  
  // Social Media Links
  social: businessData.social || {},
  
  // Logo
  logo: businessData.logo || "",
  
  // SEO Defaults
  seo: {
    defaultTitle: businessData.seo?.defaultTitle || businessData.name,
    defaultDescription: businessData.seo?.description || businessData.description,
    defaultKeywords: businessData.seo?.keywords?.join(", ") || "",
    siteName: businessData.name,
    author: businessData.name,
  },
  
  // Ratings
  ratings: businessData.ratings || {
    average: "5.0",
    count: "0",
    best: "5",
    worst: "1",
  },
  
  // Pricing
  priceRange: "$$",
  
  // Services - loaded from services.json via hooks
  services: [] as Array<{ name: string; path: string }>,
  
  // Warranty Info
  warranty: {
    years: 0,
    description: "",
  },
  
  // Geo coordinates (for schema.org)
  coordinates: {
    lat: 0,
    lng: 0,
  },
} as const;

// Type for the company config
export type CompanyConfig = typeof companyConfig;
