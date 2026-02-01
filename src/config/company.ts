/**
 * Centralized Company Configuration
 * 
 * Update this file when deploying for a new company.
 * All branding, contact info, and company details are managed here.
 */

export const companyConfig = {
  // Company Identity
  name: "The Roofing Friend",
  
  // Website URL (for payment links, sharing, etc.)
  websiteUrl: "https://www.roofingfriend.com",
  legalName: "THE ROOFING FRIEND, INC",
  shortName: "Roofing Friend",
  tagline: "We Can, We Will",
  description: "Your trusted partner for premium metal roofing solutions across the San Francisco Bay Area. Licensed, insured, and committed to excellence.",
  
  // Contact Information
  phone: "(415) 697-1849",
  phoneRaw: "+14156971849",
  email: "roofingfriend@gmail.com",
  
  // Business Details
  licenseNumber: "CA License #1067709",
  address: {
    street: "211 Jackson St.",
    city: "Hayward",
    state: "CA",
    zip: "94544",
    full: "211 Jackson St. Hayward, CA 94544",
    region: "San Francisco Bay Area",
  },
  
  // Hours of Operation
  hours: {
    weekdays: "Mon - Fri: 8AM - 4PM",
    weekends: "Weekends: Closed",
    emergency: "24/7 Emergency Service",
    schema: "Mo-Fr 08:00-16:00",
  },
  
  // Service Areas
  serviceAreas: [
    "San Francisco",
    "Santa Clara", 
    "Walnut Creek",
    "Tiburon",
    "San Anselmo",
    "Santa Cruz",
    "Modesto",
    "Kentfield",
    "Santa Rosa",
    "Alameda County",
    "Contra Costa County",
    "Petaluma",
    "Los Gatos"
  ],
  
  // Social Media Links
  social: {
    youtube: "https://www.youtube.com/@RoofingFriend",
    instagram: "https://www.instagram.com/roofingfriend/",
    facebook: "https://www.facebook.com/people/The-Roofing-Friend-Inc/100076473061858/",
    tiktok: "https://www.tiktok.com/@roofingfriend?lang=en",
    google: "https://share.google/VOkInHQUIXVepb7j3",
    yelp: "https://www.yelp.com/biz/the-roofing-friend-hayward",
    linkedin: "https://www.linkedin.com/company/metalroofingfriend",
  },
  
  // Logo
  logo: "/lovable-uploads/7b6837e6-dcb1-4e40-a018-af62558a5502.png",
  
  // SEO Defaults
  seo: {
    defaultTitle: "Metal Roofing Friend - Premium Metal Roofing Services Bay Area",
    defaultDescription: "Professional metal roofing installation, repair, and replacement services across the San Francisco Bay Area. Licensed, insured, and 25-year warranty. Free estimates.",
    defaultKeywords: "metal roofing, roof installation, Bay Area roofing, San Francisco roofing, metal roof repair, standing seam, R-panel, roofing contractor",
    siteName: "Metal Roofing Friend",
    author: "Metal Roofing Friend",
  },
  
  // Ratings
  ratings: {
    average: "4.9",
    count: "150",
    best: "5",
    worst: "1",
  },
  
  // Pricing
  priceRange: "$$-$$$",
  
  // Services
  services: [
    { name: "Metal Roof Installation", path: "/metal-roof-installation" },
    { name: "Roof Repair & Maintenance", path: "/roof-repair-maintenance" },
    { name: "Standing Seam Systems", path: "/standing-seam-systems" },
    { name: "R-Panel Installation", path: "/r-panel-installation" },
    { name: "Commercial Roofing", path: "/commercial-roofing" },
    { name: "Residential Roofing", path: "/residential-roofing" },
  ],
  
  // Warranty Info
  warranty: {
    years: 25,
    description: "25-year warranty covering materials and workmanship",
  },
  
  // Geo coordinates (for schema.org)
  coordinates: {
    lat: 37.7749,
    lng: -122.4194,
  },
} as const;

// Type for the company config
export type CompanyConfig = typeof companyConfig;
