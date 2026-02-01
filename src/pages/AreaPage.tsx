import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Phone, Mail, Star, Shield, Truck, Award, CheckCircle, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import RoofingFriendHeader from '../components/RoofingFriendHeader';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { LocalBusinessStructuredData, ServiceStructuredData, FAQStructuredData } from '../components/StructuredData';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAreaBySlug, useBusiness, useTrustIndicators } from '../hooks/useBusinessConfig';

// City-specific image mapping (fallback for areas without heroImage)
const getCityImage = (slug: string): string => {
  const imageMap: Record<string, string> = {
    'san-francisco': '/lovable-uploads/0ff36cf7-372c-449f-9bca-52afe3c60788.png',
    'santa-clara': '/lovable-uploads/2fc6c2fb-566b-4583-8603-9c50250ac72e.png',
    'walnut-creek': '/lovable-uploads/e32f3b68-afff-4e34-ad9f-677737ef64d9.png',
    'tiburon': '/lovable-uploads/d2cfa2fb-47cb-4697-8e3f-70fa16d38b52.png',
    'santa-cruz': '/lovable-uploads/86b90df1-efd6-414b-b031-d245c49c67f3.png',
    'santa-rosa': '/lovable-uploads/c273371c-c036-4c60-9353-7a61495ef41b.png',
    'modesto': '/lovable-uploads/89b3586f-7ff9-4109-984e-d58bd6ae40df.png',
    'alameda-county': '/lovable-uploads/fa871e2e-df53-42cc-b446-c90fb8d57a4e.png',
    'san-anselmo': '/lovable-uploads/10c13837-207c-4fb5-8499-cf35502a0372.png',
    'kentfield': '/lovable-uploads/eb4de00e-10cf-45a6-8e3b-bd4d76b1bfec.png',
    'contra-costa': '/lovable-uploads/5adbe72d-e67a-4421-b76a-f077f28fd1a0.png',
    'petaluma': '/lovable-uploads/03902760-7765-4751-946f-a327c25fa662.png',
    'los-gatos': '/lovable-uploads/67672a0a-4f98-4638-b03a-8e118a42bc94.png'
  };
  return imageMap[slug] || '/src/assets/modern-metal-roof-home.jpg';
};

const AreaPage: React.FC = () => {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const area = useAreaBySlug(locationSlug || '');
  const business = useBusiness();
  const trustIndicators = useTrustIndicators();

  if (!area) {
    return <Navigate to="/services" replace />;
  }

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: area.name, url: `/roofing-services/${area.slug}` }
  ];

  const heroImage = area.heroImage || getCityImage(area.slug);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Metal Roofing Services in ${area.name} | ${business.name}`}
        description={`Professional metal roofing services in ${area.fullName}. Licensed contractors, 25-year warranty, free estimates. Serving ${area.neighborhoods.join(', ')}.`}
        keywords={`metal roofing ${area.name}, roof installation ${area.name}, roofing contractor ${area.name}, ${area.name} roofing services`}
        location={{
          name: area.name,
          region: 'California'
        }}
      />

      <LocalBusinessStructuredData
        location={{
          name: area.name,
          coordinates: area.coordinates
        }}
      />

      <ServiceStructuredData
        serviceName="Metal Roofing Installation"
        location={area.fullName}
      />

      {area.faqs && area.faqs.length > 0 && (
        <FAQStructuredData faqs={area.faqs} />
      )}

      <RoofingFriendHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Metal Roofing Services in
            <span className="block text-primary">{area.name}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {area.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href={`tel:${business.phoneRaw}`}>
              <Button size="lg" variant="green-text">
                <Phone className="w-5 h-5 mr-2" />
                Call {business.phone}
              </Button>
            </a>
            <a href="/contact">
              <Button size="lg" variant="secondary" className="bg-success hover:bg-success/90 text-slate-950">
                <Phone className="w-5 h-5 mr-2" />
                Get Free Estimate
              </Button>
            </a>
          </div>

          {/* City Image Showcase */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={heroImage}
              alt={`${area.name} cityscape and roofing services area`}
              className="w-full h-64 sm:h-80 object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm font-medium bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                Proudly serving {area.name}
              </p>
            </div>
          </div>
        </section>

        {/* Service Areas / Neighborhoods */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Areas We Serve in {area.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {area.neighborhoods.map((neighborhood, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">{neighborhood}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Population Served: {area.population} residents
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Services Offered */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Our {area.name} Roofing Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {area.services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{service}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Professional {service.toLowerCase()} services with premium materials and expert installation.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-muted/30 rounded-xl p-8 mb-12">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {trustIndicators.length > 0 ? (
              trustIndicators.map((indicator, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <Shield className="w-8 h-8 text-primary" />
                  <h3 className="font-semibold">{indicator.text}</h3>
                </div>
              ))
            ) : (
              <>
                <div className="flex flex-col items-center gap-2">
                  <Shield className="w-8 h-8 text-primary" />
                  <h3 className="font-semibold">25-Year Warranty</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive warranty coverage</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Award className="w-8 h-8 text-primary" />
                  <h3 className="font-semibold">Licensed & Insured</h3>
                  <p className="text-sm text-muted-foreground">Fully licensed contractor</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Truck className="w-8 h-8 text-primary" />
                  <h3 className="font-semibold">Free Estimates</h3>
                  <p className="text-sm text-muted-foreground">No obligation consultations</p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Customer Testimonial */}
        {area.testimonial && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              What {area.name} Customers Say
            </h2>
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(area.testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg italic mb-4">
                  "{area.testimonial.text}"
                </blockquote>
                <div className="font-semibold">{area.testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{area.testimonial.project}</div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* FAQ Section */}
        {area.faqs && area.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions - {area.name}
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {area.faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your {area.name} Roofing Project?
          </h2>
          <p className="text-xl mb-6">
            Contact us today for a free consultation and estimate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${business.phoneRaw}`}>
              <Button size="lg" variant="secondary">
                <Phone className="w-5 h-5 mr-2" />
                Call {business.phone}
              </Button>
            </a>
            <a href="/contact">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </Button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AreaPage;
