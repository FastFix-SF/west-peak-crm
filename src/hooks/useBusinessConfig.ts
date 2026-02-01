/**
 * Hooks to load configuration from JSON files
 * These JSON files are synced from Supabase CMS via GitHub
 *
 * When content is updated in the admin dashboard and synced to GitHub,
 * Vercel auto-deploys and these hooks return the updated data.
 */

import businessData from '@/config/business.json';
import servicesData from '@/config/services.json';
import areasData from '@/config/areas.json';
import faqsData from '@/config/faqs.json';

// Types for the JSON configs
export interface BusinessConfig {
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

export interface ServiceBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceConfig {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon: string;
  heroImage?: string;
  heroTitle?: string;
  heroHighlight?: string;
  benefits: ServiceBenefit[];
  faqs: ServiceFAQ[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  isFeatured?: boolean;
}

export interface AreaTestimonial {
  name: string;
  text: string;
  rating: number;
  project: string;
}

export interface AreaFAQ {
  question: string;
  answer: string;
}

export interface AreaConfig {
  slug: string;
  name: string;
  fullName: string;
  description: string;
  population: string;
  heroImage?: string;
  neighborhoods: string[];
  services: string[];
  testimonial: AreaTestimonial;
  faqs: AreaFAQ[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface FAQConfig {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// ============ BUSINESS HOOKS ============

export function useBusinessConfig() {
  return {
    business: businessData as unknown as BusinessConfig,
    services: servicesData as unknown as ServiceConfig[],
    areas: areasData as unknown as AreaConfig[],
    faqs: faqsData as unknown as FAQConfig[],
  };
}

export function useBusiness(): BusinessConfig {
  return businessData as unknown as BusinessConfig;
}

export function useHero() {
  const business = businessData as unknown as BusinessConfig;
  return business.hero;
}

export function useTrustIndicators() {
  const business = businessData as unknown as BusinessConfig;
  return business.trustIndicators || [];
}

export function useStatistics() {
  const business = businessData as unknown as BusinessConfig;
  return business.statistics || [];
}

export function useRatings() {
  const business = businessData as unknown as BusinessConfig;
  return business.ratings;
}

// ============ SERVICES HOOKS ============

export function useServices(): ServiceConfig[] {
  return servicesData as unknown as ServiceConfig[];
}

export function useServiceBySlug(slug: string): ServiceConfig | undefined {
  const services = servicesData as unknown as ServiceConfig[];
  return services.find(s => s.slug === slug);
}

export function useFeaturedServices(): ServiceConfig[] {
  const services = servicesData as unknown as ServiceConfig[];
  return services.filter(s => s.isFeatured);
}

export function useServiceNavigation() {
  const services = servicesData as unknown as ServiceConfig[];
  return services.slice(0, 4).map(s => ({
    label: s.name,
    path: `/services/${s.slug}`
  }));
}

// ============ AREAS HOOKS ============

export function useAreas(): AreaConfig[] {
  return areasData as unknown as AreaConfig[];
}

export function useAreaBySlug(slug: string): AreaConfig | undefined {
  const areas = areasData as unknown as AreaConfig[];
  return areas.find(a => a.slug === slug);
}

export function useAreaNames(): string[] {
  const areas = areasData as unknown as AreaConfig[];
  return areas.map(a => a.name);
}

// ============ FAQ HOOKS ============

export function useFAQs(): FAQConfig[] {
  return faqsData as unknown as FAQConfig[];
}

export function useFAQsByCategory(category: string): FAQConfig[] {
  const faqs = faqsData as unknown as FAQConfig[];
  return faqs.filter(f => f.category === category);
}

export function useGeneralFAQs(): FAQConfig[] {
  return useFAQsByCategory('general');
}
