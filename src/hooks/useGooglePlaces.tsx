import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

let googleMapsLoaded = false;
let loadPromise: Promise<void> | null = null;

export const useGooglePlaces = () => {
  const [isLoaded, setIsLoaded] = useState(googleMapsLoaded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (googleMapsLoaded) {
      setIsLoaded(true);
      return;
    }

    if (loadPromise) {
      loadPromise.then(() => setIsLoaded(true)).catch((err) => setError(err.message));
      return;
    }

    const loadGoogleMaps = async () => {
      try {
        // Fetch API key from edge function
        const response = await fetch(
          `https://mnitzgoythqqevhtkitj.supabase.co/functions/v1/get-google-maps-key`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uaXR6Z295dGhxcWV2aHRraXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxOTA5MzUsImV4cCI6MjA2NTc2NjkzNX0.Jr38d0BgEIztZfIz2ZZ4fj-r0eKhfBEjwob5WWDXG2U`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Google Maps API key');
        }

        const { apiKey } = await response.json();

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places'],
        });

        await loader.load();
        googleMapsLoaded = true;
        setIsLoaded(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load Google Maps';
        setError(errorMessage);
        console.error('Error loading Google Maps:', err);
      }
    };

    loadPromise = loadGoogleMaps();
  }, []);

  return { isLoaded, error };
};
