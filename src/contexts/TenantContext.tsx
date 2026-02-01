import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './AuthContext';

// Types for tenant data
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface TenantProfile {
  business_id: string;
  business_name: string;
  tagline?: string;
  description?: string;
  phone?: string;
  email?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  license_number?: string;
  years_in_business?: number;
  owner_name?: string;
  owner_title?: string;
  owner_photo_url?: string;
  custom_domain?: string;
  google_place_id?: string;
}

export interface TenantBranding {
  business_id: string;
  logo_url?: string;
  logo_dark_url?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  hero_image_url?: string;
  hero_video_url?: string;
}

export interface TenantWhitelabel {
  tenant_id: string;
  system_name?: string;
  support_email?: string;
  support_phone?: string;
  footer_text?: string;
  terms_of_service_url?: string;
  privacy_policy_url?: string;
  custom_domain?: string;
  custom_domain_verified?: boolean;
  from_email?: string;
  from_name?: string;
  pwa_name?: string;
  pwa_short_name?: string;
  pwa_theme_color?: string;
}

export interface TenantSubscription {
  tenant_id: string;
  plan_id: string;
  status: 'active' | 'trial' | 'past_due' | 'canceled' | 'suspended';
  billing_cycle: 'monthly' | 'yearly';
  trial_ends_at?: string;
  current_period_start?: string;
  current_period_end?: string;
  plan_name?: string;
  plan_slug?: string;
}

export interface TenantFeature {
  function_slug: string;
  is_enabled: boolean;
  category: string;
  name: string;
  is_core: boolean;
  is_premium: boolean;
}

export interface TenantContextValue {
  // Core tenant state
  tenant: Tenant | null;
  tenantId: string | null;
  isLoading: boolean;
  error: string | null;

  // Tenant configuration
  profile: TenantProfile | null;
  branding: TenantBranding | null;
  whitelabel: TenantWhitelabel | null;
  subscription: TenantSubscription | null;

  // Feature flags
  features: Record<string, boolean>;
  isFeatureEnabled: (featureSlug: string) => boolean;

  // Tenant-aware Supabase client helper
  getTenantHeader: () => Record<string, string>;

  // Tenant switching (for multi-tenant users)
  availableTenants: Tenant[];
  switchTenant: (tenantId: string) => Promise<void>;

  // Refresh functions
  refreshTenant: () => Promise<void>;
  refreshFeatures: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

// Helper hook for checking if tenant is ready
export const useTenantReady = () => {
  const { tenant, isLoading } = useTenant();
  return !isLoading && tenant !== null;
};

// Helper hook for feature flags
export const useFeature = (featureSlug: string) => {
  const { isFeatureEnabled } = useTenant();
  return isFeatureEnabled(featureSlug);
};

interface TenantProviderProps {
  children: React.ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [whitelabel, setWhitelabel] = useState<TenantWhitelabel | null>(null);
  const [subscription, setSubscription] = useState<TenantSubscription | null>(null);
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve tenant from custom domain
  const resolveFromDomain = useCallback(async (): Promise<Tenant | null> => {
    const hostname = window.location.hostname;

    // Skip domain resolution for localhost and known dev domains
    if (hostname === 'localhost' ||
        hostname.includes('lovableproject.com') ||
        hostname.includes('supabase.co')) {
      return null;
    }

    try {
      const { data: profileData, error } = await supabase
        .from('mt_business_profiles')
        .select(`
          business_id,
          business_name,
          businesses!inner(id, name, slug, created_at)
        `)
        .eq('custom_domain', hostname)
        .single();

      if (error || !profileData) return null;

      const business = profileData.businesses as any;
      return {
        id: business.id,
        name: business.name,
        slug: business.slug,
        created_at: business.created_at,
      };
    } catch {
      return null;
    }
  }, []);

  // Resolve tenant from subdomain
  const resolveFromSubdomain = useCallback(async (): Promise<Tenant | null> => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    // Check if it's a subdomain pattern (e.g., acme.roofingcrm.com)
    if (parts.length < 3) return null;

    const subdomain = parts[0];
    if (subdomain === 'www' || subdomain === 'app') return null;

    try {
      const { data: business, error } = await supabase
        .from('businesses')
        .select('id, name, slug, created_at')
        .eq('slug', subdomain)
        .single();

      if (error || !business) return null;

      return business as Tenant;
    } catch {
      return null;
    }
  }, []);

  // Resolve tenant from user's memberships (primary tenant)
  const resolveFromUserMembership = useCallback(async (): Promise<Tenant | null> => {
    if (!user) return null;

    try {
      const { data: membership, error } = await supabase
        .from('user_tenant_memberships')
        .select(`
          tenant_id,
          is_primary,
          businesses!inner(id, name, slug, created_at)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('is_primary', { ascending: false })
        .limit(1)
        .single();

      if (error || !membership) return null;

      const business = membership.businesses as any;
      return {
        id: business.id,
        name: business.name,
        slug: business.slug,
        created_at: business.created_at,
      };
    } catch {
      return null;
    }
  }, [user]);

  // Load all tenants user has access to
  const loadAvailableTenants = useCallback(async () => {
    if (!user) {
      setAvailableTenants([]);
      return;
    }

    try {
      const { data: memberships, error } = await supabase
        .from('user_tenant_memberships')
        .select(`
          tenant_id,
          is_primary,
          businesses!inner(id, name, slug, created_at)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error || !memberships) {
        setAvailableTenants([]);
        return;
      }

      const tenants = memberships.map(m => {
        const business = m.businesses as any;
        return {
          id: business.id,
          name: business.name,
          slug: business.slug,
          created_at: business.created_at,
        };
      });

      setAvailableTenants(tenants);
    } catch {
      setAvailableTenants([]);
    }
  }, [user]);

