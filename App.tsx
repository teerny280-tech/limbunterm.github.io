import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { BrandsSection } from './components/BrandsSection';
import { MetricsSection } from './components/MetricsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CtaBanner } from './components/CtaBanner';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectLightboxModal } from './components/ProjectLightboxModal';
import { ContactModal } from './components/ContactModal';
import { DashboardView } from './components/DashboardView';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { DraftPreviewBar } from './components/cms/DraftPreviewBar';
import { CmsToastContainer } from './components/cms/CmsToastContainer';

const PortfolioApp: React.FC = () => {
  const { currentView, websiteSections } = usePortfolio();

  // Sort sections by user-defined order and filter by visibility
  const orderedSections = [...websiteSections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order);

  // Render dynamic section component
  const renderSectionComponent = (key: string) => {
    switch (key) {
      case 'hero':
        return <Hero key="sec-hero" />;
      case 'services':
        return <ServicesSection key="sec-services" />;
      case 'projects':
        return <ProjectsSection key="sec-projects" />;
      case 'brands':
        return <BrandsSection key="sec-brands" />;
      case 'about':
        return <MetricsSection key="sec-about" />;
      case 'testimonials':
        return <TestimonialsSection key="sec-testimonials" />;
      case 'cta':
        return <CtaBanner key="sec-cta" />;
      case 'contact':
        return <ContactSection key="sec-contact" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#1E1E1E]">
      {/* Top Banner when in Preview Mode or Draft is pending */}
      <DraftPreviewBar />

      <Header />
      
      {currentView === 'portfolio' ? (
        <main className="flex-1">
          {orderedSections.map((sec) => renderSectionComponent(sec.key))}
        </main>
      ) : (
        <main className="flex-1">
          <DashboardView />
        </main>
      )}

      {currentView === 'portfolio' && <Footer />}

      {/* Global Modals & Toast System */}
      <ProjectLightboxModal />
      <ContactModal />
      <OwnerAuthModal />
      <CmsToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
