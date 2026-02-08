import { useEffect, useRef } from 'react';

export const useScrollAnimations = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const zoomObserverRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Reveal animations using IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '-100px 0px' }
    );

    // Card/Section zoom via IntersectionObserver
    zoomObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            entry.target.classList.remove('out-view');
          } else {
            entry.target.classList.add('out-view');
            entry.target.classList.remove('in-view');
          }
        });
      },
      { threshold: 0.15, rootMargin: '-50px 0px' }
    );

    // Observe reveal elements
    document.querySelectorAll('.animate-reveal').forEach((el) => {
      observerRef.current?.observe(el);
    });

    // Observe zoom elements
    document.querySelectorAll('.card-zoom-scroll, .section-scale').forEach((el) => {
      zoomObserverRef.current?.observe(el);
    });

    // Lightweight scroll handler for parallax effects only (hero zoom)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;

          // Hero zoom - lightweight single selector
          const heroElements = document.querySelectorAll('.hero-zoom');
          if (heroElements.length > 0) {
            const scrollPercent = Math.min(scrollY / windowHeight, 1);
            const scale = 1 + scrollPercent * 0.1;
            heroElements.forEach((el) => {
              (el as HTMLElement).style.transform = `scale(${scale})`;
            });
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observerRef.current?.disconnect();
      zoomObserverRef.current?.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};
