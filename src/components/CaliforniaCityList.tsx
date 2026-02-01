
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';

interface ServiceLocation {
  id: string;
  name: string;
  slug: string;
  description: string;
}

const serviceLocations: ServiceLocation[] = [
  { id: '1', name: 'San Francisco', slug: 'san-francisco', description: 'Premium metal roofing in the heart of the Bay Area' },
  { id: '2', name: 'Santa Clara', slug: 'santa-clara', description: 'Residential and commercial roofing solutions' },
  { id: '3', name: 'Walnut Creek', slug: 'walnut-creek', description: 'Expert roofing services in Contra Costa County' },
  { id: '4', name: 'Tiburon', slug: 'tiburon', description: 'Luxury roofing for Marin County homes' },
  { id: '5', name: 'San Anselmo', slug: 'san-anselmo', description: 'Custom metal roofing installations' },
  { id: '6', name: 'Santa Cruz', slug: 'santa-cruz', description: 'Coastal roofing specialists' },
  { id: '7', name: 'Modesto', slug: 'modesto', description: 'Central Valley roofing experts' },
  { id: '8', name: 'Kentfield', slug: 'kentfield', description: 'Premium roofing in Marin County' },
  { id: '9', name: 'Santa Rosa', slug: 'santa-rosa', description: 'North Bay roofing professionals' },
  { id: '10', name: 'Alameda County', slug: 'alameda-county', description: 'Comprehensive roofing throughout Alameda County' },
  { id: '11', name: 'Contra Costa County', slug: 'contra-costa-county', description: 'Full-service roofing across Contra Costa County' },
  { id: '12', name: 'Petaluma', slug: 'petaluma', description: 'Quality roofing in Sonoma County' },
  { id: '13', name: 'Los Gatos', slug: 'los-gatos', description: 'High-end roofing solutions' }
];

const CaliforniaCityList: React.FC = () => {
  const navigate = useNavigate();

  const handleLocationClick = (slug: string) => {
    navigate(`/roofing-services/${slug}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center justify-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        Our Service Areas
      </h3>
      
      {/* Grid layout for better organization */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {serviceLocations.map((location, index) => (
          <button
            key={location.id}
            onClick={() => handleLocationClick(location.slug)}
            aria-label={`View roofing services in ${location.name}`}
            className="group text-left p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/50 hover:border-primary/40 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-0 shadow-card hover:shadow-card-hover active:scale-[0.98]"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-5 h-5">
                  <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></span>
                  <span className="absolute inset-1 rounded-full bg-primary/20 animate-ping [animation-delay:150ms]"></span>
                  <span className="relative z-10 block w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-primary/40"></span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors story-link group-hover:underline underline-offset-4">
                    {location.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {location.description}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CaliforniaCityList;
