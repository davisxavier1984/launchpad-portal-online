
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Benefits from "@/components/Benefits";
import News from "@/components/News";
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

    // Zoom on scroll effects
    const handleZoomScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Hero zoom effect
      const heroElements = document.querySelectorAll('.hero-zoom');
      heroElements.forEach(element => {
        const scrollPercent = Math.min(scrollY / windowHeight, 1);
        const scale = 1 + (scrollPercent * 0.1); // Scale from 1 to 1.1
        element.style.transform = `scale(${scale})`;
      });

      // Parallax zoom for sections
      const parallaxElements = document.querySelectorAll('.parallax-zoom');
      parallaxElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const windowCenter = windowHeight / 2;
        const distance = Math.abs(elementCenter - windowCenter);
        const maxDistance = windowHeight / 2;
        const factor = Math.max(0, 1 - (distance / maxDistance));
        
        const scale = 1 + (factor * 0.05); // Subtle zoom effect
        element.style.transform = `scale(${scale})`;
      });

      // Card zoom effects
      const cardElements = document.querySelectorAll('.card-zoom-scroll');
      cardElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isInView = rect.top < windowHeight && rect.bottom > 0;
        const centerDistance = Math.abs(rect.top + rect.height / 2 - windowHeight / 2);
        const maxDistance = windowHeight / 2;
        const factor = Math.max(0, 1 - (centerDistance / maxDistance));
        
        if (isInView) {
          element.classList.add('in-view');
          element.classList.remove('out-view');
          
          // Apply subtle scale based on center distance
          const scale = 0.98 + (factor * 0.04); // Scale from 0.98 to 1.02
          element.style.transform = `scale(${scale}) translateY(0)`;
        } else {
          element.classList.add('out-view');
          element.classList.remove('in-view');
        }
      });

      // Section scale effects
      const sectionElements = document.querySelectorAll('.section-scale');
      sectionElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const windowCenter = windowHeight / 2;
        
        if (elementCenter < windowCenter && rect.bottom > 0) {
          element.classList.add('scale-up');
          element.classList.remove('scale-down');
        } else if (elementCenter > windowCenter && rect.top < windowHeight) {
          element.classList.add('scale-down');
          element.classList.remove('scale-up');
        } else {
          element.classList.remove('scale-up', 'scale-down');
        }
      });

      // Image zoom effects
      const imageElements = document.querySelectorAll('.image-zoom-scroll');
      imageElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        if (isVisible) {
          const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
          if (scrollProgress > 0.2 && scrollProgress < 0.8) {
            element.classList.add('zoom');
          } else {
            element.classList.remove('zoom');
          }
        }
      });

      // Text zoom effects
      const textElements = document.querySelectorAll('.text-zoom-scroll');
      textElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const windowCenter = windowHeight / 2;
        const distance = Math.abs(elementCenter - windowCenter);
        const maxDistance = windowHeight / 3;
        
        if (distance < maxDistance) {
          element.classList.add('zoom-text');
          element.classList.remove('fade-text');
        } else {
          element.classList.add('fade-text');
          element.classList.remove('zoom-text');
        }
      });
    };

    // Throttle scroll events for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          animateElements();
          handleZoomScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Initial check
    animateElements();
    handleZoomScroll();
    
    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <Benefits />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