  // Load tenant configuration
  const loadTenantConfig = useCallback(async (tenantId: string) => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('mt_business_profiles')
        .select('*')
        .eq('business_id', tenantId)
        .single();

      if (profileData) setProfile(profileData as TenantProfile);

      // Load branding
      const { data: brandingData } = await supabase
        .from('mt_business_branding')
        .select('*')
        .eq('business_id', tenantId)
        .single();

      if (brandingData) setBranding(brandingData as TenantBranding);

      // Load whitelabel settings
      const { data: whitelabelData } = await supabase
        .from('tenant_whitelabel_settings')
        .select('*')
        .eq('tenant_id', tenantId)
        .single();

      if (whitelabelData) setWhitelabel(whitelabelData as TenantWhitelabel);

      // Load subscription
      const { data: subscriptionData } = await supabase
        .from('tenant_subscriptions')
        .select(`
          *,
          subscription_plans(name, slug)
        `)
        .eq('tenant_id', tenantId)
        .single();

      if (subscriptionData) {
        const plan = subscriptionData.subscription_plans as any;
        setSubscription({
          ...subscriptionData,
          plan_name: plan?.name,
          plan_slug: plan?.slug,
        } as TenantSubscription);
      }
    } catch (err) {
      console.error('Error loading tenant config:', err);
    }
  }, []);

  // Load feature flags for tenant
  const loadFeatures = useCallback(async (tenantId: string) => {
    try {
      const { data: featureData, error } = await supabase
        .from('tenant_edge_functions')
        .select(`
          function_slug,
          is_enabled,
          edge_function_catalog!inner(name, category, is_core, is_premium)
        `)
        .eq('tenant_id', tenantId);

      if (error || !featureData) {
        setFeatures({});
        return;
      }

      const featuresMap: Record<string, boolean> = {};
      featureData.forEach((f: any) => {
        featuresMap[f.function_slug] = f.is_enabled;
      });

      setFeatures(featuresMap);
    } catch {
      setFeatures({});
    }
  }, []);

  // Main tenant resolution
  const resolveTenant = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Priority 1: Custom domain
      let resolvedTenant = await resolveFromDomain();

      // Priority 2: Subdomain
      if (!resolvedTenant) {
        resolvedTenant = await resolveFromSubdomain();
      }

      // Priority 3: User's primary tenant (after login)
      if (!resolvedTenant && user) {
        resolvedTenant = await resolveFromUserMembership();
      }

      setTenant(resolvedTenant);

      if (resolvedTenant) {
        await Promise.all([
          loadTenantConfig(resolvedTenant.id),
          loadFeatures(resolvedTenant.id),
        ]);
      }
    } catch (err) {
      console.error('Error resolving tenant:', err);
      setError('Failed to resolve tenant');
    } finally {
      setIsLoading(false);
    }
  }, [resolveFromDomain, resolveFromSubdomain, resolveFromUserMembership, loadTenantConfig, loadFeatures, user]);

  // Switch to a different tenant
  const switchTenant = useCallback(async (tenantId: string) => {
    const newTenant = availableTenants.find(t => t.id === tenantId);
    if (!newTenant) {
      setError('Tenant not found');
      return;
    }

    setIsLoading(true);
    setTenant(newTenant);

    await Promise.all([
      loadTenantConfig(tenantId),
      loadFeatures(tenantId),
    ]);

    setIsLoading(false);
  }, [availableTenants, loadTenantConfig, loadFeatures]);

  // Refresh functions
  const refreshTenant = useCallback(async () => {
    await resolveTenant();
    await loadAvailableTenants();
  }, [resolveTenant, loadAvailableTenants]);

  const refreshFeatures = useCallback(async () => {
    if (tenant) {
      await loadFeatures(tenant.id);
    }
  }, [tenant, loadFeatures]);

  // Check if a feature is enabled
  const isFeatureEnabled = useCallback((featureSlug: string): boolean => {
    return features[featureSlug] === true;
  }, [features]);

  // Get tenant header for API requests
  const getTenantHeader = useCallback((): Record<string, string> => {
    if (!tenant) return {};
    return { 'x-tenant-id': tenant.id };
  }, [tenant]);

  // Effect: Resolve tenant when auth state changes
  useEffect(() => {
    if (!authLoading) {
      resolveTenant();
      loadAvailableTenants();
    }
  }, [authLoading, user, resolveTenant, loadAvailableTenants]);

  // Memoize context value
  const value = useMemo<TenantContextValue>(() => ({
    tenant,
    tenantId: tenant?.id ?? null,
    isLoading,
    error,
    profile,
    branding,
    whitelabel,
    subscription,
    features,
    isFeatureEnabled,
    getTenantHeader,
    availableTenants,
    switchTenant,
    refreshTenant,
    refreshFeatures,
  }), [
    tenant,
    isLoading,
    error,
    profile,
    branding,
    whitelabel,
    subscription,
    features,
    isFeatureEnabled,
    getTenantHeader,
    availableTenants,
    switchTenant,
    refreshTenant,
    refreshFeatures,
  ]);

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
