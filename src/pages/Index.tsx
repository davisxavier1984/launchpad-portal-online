
import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Benefits from "@/components/Benefits";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  // Animation for reveal on scroll
  useEffect(() => {
    const animateElements = () => {
      const elements = document.querySelectorAll('.animate-reveal');
      
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
        
        if (isVisible) {
          element.classList.add('in-view');
        }
      });
    };
    
    // Initial check
    animateElements();
    
    // Add event listener
    window.addEventListener('scroll', animateElements);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', animateElements);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <Benefits />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
